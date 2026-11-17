import {
  BedDouble,
  Car,
  ChefHat,
  ConciergeBell,
  Croissant,
  Droplets,
  Recycle,
  Shirt,
  ShowerHead,
  Trash2,
  Users,
  Utensils,
  WashingMachine,
} from "lucide-react";
import { images } from "@/config/images";
import type { SceneConfig } from "@/types";

/**
 * Hotel inside view (elevated aerial, exterior). Same structure as shopping-centre.ts.
 * The image path lives only in config/images.ts – swap src/assets/hotel.jpg (e.g. for a 7680 px
 * version, then run scripts/make-image-derivatives.mjs) and nothing else changes.
 * Positions are IMAGE percentages; each one is the TIP of the pin, placed where the artwork's
 * original marker pointed. Labels are the ones printed in the reference screenshot.
 * `labelPlacement: "below"` moves a label under its icon if two labels ever collide.
 */
const hotel: SceneConfig = {
  id: "hotel",
  name: "Hotel",
  image: images.hotel,
  comingSoon: {
    note: "The inside view of this area will open here in the next phase.",
    backLabel: "Back to the hotel",
  },
  sections: [
    {
      id: "trash-disposal",
      name: "Trash Disposal",
      icon: Trash2,
      description: "Waste collection, sorting and removal from the hotel.",
      position: { x: 5.0, y: 31.5 },
      status: "coming-soon",
    },
    {
      id: "laundry",
      name: "Laundry",
      icon: WashingMachine,
      description: "Washing and finishing of hotel linen and towels.",
      position: { x: 10.9, y: 38.3 },
      status: "coming-soon",
    },
    {
      id: "dry-cleaning",
      name: "Dry Cleaning",
      icon: Shirt,
      description: "Specialist cleaning for guest garments and delicate fabrics.",
      position: { x: 14.5, y: 42.4 },
      status: "coming-soon",
      labelPlacement: "below",
    },
    {
      id: "refuse-goods-in",
      name: "Refuse & Goods In",
      icon: Recycle,
      description: "Receiving supplies, food and deliveries, and removing refuse.",
      position: { x: 20.5, y: 40.8 },
      status: "coming-soon",
    },
    {
      id: "warewashing",
      name: "Warewashing",
      icon: Droplets,
      description: "Washing and sanitising of crockery, cutlery and kitchen equipment.",
      position: { x: 27.1, y: 47.8 },
      status: "coming-soon",
    },
    {
      id: "bakery",
      name: "Bakery",
      icon: Croissant,
      description: "Fresh bread and pastries baked in-house.",
      position: { x: 33.8, y: 54.0 },
      status: "coming-soon",
    },
    {
      id: "kitchen",
      name: "Kitchen",
      icon: ChefHat,
      description: "Main kitchen preparing meals for guests and events.",
      position: { x: 40.7, y: 57.1 },
      status: "coming-soon",
    },
    {
      id: "restaurant",
      name: "Restaurant",
      icon: Utensils,
      description: "Dining area serving breakfast, lunch and dinner.",
      position: { x: 48.5, y: 60.5 },
      status: "coming-soon",
    },
    {
      id: "car-park",
      name: "Car Park",
      icon: Car,
      description: "Guest and staff parking.",
      position: { x: 30.6, y: 65.9 },
      status: "coming-soon",
    },
    {
      id: "landing",
      name: "Landing",
      icon: ConciergeBell,
      description: "Guest-floor landing with access to the corridors and rooms.",
      position: { x: 68.5, y: 17.3 },
      status: "coming-soon",
    },
    {
      id: "guest-en-suite",
      name: "Guest En-suite",
      icon: ShowerHead,
      description: "Private bathrooms attached to every guest room.",
      position: { x: 77.9, y: 19.0 },
      status: "coming-soon",
    },
    {
      id: "guest-room",
      name: "Guest Room",
      icon: BedDouble,
      description: "Comfortable rooms and suites for every stay.",
      position: { x: 84.3, y: 18.8 },
      status: "coming-soon",
    },
    {
      id: "public-washroom",
      name: "Public Washroom",
      icon: Users,
      description: "Clean, accessible facilities for all visitors.",
      position: { x: 73.4, y: 39.4 },
      status: "coming-soon",
    },
    {
      id: "hotel-reception",
      name: "Hotel Reception",
      icon: ConciergeBell,
      description: "Check-in, check-out and front desk.",
      position: { x: 68.9, y: 54.4 },
      status: "coming-soon",
    },
  ],
};

export default hotel;
