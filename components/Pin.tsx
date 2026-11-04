import { memo } from "react";
import type { PinData } from "@/types";
import { cn } from "@/utils/cn";

interface PinProps {
  pin: PinData;
  active: boolean;
  onSelect: (pin: PinData) => void;
}

/**
 * Map pin. The wrapper sits at the building (image %), the inner block counter-scales with
 * `--inv` so the pin keeps a constant on-screen size while the image zooms.
 * The pointer tail's tip is the anchor point.
 */
export const Pin = memo(function Pin({ pin, active, onSelect }: PinProps) {
  const Icon = pin.icon;
  const ready = pin.status === "ready";

  return (
    <div
      className="group absolute z-10 h-0 w-0 focus-within:z-40 hover:z-40 data-[active=true]:z-40"
      style={{ left: `${pin.position.x}%`, top: `${pin.position.y}%` }}
      data-active={active}
      data-pin-id={pin.id}
    >
      <div
        className="absolute bottom-0 left-0"
        style={{
          transform: "translateX(-50%) scale(var(--inv, 1))",
          transformOrigin: "50% 100%",
          willChange: "transform",
        }}
      >
        <button
          type="button"
          onClick={() => onSelect(pin)}
          aria-label={`${pin.name} – ${ready ? "open inside view" : "coming soon"}`}
          className="relative flex cursor-pointer flex-col items-center outline-none before:absolute before:-inset-2 before:content-['']"
        >
          {/* tooltip */}
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 translate-y-1 rounded-xl border border-white/10 bg-navy-900/90 px-3 py-2 text-left text-xs leading-snug text-white opacity-0 shadow-glass backdrop-blur-md transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-sm:hidden"
          >
            <span className="block font-semibold text-gold-300">{pin.name}</span>
            <span className="block text-white/80">{pin.description}</span>
            <span className="mt-1 block text-[10px] uppercase tracking-wider text-white/45">
              {ready ? "Click to enter" : "Coming soon"}
            </span>
          </span>

          <span
            className={cn(
              "mb-1 max-w-[9.5rem] whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-4 text-navy-900 shadow-pin backdrop-blur-md transition duration-200 max-sm:text-[10px]",
              "border-white/60 bg-white/80 group-hover:bg-white group-focus-within:bg-white",
              (active || ready) && "border-gold-300",
              active && "bg-white",
            )}
          >
            {pin.name}
          </span>

          <span
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-pin ring-2 ring-white/70 backdrop-blur-md transition duration-200",
              "group-hover:scale-110 group-hover:shadow-gold group-hover:ring-gold-300",
              "group-focus-within:scale-110 group-focus-within:ring-4 group-focus-within:ring-gold-300",
              ready && "ring-gold-300",
              active && "scale-110 shadow-gold-lg ring-4 ring-gold-300",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 rounded-full",
                active ? "animate-pin-ping bg-gold-300/80" : "animate-pin-pulse bg-white/60",
              )}
            />
            <Icon className="relative h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
          </span>
          <span
            aria-hidden
            className={cn(
              "-mt-[5px] mb-[2px] h-2.5 w-2.5 rotate-45 rounded-[2px] bg-white/90",
              (ready || active) && "bg-gold-200",
            )}
          />
        </button>
      </div>
    </div>
  );
});
