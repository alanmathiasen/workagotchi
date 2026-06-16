import { useState, useEffect, useMemo, useRef } from "react";

const AGE_SECONDS_TO_WORKED_MINUTES_RATE = 540 / 240; // 4 minutos de ejecución son 9 horas de trabajo

// En 200 min trabajados (~3 h 20 m) cada stat va de 100 → 0.
const WORK_MINUTES_TO_ZERO = 200;
const DECAY_PER_WORKED_MINUTE = 100 / WORK_MINUTES_TO_ZERO; // = 0.5

// La jornada de juego va de las 08:00 a las 17:00 (9 h = 540 min de trabajo).
const WORK_DAY_START_MINUTE = 8 * 60; // 08:00 → workedMinutes = 0
const WORK_DAY_END_MINUTE = 17 * 60; // 17:00 → fin de jornada
const WORK_DAY_LENGTH_MINUTES = WORK_DAY_END_MINUTE - WORK_DAY_START_MINUTE; // 540

const FULL_STATUS = { energy: 100, happiness: 100, fullness: 100, relax: 100 };

// ───────────────────────────────────────────────────────────────────────────
// Eventos programados.
//
// Cada evento se dispara cuando el reloj DE JUEGO cruza `atGameMinute` (minuto
// del día, 0–1439). Al dispararse muestra `message` y la stat indicada empieza
// a caer rápido durante una ventana REAL de `windowSeconds` segundos: hay que
// hacer click en la acción `resolveAction` antes de que se acabe la ventana.
//
// Para añadir/ajustar eventos, edita esta lista.
// ───────────────────────────────────────────────────────────────────────────
const SCHEDULED_EVENTS = [
  {
    key: "lunch",
    stat: "fullness",
    atGameMinute: 13 * 60, // 13:00 (1 PM) en hora de juego
    message: "¡ES LA UNA! ¡NECESITAMOS COMER! 🍔",
    windowSeconds: 20, // ventana real para reaccionar
    dropPerSecond: 5, // cuánto cae la stat por segundo durante la ventana
    resolveAction: "feed", // qué acción cancela el evento
  },
  {
    key: "morningCoffee",
    stat: "energy",
    atGameMinute: 8 * 60 + 30, // 08:30
    message: "¡SIN MI CAFÉ NO PUEDO TRABAJAR! ☕",
    windowSeconds: 20,
    dropPerSecond: 5,
    resolveAction: "takeCoffee",
  },
  {
    key: "afternoonSlump",
    stat: "energy",
    atGameMinute: 15 * 60, // 15:00 (3 PM)
    message: "¡DESPUES DE COMER ME AGARRO LA PACHORRA! 😴",
    windowSeconds: 20,
    dropPerSecond: 5,
    resolveAction: "takeCoffee",
  },
  {
    key: "stress",
    stat: "happiness",
    atGameMinute: 16 * 60, // 16:00 (4 PM)
    message: "¡ESTE PROYECTO ME ESTÁ ESTRESANDO! 😣",
    windowSeconds: 20,
    dropPerSecond: 5,
    resolveAction: "play",
  },
];

// Cada cuánto refrescamos la caída rápida durante un evento (ms).
const EVENT_TICK_MS = 200;

const clamp = (v) => Math.max(0, Math.min(100, v));

