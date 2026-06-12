import { useRef, useEffect, useState } from "react";
import { useGameLogic } from "@/hooks/useGameState";
import {
  maximunHappinessImg,
  alimentarImg,
  cafeImg,
  meditateIcon,
  happinessImg,
  neutralImg,
  maxSleepImg,
  maxHungerImg,
  maxBoredImg,
  maxStressImg,
  burnOutImg,
  gameOverImg,
  feedButton,
  getCoffeeButton,
  meditationButton,
  playButton,
  showButtonsButton,
  showCardButton,
} from "../../img";

// Movement smaller than this counts as a click, not a drag.
const DRAG_THRESHOLD = 3;

function formatTime(totalMinutes = 0) {
  const hh = String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function useGetImage() {
  const {
    petStatus: { energy, happiness, fullness, relax },
  } = useGameLogic();

  const allStatus = [energy, happiness, fullness, relax];

  if (allStatus.every((x) => x <= 10)) {
    return gameOverImg;
  }

  if (allStatus.filter((x) => x <= 20).length >= 2) {
    return burnOutImg;
  }

  if (energy <= 20) {
    return maxSleepImg;
  }
  if (happiness <= 20) {
    return maxBoredImg;
  }
  if (fullness <= 20) {
    return maxHungerImg;
  }
  if (relax <= 20) {
    return maxStressImg;
  }

  if (allStatus.every((x) => x >= 95)) {
    return maximunHappinessImg;
  }

  if (allStatus.every((x) => x >= 80)) {
    return happinessImg;
  }

  return neutralImg;
}

export function Floating() {
  const {
    workedMinutes,
    petStatus: { energy, happiness, fullness, relax },
    feed,
    play,
    takeCoffee,
    meditate,
  } = useGameLogic();

  const image = useGetImage();

  const [expanded, setExpanded] = useState(false);

  const [showStats, setShowStats] = useState(false);

  const [minigameResult, setMinigameResult] = useState(null);

  useEffect(() => {
    return window.api.minigame.onResult((result) => setMinigameResult(result));
  }, []);

  useEffect(() => {
    if (minigameResult === "win") {
      console.log("¡Ganaste el minijuego! Tu Workagotchi está feliz :)");
    } else if (minigameResult === "lose") {
      console.log(
        "Perdiste el minijuego. ¡Inténtalo de nuevo para hacer feliz a tu Workagotchi!",
      );
    }
  }, [minigameResult]);

  // Drag bookkeeping lives in a ref so moving the mouse doesn't re-render.
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });

  const onPointerDown = (e) => {
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
      img: showCardButton,
      label: "Estados",
      onClick: () => setShowStats((v) => !v),
      x: 120,
      y: -10,
    },
    { key: "meditate", img: meditationButton, label: "Meditar", onClick: meditate, x: 70, y: -80 },
    { key: "play", img: playButton, label: "Jugar", onClick: play, x: -70, y: -80 },
    { key: "feed", img: feedButton, label: "Alimentar", onClick: feed, x: -120, y: -10 },
    { key: "coffee", img: getCoffeeButton, label: "Café", onClick: takeCoffee, x: -90, y: 70 },
  ];

  return (
    <div
      className={`flex h-screen w-screen select-none flex-col items-center justify-center gap-2 ${showStats ? "bg-white" : "bg-transparent"
        }`}
    >
      <div className="relative flex items-center justify-center">
        {actions.map((a, i) => (
          <button
            key={a.key}
            type="button"
            onClick={a.onClick}
            aria-label={a.label}
            className="absolute left-1/2 top-1/2 transition-all duration-300 ease-out"
            style={{
              transform: expanded
                ? `translate(-50%, -50%) translate(${a.x}px, ${a.y}px) scale(1)`
                : `translate(-50%, -50%) translate(0px, 0px) scale(0)`,
              opacity: expanded ? 1 : 0,
              pointerEvents: expanded ? "auto" : "none",
              transitionDelay: expanded ? `${i * 40}ms` : "0ms",
            }}
          >
            <img src={a.img} alt="" draggable={false} className="h-14 w-14" />
          </button>
        ))}


        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Mostrar acciones"
          aria-expanded={expanded}
          className="absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%, -50%) translate(90px, 70px)" }}
        >
          <img src={showButtonsButton} alt="" draggable={false} className="h-14 w-14" />
        </button>

        <img
          src={image}
          alt="Your Workagotchi"
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          title="Drag to move · click to open the dashboard"
          className="h-28 w-28 cursor-grab rounded-lg object-contain active:cursor-grabbing"
        />
      </div>

      {showStats && (
        <div className="pointer-events-none flex flex-col items-center gap-0.5 text-[11px] leading-tight text-black drop-shadow">
          <span>
            ⏱ <strong>TIEMPO</strong> {formatTime(workedMinutes)}
          </span>
          <span>
            ⚡ <strong>ENERGIA</strong> {Math.round(energy)}
          </span>
          <span>
            😊 <strong>FELICIDAD</strong> {Math.round(happiness)}
          </span>
          <span>
            🍔 <strong>SACIEDAD</strong> {Math.round(fullness)}
          </span>
          <span>
            😣 <strong>RELAX</strong> {Math.round(relax)}
          </span>
        </div>
      )}
    </div>
  );
}
