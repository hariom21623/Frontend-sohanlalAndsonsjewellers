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
        gap: 4,
        p: 2,
        borderBottom: "1px solid #ddd",
        fontWeight: 600,
        justifyContent: "center",
      }}
    >
      {categories.map((cat) => (
        <Typography
          key={cat}
          sx={{
            cursor: "pointer",
            whiteSpace: "nowrap",
            "&:hover": { color: "#b1003a" },
          }}
        >
          {cat}
        </Typography>
      ))}
    </Box>
  );
}
