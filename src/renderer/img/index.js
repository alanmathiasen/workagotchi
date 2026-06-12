// Barrel for all image assets. Import from "@/../img" (or a relative path) so
// callers never need to know the real file locations.

// --- Root icons ---
import alimentarImg from "./alimentar.svg";
import cafeImg from "./cafe.svg";
import meditateIcon from "./meditateIcon.svg";
import obeliscoImg from "./obeslico.svg"; // NOTE: filename is misspelled "obeslico"
import playIcon from "./playIcon.svg";

// --- Pet state faces ---
import maximunHappinessImg from "./states/maxHappiness.svg";
import happinessImg from "./states/happiness.svg";
import neutralImg from "./states/neutral.svg";
import maxSleepImg from "./states/maxSleep.svg";
import maxHungerImg from "./states/maxHunger.svg";
import maxBoredImg from "./states/maxBored.svg";
import maxStressImg from "./states/maxStress.svg";
import burnOutImg from "./states/burnOut.svg";
import gameOverImg from "./states/gameOver.svg";

// --- Dialogs (event speech bubbles) ---
import dialogMorningCoffee from "./dialogs/morning-coffee.png";
import dialogAfternoonCoffee from "./dialogs/afternoon-coffee.png";
import dialogHunger from "./dialogs/hunger.png";
import dialogHappiness from "./dialogs/happines.png";
import dialogRelax from "./dialogs/relax.png";

// --- Buttons ---
import feedButton from "./buttons/feedButton.svg";
import getCoffeeButton from "./buttons/getCoffeeButton.svg";
import meditationButton from "./buttons/meditationButton.svg";
import playButton from "./buttons/playButton.svg";
import showButtonsButton from "./buttons/showButtonsButton.svg";
import showButtonsButtonClose from "./buttons/showButtonsButtonClose.svg";
import showCardButton from "./buttons/showCardButton.svg";
import showCardButtonClose from "./buttons/showCardButtonClose.svg";
import siguienteDiaButton from "./buttons/siguienteDiaButton.svg";

// --- Minigame ---
import stoneImg from "./minigame/stone.png";

import loLograste from "./loLograste.svg";

import gameOverTitle from "./gameOverTitle.svg";
import jornadaLaboralTitle from "./jornadaLaboralTitle.svg";
import felicidadState from "./felicidadState.svg";
import energiaState from "./energiaState.svg";
import saciedadState from "./saciedadState.svg";
import relaxState from "./relaxState.svg";

import moon from "./moon.svg";

import sun from "./sun.svg";

import eatingLionImg from "./minigame/eating-lion.svg";

// Cloud PNGs (filenames have spaces/parens, so glob them); exclude the stone.
const cloudImgs = Object.entries(
  import.meta.glob("./minigame/*.png", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)
  .filter(([path]) => !path.includes("stone"))
  .map(([, url]) => url);

export {
  // root
  alimentarImg,
  cafeImg,
  meditateIcon,
  obeliscoImg,
  playIcon,
  // states
  maximunHappinessImg,
  happinessImg,
  neutralImg,
  maxSleepImg,
  maxHungerImg,
  maxBoredImg,
  maxStressImg,
  burnOutImg,
  gameOverImg,
  // dialogs
  dialogMorningCoffee,
  dialogAfternoonCoffee,
  dialogHunger,
  dialogHappiness,
  dialogRelax,
  dialogMorningCoffee as morningCooffe, // alias retrocompatible
  // buttons
  feedButton,
  getCoffeeButton,
  meditationButton,
  playButton,
  showButtonsButton,
  showButtonsButtonClose,
  showCardButton,
  showCardButtonClose,
  // minigame
  cloudImgs,
  stoneImg,
  loLograste,
  siguienteDiaButton,
  moon,
  sun,
  eatingLionImg,
  gameOverTitle,
  jornadaLaboralTitle,
  felicidadState,
  energiaState,
  saciedadState,
  relaxState,
};
