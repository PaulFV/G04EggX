// Nach dem Deploy des Workers dessen URL hier eintragen, ohne abschließenden Slash.
// Beispiel: window.EGGX_PUSH_API = "https://eggx-push.<deine-subdomain>.workers.dev";
window.EGGX_PUSH_API = "https://eggx-push.gosleep-push-worker.workers.dev";

// Audio darf niemals verhindern, dass der Timer startet.
// Einige Android-/TWA-Umgebungen können AudioContext beim Erzeugen ablehnen.
(function installSafeAudioContext() {
  const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;

  function createSilentContext() {
    return {
      state: "running",
      currentTime: 0,
      destination: {},
      resume: () => Promise.resolve(),
      createBuffer: () => ({}),
      createBufferSource: () => ({
        buffer: null,
        connect: () => {},
        start: () => {},
      }),
      createOscillator: () => ({
        type: "sine",
        frequency: { value: 0 },
        connect: () => {},
        start: () => {},
        stop: () => {},
      }),
      createGain: () => ({
        gain: {
          setValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: () => {},
      }),
    };
  }

  function SafeAudioContext(...args) {
    if (OriginalAudioContext) {
      try {
        return new OriginalAudioContext(...args);
      } catch (error) {
        console.warn("G04EggX: AudioContext nicht verfügbar – Timer läuft ohne Ton.");
      }
    }
    return createSilentContext();
  }

  window.AudioContext = SafeAudioContext;
  window.webkitAudioContext = SafeAudioContext;
})();
