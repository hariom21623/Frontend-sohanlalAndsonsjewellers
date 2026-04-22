import { Box } from "@mui/material";

export default function MainBanner() {
  return (
    <Box
      sx={{
        width: "100%",
        height: 350,
        backgroundImage: "url('/Shop-logo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
