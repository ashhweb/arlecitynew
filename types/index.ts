import type { LucideIcon } from "lucide-react";

/** Position in IMAGE coordinates, expressed as percentages (0-100). */
export interface Position {
  x: number;
  y: number;
}

export type Status = "ready" | "coming-soon";

/** One responsive image asset. Swap the files in /src/assets to upgrade quality – no code changes. */
export interface ImageAsset {
  /** JPEG fallback (always required). */
  jpg: string;
  /** Optional modern formats, served first via <picture>. */
  avif?: string;
  webp?: string;
  /** Tiny blurred placeholder shown while the full-resolution file loads. */
  placeholder: string;
  alt: string;
}

/** Anything that can be pinned on a panorama. */
export interface PinData {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  position: Position;
  status: Status;
  /** Route opened when a "ready" pin is clicked. */
  route?: string;
}

export interface Industry extends PinData {
  /** Id of the scene in /src/data/scenes that shows the inside of this industry. */
  insideScene?: string;
}

export interface SceneSection extends PinData {
  status: "coming-soon" | "ready";
}

/** Named horizontal band of a panorama (drives the "● WEST BAY, DOHA" label). */
export interface Zone {
  from: number; // 0-1 normalised image x
  to: number;
  label: string;
}

/**
 * Generic scene definition used by <PanoramaViewer />.
 * `sections` are the pins of the scene (industries for the city, rooms for an inside view).
 */
export interface SceneConfig {
  id: string;
  name: string;
  image: ImageAsset;
  sections: PinData[];
  zones?: Zone[];
  /** Copy used by the Coming Soon modal for pins in this scene. */
  comingSoon: {
    note: string;
    backLabel: string;
  };
}
