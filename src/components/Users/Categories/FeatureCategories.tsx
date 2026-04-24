import { Box, Typography } from "@mui/material";

const categories = [
  "All Jewellery",
  "Gold",
  "Silver",
  "Rings",
  "Earrings",
  "Chains",
  "Bangles",
  "Mangalsutra",
];

export default function CategoryStrip() {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 3,
        p: 2,
        borderBottom: "1px solid #ddd",
        fontWeight: 600,

        // 👇 KEY FIX
        justifyContent: {
          xs: "flex-start", // mobile
          md: "center",     // desktop
        },

        // 👇 smoother scroll UX
        scrollBehavior: "smooth",

        // 👇 hide scrollbar (optional clean UI)
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {categories.map((cat) => (
        <Typography
          key={cat}
          sx={{
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0, // 👈 prevents shrinking
            "&:hover": { color: "#b1003a" },
          }}
        >
          {cat}
        </Typography>
      ))}
    </Box>
  );
}