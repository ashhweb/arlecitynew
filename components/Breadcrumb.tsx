import { Fragment } from "react";
import { cn } from "@/utils/cn";

export interface Crumb {
  label: string;
  onClick?: () => void;
}

/** "ARLE City / Supermarket" – earlier crumbs are clickable. */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "glass-light absolute z-20 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-navy-900",
        className,
      )}
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={c.label}>
            {c.onClick && !last ? (
              <button
                type="button"
                onClick={c.onClick}
                className="focus-ring cursor-pointer rounded underline-offset-2 transition hover:text-navy-700 hover:underline"
              >
                {c.label}
              </button>
            ) : (
              <span aria-current={last ? "page" : undefined}>{c.label}</span>
            )}
            {!last && <span aria-hidden className="text-navy-900/50">/</span>}
          </Fragment>
        );
      })}
    </nav>
  );
}
