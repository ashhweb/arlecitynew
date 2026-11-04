import { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, type ReactNode, type Ref } from "react";
import { AnimatePresence } from "framer-motion";
import { PanZoomEngine, type ViewSnapshot } from "@/engine/PanZoomEngine";
import { useImageAsset } from "@/hooks/useImageAsset";
import type { PinData, SceneConfig } from "@/types";
import { cn } from "@/utils/cn";
import { EdgeArrows } from "./EdgeArrows";
import { ImageFallback, LoadingScreen } from "./LoadingScreen";
import { MiniMap } from "./MiniMap";
import { PinLayer } from "./PinLayer";
import { ImagePicture } from "./ProgressiveImage";
import { ZoneLabel } from "./ZoneLabel";
import { ZoomControls } from "./ZoomControls";

export interface PanoramaHandle {
  /** Glide to a pin (and optionally zoom in on it). */
  focusPin: (pin: PinData, zoom?: number) => void;
  engine: PanZoomEngine;
}

interface Props {
  scene: SceneConfig;
  activePinId?: string | null;
  onPinSelect: (pin: PinData) => void;
  showMiniMap?: boolean;
  /** Tailwind classes positioning the minimap (default: bottom-centre). */
  miniMapClassName?: string;
  /** Tailwind classes positioning the zoom buttons (default: bottom-right). */
  zoomClassName?: string;
  /** Disable keyboard shortcuts while a modal / drawer is open. */
  keyboardEnabled?: boolean;
  initialCenter?: { x: number; y: number };
  /** Decorative overlays (airplane, …) rendered above the image, below the UI. */
  children?: ReactNode;
  ref?: Ref<PanoramaHandle>;
}

/** Remember where the user was in each scene while navigating between screens. */
const viewMemory = new Map<string, ViewSnapshot>();

/**
 * Generic panorama viewer: city and every industry inside view use this one component.
 * Pins sit inside the transformed content, so they stay locked to their buildings.
 */
export function PanoramaViewer({
  scene,
  activePinId,
  onPinSelect,
  showMiniMap = true,
  miniMapClassName = "bottom-3 left-1/2 w-36 -translate-x-1/2 sm:bottom-4 sm:w-60",
  zoomClassName = "bottom-3 sm:bottom-4",
  keyboardEnabled = true,
  initialCenter,
  children,
  ref,
}: Props) {
  const img = useImageAsset(scene.image);
  const engine = useMemo(() => new PanZoomEngine(), []);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ready = img.status === "ready" && !!img.size;

  useImperativeHandle(
    ref,
    () => ({
      engine,
      focusPin: (pin, zoom) => engine.focus(pin.position.x / 100, pin.position.y / 100, zoom),
    }),
    [engine],
  );

  // Bind input + sizing once the image is decoded and its natural size is known.
  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    const content = contentRef.current;
    if (!ready || !surface || !content || !img.size) return;
    const { width, height } = img.size;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    engine.reduceMotion = motionQuery.matches;
    const onMotion = () => (engine.reduceMotion = motionQuery.matches);
    motionQuery.addEventListener("change", onMotion);

    const unbind = engine.bind(surface, content);
    const memo = viewMemory.get(scene.id);
    let first = true;
    const measure = () => {
      engine.setSize(surface.clientWidth, surface.clientHeight, width, height, initialCenter);
      if (first && memo) engine.restore(memo);
      first = false;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(surface);

    return () => {
      viewMemory.set(scene.id, engine.getSnapshot());
      ro.disconnect();
      motionQuery.removeEventListener("change", onMotion);
      unbind();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, engine, scene.id, img.size]);

  // Keyboard: ← → pan, + / − zoom.
  useEffect(() => {
    if (!keyboardEnabled || !ready) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const step = Math.max(160, engine.viewport.w * 0.2);
      switch (e.key) {
        case "ArrowLeft":
          engine.panBy(step);
          break;
        case "ArrowRight":
          engine.panBy(-step);
          break;
        case "+":
        case "=":
          engine.zoomBy(1.4);
          break;
        case "-":
        case "_":
          engine.zoomBy(1 / 1.4);
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engine, keyboardEnabled, ready]);

  const aspect = img.size ? img.size.width / img.size.height : 2;

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-900">
      {/* blurred placeholder behind everything while loading */}
      <img
        src={scene.image.placeholder}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
      />

      {ready && (
        <div ref={surfaceRef} role="group" className="pan-surface absolute inset-0" aria-label={`${scene.name} panorama. Drag, swipe or use the arrow keys to look around.`}>
          <div ref={contentRef} className="pan-content absolute left-0 top-0">
            <ImagePicture asset={scene.image} />
            <PinLayer pins={scene.sections} activeId={activePinId} onSelect={onPinSelect} />
          </div>
        </div>
      )}

      {ready && (
        <>
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">{children}</div>
          {scene.zones && <ZoneLabel engine={engine} zones={scene.zones} />}
          <EdgeArrows engine={engine} />
          <ZoomControls engine={engine} className={zoomClassName} />
          {showMiniMap && (
            <MiniMap
              engine={engine}
              image={scene.image}
              pins={scene.sections}
              aspect={aspect}
              className={cn("absolute z-20", miniMapClassName)}
            />
          )}
        </>
      )}

      <AnimatePresence>{img.status === "loading" && <LoadingScreen key="loader" />}</AnimatePresence>
      {img.status === "error" && <ImageFallback onRetry={img.retry} />}
    </div>
  );
}
