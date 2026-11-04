import { memo } from "react";
import type { PinData } from "@/types";
import { Pin } from "./Pin";

interface Props {
  pins: PinData[];
  activeId?: string | null;
  onSelect: (pin: PinData) => void;
}

/** Absolutely fills the panorama content so pins use IMAGE percentages. */
export const PinLayer = memo(function PinLayer({ pins, activeId, onSelect }: Props) {
  return (
    <div className="absolute inset-0">
      {pins.map((pin) => (
        <Pin key={pin.id} pin={pin} active={pin.id === activeId} onSelect={onSelect} />
      ))}
    </div>
  );
});
