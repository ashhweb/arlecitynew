/**
 * SINGLE SOURCE OF TRUTH for every image path in the site.
 *
 * To upgrade to the final 8K artwork: drop the new files into /src/assets with the same
 * names (or change the imports below). The viewer reads the natural size from the file,
 * so no other code needs to change. Provide .avif next to the .jpg for the best
 * performance; the <picture> element serves AVIF first and falls back to JPEG.
 */
import type { ImageAsset } from "@/types";

import landingJpg from "@/assets/landing-doha.jpg";
import landingAvif from "@/assets/landing-doha.avif";
import landingLqip from "@/assets/landing-doha-lqip.jpg";

import cityJpg from "@/assets/city-panorama.jpg";
import cityAvif from "@/assets/city-panorama.avif";
import cityLqip from "@/assets/city-panorama-lqip.jpg";

import marketJpg from "@/assets/supermarket-inside.jpg";
import marketAvif from "@/assets/supermarket-inside.avif";
import marketLqip from "@/assets/supermarket-inside-lqip.jpg";

export const images = {
  landing: {
    jpg: landingJpg,
    avif: landingAvif,
    placeholder: landingLqip,
    alt: "Doha, Qatar skyline at sunset over the bay",
  },
  city: {
    jpg: cityJpg,
    avif: cityAvif,
    placeholder: cityLqip,
    alt: "Aerial panorama of ARLE City with the Doha waterfront, industrial zone and airport",
  },
  supermarket: {
    jpg: marketJpg,
    avif: marketAvif,
    placeholder: marketLqip,
    alt: "Isometric cut-away view of the ARLE City supermarket",
  },
} satisfies Record<string, ImageAsset>;
