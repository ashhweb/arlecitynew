import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronUp, ShoppingBasket } from "lucide-react";
import { useCart } from "@/store/cart";
import { cn } from "@/utils/cn";

interface Props {
  onBack: () => void;
  backLabel?: string;
}

const item =
  "focus-ring pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white/90 transition duration-200 hover:scale-110 hover:bg-white/15 hover:text-gold-300 sm:h-10 sm:w-10";

/** Right-hand vertical glass toolbar of the inside views. */
export function SideToolbar({ onBack, backLabel = "Back to city" }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const openCart = useCart((s) => s.open);

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-30 sm:right-4 sm:top-4">
      <div className="glass pointer-events-auto flex flex-col items-center gap-1 rounded-full p-1">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}
          aria-expanded={!collapsed}
          className={item}
        >
          <ChevronUp className={cn("h-5 w-5 transition-transform duration-300", collapsed && "rotate-180")} aria-hidden />
        </button>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-1 overflow-hidden"
            >
              <button type="button" onClick={onBack} aria-label={backLabel} title={backLabel} className={item}>
                <Building2 className="h-5 w-5" aria-hidden />
              </button>
              <button type="button" onClick={openCart} aria-label="Open cart" title="Cart" className={item}>
                <ShoppingBasket className="h-5 w-5" aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
