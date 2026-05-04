import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || products.length === 0) return;

    let animationId: number;
    let startPosition = 0;
    const scrollSpeed = 1.2; // Adjust the speed of the scroll here

    const scroll = () => {
      if (!scroller) return;
      startPosition += scrollSpeed;

      // When the scroll reaches halfway through the duplicated elements, loop back to the start
      if (startPosition >= scroller.scrollWidth / 2) {
        startPosition = 0;
      }

      scroller.scrollLeft = startPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  // Duplicate items for a seamless infinite loop
  const duplicatedProducts = [...products, ...products];

  return (
    <Box
      ref={scrollerRef}
      sx={{
        mt: 2,
        display: "flex",
        gap: 3,
        overflowX: "hidden", // Disable manual scrollbar to keep it auto-scrolling
        width: "100%",
        p: 1,
      }}
    >
      {duplicatedProducts.map((p, index) => (
        <Box
          key={`${p.id}-${index}`}
          sx={{
            // Keep card sizes uniform (shows a single item or multiple depending on width)
            minWidth: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
            flexShrink: 0,
          }}
        >
          <ProductCard product={p} />
        </Box>
      ))}
    </Box>
  );
}