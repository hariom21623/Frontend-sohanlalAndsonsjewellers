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

  // ✅ UPDATED: Status update logic with cleaned WhatsApp URL
  const handleStatusUpdate = async (order: any, status: string) => {
    if (window.confirm(`Are you sure you want to ${status} this order?`)) {
      try {
        await updateOrderStatus(order.id, status);
        
        // Agar status ACCEPTED hai, toh WhatsApp trigger karo
        if (status === "ACCEPTED") {
          // Phone number ko clean karo (sirf digits rakho)
          const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
          const msg = encodeURIComponent(
            `Hello ${order.customerName}, your order #${order.id.slice(-6).toUpperCase()} has been ACCEPTED by Sohan Lal & Sons Jewellers!`
          );

          // ✅ wa.me URL (Desktop aur Mobile dono par perfectly kaam karta hai)
          window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
        }
        
        fetchOrders(); // List ko refresh karo
      } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update order status.");
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
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#4A0E17" }}>
          Orders Management
        </Typography>
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
              <TableRow
                key={order.id}
                hover
                sx={{
                  bgcolor: "#FFFFFF !important",
                  '&:hover': { bgcolor: '#FDFBF7 !important' },
                  '& .MuiTableCell-root': { color: "#4A0E17 !important" }
                }}
              >
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  #{order.id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerPhone}</TableCell>
                <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography sx={{
                    color: order.status === "ACCEPTED" ? "#2e7d32" : order.status === "REJECTED" ? "#d32f2f" : "#ed6c02",
                    fontWeight: 700
                  }}>
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.status === "PENDING" && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button 
                        size="small" variant="outlined" color="success" 
                        onClick={() => handleStatusUpdate(order, "ACCEPTED")}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="small" variant="outlined" color="error" 
                        onClick={() => handleStatusUpdate(order, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                  <IconButton color="error" onClick={() => handleDelete(order.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
}