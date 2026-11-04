import { useEffect, useState } from "react";
import type { PanZoomEngine } from "@/engine/PanZoomEngine";
import type { Zone } from "@/types";

/** Faint "● WEST BAY, DOHA" label that follows the horizontal position of the view. */
export function ZoneLabel({ engine, zones }: { engine: PanZoomEngine; zones: Zone[] }) {
  const [label, setLabel] = useState(zones[0]?.label ?? "");

  useEffect(
    () =>
      engine.subscribe((v) => {
        const centre = v.x + v.w / 2;
        const zone = zones.find((z) => centre >= z.from && centre < z.to) ?? zones[zones.length - 1];
        setLabel(zone.label);
      }),
    [engine, zones],
  );

  return (
    <p
      className="pointer-events-none absolute left-4 top-[112px] z-10 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:left-24 sm:top-[88px]"
      aria-live="polite"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white/60" />
      {label}
    </p>
  );
}
