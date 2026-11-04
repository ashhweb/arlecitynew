import { images } from "@/config/images";
import type { SceneConfig } from "@/types";
import { industries } from "./industries";

/** The city itself is a scene too, so the same viewer renders it. */
export const cityScene: SceneConfig = {
  id: "city",
  name: "ARLE City",
  image: images.city,
  sections: industries,
  zones: [
    { from: 0, to: 0.56, label: "West Bay, Doha" },
    { from: 0.56, to: 1, label: "Industrial Zone" },
  ],
  comingSoon: {
    note: "The inside view of this industry will open here in the next phase.",
    backLabel: "Back to the city",
  },
};
