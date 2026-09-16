// Nach dem Deploy des Workers dessen URL hier eintragen, ohne abschließenden Slash.
// Beispiel: window.EGGX_PUSH_API = "https://eggx-push.<deine-subdomain>.workers.dev";
window.EGGX_PUSH_API = "https://eggx-push.gosleep-push-worker.workers.dev";

// Audio ist optional: Wenn die Android-TWA keinen Web-Audiokontext anbietet,
// darf das niemals den Eier-Timer am Start hindern.
if (!window.AudioContext && !window.webkitAudioContext) {
  window.AudioContext = function SafeAudioContext() {
    return {
      state: "suspended",
      currentTime: 0,
      destination: {},
      resume: () => Promise.resolve(),
      createBuffer: () => ({}),
      createBufferSource: () => ({
        buffer: null,
        connect: () => {},
        start: () => {},
      }),
    };
  };
}
