import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { Drawer } from "./Drawer";

/** Right glass drawer. Empty state only for now – items come from the cart store later. */
export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);

  return (
    <Drawer open={isOpen} onClose={close} title="Your cart" side="right">
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 pb-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-gold-300">
            <ShoppingCart className="h-7 w-7" aria-hidden />
          </span>
          <p className="font-heading text-lg font-semibold">Your cart is empty</p>
          <p className="text-sm text-white/50">Items you add while exploring ARLE City will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-2 p-4">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
              <span>{i.name}</span>
              <span className="text-white/60">×{i.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
