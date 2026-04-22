import { Box, Typography } from "@mui/material";

export default function TrendingSlider() {
  return (
    <Box sx={{ my: 5 }}>
      <Typography
        sx={{
          fontFamily: "serif",
          fontSize: 30,
          textAlign: "center",
          mb: 3,
        }}
      >
        Trending Now
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
        <Box sx={{ width: 250, height: 250, background: "#eee" }} />
      </Box>
    </Box>
  );
}
