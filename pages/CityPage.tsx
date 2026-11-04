import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Airplane } from "@/components/Airplane";
import { CartDrawer } from "@/components/CartDrawer";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { MenuDrawer } from "@/components/MenuDrawer";
import { PageTransition } from "@/components/PageTransition";
import { PanoramaViewer, type PanoramaHandle } from "@/components/PanoramaViewer";
import { SearchPanel } from "@/components/SearchPanel";
import { TopBar } from "@/components/TopBar";
import { cityScene } from "@/data/cityScene";
import { industries } from "@/data/industries";
import { getScene } from "@/data/scenes";
import { preloadImage } from "@/hooks/useImageAsset";
import { useCart } from "@/store/cart";
import type { PinData } from "@/types";

export default function CityPage() {
  const navigate = useNavigate();
  const viewer = useRef<PanoramaHandle>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalPin, setModalPin] = useState<PinData | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);
  const timers = useRef<number[]>([]);
  const cartOpen = useCart((s) => s.isOpen);

  // Preload every inside view so entering one is instant.
  useEffect(() => {
    industries.forEach((i) => {
      const scene = getScene(i.insideScene);
      if (scene) preloadImage(scene.image);
    });
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const highlight = useCallback((pin: PinData, zoom = 1.9) => {
    setActiveId(pin.id);
    viewer.current?.focusPin(pin, zoom);
    timers.current.push(window.setTimeout(() => setActiveId((id) => (id === pin.id ? null : id)), 4000));
  }, []);

  const onPinSelect = useCallback(
    (pin: PinData) => {
      if (pin.status === "ready" && pin.route) {
        // Zoom into the building, then cross-fade into the inside view.
        setActiveId(pin.id);
        setEntering(true);
        viewer.current?.focusPin(pin, 3);
        timers.current.push(window.setTimeout(() => navigate(pin.route!), 750));
      } else {
        setModalPin(pin);
      }
    },
    [navigate],
  );

  const overlayOpen = menuOpen || searchOpen || !!modalPin || cartOpen || entering;

  return (
    <PageTransition>
      <PanoramaViewer
        ref={viewer}
        scene={cityScene}
        activePinId={activeId}
        onPinSelect={onPinSelect}
        keyboardEnabled={!overlayOpen}
      >
        <Airplane />
      </PanoramaViewer>

      <TopBar
        onMenu={() => setMenuOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onHome={() => navigate("/")}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Industries"
        pins={cityScene.sections}
        onSelect={(pin) => highlight(pin)}
      />
      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        pins={cityScene.sections}
        placeholder="Search industries…"
        onSelect={(pin) => {
          setSearchOpen(false);
          highlight(pin);
        }}
      />
      <CartDrawer />
      <ComingSoonModal
        pin={modalPin}
        note={cityScene.comingSoon.note}
        backLabel={cityScene.comingSoon.backLabel}
        onClose={() => setModalPin(null)}
      />

      {entering && (
        <motion.div
          aria-hidden
          className="pointer-events-auto absolute inset-0 z-[70] bg-navy-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        />
      )}
    </PageTransition>
  );
}
