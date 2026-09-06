# G04EggX Push Worker

Der Worker speichert pro Browser eine Web-Push-Anmeldung in einem eigenen Durable Object. Der Timer-Endzeitpunkt wird als Durable-Object-Alarm geplant, sodass die Mitteilung auch bei geschlossener G04EggX-App gesendet werden kann.

## Bereitstellung

1. Im Ordner `worker` die Abhängigkeiten installieren: `npm install`
2. Bei Cloudflare anmelden: `npx wrangler login`
3. Ein VAPID-Schlüsselpaar erzeugen: `npx web-push generate-vapid-keys`
4. Die beiden Schlüssel als Secrets setzen:
   - `npx wrangler secret put VAPID_PUBLIC_KEY`
   - `npx wrangler secret put VAPID_PRIVATE_KEY`
5. Den Worker deployen: `npm run deploy`
6. Die ausgegebene Worker-URL in `../push-config.js` eintragen.

Der private VAPID-Schlüssel darf niemals in Git oder in `push-config.js` gespeichert werden.
