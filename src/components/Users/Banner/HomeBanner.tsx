import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPublic } from "../../../api/product";

type Props = {
  category: string;
};

export default function HomeBanner({ category }: Props) {
  const [banners, setBanners] = useState<any[]>([]); 
  const [bannerIndex, setBannerIndex] = useState(0); 
  const navigate = useNavigate();
  // const touchStartX = useRef(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getAllPublic({ q: "", category });
        if (active) {
          const rawProducts = res.products || [];
          const bannerProducts = rawProducts.filter((p: any) => p.isBanner === true || p.bannerImages);
          const sourceArray = bannerProducts.length > 0 ? bannerProducts : (res.banners || []);

          const uniqueBannersMap: Record<string, any> = {};
          sourceArray.forEach((p: any) => {
            const normalizedName = p.name.toLowerCase().trim();
            if (!uniqueBannersMap[normalizedName]) {
              uniqueBannersMap[normalizedName] = p;
            } else {
              const existingDate = new Date(uniqueBannersMap[normalizedName].created_at).getTime();
              const currentDate = new Date(p.created_at).getTime();
              if (currentDate > existingDate) uniqueBannersMap[normalizedName] = p;
            }
          });

          const filteredUniqueBanners = Object.values(uniqueBannersMap);
          setBanners(filteredUniqueBanners);

          if (filteredUniqueBanners.length > 0) {
            const dayIndex = (new Date().getDate() - 1) % filteredUniqueBanners.length;
            setBannerIndex(dayIndex);
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { active = false; };
  }, [category]);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  const activeProduct = banners[bannerIndex];
  
  const desktopBannerUrl = activeProduct?.bannerImages?.desktopUrl || (activeProduct?.images && activeProduct.images[1] ? activeProduct.images[1] : activeProduct.images[0]);
  // const mobileBannerUrl = activeProduct?.bannerImages?.mobileUrl || desktopBannerUrl;

  const enhanceBannerQuality = (url: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/q_auto:best,f_auto,fl_lossy,w_1920/');
    }
    return url;
  };

  const activeImage = enhanceBannerQuality(desktopBannerUrl);

  return (
    <Box
      onClick={() => navigate(`/collection/${encodeURIComponent(activeProduct.name.trim())}`)}
      sx={{
        width: "100vw", 
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        height: { xs: "50vh", sm: "60vh", md: "70vh" }, 
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "#000"
      }}
    >
      {/* ================= LAYER 1: BACKDROP BLURRED MATRIX IMAGE ================= */}
      <Box
        component="img"
        src={activeImage}
        alt="Blurred background element"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(20px) brightness(0.4)", // 🔥 Micro blur engine + Darken to elevate depth
          transform: "scale(1.15)", // Smooth crop padding edge boundary leakage fix
          zIndex: 1
        }}
      />

      {/* ================= LAYER 2: CRYSTAL CLEAR PRISTINE FOREGROUND ================= */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2
        }}
      >
        <Box
          component="img"
          src={activeImage}
          alt={activeProduct?.name}
          sx={{
            height: "100%",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
            // Subtle premium shadow around the standalone floating jewel piece box mapping
            filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.65))" 
          }}
        />
      </Box>

      {/* ================= LAYER 3: REGAL TEXT OVERLAYS ================= */}
      <Box 
        sx={{ 
          position: "absolute", 
          bottom: { xs: '30px', md: "45px" }, 
          left: { xs: "6%", md: "8%" }, 
          color: "#FFFFFF", 
          zIndex: 3,
          maxWidth: { xs: "88%", md: "600px" },
          textAlign: "left"
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            textTransform: "uppercase", 
            color: "#E5D5BC", 
            letterSpacing: "0.25em", 
            fontWeight: 700,
            fontSize: { xs: '0.62rem', md: '0.75rem' },
            display: "block",
            mb: 0.5,
            textShadow: "0px 2px 4px rgba(0,0,0,0.5)"
          }}
        >
          {activeProduct?.category}
        </Typography>

        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: "1.6rem", sm: "2rem", md: '2.6rem' }, 
            fontFamily: '"Playfair Display", serif', 
            fontWeight: 500,
            lineHeight: 1.1,
            mb: 1,
            textShadow: "0px 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          {activeProduct?.name}
        </Typography>

        {activeProduct?.description && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.85)", 
              fontFamily: '"Montserrat", sans-serif',
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              fontWeight: 400,
              letterSpacing: '0.04em',
              lineHeight: 1.4,
              display: { xs: 'none', sm: 'block' }, 
              maxWidth: "90%",
              textShadow: "0px 2px 4px rgba(0,0,0,0.5)"
            }}
          >
            {activeProduct.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}