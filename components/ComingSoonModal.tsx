import { useRef } from "react";
import type { PinData } from "@/types";
import { Modal } from "./Modal";

interface Props {
  pin: PinData | null;
  note: string;
  backLabel: string;
  onClose: () => void;
}

/** Reusable "Coming Soon" card – used for industries and for inside-view sections. */
export function ComingSoonModal({ pin, note, backLabel, onClose }: Props) {
  // Keep last pin while the exit animation plays.
  const last = useRef<PinData | null>(null);
  if (pin) last.current = pin;
  const shown = pin ?? last.current;
  const Icon = shown?.icon;

  return (
    <Modal open={!!pin} onClose={onClose} labelledBy="coming-soon-title" describedBy="coming-soon-desc">
      {shown && Icon && (
        <div className="flex flex-col items-center text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-navy-900 shadow-gold-lg">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <h2 id="coming-soon-title" className="font-heading text-2xl font-semibold text-white">
            {shown.name} – Coming Soon
          </h2>
          <p id="coming-soon-desc" className="mt-2 text-base text-white/85">
            {shown.description}
          </p>
          <p className="mt-4 max-w-[17rem] text-xs leading-relaxed text-white/50">{note}</p>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="focus-ring mt-6 cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-navy-900 transition hover:scale-105 hover:shadow-[0_0_24px_rgba(255,255,255,0.4)]"
          >
            {backLabel}
          </button>
        </div>
      )}
    </Modal>
  );
}
