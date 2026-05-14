import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./pages/SplashScreen";
import DownloadScreen from "./pages/DownloadScreen";
import UploadScreen from "./pages/UploadScreen";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/upload" element={<UploadScreen />} />
        <Route path="/download" element={<DownloadScreen />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
