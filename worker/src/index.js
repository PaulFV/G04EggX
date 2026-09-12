import webpush from "web-push";

const encoder = new TextEncoder();
const PRESET_NAMES = {
  en: {
    wachsweich: "very soft",
    weich: "soft",
    mittel: "medium",
    hart: "hard",
    sehrhart: "very hard"
  },
  de: {
    wachsweich: "wachsweich",
    weich: "weich",
    mittel: "mittel",
    hart: "hart",
    sehrhart: "sehr hart"
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function corsHeaders(origin, env) {
  const allowed = origin === env.APP_ORIGIN ? origin : env.APP_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function withCors(response, origin, env) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(origin, env)).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validSubscription(subscription) {
  return Boolean(
    subscription &&
    typeof subscription.endpoint === "string" &&
    subscription.endpoint.startsWith("https://") &&
    typeof subscription.keys?.p256dh === "string" &&
    typeof subscription.keys?.auth === "string"
  );
}

function validTimer(timer) {
  if (!timer || typeof timer.enabled !== "boolean") return false;
  if (!timer.enabled) return true;
  if (!Number.isFinite(timer.triggerAt)) return false;
  if (timer.triggerAt < Date.now() - 5000 || timer.triggerAt > Date.now() + 24 * 60 * 60 * 1000) return false;
  return Object.hasOwn(PRESET_NAMES.en, timer.presetId);
}

async function sendNotification(env, subscription, timer, test = false) {
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  const language = timer?.language === "de" ? "de" : "en";
  const hardness = PRESET_NAMES[language][timer?.presetId] || (language === "de" ? "perfekt" : "perfectly");
  return webpush.sendNotification(subscription, JSON.stringify({
    title: test ? "G04EggX Test" : language === "de" ? "G04EggX – Fertig!" : "G04EggX – Finished!",
    body: test
      ? language === "de" ? "Hintergrund-Mitteilungen funktionieren. 🥚" : "Background notifications are working. 🥚"
      : language === "de" ? `Dein Ei ist jetzt ${hardness} gekocht. 🥚` : `Your egg is now cooked ${hardness}. 🥚`,
    tag: test ? "eggx-test" : "eggx-timer",
    url: env.APP_URL
  }), { TTL: 300, urgency: "high" });
}

export class TimerDevice {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async authorize(request, allowCreate = false) {
    const header = request.headers.get("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (token.length < 32) return false;
    const suppliedHash = await sha256(token);
    const storedHash = await this.state.storage.get("tokenHash");
    if (!storedHash && allowCreate) {
      await this.state.storage.put("tokenHash", suppliedHash);
      return true;
    }
    return storedHash === suppliedHash;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const isTest = url.pathname.endsWith("/test");

    if (request.method === "PUT") {
      if (!await this.authorize(request, true)) return json({ error: "Nicht autorisiert." }, 401);
      const body = await request.json().catch(() => null);
      if (!validSubscription(body?.subscription) || !validTimer(body?.timer)) {
        return json({ error: "Ungültige Push- oder Timerdaten." }, 400);
      }
      await this.state.storage.put({ subscription: body.subscription, timer: body.timer });
      if (body.timer.enabled) await this.state.storage.setAlarm(body.timer.triggerAt);
      else await this.state.storage.deleteAlarm();
      return json({ ok: true, triggerAt: body.timer.triggerAt });
    }

    if (request.method === "DELETE") {
      if (!await this.authorize(request)) return json({ error: "Nicht autorisiert." }, 401);
      await this.state.storage.deleteAlarm();
      await this.state.storage.deleteAll();
      return json({ ok: true });
    }

    if (request.method === "POST" && isTest) {
      if (!await this.authorize(request)) return json({ error: "Nicht autorisiert." }, 401);
      const data = await this.state.storage.get(["subscription", "timer"]);
      if (!data.subscription) return json({ error: "Keine Push-Anmeldung vorhanden." }, 404);
      try {
        await sendNotification(this.env, data.subscription, data.timer, true);
        return json({ ok: true });
      } catch (error) {
        if (error?.statusCode === 404 || error?.statusCode === 410) await this.state.storage.deleteAll();
        return json({ error: "Test-Mitteilung konnte nicht zugestellt werden." }, 502);
      }
    }

    return json({ error: "Methode nicht erlaubt." }, 405);
  }

  async alarm() {
    const data = await this.state.storage.get(["subscription", "timer"]);
    if (!data.subscription || !data.timer?.enabled) return;
    try {
      await sendNotification(this.env, data.subscription, data.timer, false);
      await this.state.storage.put("timer", { ...data.timer, enabled: false });
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await this.state.storage.deleteAll();
        return;
      }
      await this.state.storage.setAlarm(Date.now() + 60000);
      throw error;
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    if (origin && origin !== env.APP_ORIGIN) return withCors(json({ error: "Unerlaubter Ursprung." }, 403), origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    if (request.method === "GET" && url.pathname === "/vapid-public-key") {
      return withCors(json({ publicKey: env.VAPID_PUBLIC_KEY || "" }), origin, env);
    }

    const match = url.pathname.match(/^\/api\/devices\/([A-Za-z0-9_-]{16,128})(?:\/test)?$/);
    if (!match) return withCors(json({ error: "Nicht gefunden." }, 404), origin, env);

    const id = env.TIMER_DEVICE.idFromName(match[1]);
    const response = await env.TIMER_DEVICE.get(id).fetch(request);
    return withCors(response, origin, env);
  }
};
