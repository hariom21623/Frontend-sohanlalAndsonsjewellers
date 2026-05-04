import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainNavbar({
  onSearch,
}: {
  onSearch?: (q: string) => void;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const goLogin = () => navigate("/login");

  // ✅ Updated debounce logic with robust cleanup
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch?.(q);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [q, onSearch]);

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "95%", md: "60%" },
            background: "#f1f1f1",
            borderRadius: 50,
            px: 2,
            py: 1,
            mb: 1,
          }}
        >
          <SearchIcon sx={{ color: "#444" }} />

          <InputBase
            placeholder="Search jewellery..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
          />
        </Box>

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