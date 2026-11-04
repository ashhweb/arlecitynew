import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PanZoomEngine } from "@/engine/PanZoomEngine";
import { cn } from "@/utils/cn";

const base =
  "focus-ring glass pointer-events-auto absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white/90 transition hover:scale-110 hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0";

/** "<" and ">" buttons on the screen edges – pan left / right. */
export function EdgeArrows({ engine }: { engine: PanZoomEngine }) {
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(
    () =>
      engine.subscribe((v) => {
        const start = v.x <= 0.0005;
        const end = v.x + v.w >= 0.9995;
        setEdge((e) => (e.start === start && e.end === end ? e : { start, end }));
      }),
    [engine],
  );

  const step = () => Math.max(220, engine.viewport.w * 0.28);

  return (
    <>
      <button
        type="button"
        aria-label="Pan left"
        disabled={edge.start}
        onClick={() => engine.panBy(step())}
        className={cn(base, "left-3 sm:left-4")}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Pan right"
        disabled={edge.end}
        onClick={() => engine.panBy(-step())}
        className={cn(base, "right-3 sm:right-4")}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </>
  );
}
