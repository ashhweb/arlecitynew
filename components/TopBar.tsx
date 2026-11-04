import { Home, MapPin, Menu, Search, ShoppingCart } from "lucide-react";
import { selectCartCount, useCart } from "@/store/cart";
import { cn } from "@/utils/cn";

interface Props {
  variant?: "full" | "compact";
  onMenu: () => void;
  onSearch: () => void;
  onHome?: () => void;
  locationLabel?: string;
}

const circle =
  "focus-ring pointer-events-auto flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition duration-200 hover:scale-110 sm:h-10 sm:w-10";

/** Glass top bar. "full" = city screen, "compact" = inside views (two round buttons). */
export function TopBar({ variant = "full", onMenu, onSearch, onHome, locationLabel }: Props) {
  const count = useCart(selectCartCount);
  const openCart = useCart((s) => s.open);

  if (variant === "compact") {
    const light = cn(circle, "glass-light text-navy-900 hover:bg-white");
    return (
      <div className="pointer-events-none absolute left-3 top-3 z-30 flex gap-2 sm:left-4 sm:top-4">
        <button type="button" aria-label="Open menu" onClick={onMenu} className={light}>
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" aria-label="Search sections" onClick={onSearch} className={light}>
          <Search className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </div>
    );
  }

  const glass = cn(circle, "glass text-white hover:bg-white/20");

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Open industries menu" onClick={onMenu} className={glass}>
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Search industries"
            onClick={onSearch}
            className="focus-ring glass pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium text-white transition hover:scale-105 hover:bg-white/20 sm:h-10 sm:w-auto sm:px-4"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="pointer-events-auto absolute left-1/2 top-[60px] -translate-x-1/2 sm:top-4">
          <div className="glass flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 text-xs font-medium text-white sm:h-10 sm:text-sm">
            <MapPin className="h-4 w-4 text-gold-300" aria-hidden />
            {locationLabel ?? "ARLE City · Doha, Qatar"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" aria-label={`Open cart, ${count} items`} onClick={openCart} className={cn(glass, "relative")}>
            <ShoppingCart className="h-[18px] w-[18px]" aria-hidden />
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-gradient px-1 text-[10px] font-bold text-navy-900"
            >
              {count}
            </span>
          </button>
          <button type="button" aria-label="Back to home page" onClick={onHome} className={glass}>
            <Home className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
