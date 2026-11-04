import {
  Apple,
  Beef,
  Brush,
  Croissant,
  Fish,
  Recycle,
  Sandwich,
  ScanBarcode,
  SquareParking,
  Toilet,
  Warehouse,
} from "lucide-react";
import { images } from "@/config/images";
import type { SceneConfig } from "@/types";

/**
 * Supermarket inside view. Copy this file for the next industry:
 * new image in config/images.ts, new sections below – nothing else changes.
 * Positions are IMAGE percentages pointing at the exact spot.
 */
const supermarket: SceneConfig = {
  id: "supermarket",
  name: "Supermarket",
  image: images.supermarket,
  comingSoon: {
    note: "The inside view of this section will open here in the next phase.",
    backLabel: "Back to the supermarket",
  },
  sections: [
    {
      id: "checkout",
      name: "Checkout",
      icon: ScanBarcode,
      description: "Fast staffed and self-service checkout lanes.",
      position: { x: 24, y: 50 },
      status: "coming-soon",
    },
    {
      id: "produce",
      name: "Produce",
      icon: Apple,
      description: "Fresh fruit and vegetables sourced from local farms.",
      position: { x: 61.2, y: 51 },
      status: "coming-soon",
    },
    {
      id: "deli",
      name: "Deli",
      icon: Sandwich,
      description: "Cold cuts, cheeses and freshly prepared meals.",
      position: { x: 67, y: 43 },
      status: "coming-soon",
    },
    {
      id: "bakery-dept",
      name: "Bakery Dept",
      icon: Croissant,
      description: "In-store bakery with bread, pastries and cakes baked daily.",
      position: { x: 72, y: 28 },
      status: "coming-soon",
    },
    {
      id: "butchery",
      name: "Butchery",
      icon: Beef,
      description: "Fresh cuts of beef, lamb and poultry prepared to order.",
      position: { x: 49, y: 20.5 },
      status: "coming-soon",
    },
    {
      id: "fishery",
      name: "Fishery",
      icon: Fish,
      description: "Daily catch of fresh fish and seafood on ice.",
      position: { x: 54.2, y: 29 },
      status: "coming-soon",
    },
    {
      id: "warehouse",
      name: "Warehouse",
      icon: Warehouse,
      description: "Back-of-house storage and stock management.",
      position: { x: 33, y: 14 },
      status: "coming-soon",
    },
    {
      id: "refuse-receiving",
      name: "Refuse & Receiving",
      icon: Recycle,
      description: "Delivery bay, goods receiving and waste recycling.",
      position: { x: 92, y: 32 },
      status: "coming-soon",
    },
    {
      id: "janitor-room",
      name: "Janitor Room",
      icon: Brush,
      description: "Cleaning supplies and facility maintenance.",
      position: { x: 8.3, y: 29 },
      status: "coming-soon",
    },
    {
      id: "public-washroom",
      name: "Public Washroom",
      icon: Toilet,
      description: "Clean, accessible facilities for every shopper.",
      position: { x: 20.4, y: 25.5 },
      status: "coming-soon",
    },
    {
      id: "car-park",
      name: "Supermarket Car Park",
      icon: SquareParking,
      description: "Convenient customer parking with trolley bays.",
      position: { x: 25.5, y: 83 },
      status: "coming-soon",
    },
  ],
};

export default supermarket;
