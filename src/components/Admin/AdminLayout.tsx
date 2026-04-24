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
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthProvider";

export default function AdminLayout({ title, children }: any) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => logout("/login");

  const drawerWidth = isTablet ? 180 : 220;

  return (
    <Box sx={{ display: "flex" }}>
      {/* APPBAR */}
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {(isMobile || isTablet) && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6">{title}</Typography>

          {/* DESKTOP */}
          {!isMobile && !isTablet && (
            <Box>
              {/* <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button> */}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}

          {/* MOBILE + TABLET MENU */}
          {(isMobile || isTablet) && (
            <>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MoreVertIcon sx={{ color: "#fff" }} />
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* SIDEBAR DESKTOP */}
      {!isMobile && !isTablet && (
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* DRAWER MOBILE + TABLET */}
      {(isMobile || isTablet) && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: drawerWidth }}>
            <Sidebar />
          </Box>
        </Drawer>
      )}

      {/* CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3,
          mt: 8,
          ml: !isMobile && !isTablet ? `${drawerWidth}px` : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}