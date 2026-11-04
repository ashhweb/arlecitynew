import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus trap + Escape handling + focus restoration.
 * Mount the component that calls this only while the dialog is open.
 */
export function useDialogA11y(onClose: () => void, panelRef: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];

    const raf = requestAnimationFrame(() => {
      const target = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? panel;
      target?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = focusables();
      if (!items.length) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey, true);
      previous?.focus?.({ preventScroll: true });
    };
  }, [panelRef]);
}
