# EggX 🥚

Ein futuristischer Eier-Kochtimer im Browser – mit animiertem Ei, flüssigem Eigelb, das beim Garen fest wird, aufsteigendem Rauch und wiederholendem Alarmton.

**[➡️ Live-Demo ansehen](#)** *(Link einfügen, sobald GitHub Pages aktiviert ist – siehe unten)*

## Features

- **5 Härtegrade**: Wachsweich, Weich, Mittel, Hart, Sehr Hart – jeweils mit eigener Kochzeit
- **Eigelb-Visualisierung**: startet flüssig/glasig und wird beim Kochen zunehmend fest – der Endzustand richtet sich nach dem gewählten Härtegrad
- **Lebendige Animation**: Das Ei bewegt sich beim Kochen zunehmend unruhiger, je weniger Zeit übrig ist, und hüpft am Ende aufgeregt
- **Aufsteigender Rauch** rund ums Ei während des Kochens
- **Alarm**: wiederholender Ton (Chime/Beep/Melodie) plus Vibration, bis er gestoppt wird – ein Tap irgendwo auf dem Bildschirm reicht
- **Hintergrundfest**: Der Timer läuft über einen festen Ziel-Zeitpunkt statt einfachem Herunterzählen, damit die Zeit auch nach Bildschirmsperre/App-Wechsel korrekt bleibt
- **Läuft ohne Build-Schritt** direkt im Browser (React, Babel und Tailwind werden per CDN geladen)

## Verwendung

Einfach `index.html` im Browser öffnen – fertig, keine Installation nötig.

### Mit GitHub Pages hosten

1. Repository auf GitHub erstellen und diesen Ordner hochladen (`index.html` muss im Root-Verzeichnis liegen)
2. Unter **Settings → Pages** als Quelle den `main`-Branch (Root) auswählen
3. Nach kurzer Zeit ist die App unter `https://<dein-username>.github.io/<repo-name>/` erreichbar

## Tech-Stack

- [React 18](https://react.dev/) (UMD, per CDN)
- [Babel Standalone](https://babeljs.io/docs/babel-standalone) für JSX im Browser
- [Tailwind CSS](https://tailwindcss.com/) (CDN-Build)
- Reines SVG/CSS für Animationen (kein zusätzliches Grafik-Framework)

## Hinweis

Der Tailwind-CDN-Build ist für Prototypen gedacht; für den produktiven Einsatz empfiehlt sich ein eigener Tailwind-Build-Schritt. Für dieses kleine Ein-Datei-Projekt reicht die CDN-Variante aber völlig aus.

## Lizenz

MIT – siehe [LICENSE](LICENSE)
