import { useState, useEffect, useMemo, useRef } from "react";

const AGE_SECONDS_TO_WORKED_MINUTES_RATE = 10;

// En 8 h de trabajo (480 min trabajados) cada stat va de 100 → 0.
const WORK_MINUTES_TO_ZERO = 8 * 60; // 480
const DECAY_PER_WORKED_MINUTE = 100 / WORK_MINUTES_TO_ZERO; // ≈ 0.2083

const clamp = (v) => Math.max(0, Math.min(100, v));

export function useGameLogic() {
  const [electronGameState, setElectronGameState] = useState({ ageSeconds: 0 });

  useEffect(() => {
    window.api.game.getState().then(setElectronGameState);
    return window.api.game.onState(setElectronGameState);
  }, []);

  const workedMinutes = useMemo(
    () =>
      Math.floor(AGE_SECONDS_TO_WORKED_MINUTES_RATE * electronGameState.ageSeconds),
    [electronGameState],
  );

  const [petStatus, setPetStatus] = useState({
    energy: 100,
    happiness: 100,
    fullness: 100,
    relax: 100,
  });

  // Cuántos minutos trabajados ya descontamos.
  const lastWorkedRef = useRef(0);

  useEffect(() => {
    const elapsed = workedMinutes - lastWorkedRef.current;
    if (elapsed <= 0) return; // no avanzó, nada que decaer
    lastWorkedRef.current = workedMinutes;

    const drop = DECAY_PER_WORKED_MINUTE * elapsed;
    setPetStatus((prev) => ({
      energy: clamp(prev.energy - drop),
      happiness: clamp(prev.happiness - drop),
      fullness: clamp(prev.fullness - drop),
      relax: clamp(prev.relax - drop),
    }));
  }, [workedMinutes]);

  return {
    workedMinutes,
    petStatus,
    play: () => window.api.openMinigame(),
    feed: () =>
      setPetStatus((p) => ({
        ...p,
        fullness: clamp(p.fullness + 30),
        happiness: clamp(p.happiness + 5),
      })),
    rest: () =>
      setPetStatus((p) => ({
        ...p,
        energy: clamp(p.energy + 30),
        relax: clamp(p.relax + 10),
      })),
  };
}