import { useRef, useEffect, useState } from "react";
import { useGameLogic } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
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
    rest,
  } = useGameLogic();

  const image = useGetImage();

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

  return (
    <div className="flex h-screen w-screen select-none flex-col items-center justify-center gap-2 bg-white">
      <div className="flex w-full items-center justify-center gap-2 px-2 relative">

        <Button id="" className="absolute bottom-0 right-0" > 1 </Button>
        <Button className="absolute bottom-0 left-0" > 2 </Button>
        <Button className="absolute top-0 left-45" > 3 </Button>
        <Button className="absolute top-0 left-15" > 4 </Button>
        <Button className="absolute top-0 right-15" > 5 </Button>
        <Button className="absolute top-0 right-15" > 6 </Button>
        {/* <Button > 2 </Button>
        <Button > 2 </Button>
        <Button > 1 </Button>
        <Button > 1 </Button> */}
        <div className="flex basis-1/2 justify-center">
          <img
            src={image}
            alt="Your Workagotchi"
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            title="Drag to move · click to open the dashboard"
            className="w-full cursor-grab rounded-lg border border-white/40 object-contain active:cursor-grabbing"
          />
        </div>
      </div>

      <div className="none pointer-events-none flex flex-col items-center gap-0.5 text-[11px] leading-tight text-black drop-shadow">
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
    </div>
  );
}
