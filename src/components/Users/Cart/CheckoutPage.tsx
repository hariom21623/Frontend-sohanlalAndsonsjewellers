import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useCart } from "../../../contexts/CartProvider";
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../../api/orderService";

export default function CheckoutPage() {
  const { items: contextItems, total: contextTotal, clear } = useCart();
  const { user } = useAuth() as any;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getCartData = () => {
    if (contextItems.length > 0) return { items: contextItems, total: contextTotal };
    const cart = JSON.parse(localStorage.getItem("sl_cart") || "[]");
    const total = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    return { items: cart, total };
  };

  const { items, total } = getCartData();

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items,
        totalAmount: total,
        customerName: user?.name || "Guest",
        customerPhone: user?.phoneNumber || "0000000000",
        address: user?.address || "N/A",
        pincode: user?.pincode || "N/A"
      };

      const res = await placeOrder(orderData);
      const order = res.order;

      // ✅ Yahan SKU, Qty, aur Price add kar diye hain
      const itemsList = order.items.map((it: any) =>
        `* ${it.name} (SKU: ${it.sku}) | Qty: ${it.qty} | Price: ₹${it.price}`
      ).join('\n');

      // ✅ Yahan format fix kar diya hai
      const msg = encodeURIComponent(
        `New Order Received!\n\n` +
        `Order ID: #${order.id.slice(-6).toUpperCase()}\n` +
        `Customer: ${order.customerName}\n` +
        `Phone: ${order.customerPhone}\n` +
        `Address: ${order.address}\n` +
        `Pincode: ${order.pincode}\n\n` +
        `Items:\n${itemsList}\n\n` +
        `Total Amount: ₹${order.totalAmount}\n` +
        `Date: ${new Date(order.createdAt).toLocaleString()}`
      );

      window.open(`whatsapp://send?phone=919682296756&text=${msg}`, "_blank");

      clear?.();
      localStorage.removeItem("sl_cart");
      navigate("/");
    } catch {
      alert("Order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3
    }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4A0E17' }}>
        Checkout
      </Typography>

      <Button
        variant="contained"
        size="large"
        disabled={loading}
        onClick={handlePlaceOrder}
        sx={{
          bgcolor: 'cream',
          py: 2,
          px: 5,
          borderRadius: 2,
          fontSize: '1.1rem',
          '&:hover': { bgcolor: 'cream' }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "PLACE ORDER VIA WHATSAPP"}
      </Button>
    </Box>
  );
}