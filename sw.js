const CACHE_NAME = "g04eggx-v3";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./push-config.js",
  "./icon-32.png",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const networkFirst = event.request.mode === "navigate" || url.pathname.endsWith("/push-config.js");
  if (networkFirst) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const cacheKey = event.request.mode === "navigate" ? "./index.html" : event.request;
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, response.clone())));
        }
        return response;
      }).catch(() => caches.match(event.request.mode === "navigate" ? "./index.html" : event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && url.origin === self.location.origin) {
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone())));
      }
      return response;
    }))
  );
});

self.addEventListener("push", (event) => {
  const fallback = {
    title: "G04EggX – Fertig!",
    body: "Dein Ei ist fertig gekocht. 🥚",
    tag: "eggx-timer",
    url: "./"
  };
  let data = fallback;
  if (event.data) {
    try {
      data = { ...fallback, ...event.data.json() };
    } catch (error) {
      data = { ...fallback, body: event.data.text() || fallback.body };
    }
  }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./icon-192.png",
    badge: "./icon-32.png",
    tag: data.tag,
    renotify: true,
    requireInteraction: true,
    data: { url: data.url || "./" }
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = new URL(event.notification.data?.url || "./", self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => client.url.startsWith(self.registration.scope));
    if (existing) return existing.focus();
    return self.clients.openWindow(destination);
  }));
});
