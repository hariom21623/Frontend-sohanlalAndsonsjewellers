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
    <Box sx={{ width: 220, p: 1 }}>
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={pathname === item.path}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
