import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, Menu, MenuItem, Button, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthProvider";

export default function AdminLayout({ title, children }: any) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  
  // Triggers mobile layout when browser viewport width splits or goes below 900px scale
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); 

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => logout("/");
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FDFBF7", maxWidth: "100vw", overflowX: "hidden" }}>
      
      {/* HEADER BAR APPBAR */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 2, 
          bgcolor: "#141414", 
          borderBottom: "1px solid rgba(229, 213, 188, 0.15)",
          boxShadow: "none"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton 
              color="inherit" 
              onClick={() => setDrawerOpen(!drawerOpen)} 
              edge="start" 
              sx={{ mr: 2, "&:hover": { bgcolor: "rgba(229,213,188,0.1)" } }}
            >
              <MenuIcon sx={{ color: "#E5D5BC" }} />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', color: "#E5D5BC", fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.05em" }}>
            {title}
          </Typography>

          {!isMobile && (
            <Box>
              <Button sx={{ color: '#B3B3B3', letterSpacing: '0.1em', '&:hover': { color: '#E5D5BC' } }} onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}

          {isMobile && (
            <>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MoreVertIcon sx={{ color: "#E5D5BC" }} />
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ sx: { bgcolor: '#141414', border: '1px solid rgba(229, 213, 188, 0.2)', borderRadius: 0 } }}
              >
                <MenuItem onClick={() => { setMenuAnchor(null); navigate("/"); }} sx={{ color: '#FFF', fontSize: '0.85rem' }}>Home Window</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#E5D5BC', fontWeight: 600, fontSize: '0.85rem' }}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* DESKTOP DRAW PANEL CONTROL */}
      {!isMobile && (
        <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0, bgcolor: "#FFFFFF", minHeight: "100vh" }}>
          <Sidebar />
        </Box>
      )}

      {/* MOBILE COLLAPSIBLE DRAWER COMPONENT LAYOUT */}
      {isMobile && (
        <Drawer 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              bgcolor: '#FFFFFF', 
              boxSizing: 'border-box',
              borderRight: "1px solid rgba(229, 213, 188, 0.15)"
            }
          }}
        >
          <Toolbar />
          <Box sx={{ width: drawerWidth, pt: 1 }} onClick={() => setDrawerOpen(false)}>
            <Sidebar />
          </Box>
        </Drawer>
      )}

      {/* =======================================================================
          🔥 CRITICAL FIXED MASTER CONTENT GRID WRAPPER (STOPS THE ENTIRE WINDOW SCROLL BAR)
          ======================================================================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          flexShrink: 1,             // 🚀 CRITICAL: Forces elements to dynamically compress inside split screens parameters
          minWidth: 0,               // 🚀 CRITICAL: Prevents default grid layouts overflow threshold expansion breaks
          p: { xs: 2.5, sm: 3, md: 4 },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` }, 
          minHeight: "100vh",
          boxSizing: "border-box",
          overflowX: "hidden"        // Strictly clamps down any bleeding margin leakage ranges
        }}
      >
        <Toolbar /> 
        <Box sx={{ mt: 1, width: "100%" }}>
          {children}
        </Box>
      </Box>

    </Box>
  );
}