import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { cn } from "@/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  className?: string;
}

function ModalInner({ onClose, labelledBy, describedBy, children, className }: Omit<ModalProps, "open">) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogA11y(onClose, panelRef);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
        data-testid="modal-backdrop"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8, transition: { duration: 0.18 } }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={cn(
          "glass-strong relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-glass p-8 outline-none",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-ring absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Modal({ open, ...rest }: ModalProps) {
  return <AnimatePresence>{open && <ModalInner key="modal" {...rest} />}</AnimatePresence>;
}
