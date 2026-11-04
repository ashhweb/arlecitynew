import { useState } from "react";
import { cn } from "@/utils/cn";
import type { ImageAsset } from "@/types";
import { useImageAsset } from "@/hooks/useImageAsset";
import { ImageFallback } from "./LoadingScreen";

interface PictureProps {
  asset: ImageAsset;
  className?: string;
  alt?: string;
  priority?: boolean;
}

/** AVIF/WebP with JPEG fallback, async decoding, never distorted. */
export function ImagePicture({ asset, className, alt, priority }: PictureProps) {
  return (
    <picture className="block h-full w-full">
      {asset.avif && <source srcSet={asset.avif} type="image/avif" />}
      {asset.webp && <source srcSet={asset.webp} type="image/webp" />}
      <img
        src={asset.jpg}
        alt={alt ?? asset.alt}
        decoding="async"
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("block h-full w-full select-none object-cover", className)}
        style={{ imageRendering: "auto" }}
      />
    </picture>
  );
}

interface ProgressiveProps {
  asset: ImageAsset;
  className?: string;
  imgClassName?: string;
}

/** Tiny blurred placeholder first, full resolution cross-fades in once decoded. */
export function ProgressiveImage({ asset, className, imgClassName }: ProgressiveProps) {
  const { status, retry } = useImageAsset(asset);
  const [errored, setErrored] = useState(false);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-navy-900", className)}>
      <img
        src={asset.placeholder}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
      />
      {status === "ready" && !errored && (
        <div className="absolute inset-0 animate-[fade-in_700ms_ease-out_both]">
          <ImagePicture asset={asset} className={imgClassName} priority />
        </div>
      )}
      {(status === "error" || errored) && (
        <ImageFallback
          onRetry={() => {
            setErrored(false);
            retry();
          }}
        />
      )}
    </div>
  );
}
