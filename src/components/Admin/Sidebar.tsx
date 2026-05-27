// src/components/Admin/Sidebar.tsx
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Users", path: "/admin/users" },
    { label: "Products", path: "/admin/products" },
    { label: "Bills", path: "/admin/bills" },
    { label: "Orders", path: "/admin/orders" }, // <--- Ye add kiya
  ];

  return (
    <Box 
      sx={{ 
        width: "100%",
        p: 1.5, 
        // 🚀 Fixed padding configurations matrix (Clean alignment zero padding defaults for custom mobile sliders)
        pt: { xs: 1, md: 10 }, 
        boxSizing: "border-box",
        bgcolor: "transparent" 
      }}
    >
      <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menu.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path);
          
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive}
              sx={{ 
                borderRadius: 0,
                py: 1.5,
                px: 2.5,
                mb: 0.5,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                
                bgcolor: isActive ? "#E5D5BC !important" : "transparent", 
                color: isActive ? "#4A0E17 !important" : "#444444",
                
                "&:hover": {
                  bgcolor: isActive ? "#B89B73" : "rgba(229, 213, 188, 0.15)",
                  color: isActive ? "#4A0E17" : "#0A0A0A"
                },
                "&.Mui-selected": {
                  bgcolor: "#E5D5BC",
                  color: "#4A0E17"
                }
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontSize: "0.9rem", 
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.08em"
                }} 
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}