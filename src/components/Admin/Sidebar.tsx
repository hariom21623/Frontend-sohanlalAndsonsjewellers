import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Users", path: "/admin/users" },
    { label: "Products", path: "/admin/products" },
    { label: "Bills", path: "/admin/bills" },
  ];

  return (
    // Changed: Box takes full height, and uses pt: 9 (around 72px) 
    // to cleanly push the menu list below the blue header without moving the container background!
    <Box 
      sx={{ 
        width: 220, 
        p: 1, 
        pt: 9, 
        height: "100vh", 
        borderRight: "1px solid #EAEAEA", // Clean luxury dividing line
        bgcolor: "#FFFFFF" 
      }}
    >
      <List component="nav">
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={pathname === item.path}
            sx={{ 
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "rgba(74, 14, 23, 0.08)", // Custom luxurious soft tint selection background
                color: "#4A0E17",
                "&:hover": {
                  bgcolor: "rgba(74, 14, 23, 0.12)",
                }
              }
            }}
          >
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                fontSize: "0.9rem", 
                fontWeight: pathname === item.path ? 600 : 400 
              }} 
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}