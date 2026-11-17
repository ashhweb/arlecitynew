import {
  BedDouble,
  Briefcase,
  ConciergeBell,
  DoorOpen,
  GraduationCap,
  Lock,
  Recycle,
  SprayCan,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import { images } from "@/config/images";
import type { SceneConfig } from "@/types";

/**
 * College inside view (isometric aerial of the campus). Same structure as hotel.ts / supermarket.ts.
 * The image path lives only in config/images.ts – replace assets/college.jpg (e.g. a 7680 px wide
 * version), run scripts/make-image-derivatives.mjs and nothing else changes.
 *
 * Positions are IMAGE percentages. Each one is the TIP of the pin: the x/y of the reference
 * screenshot's marker centre, with y moved ~2 % down so the pin icon lands exactly where the
 * screenshot shows it (the pin has a constant on-screen size, its tail points at the spot).
 * `labelPlacement` only moves the name label (never the pin) to avoid collisions / edge clipping.
 */
const college: SceneConfig = {
  id: "college",
  name: "College",
  image: images.college,
  comingSoon: {
    note: "The inside view of this area will open here in the next phase.",
    backLabel: "Back to the college",
  },
  sections: [
    {
      id: "dorm-room",
      name: "Dorm Room",
      icon: BedDouble,
      description: "Student accommodation with private study and rest space.",
      position: { x: 14.1, y: 6.9 },
      status: "coming-soon",
      labelPlacement: "right",
    },
    {
      id: "landing",
      name: "Landing",
      icon: ConciergeBell,
      description: "Floor landing and corridor access to the dorm wings.",
      position: { x: 8.9, y: 12.4 },
      status: "coming-soon",
      labelPlacement: "left",
    },
    {
      id: "public-washroom",
      name: "Public Washroom",
      icon: Users,
      description: "Clean, accessible facilities for all visitors.",
      position: { x: 18.0, y: 12.6 },
      status: "coming-soon",
      labelPlacement: "below",
    },
    {
      id: "office",
      name: "Office",
      icon: Briefcase,
      description: "Administration, admissions and staff offices.",
      position: { x: 8.0, y: 29.3 },
      status: "coming-soon",
    },
    {
      id: "classroom",
      name: "Classroom",
      icon: GraduationCap,
      description: "Lecture and learning rooms for every course.",
      position: { x: 23.9, y: 47.9 },
      status: "coming-soon",
    },
    {
      id: "corridor",
      name: "Corridor",
      icon: DoorOpen,
      description: "Connecting walkways between classrooms and facilities.",
      position: { x: 17.9, y: 55.3 },
      status: "coming-soon",
    },
    {
      id: "reception-large",
      name: "Reception - large",
      icon: ConciergeBell,
      description: "Main campus welcome desk and visitor services.",
      position: { x: 4.2, y: 69.0 },
      status: "coming-soon",
      labelPlacement: "right",
    },
    {
      id: "sports-hall",
      name: "Sports Hall",
      icon: Trophy,
      description: "Indoor courts and spectator seating for sport and events.",
      position: { x: 67.2, y: 68.1 },
      status: "coming-soon",
    },
    {
      id: "locker-room",
      name: "Locker Room",
      icon: Lock,
      description: "Changing rooms and lockers for students and teams.",
      position: { x: 54.7, y: 73.7 },
      status: "coming-soon",
    },
    {
      id: "refuse-goods-in",
      name: "Refuse & Goods In",
      icon: Recycle,
      description: "Waste removal and receiving of supplies and deliveries.",
      position: { x: 92.4, y: 82.8 },
      status: "coming-soon",
      labelPlacement: "left",
    },
    {
      id: "plant-room",
      name: "Plant Room",
      icon: Wrench,
      description: "Utilities and equipment that power the campus.",
      position: { x: 86.5, y: 93.3 },
      status: "coming-soon",
      labelPlacement: "left",
    },
    {
      id: "janitor-room",
      name: "Janitor Room",
      icon: SprayCan,
      description: "Cleaning supplies and equipment storage.",
      position: { x: 96.4, y: 99.0 },
      status: "coming-soon",
      labelPlacement: "left",
    },
  ],
};

export default college;
