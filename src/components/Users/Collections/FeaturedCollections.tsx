import { Box, Typography } from "@mui/material";

export default function FeaturedCollections() {
  return (
    <Box sx={{ my: 5, px: 2, textAlign: "center" }}>
      
      {/* Heading */}
      <Typography
        sx={{
          fontFamily: "serif",
          fontWeight: 600,
          mb: 1,
          fontSize: {
            xs: 20,
            sm: 24,
            md: 30,
          },
        }}
      >
        Find Your Perfect Match
      </Typography>

      <Typography
        sx={{
          mb: 3,
          color: "text.secondary",
          fontSize: { xs: 14, md: 16 },
        }}
      >
        Shop by Categories
      </Typography>

      {/* Responsive Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",   // mobile: 2 per row
            sm: "repeat(3, 1fr)",   // tablet
            md: "repeat(4, 1fr)",   // desktop
          },
          gap: 2,
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Box
            key={item}
            sx={{
              padding: 2,
              width: "100%",
              aspectRatio: "1 / 1", // 👈 perfect square
              background: "#eee",
              borderRadius: 2,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}