import { useCallback, useEffect, useState } from "react";
import type { ImageAsset } from "@/types";

export interface LoadedImage {
  width: number;
  height: number;
}

const cache = new Map<string, Promise<LoadedImage>>();
const sizes = new Map<string, LoadedImage>();

/** Builds a detached <picture> so the browser picks the same format (AVIF → JPEG) as the page will. */
function load(asset: ImageAsset): Promise<LoadedImage> {
  const existing = cache.get(asset.jpg);
  if (existing) return existing;

  const promise = new Promise<LoadedImage>((resolve, reject) => {
    const picture = document.createElement("picture");
    const sources: [string, string | undefined][] = [
      ["image/avif", asset.avif],
      ["image/webp", asset.webp],
    ];
    for (const [type, src] of sources) {
      if (!src) continue;
      const source = document.createElement("source");
      source.type = type;
      source.srcset = src;
      picture.appendChild(source);
    }
    const img = document.createElement("img");
    img.decoding = "async";
    picture.appendChild(img);
    img.onload = () => {
      const done = () => {
        const size = { width: img.naturalWidth, height: img.naturalHeight };
        sizes.set(asset.jpg, size);
        resolve(size);
      };
      if (img.decode) img.decode().then(done, done);
      else done();
    };
    img.onerror = () => reject(new Error(`Failed to load ${asset.jpg.slice(0, 40)}`));
    img.src = asset.jpg;
  });

  cache.set(asset.jpg, promise);
  promise.catch(() => cache.delete(asset.jpg));
  return promise;
}

/** Warm the cache for the next screen. Failures are silent. */
export function preloadImage(asset: ImageAsset) {
  load(asset).catch(() => undefined);
}

export type ImageStatus = "loading" | "ready" | "error";

export function useImageAsset(asset: ImageAsset) {
  const [state, setState] = useState<{ status: ImageStatus; size?: LoadedImage }>(() => {
    const size = sizes.get(asset.jpg);
    return size ? { status: "ready", size } : { status: "loading" };
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const known = sizes.get(asset.jpg);
    setState(known ? { status: "ready", size: known } : { status: "loading" });
    load(asset).then(
      (size) => !cancelled && setState({ status: "ready", size }),
      () => !cancelled && setState({ status: "error" }),
    );
    return () => {
      cancelled = true;
    };
  }, [asset, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { status: state.status, size: state.size, retry };
}
