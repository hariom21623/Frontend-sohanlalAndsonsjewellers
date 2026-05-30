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
        const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
        
        // Message ko 2 parts mein todo: text aur link
        const text = `Hello ${order.customerName}, your order #${order.id.slice(-6).toUpperCase()} is ACCEPTED!\n\nTotal: ₹${order.totalAmount}\n\nDownload Bill below:`;
        const link = res.billLink;
        
        // Sirf text ko encode karo, link ko nahi
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}%0A%0A${link}`;
        
        window.open(whatsappUrl, "_blank");
      }
      fetchOrders();
    } catch (error) {
      alert("Error!");
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