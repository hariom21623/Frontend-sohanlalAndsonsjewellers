import { Box, Typography } from "@mui/material";

export default function FeaturedCollections() {
  return (
    <Box sx={{ my: 4, textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "serif",
          fontSize: 30,
          fontWeight: 600,
          mb: 1,
        }}
      >
        Find Your Perfect Match
      </Typography>

      <Typography sx={{ mb: 3 }}>
        Shop by Categories
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
      </Box>
    </Box>
  );
}
