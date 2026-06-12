import {moon, sun}  from "../../../img";

const clamp = (v) => Math.max(0, Math.min(100, v));

export function TimeBar({ value }) {
  const safeValue = clamp(value * 100 / (9 * 60)) ;

  return (
    <div className="flex w-full items-center gap-3">
      <img
        src={sun}
        alt="Sun"
        className="h-7 w-7 shrink-0 object-contain"
      />

      <div className="relative h-[22px] flex-1 bg-white p-[3px] shadow-[4px_4px_0_#d9d9d9]">
        <div className="h-full w-full bg-[#bfbfbf]">
          <div
            className="h-full bg-[#001b38]"
            style={{ width: `${safeValue}%` }}
          />
        </div>
      </div>

      <img
        src={moon}
        alt="Moon"
        className="h-7 w-7 shrink-0 object-contain"
      />
    </div>
  );
}