import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 🚀 STEP 1: Instant snapping reset to absolute coordinate zero boundaries
    window.scrollTo(0, 0);

    // 🚀 STEP 2: Handle strict HTML body frames immediately
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // 🚀 STEP 3: Fallback delay engine to bypass delayed layout loading lags
    const renderingFlushTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto" // Absolute snap without animation drifts
      });

      // Pure HTML node hard resets
      const mainCanvas = document.getElementById("root") || document.body;
      if (mainCanvas) {
        mainCanvas.scrollIntoView({ block: "start", inline: "nearest" });
      }
    }, 10); // Executed at microseconds level right after layout tree mounts

    return () => clearTimeout(renderingFlushTimer);
  }, [pathname, search]); // Triggers on every single page transition nodes seamlessly

  return null;
}