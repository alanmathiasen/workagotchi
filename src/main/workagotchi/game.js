// Authoritative tamagotchi game loop. Lives in the main process so it keeps
// ticking regardless of which windows are open or focused. All stat data lives
// in state.js — this module just advances time and applies changes to it.
const TICK_MS = 200; // how often the loop advances

export function createGame() {
  let ageSeconds = 0; // total time the pet has been alive
  let ticks = 0; // number of loop iterations
  let timer = null;
  let lastTick = 0;
  const listeners = new Set();

  function getState() {
    return { ageSeconds, ticks };
  }

  function emit() {
    const snapshot = getState();
    for (const fn of listeners) fn(snapshot);
  }

  function tick() {
    const now = Date.now();
    const dt = (now - lastTick) / 1000; // real seconds since last tick
    lastTick = now;

    ageSeconds += dt;
    ticks += 1;

    emit();
  }

  return {
    getState,

    // Subscribe to state updates; returns an unsubscribe function.
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    start() {
      if (timer) return;
      lastTick = Date.now();
      timer = setInterval(tick, TICK_MS);
    },

    stop() {
      if (timer) clearInterval(timer);
      timer = null;
    },
  };
}
