import chairImageBorder from "../../img/ui/borders/chairImageBorder.svg";
import cupImageBorder from "../../img/ui/borders/cupImageBorder.svg";
import gameOverBorder from "../../img/ui/borders/gameOverBorder.svg";
import cardTitle from "../../img/cardTitle.svg";
import puertoBackground from "../../img/backgrounds/puertoCardBackground.svg";
import gameOverBackground from "../../img/backgrounds/gameOverBackground.png";
import youWonBackground from "../../img/backgrounds/youWonBackground.png";

import {
  loLograste,
  siguienteDiaButton,
  gameOverTitle,
  jornadaLaboralTitle,
} from "../../img";
import { SegmentedStatBar } from "./components/SegmentedBar";
import { Pet } from "./components/Pet";
import { TimeBar } from "./components/TimeBar";

export function Card({
  petStatus: { energy, happiness, fullness, relax },
  workedMinutes,
  activeEvent,
  restartWorkday,
}) {
  const isWorkDayFinished = workedMinutes >= 540;
  const hasWon = getResult();

  function getResult() {
    const average = (energy + happiness + fullness + relax) / 4;
    return average > 60;
  }

  function getBackgroundColor() {
    if (!isWorkDayFinished) return "#3A6496"; // neutro
    return hasWon ? "#CF9878" : "#505050"; // ganó : perdió
  }

  function getBorderColor() {
    if (!isWorkDayFinished) return "#0E2745"; // neutro
    return hasWon ? "#F7B940" : "#3E3E3E"; // ganó : perdió
  }

  function getBorderImage() {
    if (!isWorkDayFinished) return chairImageBorder; // jugando
    return hasWon ? cupImageBorder : gameOverBorder; // ganó : perdió
  }

  function getBackgroundImage() {
    if (!isWorkDayFinished) return puertoBackground; // jugando
    return hasWon ? youWonBackground : gameOverBackground; // ganó : perdió
  }

  function getBackgroundStatesColor() {
    if (!isWorkDayFinished) return "#071C36"; // neutro
    return hasWon ? "#A3523B" : "#0A0A0A"; // ganó : perdió
  }

  return (
    <div className="flex select-none flex-col items-center justify-center gap-2">
      <div
        className="relative"
        style={{
          backgroundImage: `url(${getBorderImage()})`,
          backgroundRepeat: "round",
          //505050 si perdio, 3E3E3E si perdio background border / 3A6496 fondo neutro, 0E2745 border color /
          //backgroundColor: "#AF603D",
          backgroundColor: getBorderColor(),
          backgroundSize: "35px 35px",
          padding: "35px",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            padding: "5px",
            borderWidth: "5px",
            borderColor: getBackgroundStatesColor(),
            backgroundColor: getBackgroundColor(),
            borderRadius: "12px",
          }}
        >
          <img
            src={cardTitle}
            alt="Workagotchi"
            draggable={false}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 select-none z-10 w-[310px]"
          />
          <div
            style={{
              border: "8px solid ${getBorderColor()}",
              padding: "8px",
              //backgroundColor: "#AF603D",
              backgroundColor: getBackgroundColor(),
              borderRadius: "12px",
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                backgroundImage: `url(${getBackgroundImage()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {!isWorkDayFinished ? (
                <Pet
                  petStatus={{ energy, happiness, fullness, relax }}
                  activeEvent={activeEvent}
                />
              ) : (
                <div className="relative inline-block">
                  <img
                    src={getBackgroundImage()}
                    alt="Workagotchi"
                    draggable={false}
                    //className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 select-none z-10 w-[310px]"
                  />
                </div>
              )}
            </div>
            <div style={{ padding: "10px" }}>
              {isWorkDayFinished ? (
                <img src={hasWon ? loLograste : gameOverTitle} />
              ) : (
                <img src={jornadaLaboralTitle} />
              )}
            </div>

            <div
              className="grid grid-cols-2 gap-x-2 gap-y-2 rounded-lg p-4"
              style={{ backgroundColor: getBackgroundStatesColor() }}
            >
              <SegmentedStatBar
                type="energy"
                value={energy}
              />

              <SegmentedStatBar
                type="fullness"
                value={fullness}
              />

              <SegmentedStatBar type="relax" value={relax} />

              <SegmentedStatBar
                type="happiness"
                value={happiness}
              />
            </div>

            <div
              style={{
                paddingTop: "20px",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              {isWorkDayFinished ? (
                <div className="grid w-full pt-2 pb-4">
                  <button
                    type="button"
                    aria-label="Siguiente día"
                    onClick={restartWorkday}
                  >
                    <img src={siguienteDiaButton} alt="Siguiente día" />
                  </button>
                </div>
              ) : (
                <TimeBar value={workedMinutes} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
