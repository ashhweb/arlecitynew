import { motion } from "framer-motion";
import { ImageOff, RefreshCw } from "lucide-react";
import { LogoMark } from "./Logo";

/** Full-screen ARLE loader shown while the 8K imagery downloads and decodes. */
export function LoadingScreen({ label = "Loading ARLE City" }: { label?: string }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-navy-900 to-navy-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-4"
      >
        <LogoMark className="h-14 w-14 rounded-2xl" />
        <span className="font-heading text-3xl font-bold tracking-[0.3em]">ARLE</span>
      </motion.div>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full w-1/2 rounded-full bg-gold-gradient"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
    </motion.div>
  );
}

/** Shown when an image fails to load – gradient backdrop + retry. */
export function ImageFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-6 text-center"
    >
      <ImageOff className="h-10 w-10 text-gold-300" aria-hidden />
      <p className="max-w-xs text-sm text-white/70">
        We couldn't load this image. Please check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:scale-105"
      >
        <RefreshCw className="h-4 w-4" aria-hidden /> Retry
      </button>
    </div>
  );
}
