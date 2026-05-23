// src/components/Users/Banner/HomeBanner.tsx
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPublic } from "../../../api/product";
import { optimizeImage } from '../../../utils/imageOptimizer';

type Props = {
  category: string;
};

export default function HomeBanner({ category }: Props) {
  const [banners, setBanners] = useState<any[]>([]); 
  const [bannerIndex, setBannerIndex] = useState(0); 
  
  const navigate = useNavigate();
  const touchStartX = useRef(0);

  // 1. Fetch products logic stream (Exactly matches your original code baseline)
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await getAllPublic({ q: "", category });
        console.log("ALL PUBLIC DATA 👉", res);

        if (active) {
          // Filters out elements where admin enabled banner flags manually
          const bannerProducts = (res.products || []).filter((p: any) => p.isBanner === true || p.bannerImages);
          
          // Fallback check: If no custom banner marked, fallback to top public items safely
          setBanners(bannerProducts.length > 0 ? bannerProducts : (res.banners || []));

          if (bannerProducts.length > 0) {
            const dayIndex = (new Date().getDate() - 1) % bannerProducts.length;
            setBannerIndex(dayIndex);
          }
        }
      } catch (err) {
        console.error("Banner error matrix fallback capture:", err);
      }
    })();

    return () => { active = false; };
  }, [category]);

  // 2. Automated slide rotations cycle loops logic (Matches your original timeline framework)
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 Seconds custom smooth screen holding threshold

    return () => clearInterval(interval);
  }, [banners]);

  const handleTouchStart = (e: any) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: any) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    if (diff > 50) {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    } else if (diff < -50) {
      setBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }
  };

  if (banners.length === 0) {
    return <Box sx={{ height: { xs: 200, sm: 350, md: 460 }, bgcolor: "#141414" }} />;
  }

  const activeProduct = banners[bannerIndex];

  // Extract separate layout profiles paths injected from Admin Dashboard uploads matrix
  const desktopBannerUrl = activeProduct?.bannerImages?.desktopUrl || (activeProduct?.images && activeProduct.images[0]);
  const mobileBannerUrl = activeProduct?.bannerImages?.mobileUrl || desktopBannerUrl;

  return (
    <Box
      onClick={() => navigate(`/product/${activeProduct.id || activeProduct._id}`)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      sx={{
        width: "100%",
        height: { xs: "50vh", sm: "60vh", md: "72vh" }, // Responsive adaptive height ratios scaling
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "#000000",
        borderBottom: "1px solid rgba(229, 213, 188, 0.15)",
      }}
    >
      {/* 🖥️ DESKTOP DISPLAY LAYOUT FRAME CANVAS (Hides inside small mobile widths viewports) */}
      <Box
        component="img"
        src={optimizeImage(desktopBannerUrl)}
        alt={activeProduct?.name || "Premium Desktop Showcase Showcase Banner"}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // 🚀 Core aspect protection fix: Prevents compression stretching
          objectPosition: "center center",
          display: { xs: "none", sm: "block" }
        }}
      />

      {/* 📱 MOBILE SIZING DISPLAY FRAME CANVAS (Enables ONLY during small device footprints) */}
      <Box
        component="img"
        src={optimizeImage(mobileBannerUrl)}
        alt={activeProduct?.name || "Premium Mobile Adaptive Showcase Banner"}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // 🚀 Aspect control: Fits tightly within mobile screens without pixel breaks
          objectPosition: "center center",
          display: { xs: "block", sm: "none" }
        }}
      />

      {/* LUXURY REGAL AMBIENT TEXTURE GRADIENT BLENDING */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(to top, rgba(10,10,10,0.9) 20%, rgba(0,0,0,0.1) 100%)",
            md: "linear-gradient(to right, rgba(10,10,10,0.8) 35%, rgba(0,0,0,0.1) 100%)"
          }
        }}
      />

      {/* FLOATING ACTION TEXT CONTENT NODE WRAPPER */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 40, md: "auto" },
          top: { md: "50%" },
          transform: { md: "translateY(-50%)" },
          left: { xs: "6%", md: "8%" },
          color: "#FFFFFF",
          maxWidth: { xs: "88%", md: "520px" },
          zIndex: 3
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.6rem", sm: "2.4rem", md: '3.5rem' },
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {activeProduct?.name}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            color: "#E5D5BC",
            letterSpacing: "0.22em",
            fontWeight: 600,
            fontSize: { xs: "0.65rem", md: "0.8rem" }
          }}
        >
          {activeProduct?.category ? activeProduct.category.split(" ")[0] : "Exquisite Asset"}
        </Typography>
      </Box>

      {/* SLIDER DOT INDEX METRIC CHANNELS */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 1.2,
            zIndex: 4
          }}
        >
          {banners.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: i === bannerIndex ? 24 : 6, // Premium capsule transformation on active item tracking index
                height: 6,
                borderRadius: "4px",
                background: i === bannerIndex ? "#E5D5BC" : "rgba(255,255,255,0.3)",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}