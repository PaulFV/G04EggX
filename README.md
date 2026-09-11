# G04EggX 🥚

Ein futuristischer Eier-Kochtimer im Browser – mit animiertem Ei, flüssigem Eigelb, das beim Garen fest wird, aufsteigendem Rauch und wiederholendem Alarmton.

**[➡️ Live-Demo ansehen](https://paulfv.github.io/G04EggX/)**

## Features

- **5 Härtegrade**: Wachsweich, Weich, Mittel, Hart, Sehr Hart – jeweils mit eigener Kochzeit
- **Eigelb-Visualisierung**: startet flüssig/glasig und wird beim Kochen zunehmend fest – der Endzustand richtet sich nach dem gewählten Härtegrad
- **Lebendige Animation**: Das Ei bewegt sich beim Kochen zunehmend unruhiger, je weniger Zeit übrig ist, und hüpft am Ende aufgeregt
- **Aufsteigender Rauch** rund ums Ei während des Kochens
- **5 Alarmtöne**: Chime, Beep, Melodie, Puls und Sirene plus Vibration, bis der Alarm gestoppt wird
- **Hintergrundfest**: Der Timer läuft über einen festen Ziel-Zeitpunkt statt einfachem Herunterzählen, damit die Zeit auch nach Bildschirmsperre/App-Wechsel korrekt bleibt
- **iPhone-Vollbild**: installierbare PWA mit Safe-Area-Unterstützung für Dynamic Island und Home Indicator
- **Optionale Hintergrund-Mitteilungen** per Web Push und Cloudflare Worker – auch bei geschlossener App
- **Offlinefähig** durch einen Service Worker
- **Läuft ohne Build-Schritt** direkt im Browser (React, Babel und Tailwind werden per CDN geladen)

## Verwendung

Für die Timer-Grundfunktion reicht `index.html`. PWA-, Offline- und Push-Funktionen benötigen HTTPS oder einen lokalen Webserver.

### Auf dem iPhone installieren

1. [G04EggX](https://paulfv.github.io/G04EggX/) in Safari öffnen.
2. **Teilen → Zum Home-Bildschirm** wählen.
3. G04EggX vom neuen Home-Bildschirm-Symbol starten. Die App nutzt dann die gesamte verfügbare Anzeige inklusive korrekter Safe Areas.
4. In G04EggX **Mitteilungen aus** antippen und die iOS-Abfrage erlauben.

Web Push auf dem iPhone setzt iOS/iPadOS 16.4 oder neuer sowie den Start als Home-Bildschirm-App voraus. Der ausgewählte G04EggX-Alarmton spielt bei geöffneter App; Hintergrund-Push verwendet den System-Mitteilungston von iOS.

### Mit GitHub Pages hosten

1. Repository auf GitHub erstellen und diesen Ordner hochladen (`index.html` muss im Root-Verzeichnis liegen)
2. Unter **Settings → Pages** als Quelle den `main`-Branch (Root) auswählen
3. Nach kurzer Zeit ist die App unter `https://<dein-username>.github.io/<repo-name>/` erreichbar

### Hintergrund-Mitteilungen bereitstellen

Der Ordner `worker/` enthält den Cloudflare Worker. Nach dem Deploy dessen URL in `push-config.js` eintragen. Eine vollständige Anleitung steht in [`worker/README.md`](worker/README.md).

### Android-App für Google Play

Der Ordner [`android/`](android/) enthält eine Trusted-Web-Activity-Hülle für den
Play Store. Die Build- und Signaturanleitung steht in [`android/README.md`](android/README.md);
der GitHub-Actions-Workflow liegt unter [`.github/workflows/android-build.yml`](.github/workflows/android-build.yml).

## Tech-Stack

- [React 18](https://react.dev/) (UMD, per CDN)
- [Babel Standalone](https://babeljs.io/docs/babel-standalone) für JSX im Browser
- [Tailwind CSS](https://tailwindcss.com/) (CDN-Build)
- Reines SVG/CSS für Animationen (kein zusätzliches Grafik-Framework)
- Web-App-Manifest und Service Worker
- Cloudflare Worker mit Durable Objects für zuverlässig geplante Push-Termine

## Hinweis

Der Tailwind-CDN-Build ist für Prototypen gedacht; für den produktiven Einsatz empfiehlt sich ein eigener Tailwind-Build-Schritt. Für dieses kleine Ein-Datei-Projekt reicht die CDN-Variante aber völlig aus.

## Lizenz

MIT – siehe [LICENSE](LICENSE). Für die Veröffentlichung: [Datenschutz](datenschutz.html) und [Impressum/Copyright](impressum.html).
