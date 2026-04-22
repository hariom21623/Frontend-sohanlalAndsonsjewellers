import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  Menu,
  MenuItem,
  useMediaQuery,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout({ title, children }: any) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ────────────────────────────────
                TOP NAVBAR
      ──────────────────────────────── */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* LEFT SIDE — MENU BUTTON (ONLY MOBILE) */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* TITLE */}
          <Typography variant="h6">{title}</Typography>

          {/* RIGHT SIDE OPTIONS */}
          {/* DESKTOP → Buttons */}
          {!isMobile && (
            <Box>
              <Button
                sx={{ color: "#fff", mr: 1 }}
                onClick={() => navigate("/")}
              >
                HomePage
              </Button>
              <Button sx={{ color: "#fff" }} onClick={() => navigate("/logout")}>
                Logout
              </Button>
            </Box>
          )}

          {/* MOBILE → ⋮ Menu */}
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                open={Boolean(menuAnchor)}
                anchorEl={menuAnchor}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => navigate("/")}>HomePage</MenuItem>
                <MenuItem onClick={() => navigate("/logout")}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* ────────────────────────────────
                SIDEBAR
      ──────────────────────────────── */}

      {/* DESKTOP — Fixed Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 220,
            height: "100vh",
            borderRight: "1px solid #ddd",
            position: "fixed",
            left: 0,
            top: 64,
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* MOBILE — Drawer Sidebar */}
      {isMobile && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 240 }}>
            <Sidebar />
          </Box>
        </Drawer>
      )}

      {/* ────────────────────────────────
                PAGE CONTENT
      ──────────────────────────────── */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: isMobile ? 0 : "220px",
          overflowY: "auto",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
