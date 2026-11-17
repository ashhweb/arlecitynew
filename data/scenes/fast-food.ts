import { Car, ChefHat, Recycle, SprayCan, Users, Utensils } from "lucide-react";
import { images } from "@/config/images";
import type { SceneConfig } from "@/types";

/**
 * Fast Food inside view (isometric aerial of a QSR outlet, roof removed). Same structure as
 * hotel.ts / college.ts. The image path lives only in config/images.ts – replace assets/fast-food.jpg
 * (e.g. a 7680 px wide version), run scripts/make-image-derivatives.mjs fast-food.jpg --webp and nothing else changes.
 *
 * Positions are IMAGE percentages (0-100 of the full image width / height). Each one is the TIP of the
 * pin – the sharp pointer at the bottom of the marker – which is exactly the point that sits on the spot.
 * Fine-tune any pin: open the dev server with ?debug=1, click the exact spot, paste "x%, y%" below.
 * `labelPlacement` only moves the name label (never the pin tip) to avoid collisions.
 */
const fastFood: SceneConfig = {
  id: "fast-food",
  name: "Fast Food",
  image: images.fastFood,
  comingSoon: {
    note: "The inside view of this area will open here in the next phase.",
    backLabel: "Back to the restaurant",
  },
  sections: [
    {
      id: "vehicle-cleaning",
      name: "Vehicle cleaning",
      icon: SprayCan,
      description: "Washing and sanitising of delivery and service vehicles.",
      position: { x: 85.7, y: 19.4 },
      status: "coming-soon",
    },
    {
      id: "refuse-receiving-small",
      name: "Refuse & Receiving - Small",
      icon: Recycle,
      description: "Waste removal and receiving of daily supplies.",
      position: { x: 74.8, y: 26.7 },
      status: "coming-soon",
      // Sits close to "Vehicle cleaning": the label goes to the left so the two never collide.
      labelPlacement: "left",
    },
    {
      id: "public-toilet",
      name: "Public toilet",
      icon: Users,
      description: "Clean, accessible facilities for all customers.",
      position: { x: 46.2, y: 39.9 },
      status: "coming-soon",
    },
    {
      id: "qsr-kitchen",
      name: "QSR Kitchen",
      icon: ChefHat,
      description: "Fast-service kitchen preparing orders in minutes.",
      position: { x: 58.2, y: 45.4 },
      status: "coming-soon",
    },
    {
      id: "drive-thru-car-park",
      name: "Drive Thru / Car Park",
      icon: Car,
      description: "Drive-through lane and customer parking.",
      position: { x: 74.6, y: 60.6 },
      status: "coming-soon",
    },
    {
      id: "qsr-dining-area",
      name: "QSR Dining Area",
      icon: Utensils,
      description: "Customer seating and quick-service dining.",
      position: { x: 42.9, y: 64.9 },
      status: "coming-soon",
    },
  ],
};

export default fastFood;
