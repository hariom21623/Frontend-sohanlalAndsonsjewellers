import { useEffect, useState, useRef } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const timerRef = useRef<any>(null);

  const isIOS = () => {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  };

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);

      timerRef.current = setTimeout(() => {
        setShowInstall(false);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (isIOS() && !window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstall(true);

      timerRef.current = setTimeout(() => {
        setShowInstall(false);
      }, 8000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleClose = () => {
    setShowInstall(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (!showInstall) return null;

  return (
    <>
      {/* ANDROID / DESKTOP */}
      {!isIOS() && (
        <div style={styles.container}>
          <button style={styles.close} onClick={handleClose}>×</button>
          <p style={styles.text}>
            {/* Install Sohan Lal & Sons Jewellers */}
            सोहन लाल एंड संस ज्वैलर्स को स्थापित करें
          </p>
          <button style={styles.button} onClick={handleInstall}>
            Install App
          </button>
        </div>
      )}

      {/* iOS */}
      {isIOS() && (
        <div style={{ ...styles.container, background: "#2563eb" }}>
          <button style={styles.close} onClick={handleClose}>×</button>
          <p style={styles.text}>
            Tap Share ⬆️ → "Add to Home Screen"
          </p>
        </div>
      )}
    </>
  );
}

const styles: any = {
  container: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1e293b",
    color: "#fff",
    padding: "16px",
    borderRadius: "12px",
    zIndex: 9999,
    width: "90%",
    maxWidth: "320px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },
  text: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  button: {
    background: "#facc15",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  close: {
    position: "absolute",
    top: 5,
    right: 10,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
};