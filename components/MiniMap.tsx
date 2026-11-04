import { useEffect, useRef } from "react";
import type { PanZoomEngine } from "@/engine/PanZoomEngine";
import type { ImageAsset, PinData } from "@/types";
import { cn } from "@/utils/cn";
import { ImagePicture } from "./ProgressiveImage";

interface Props {
  engine: PanZoomEngine;
  image: ImageAsset;
  pins: PinData[];
  aspect: number;
  className?: string;
}

/** Thumbnail of the whole panorama. Click or drag to move the view. */
export function MiniMap({ engine, image, pins, aspect, className }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(
    () =>
      engine.subscribe((v) => {
        const el = rectRef.current;
        if (!el) return;
        el.style.left = `${v.x * 100}%`;
        el.style.top = `${v.y * 100}%`;
        el.style.width = `${Math.min(1, v.w) * 100}%`;
        el.style.height = `${Math.min(1, v.h) * 100}%`;
      }),
    [engine],
  );

  const moveTo = (e: React.PointerEvent) => {
    const r = frameRef.current!.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    engine.focus(nx, ny);
  };

  return (
    <div
      ref={frameRef}
      role="slider"
      aria-label="Mini-map. Click or drag to move the view."
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = engine.viewport.w * 0.2;
        if (e.key === "ArrowLeft") engine.panBy(step);
        if (e.key === "ArrowRight") engine.panBy(-step);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      style={{ aspectRatio: String(aspect) }}
      className={cn(
        "focus-ring relative cursor-pointer touch-none overflow-hidden rounded-xl border-2 border-white/80 bg-navy-900 shadow-glass",
        className,
      )}
    >
      <ImagePicture asset={image} alt="" className="pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/15" />
      {pins.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_4px_rgba(245,215,122,0.9)]"
          style={{ left: `${p.position.x}%`, top: `${p.position.y}%` }}
        />
      ))}
      <div
        ref={rectRef}
        className="pointer-events-none absolute rounded-[3px] border-2 border-white shadow-[0_0_0_9999px_rgba(7,15,32,0.35)]"
      />
    </div>
  );
}
