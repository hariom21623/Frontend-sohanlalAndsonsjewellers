import React, { useState } from "react";
import { Drawer, Box, IconButton, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider, Snackbar, Alert } from "@mui/material";
import { CloseOutlined, DeleteOutline, AddOutlined, RemoveOutlined } from "@mui/icons-material";
import { useCart } from "../../../contexts/CartProvider";
import { useNavigate } from "react-router-dom";


interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQty, total } = useCart();
  const navigate = useNavigate();
  const [stockAlert, setStockAlert] = useState({ open: false, max: 0 });

  // CartDrawer.tsx (Snippet)
  const proceed = () => {
    if (!items.length) return;
    onClose(); // Drawer band karo
    navigate("/checkout"); // Bas Checkout page par bhejo
  };

  const handleQtyIncrease = (productId: string, currentQty: number) => {
    const result = updateQty(productId, currentQty + 1);
    if (!result.success && result.maxStock !== undefined) {
      setStockAlert({ open: true, max: result.maxStock });
    }
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#FDFBF7', width: { xs: '100%', sm: 420 }, borderRadius: 0 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2.5, bgcolor: '#0A0A0A' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', color: '#E5D5BC', fontWeight: 600 }}>Your Cart</Typography>
            <IconButton onClick={onClose} sx={{ color: '#E5D5BC' }}><CloseOutlined /></IconButton>
          </Box>

          <Divider sx={{ borderColor: 'rgba(229, 213, 188, 0.2)' }} />

          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="body2" sx={{ color: '#6E6557', fontStyle: 'italic' }}>Your shopping bag is currently empty.</Typography>
              </Box>
            ) : (
              <List>
                {items.map((it) => {
                  // 🚀 PROPER FIXED: Reads exact max stock value persistent from standard storage layers
                  const displayedMaxStock = it.maxStock !== undefined ? Number(it.maxStock) : 1;

                  return (
                    <React.Fragment key={it.productId}>
                      <ListItem secondaryAction={
                        <IconButton edge="end" onClick={() => removeFromCart(it.productId)} sx={{ color: '#A0A0A0', '&:hover': { color: '#4A0E17' } }}>
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      } sx={{ px: 1, py: 2 }}>

                        <ListItemAvatar sx={{ mr: 1.5 }}>
                          <Avatar src={it.image} variant="square" sx={{ width: 64, height: 64, border: '1px solid rgba(229, 213, 188, 0.3)', bgcolor: '#FFF' }} />
                        </ListItemAvatar>

                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#1A1A1A' }}>{it.name}</Typography>}
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#6E6557', display: 'block', fontWeight: 600, mb: 0.5 }}>
                                ₹{it.price.toLocaleString('en-IN')}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <IconButton size="small" onClick={() => updateQty(it.productId, it.qty - 1)} sx={{ border: '1px solid rgba(229, 213, 188, 0.6)', borderRadius: 0, p: 0.4, bgcolor: '#FAF8F5' }}>
                                  <RemoveOutlined fontSize="inherit" sx={{ color: '#4A0E17' }} />
                                </IconButton>
                                <Typography variant="body2" sx={{ px: 1.5, fontWeight: 700, minWidth: 20, textAlign: 'center', color: '#1A1A1A' }}>{it.qty}</Typography>
                                <IconButton size="small" onClick={() => handleQtyIncrease(it.productId, it.qty)} sx={{ border: '1px solid rgba(229, 213, 188, 0.6)', borderRadius: 0, p: 0.4, bgcolor: '#FAF8F5' }}>
                                  <AddOutlined fontSize="inherit" sx={{ color: '#4A0E17' }} />
                                </IconButton>
                              </Box>

                              {/* 🚀 FIXED TEXT MATRIX LAYOUT LAYER */}
                              <Typography variant="caption" sx={{ color: '#8E8370', display: 'block', mt: 1, fontSize: '0.65rem', fontWeight: 600 }}>
                                Available Stock Limit: {displayedMaxStock} units
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#A0A0A0', display: 'block' }}>SKU: {it.sku || "N/A"}</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider sx={{ borderColor: 'rgba(229, 213, 188, 0.15)' }} />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Box>

          {items.length > 0 && (
            <Box sx={{ p: 3, bgcolor: '#FFF', borderTop: '1px solid rgba(229, 213, 188, 0.3)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#6E6557', fontWeight: 500, letterSpacing: '0.05em' }}>TOTAL PAYABLE:</Typography>
                <Typography variant="h6" sx={{ color: '#4A0E17', fontWeight: 700 }}>₹{total.toLocaleString('en-IN')}</Typography>
              </Box>
              <Button variant="contained" fullWidth onClick={proceed} sx={{ bgcolor: '#4A0E17', color: '#FDFBF7', borderRadius: 0, py: 1.5, fontWeight: 600, letterSpacing: '0.1em', '&:hover': { bgcolor: '#2C050B' } }}>
                PROCEED TO CHECKOUT
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Snackbar open={stockAlert.open} autoHideDuration={2500} onClose={() => setStockAlert({ ...stockAlert, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="warning" variant="filled" onClose={() => setStockAlert({ ...stockAlert, open: false })} sx={{ bgcolor: '#4A0E17', color: '#FDFBF7', borderRadius: 0, fontFamily: '"Montserrat", sans-serif', fontSize: '0.78rem', fontWeight: 600, boxShadow: '0px 8px 20px rgba(0,0,0,0.2)', '& .MuiAlert-icon': { color: '#E5D5BC' } }}>
          ⚠️ Limited Availability! Only {stockAlert.max} exclusive designer pieces available in live stock.
        </Alert>
      </Snackbar>
    </>
  );
}