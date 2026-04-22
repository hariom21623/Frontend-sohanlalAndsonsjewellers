import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

export default function MainNavbar() {
  const navigate = useNavigate();

  const goLogin = () => navigate("/login");

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        color: "#000",
      }}
    >
      <Toolbar sx={{ display: "flex", flexDirection: "column", py: 1 }}>
        
        {/* LOGO */}
        {/* <Typography
          sx={{
            fontFamily: "serif",
            fontSize: 32,
            fontWeight: 600,
            mb: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/user")}
        >
          Sohan Lal & Sons Jewellers
        </Typography> */}

        {/* SEARCH BAR */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "70%",
            background: "#f1f1f1",
            borderRadius: 50,
            p: 1,
            mb: 1,
          }}
        >
          <SearchIcon sx={{ ml: 1, color: "#444" }} />
          <InputBase
            placeholder="Search for Gold, Silver, Diamond jewellery..."
            sx={{ ml: 1, flex: 1 }}
          />
        </Box>

        {/* ICONS */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <IconButton onClick={goLogin}>
            <PersonIcon />
          </IconButton>

          <IconButton onClick={goLogin}>
            <FavoriteBorderIcon />
          </IconButton>

          <IconButton onClick={goLogin}>
            <ShoppingBagIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
