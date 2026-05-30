import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useCart } from "../../../contexts/CartProvider";
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../../api/orderService";

export default function CheckoutPage() {
  const { items: contextItems, total: contextTotal, clear } = useCart();
  const { user, token } = useAuth() as any;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Cart data fetcher
  const getCartData = () => {
    if (contextItems.length > 0) return { items: contextItems, total: contextTotal };
    const cart = JSON.parse(localStorage.getItem("sl_cart") || "[]");
    const total = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    return { items: cart, total };
  };

  const { items, total } = getCartData();

  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Session expired! Please login again.");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      // ✅ Payload: adminPrice (total) backend ko calculation ke liye bheja ja raha hai
      const orderData = {
        items,
        adminPrice: total, 
        discount: 0,
        customerName: user?.name || "Guest",
        customerPhone: user?.phoneNumber || "0000000000",
        address: user?.address || "Not provided",
        pincode: user?.pincode || "N/A"
      };

      // Backend call
      const res = await placeOrder(orderData, token);
      const order = res.order;

      // WhatsApp Message Preparation
      const itemsList = order.items.map((it: any) =>
        `* ${it.name} (SKU: ${it.sku}) | Qty: ${it.qty} | Price: ₹${it.price}`
      ).join('\n');

      const msg = encodeURIComponent(
        `New Order Received!\n\n` +
        `Order ID: #${order.id.slice(-6).toUpperCase()}\n` +
        `Customer: ${order.customerName}\n` +
        `Phone: ${order.customerPhone}\n` +
        `Address: ${order.address}\n` +
        `Pincode: ${order.pincode}\n\n` +
        `Items:\n${itemsList}\n\n` +
        `Total Amount: ₹${order.totalAmount ? order.totalAmount.toLocaleString() : 'N/A'}\n` +
        `Date: ${new Date(order.createdAt).toLocaleString()}`
      );

      // Trigger WhatsApp
      window.location.href = `whatsapp://send?phone=919682296756&text=${msg}`;

      // Finalize
      clear?.();
      localStorage.removeItem("sl_cart");
      navigate("/");
    } catch (err: any) {
      console.error("Checkout Error:", err);
      alert("Order failed! " + (err.response?.data?.message || err.message));
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
      gap: 3,
      px: 2
    }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4A0E17' }}>Checkout</Typography>
      
      <Typography variant="body1" sx={{ color: '#8E8370' }}>
        Total Payable: ₹{total.toLocaleString()}
      </Typography>

      <Button
        variant="contained"
        size="large"
        disabled={loading}
        onClick={handlePlaceOrder}
        sx={{ 
          bgcolor: '#4A0E17', 
          py: 2, 
          px: 5, 
          borderRadius: 2, 
          fontSize: '1.1rem', 
          '&:hover': { bgcolor: '#6e1e2b' } 
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "PLACE ORDER VIA WHATSAPP"}
      </Button>
    </Box>
  );
}