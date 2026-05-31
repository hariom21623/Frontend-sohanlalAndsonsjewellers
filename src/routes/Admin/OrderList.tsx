import { useState, useEffect } from "react";
import {
  Button, Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../api/orderService";

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await getAllOrders();
    setOrders(res.orders || []);
  }

  const handleStatusUpdate = async (order: any, status: string) => {
    if (window.confirm(`Are you sure?`)) {
      try {
        const res = await updateOrderStatus(order.id, status);

        if (status === "ACCEPTED" && res.billLink) {
          // Code mein change karo:
          const cleanPhone = "91" + order.customerPhone.replace(/[^0-9]/g, "").slice(-10);
          const text = `Hello ${order.customerName}, your order #${order.id.slice(-6).toUpperCase()} is ACCEPTED!\n\nTotal: ₹${order.totalAmount}\n\nDownload Bill: ${res.billLink}`;

          // WhatsApp Direct Scheme: Ye browser ko force karta hai ki WhatsApp dhundo
          // Format: whatsapp://send?phone=NUMBER&text=TEXT
          const whatsappAppUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;

          // 1. Pehle App Scheme try karo
          window.location.href = whatsappAppUrl;

          // 2. Agar 2 second mein app nahi khuli (yani app nahi hai), toh fallback web pe jao
          setTimeout(() => {
            const webUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
            window.open(webUrl, "_blank");
          }, 2000);
        }

        fetchOrders();
      } catch (error) {
        alert("Error updating status!");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
      fetchOrders();
    }
  };

  return (
    <AdminLayout title="Orders">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#4A0E17" }}>Orders Management</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none', border: "1px solid #E5D5BC" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F5EFE6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#4A0E17" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#4A0E17" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#4A0E17" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#4A0E17" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#4A0E17" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#4A0E17" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id} hover sx={{ bgcolor: "#FFFFFF !important" }}>
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>#{order.id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerPhone}</TableCell>
                <TableCell>₹{order.totalAmount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography sx={{ color: order.status === "ACCEPTED" ? "#2e7d32" : "#ed6c02", fontWeight: 700 }}>
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.status === "PENDING" && (
                    <Button size="small" variant="outlined" color="success" onClick={() => handleStatusUpdate(order, "ACCEPTED")}>Accept</Button>
                  )}
                  <IconButton color="error" onClick={() => handleDelete(order.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
}