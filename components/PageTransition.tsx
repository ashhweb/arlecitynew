import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Cinematic route transition: next screen fades in from slightly behind, old one zooms through. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden bg-navy-900"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, scale: 1.14, transition: { duration: 0.8, ease: [0.55, 0, 0.55, 0.2] } }}
    >
      {children}
    </motion.div>
  );
}
