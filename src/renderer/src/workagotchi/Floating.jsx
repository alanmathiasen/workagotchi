import { useRef, useEffect, useState } from "react";
import { useGameLogic } from "@/hooks/useGameState";
import { Card } from "./Card";
import {
  getCoffeeButton,
  meditationButton,
  feedButton,
  playButton,
  showButtonsButton,
  showCardButton,
  showCardButtonClose,
  showButtonsButtonClose,
} from "../../img";
import { CircularProgressIndication } from "./components/CircularProgressIndication";
import { Pet } from "./components/Pet";

// Movement smaller than this counts as a click, not a drag.
const DRAG_THRESHOLD = 3;

export function Floating() {
  const {
    workedMinutes,
    petStatus: { energy, happiness, fullness, relax },
    activeEvent,
    feed,
    play,
    takeCoffee,
    meditate,
    minigameResult: mnResult,
    restartWorkday
  } = useGameLogic();

  const [expanded, setExpanded] = useState(true);

  const [showStats, setShowStats] = useState(true);

  const [minigameResult, setMinigameResult] = useState(null);

  useEffect(() => {
    return window.api.minigame.onResult((result) => setMinigameResult(result));
  }, []);

  useEffect(() => {
    if (minigameResult) {
      mnResult(minigameResult);
      setMinigameResult(null);
    }
  }, [minigameResult]);

  // Drag bookkeeping lives in a ref so moving the mouse doesn't re-render.
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });

  const onPointerDown = (e) => {
    // No iniciar el arrastre si el click empezó en un botón: la captura de
    // puntero del contenedor redirigiría el "click" hacia él y el botón nunca
    // recibiría su onClick (p. ej. el botón "Siguiente día").
    if (e.target.closest("button")) return;
    e.preventDefault(); // evita que el navegador inicie una selección al arrastrar
    drag.current = { active: true, moved: false, x: e.screenX, y: e.screenY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.screenX - d.x;
    const dy = e.screenY - d.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      d.moved = true;
    }
    if (dx !== 0 || dy !== 0) {
      window.api.moveWindowBy(dx, dy); // ← same IPC the main handler receives
      d.x = e.screenX;
      d.y = e.screenY;
    }
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const actions = [
    {
      key: "stats",
      img: showStats ? showCardButtonClose : showCardButton,
      label: "Estados",
      onClick: () => setShowStats((v) => !v),
      x: 120,
      y: -10,
    },
    {
      key: "meditate",
      img: meditationButton,
      label: "Meditar",
      onClick: meditate,
      associatedState: relax,
      x: 70,
      y: -80,
    },
    {
      key: "play",
      img: playButton,
      label: "Jugar",
      onClick: play,
      associatedState: happiness,
      x: -70,
      y: -80,
    },
    {
      key: "feed",
      img: feedButton,
      label: "Alimentar",
      onClick: feed,
      associatedState: fullness,
      x: -120,
      y: -10,
    },
    {
      key: "coffee",
      img: getCoffeeButton,
      label: "Café",
      onClick: takeCoffee,
      associatedState: energy,
      x: -90,
      y: 70,
    },
  ];

  return (
    <div className="flex items-end gap-4 pr-2 h-screen">
      <div
        className="grow"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {showStats ? (
          <Card
            petStatus={{ energy, happiness, fullness, relax }}
            workedMinutes={workedMinutes}
            activeEvent={activeEvent}
            restartWorkday={restartWorkday}
          />
        ) : (
          <div className="relative flex items-center justify-center">
            <Pet
              petWidth="w-62"
              petStatus={{ energy, happiness, fullness, relax }}
              activeEvent={activeEvent}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 w-24 shrink-0">
        {actions.reverse().map((action, i) => (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            aria-label={action.label}
            className="transition-all duration-300 ease-out"
            style={{
              transform: expanded ? "scale(1)" : "scale(0)",
              opacity: expanded ? 1 : 0,
              pointerEvents: expanded ? "auto" : "none",
              transitionDelay: expanded
                ? `${(actions.length - 1 - i) * 150}ms`
                : `${i * 40}ms`,
            }}
          >
            {!showStats && action.associatedState !== undefined ? (
              <CircularProgressIndication
                value={Math.max(2, action.associatedState)}
              >
                <img src={action.img} className="h-auto w-20" />
              </CircularProgressIndication>
            ) : (
              <img src={action.img} className="h-auto w-20" />
            )}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Mostrar acciones"
          aria-expanded={expanded}
        >
          <img
            src={expanded ? showButtonsButtonClose : showButtonsButton}
            alt=""
            draggable={false}
            className="h-auto w-20"
          />
        </button>
      </div>
    </div>
  );
}