export function useGameLogic() {
  const [electronGameState, setElectronGameState] = useState({ ageSeconds: 0 });

  useEffect(() => {
    window.api.game.getState().then(setElectronGameState);
    return window.api.game.onState(setElectronGameState);
  }, []);

  // Punto de referencia: ageSeconds desde el que medimos la jornada actual.
  // Reiniciar la jornada = mover este baseline al ageSeconds del momento.
  const [baselineSeconds, setBaselineSeconds] = useState(0);

  // Minutos trabajados desde el baseline, topados al final de la jornada.
  const workedMinutes = useMemo(() => {
    const elapsed = electronGameState.ageSeconds - baselineSeconds;
    const value = Math.floor(AGE_SECONDS_TO_WORKED_MINUTES_RATE * elapsed);
    return Math.min(Math.max(value, 0), WORK_DAY_LENGTH_MINUTES);
  }, [electronGameState, baselineSeconds]);

  // Reloj de juego: arranca a las 08:00 y se detiene a las 17:00.
  const gameClockMinutes = useMemo(
    () => Math.min(WORK_DAY_START_MINUTE + workedMinutes, WORK_DAY_END_MINUTE),
    [workedMinutes],
  );

  const [petStatus, setPetStatus] = useState(FULL_STATUS);

  // Evento activo (o null). { key, stat, message, dropPerSecond, resolveAction, deadline }
  const [activeEvent, setActiveEvent] = useState(null);

  // Cuántos minutos trabajados ya descontamos.
  const lastWorkedRef = useRef(0);
  // Eventos ya disparados en esta jornada (por key), para no repetirlos.
  const firedRef = useRef(new Set());

  // Fin de jornada: cancelar cualquier evento activo para que no siga cayendo.
  useEffect(() => {
    if (workedMinutes >= WORK_DAY_LENGTH_MINUTES) {
      setActiveEvent(null);
    }
  }, [workedMinutes]);

  // Caída lenta normal, ligada al tiempo de juego.
  useEffect(() => {
    const elapsed = workedMinutes - lastWorkedRef.current;
    if (elapsed <= 0) return; // no avanzó (o se reinició), nada que decaer
    lastWorkedRef.current = workedMinutes;

    const drop = DECAY_PER_WORKED_MINUTE * elapsed;
    setPetStatus((prev) => ({
      energy: clamp(prev.energy - drop),
      happiness: clamp(prev.happiness - drop),
      fullness: clamp(prev.fullness - drop),
      relax: clamp(prev.relax - drop),
    }));
  }, [workedMinutes]);

  // Disparo de eventos según el reloj de juego.
  useEffect(() => {
    // Pasada la jornada no se disparan más eventos.
    if (workedMinutes >= WORK_DAY_LENGTH_MINUTES) return;

    for (const ev of SCHEDULED_EVENTS) {
      if (gameClockMinutes >= ev.atGameMinute && !firedRef.current.has(ev.key)) {
        firedRef.current.add(ev.key);
        setActiveEvent({
          key: ev.key,
          stat: ev.stat,
          message: ev.message,
          dropPerSecond: ev.dropPerSecond,
          resolveAction: ev.resolveAction,
          deadline: Date.now() + ev.windowSeconds * 1000,
        });
      }
    }
  }, [gameClockMinutes, workedMinutes]);

  // Caída rápida en tiempo real mientras hay un evento activo.
  useEffect(() => {
    if (!activeEvent) return;

    const id = setInterval(() => {
      if (Date.now() >= activeEvent.deadline) {
        setActiveEvent(null); // se acabó la ventana: ya no decae rápido
        return;
      }
      const drop = activeEvent.dropPerSecond * (EVENT_TICK_MS / 1000);
      setPetStatus((prev) => ({
        ...prev,
        [activeEvent.stat]: clamp(prev[activeEvent.stat] - drop),
      }));
    }, EVENT_TICK_MS);

    return () => clearInterval(id);
  }, [activeEvent]);

  // Si la acción que se acaba de ejecutar resuelve el evento activo, lo cancela.
  const resolveEventFor = (actionName) =>
    setActiveEvent((ev) => (ev && ev.resolveAction === actionName ? null : ev));

  return {
    workedMinutes,
    gameClockMinutes,
    petStatus,
    activeEvent,
    play: () => {
      resolveEventFor("play");
      window.api.openMinigame();
    },
    feed: () => {
      resolveEventFor("feed");
      setPetStatus((p) => ({
        ...p,
        fullness: clamp(p.fullness + 30),
        happiness: clamp(p.happiness + 5),
      }));
    },
    takeCoffee: () => {
      resolveEventFor("takeCoffee");
      setPetStatus((p) => ({
        ...p,
        energy: clamp(p.energy + 30),
        relax: clamp(p.relax + 5),
      }));
    },
    meditate: () => {
      resolveEventFor("meditate");
      setPetStatus((p) => ({
        ...p,
        relax: clamp(p.relax + 30),
        energy: clamp(p.energy + 10),
      }));
    },
    minigameResult: (result) => {
      setPetStatus((p) => ({
        ...p,
        happiness:
          result === "win" ? clamp(p.happiness + 100) : clamp(p.happiness - 10),
      }));
    },
    // Reinicia la jornada: stats a 100, reloj a 08:00, eventos disponibles de nuevo.
    restartWorkday: () => {
      setBaselineSeconds(electronGameState.ageSeconds); // medir desde ahora
      lastWorkedRef.current = 0;
      firedRef.current = new Set();
      setActiveEvent(null);
      setPetStatus(FULL_STATUS);
    },
  };
}