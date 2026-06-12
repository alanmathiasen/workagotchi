import {
  maximunHappinessImg,
  happinessImg,
  neutralImg,
  maxSleepImg,
  maxHungerImg,
  maxBoredImg,
  maxStressImg,
  burnOutImg,
  gameOverImg,
  dialogMorningCoffee,
  dialogAfternoonCoffee,
  dialogHunger,
  dialogHappiness,
  dialogRelax,
} from "../../../img";

// Globo de diálogo por evento (la key viene de SCHEDULED_EVENTS en useGameState).
const DIALOG_IMAGES = {
  morningCoffee: dialogMorningCoffee,
  afternoonSlump: dialogAfternoonCoffee,
  lunch: dialogHunger,
  stress: dialogHappiness,
  relax: dialogRelax,
};

function useGetImage({ petStatus: { energy, happiness, fullness, relax } }) {
  const allStatus = [energy, happiness, fullness, relax];
  console.log(allStatus);

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

export function Pet({ petStatus, activeEvent, petWidth = "w-46" }) {
  const image = useGetImage({ petStatus });

  // Mientras hay un evento activo, mostramos su globo de diálogo (imagen).
  const dialogImage = activeEvent ? DIALOG_IMAGES[activeEvent.key] : null;

  return (
    <div className="relative inline-block">
      {/* El globo de diálogo del evento activo, posicionado sobre la mascota */}
      {dialogImage && (
        <img
          style={{ zIndex: 1000 }}
          src={dialogImage}
          alt={activeEvent.message}
          className="pointer-events-none absolute left-1/2 bottom-[70%] w-46 left-1/2 translate-x-[-70%]"
        />
      )}

      {/*a mascot*/}
      <img
        src={image}
        alt="Your Wkagotchi"
        className={`h-to ${petWidth} cursor-grab rounded-lg`}
      />
    </div>
  );
}
