import type { PinData } from "@/types";
import { Drawer } from "./Drawer";
import { PinList } from "./PinList";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  pins: PinData[];
  onSelect: (pin: PinData) => void;
}

/** Left glass drawer listing every pin of the current scene. */
export function MenuDrawer({ open, onClose, title, pins, onSelect }: Props) {
  return (
    <Drawer open={open} onClose={onClose} title={title} subtitle={`${pins.length} locations`} side="left">
      <div className="p-3">
        <PinList
          pins={pins}
          onSelect={(pin) => {
            onClose();
            onSelect(pin);
          }}
        />
      </div>
    </Drawer>
  );
}
