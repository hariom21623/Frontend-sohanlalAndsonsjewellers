import { Box, Typography } from "@mui/material";

export default function TrendingSlider() {
  return (
    <Box sx={{ my: 5 }}>
      
      {/* Heading */}
      <Typography
        sx={{
          fontFamily: "serif",
          textAlign: "center",
          mb: 3,
          fontSize: { xs: 20, sm: 24, md: 30 },
        }}
      >
        Trending Now
      </Typography>

      {/* Slider */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",

          // hide scrollbar (optional)
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <Box
            key={item}
            sx={{
              minWidth: {
                xs: 160,
                sm: 200,
                md: 250,
              },
              height: {
                xs: 160,
                sm: 200,
                md: 250,
              },
              background: "#eee",
              borderRadius: 2,
              flexShrink: 0, // 🔥 important
            }}
          />
        ))}
      </Box>
    </Box>
  );
}