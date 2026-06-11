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

// --- Buttons ---
import feedButton from "./buttons/feedButton.svg";
import getCoffeeButton from "./buttons/getCoffeeButton.svg";
import meditationButton from "./buttons/meditationButton.svg";
import playButton from "./buttons/playButton.svg";
import showButtonsButton from "./buttons/showButtonsButton.svg";
import showCardButton from "./buttons/showCardButton.svg";

// --- Minigame ---
import stoneImg from "./minigame/stone.png";

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
  // buttons
  feedButton,
  getCoffeeButton,
  meditationButton,
  playButton,
  showButtonsButton,
  showCardButton,
  // minigame
  cloudImgs,
  stoneImg,
};
