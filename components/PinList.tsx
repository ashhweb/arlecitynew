import type { PinData } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  pins: PinData[];
  onSelect: (pin: PinData) => void;
  numbered?: boolean;
  className?: string;
}

/** Shared list row used by the menu drawer and the search results. */
export function PinList({ pins, onSelect, numbered = true, className }: Props) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {pins.map((pin, i) => {
        const Icon = pin.icon;
        return (
          <li key={pin.id}>
            <button
              type="button"
              onClick={() => onSelect(pin)}
              className="focus-ring group flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-300 transition group-hover:bg-gold-gradient group-hover:text-navy-900">
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">
                  {numbered && <span className="mr-2 text-xs text-white/35">{String(i + 1).padStart(2, "0")}</span>}
                  {pin.name}
                </span>
                <span className="block truncate text-xs text-white/45">{pin.description}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  pin.status === "ready" ? "bg-gold-gradient text-navy-900" : "bg-white/10 text-white/50",
                )}
              >
                {pin.status === "ready" ? "Open" : "Soon"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
