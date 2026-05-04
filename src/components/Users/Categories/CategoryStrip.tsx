// src/components/Users/Categories/CategoryStrip.tsx

import { Box } from "@mui/material";
import { useState } from "react";

const categories = [
  { label: "All", value: "all" }, // ✅ IMPORTANT
  { label: "1Gram Gold", value: "1Gram Gold Polished Jewellery" },
  { label: "Gold", value: "Gold" },
  { label: "Silver", value: "Silver" },
];

export default function CategoryStrip({
  onSelect,
}: {
  onSelect?: (category: string) => void;
}) {
  const [active, setActive] = useState("all");

  const handleClick = (cat: string) => {
    setActive(cat);
    onSelect?.(cat);
  };

  return (
    <Box
      sx={{
        display: "flex",
        // Centers the items on larger screens but lets them scroll on mobile devices
        justifyContent: { xs: "flex-start", md: "center" },
        gap: 2,
        px: 2,
        py: 1.5,
        borderBottom: "1px solid #eee",
        overflowX: "auto",
        width: "100%",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {categories.map((cat) => (
        <Box
          key={cat.value}
          onClick={() => handleClick(cat.value)}
          sx={{
            px: 2,
            py: 0.8,
            borderRadius: "20px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            background: active === cat.value ? "#b1003a" : "#f5f5f5",
            color: active === cat.value ? "#fff" : "#333",
          }}
        >
          {cat.label}
        </Box>
      ))}
    </Box>
  );
}