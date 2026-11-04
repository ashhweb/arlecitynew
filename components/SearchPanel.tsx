import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import type { PinData } from "@/types";
import { PinList } from "./PinList";

interface Props {
  open: boolean;
  onClose: () => void;
  pins: PinData[];
  placeholder: string;
  onSelect: (pin: PinData) => void;
}

function SearchInner({ onClose, pins, placeholder, onSelect }: Omit<Props, "open">) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  useDialogA11y(onClose, ref);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? pins.filter((p) => p.name.toLowerCase().includes(q)) : pins;
  }, [pins, query]);

  return (
    <motion.div
      className="fixed inset-0 z-[55]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <motion.div
        ref={ref}
        role="dialog"
        aria-label="Search"
        tabIndex={-1}
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="glass-strong absolute left-3 top-[68px] flex max-h-[min(70dvh,34rem)] w-[min(94vw,24rem)] origin-top-left flex-col rounded-glass-sm sm:left-4"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-gold-300" aria-hidden />
          <input
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) onSelect(results[0]);
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="focus-ring flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-2" aria-live="polite">
          {results.length ? (
            <PinList pins={results} onSelect={onSelect} numbered={false} />
          ) : (
            <p className="px-4 py-8 text-center text-sm text-white/50">No results for “{query}”.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SearchPanel({ open, ...rest }: Props) {
  return <AnimatePresence>{open && <SearchInner key="search" {...rest} />}</AnimatePresence>;
}
