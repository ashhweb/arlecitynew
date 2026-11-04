import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { PanZoomEngine } from "@/engine/PanZoomEngine";
import { cn } from "@/utils/cn";

const btn =
  "focus-ring glass pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition hover:scale-110 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:h-10 sm:w-10";

export function ZoomControls({ engine, className }: { engine: PanZoomEngine; className?: string }) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => engine.subscribe((v) => setZoom(Math.round(v.zoom * 100) / 100)), [engine]);

  return (
    <div className={cn("pointer-events-none absolute right-3 z-20 flex flex-col gap-2 sm:right-4", className)}>
      <button type="button" className={btn} aria-label="Zoom in" onClick={() => engine.zoomBy(1.5)} disabled={zoom >= engine.maxZoom - 0.01}>
        <Plus className="h-5 w-5" aria-hidden />
      </button>
      <button type="button" className={btn} aria-label="Zoom out" onClick={() => engine.zoomBy(1 / 1.5)} disabled={zoom <= engine.minZoom + 0.01}>
        <Minus className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
