import {
  felicidadState,
  energiaState,
  saciedadState,
  relaxState,
} from "../../../img";

const clamp = (v) => Math.max(10, Math.min(100, v));

function getBarColor(value) {
  if (value <= 20) return "from-[#c91d12] to-[#8f110b]"; // rojo
  if (value <= 55) return "from-[#ff9c2e] to-[#d66a17]"; // naranja
  return "from-[#42d25a] to-[#229c42]"; // verde
}

const statImages = {
  energy: energiaState,
  fullness: saciedadState,
  relax: relaxState,
  happiness: felicidadState,
};

export function SegmentedStatBar({ type, value, segments = 8 }) {
  const filled = Math.round((clamp(value) / 100) * segments);
  const safeValue = clamp(value);
  const barColor = getBarColor(safeValue);
  const imageSrc = statImages[type];

  return (
    <div className="flex flex-col items-center gap-1">
      <img src={imageSrc} />

      <div className="flex w-full gap-[2px] rounded-full border-2 border-gray-300 bg-[#16280f] p-[3px] shadow-inner">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filled;
          const isFirst = i === 0;
          const isLast = i === segments - 1;
          return (
            <div
              key={i}
              className={[
                "h-3 flex-1",
                isFilled
                  ? `bg-gradient-to-b ${barColor}`
                  : "bg-gradient-to-b from-[#234d84] to-[#142f5d]",
                isFirst ? "rounded-l-full" : "",
                isLast ? "rounded-r-full" : "",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
