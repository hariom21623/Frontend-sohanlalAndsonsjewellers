import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function AppHeader() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    if (user?.adminRole) logout("/");
    
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#800000" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer",color: "#d4af37", fontWeight: "bold" }}
          onClick={() => navigate("/")}
        >
          {/* Sohan Lal & Son’s Jewellers */}
          सोहन लाल एंड संस ज्वैलर्स
        </Typography>

        {/* ================= MOBILE ================= */}
        {isMobile ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon sx={{ color: "#fff" }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {!token ? (
                <>
                  <MenuItem onClick={() => navigate("/login")}>
                    <LoginIcon sx={{ mr: 1 }} /> Login
                  </MenuItem>
                  {/* <MenuItem onClick={() => navigate("/register")}>
                    <PersonAddIcon sx={{ mr: 1 }} /> Register
                  </MenuItem> */}
                </>
              ) : (
                <>
                  {/* <MenuItem onClick={() => navigate("/user")}>
                    <AccountCircleIcon sx={{ mr: 1 }} /> Home
                  </MenuItem> */}
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          /* ================= DESKTOP ================= */
          <Stack direction="row" spacing={1}>
            {!token ? (
              <>
                <Button color="inherit"  onClick={() => navigate("/login")}>
                  Login
                </Button>
                {/* <Button color="inherit" onClick={() => navigate("/register")}>
                  Register
                </Button> */}
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/")}>
                  Home
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}