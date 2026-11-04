import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { cn } from "@/utils/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function DrawerInner({ onClose, side = "left", title, subtitle, children }: Omit<DrawerProps, "open">) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogA11y(onClose, ref);
  const dir = side === "left" ? -1 : 1;

  return (
    <motion.div
      className="fixed inset-0 z-[55]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        initial={{ x: `${dir * 105}%` }}
        animate={{ x: 0 }}
        exit={{ x: `${dir * 105}%` }}
        transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
        className={cn(
          "glass-strong absolute top-0 flex h-full w-[min(88vw,22rem)] flex-col outline-none",
          side === "left" ? "left-0 rounded-r-glass" : "right-0 rounded-l-glass",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 pb-4 pt-6">
          <div>
            <h2 className="font-heading text-xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-white/50">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="focus-ring flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/5 text-white/80 transition hover:scale-105 hover:bg-white/15"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>
        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
    </motion.div>
  );
}

export function Drawer({ open, ...rest }: DrawerProps) {
  return <AnimatePresence>{open && <DrawerInner key="drawer" {...rest} />}</AnimatePresence>;
}
