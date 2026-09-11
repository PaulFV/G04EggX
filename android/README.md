# G04EggX für Google Play

Dieses Verzeichnis enthält die Android-Hülle für G04EggX. Es handelt sich um eine
Trusted Web Activity (TWA): Die App öffnet die veröffentlichte PWA
`https://paulfv.github.io/G04EggX/` im Vollbild über Chrome. Dadurch bleiben Timer,
Service Worker und Web-Push an einer Stelle gepflegt.

## Fester App-Identifier

Der aktuelle Identifier lautet `de.g04eggx.app`. Er muss vor dem ersten Upload im
Play Store endgültig gewählt werden. Nach der Veröffentlichung darf er nicht mehr
geändert werden.

## Lokal mit Android Studio bauen

1. Android Studio installieren und dieses Verzeichnis als Projekt öffnen.
2. JDK 17 und Android SDK 36 installieren.
3. Im Projekt `app` den Build `bundleRelease` starten.

Das Ergebnis ist ein Android App Bundle (`.aab`). Neue Google-Play-Apps müssen als
App Bundle veröffentlicht werden. Die Release-Datei muss mit einem Upload-Schlüssel
signiert werden; den Schlüssel niemals committen.

## Build über GitHub Actions

Der Workflow [`android-build.yml`](../.github/workflows/android-build.yml) baut das
Bundle nach `workflow_dispatch` oder bei Änderungen unter `android/`.

Für ein signiertes Bundle unter **Repository → Settings → Secrets and variables →
Actions** diese Secrets anlegen:

- `ANDROID_KEYSTORE_BASE64` – Base64-Inhalt der `.jks`-Datei
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Ohne diese Secrets erzeugt der Workflow ein unsigniertes Prüf-Bundle. Das kann man
testen, aber nicht im Play Store veröffentlichen.

Beispiel für einen neuen Upload-Schlüssel (lokal ausführen):

```text
keytool -genkeypair -v -keystore g04eggx-upload.jks -alias g04eggx-upload -keyalg RSA -keysize 2048 -validity 10000
```

## Domain-Verknüpfung (Digital Asset Links)

Damit Android die Website als vertrauenswürdige TWA ohne Browser-Leiste öffnet,
muss nach der Einrichtung von Play App Signing die SHA-256-Zertifikatsnummer in
`.well-known/assetlinks.json` der GitHub-Pages-Seite eingetragen werden. Die
Zertifikatsnummer erhältst du in der Play Console unter **App-Integrität**. Vorher
ist die Datei absichtlich noch nicht aktiv, weil ein Platzhalter nicht verifiziert
werden kann.

## Play-Store-Checkliste

- Play-Console-App mit dem Identifier `de.g04eggx.app` anlegen
- Datenschutz-URL hinterlegen: `https://paulfv.github.io/G04EggX/datenschutz.html`
- Data-Safety-Formular passend zur [Datenschutzerklärung](../datenschutz.html) ausfüllen
- Store-Beschreibung und Screenshots erstellen
- signiertes `.aab` im internen Test-Track hochladen
- SHA-256-Fingerprint in `assetlinks.json` ergänzen und TWA-Verifizierung testen
