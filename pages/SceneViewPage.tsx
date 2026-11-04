import { useCallback, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Map as MapIcon } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CartDrawer } from "@/components/CartDrawer";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { MenuDrawer } from "@/components/MenuDrawer";
import { PageTransition } from "@/components/PageTransition";
import { PanoramaViewer, type PanoramaHandle } from "@/components/PanoramaViewer";
import { SearchPanel } from "@/components/SearchPanel";
import { SideToolbar } from "@/components/SideToolbar";
import { TopBar } from "@/components/TopBar";
import { getScene } from "@/data/scenes";
import { useCart } from "@/store/cart";
import type { PinData } from "@/types";
import { cn } from "@/utils/cn";

/** Inside view of any industry (route: /city/:sceneId). Driven entirely by the scene config. */
export default function SceneViewPage() {
  const { sceneId } = useParams();
  const scene = getScene(sceneId);
  if (!scene) return <Navigate to="/city" replace />;
  return <SceneView key={scene.id} sceneId={scene.id} />;
}

function SceneView({ sceneId }: { sceneId: string }) {
  const scene = getScene(sceneId)!;
  const navigate = useNavigate();
  const viewer = useRef<PanoramaHandle>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [modalPin, setModalPin] = useState<PinData | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const cartOpen = useCart((s) => s.isOpen);

  const highlight = useCallback((pin: PinData) => {
    setActiveId(pin.id);
    viewer.current?.focusPin(pin, 1.8);
    window.setTimeout(() => setActiveId((id) => (id === pin.id ? null : id)), 4000);
  }, []);

  const backToCity = () => navigate("/city");
  const overlayOpen = menuOpen || searchOpen || !!modalPin || cartOpen;

  return (
    <PageTransition>
      <PanoramaViewer
        ref={viewer}
        scene={scene}
        activePinId={activeId}
        onPinSelect={setModalPin}
        showMiniMap={mapOpen}
        miniMapClassName="bottom-[72px] left-3 w-44 sm:left-4 sm:w-64"
        zoomClassName="bottom-14 sm:bottom-16"
        keyboardEnabled={!overlayOpen}
      />

      <TopBar variant="compact" onMenu={() => setMenuOpen(true)} onSearch={() => setSearchOpen(true)} />
      <SideToolbar onBack={backToCity} backLabel="Back to city" />

      <button
        type="button"
        onClick={() => setMapOpen((o) => !o)}
        aria-label={mapOpen ? "Hide mini-map" : "Show mini-map"}
        aria-pressed={mapOpen}
        className={cn(
          "focus-ring glass-light absolute bottom-3 left-3 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-navy-900 transition duration-200 hover:scale-110 hover:bg-white sm:bottom-4 sm:left-4 sm:h-10 sm:w-10",
          mapOpen && "bg-gold-gradient",
        )}
      >
        <MapIcon className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <Breadcrumb
        className="bottom-3 right-3 sm:bottom-4 sm:right-4"
        items={[{ label: "ARLE City", onClick: backToCity }, { label: scene.name }]}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={scene.name}
        pins={scene.sections}
        onSelect={highlight}
      />
      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        pins={scene.sections}
        placeholder={`Search ${scene.name.toLowerCase()} sections…`}
        onSelect={(pin) => {
          setSearchOpen(false);
          highlight(pin);
        }}
      />
      <CartDrawer />
      <ComingSoonModal
        pin={modalPin}
        note={scene.comingSoon.note}
        backLabel={scene.comingSoon.backLabel}
        onClose={() => setModalPin(null)}
      />
    </PageTransition>
  );
}
