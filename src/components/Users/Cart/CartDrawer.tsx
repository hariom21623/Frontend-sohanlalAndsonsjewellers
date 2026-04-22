import React from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../../../contexts/CartProvider";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const { items, updateQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  const proceed = () => {
    if (!items.length) return;
    // go to checkout or login
    navigate("/checkout");
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List>
          {items.map((it) => (
            <ListItem key={it.productId} secondaryAction={
              <Button color="error" onClick={() => removeFromCart(it.productId)}>Remove</Button>
            }>
              <ListItemAvatar>
                <Avatar src={it.image} variant="square" />
              </ListItemAvatar>
              <ListItemText
                primary={it.name}
                secondary={
                  <>
                    <div>₹{it.price} × {it.qty}</div>
                    <div>SKU: {it.sku}</div>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Total: ₹{total.toFixed(2)}</Typography>
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={proceed}>Checkout</Button>
        </Box>
      </Box>
    </Drawer>
  );
}
