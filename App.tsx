import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CityPage from "@/pages/CityPage";
import LandingPage from "@/pages/LandingPage";
import SceneViewPage from "@/pages/SceneViewPage";

function AnimatedRoutes() {
  const location = useLocation();
  // Group "/city" and "/city/xyz" under distinct keys so each screen transitions.
  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/city" element={<CityPage />} />
        <Route path="/city/:sceneId" element={<SceneViewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

/** HashRouter keeps deep links + the back button working when dist/index.html is served as a single static file. */
export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  );
}
