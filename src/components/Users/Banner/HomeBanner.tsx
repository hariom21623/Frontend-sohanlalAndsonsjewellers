// src/components/Users/Banner/HomeBanner.tsx
import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPublic } from "../../../api/product";

type Props = {
  category: string;
};

export default function HomeBanner({ category }: Props) {
  const [banners, setBanners] = useState<any[]>([]); // Array of products
  const [bannerIndex, setBannerIndex] = useState(0); // Current product index
  const [images, setImages] = useState<string[]>([]); // Current product's images
  const [imageIndex, setImageIndex] = useState(0); // Current image index in the product's images
  
  const navigate = useNavigate();
  const touchStartX = useRef(0);

  // 1. Fetch products
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await getAllPublic({ q: "", category });
        console.log("ALL PUBLIC DATA 👉", res);

        if (active) {
          const products = res.banners || [];
          setBanners(products);

          if (products.length > 0) {
            const dayIndex = (new Date().getDate() - 1) % products.length;
            setBannerIndex(dayIndex);
          }
        }
      } catch (err) {
        console.error("Banner error", err);
      }
    })();

    return () => {
      active = false;
    };
  }, [category]);

  // 2. Load images for the active product
  useEffect(() => {
    if (banners.length === 0) {
      setImages([]);
      return;
    }

    const currentBanner = banners[bannerIndex];
    let productImages: string[] = [];

    if (currentBanner && currentBanner.images) {
      if (Array.isArray(currentBanner.images)) {
        productImages = currentBanner.images;
      } else if (typeof currentBanner.images === "string") {
        try {
          productImages = JSON.parse(currentBanner.images);
        } catch {
          productImages = [currentBanner.images];
        }
      }
    }

    setImages(productImages);
    setImageIndex(0); // Reset image index on product change
  }, [bannerIndex, banners]);

  // 3. Rotate Banners & Images automatically
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      // If the current product has multiple images, cycle through them first
      if (images.length > 1 && imageIndex < images.length - 1) {
        setImageIndex((prev) => prev + 1);
      } else {
        // Once images are at the end, move to the next product and reset the image index
        setImageIndex(0);
        setBannerIndex((prev) => (prev + 1) % banners.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [banners, images, imageIndex]);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: any) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    if (diff > 50) {
      // Swipe left - change to the next banner product
      setBannerIndex((prev) => (prev + 1) % banners.length);
      setImageIndex(0);
    } else if (diff < -50) {
      // Swipe right - change to the previous banner product
      setBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
      setImageIndex(0);
    }
  };

  if (banners.length === 0 || images.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: 220, md: 420 },
          background: "#eee",
        }}
      />
    );
  }

  const banner = banners[bannerIndex];
  const currentImage = images[imageIndex];

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 220, md: 420 },
        position: "relative",
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* IMAGE */}
      <Box
        component="img"
        src={currentImage || "/placeholder.png"}
        alt={banner?.name || "Banner Image"}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
        }}
      />

      {/* TEXT */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: "5%", md: "8%" },
          transform: "translateY(-50%)",
          color: "#fff",
        }}
      >
        <Typography fontSize={{ xs: 18, md: 32 }} fontWeight={700}>
          {banner?.name}
        </Typography>

        <Typography fontSize={{ xs: 12, md: 16 }} mt={1}>
          {banner?.category}
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: "30px",
            background: "#b1003a",
          }}
          onClick={() => navigate(`/product/${banner?.id}`)}
        >
          Shop Now
        </Button>
      </Box>

      {/* DOTS */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {images.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === imageIndex ? "#fff" : "#888",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}