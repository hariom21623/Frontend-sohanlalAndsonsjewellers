import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Divider, Chip, CircularProgress, Button } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../contexts/AuthProvider';

export default function MyOrders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/order/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders);
      } catch (err) { console.error("Error:", err); }
      finally { setLoading(false); }
    };
    if (token) fetchOrders();
  }, [token]);

  return (
    <Container maxWidth="md" sx={{ py: 8, minHeight: '80vh', bgcolor: '#FDFBF7' }}>
      {/* Luxury Header Section */}
      <Box sx={{ mb: 6, borderBottom: '1px solid #E5D5BC', pb: 2 }}>
        <Button 
          startIcon={<ArrowBackIos sx={{ fontSize: '0.7rem !important' }} />} 
          onClick={() => navigate('/')} 
          sx={{ color: '#8E8370', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', mb: 1, p: 0 }}
        >
          CONTINUE SHOPPING
        </Button>
        <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', color: '#4A0E17', fontWeight: 700 }}>
          Order History
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: '#4A0E17' }} /></Box>
      ) : orders.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#8E8370', fontStyle: 'italic' }}>Your exquisite collection is currently empty.</Typography>
      ) : (
        orders.map((order: any) => (
          <Paper key={order.id} sx={{ mb: 4, p: 4, borderRadius: 0, border: '1px solid #E5D5BC', bgcolor: '#FFFFFF', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#4A0E17', letterSpacing: '0.05em' }}>
                ORDER #{order.id.slice(-6).toUpperCase()}
              </Typography>
              <Chip 
                label={order.status} 
                sx={{ 
                  bgcolor: order.status === 'ACCEPTED' ? '#EDE6DB' : '#F9F6F0', 
                  color: '#4A0E17',
                  borderRadius: 0,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase'
                }} 
              />
            </Box>
            
            <Divider sx={{ mb: 3, opacity: 0.5 }} />

            {/* Product Items */}
            {order.items && order.items.map((item: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 80, height: 80, mr: 3, border: '1px solid #E5D5BC', overflow: 'hidden' }}>
                  <img 
                    src={item.image || (item.images && item.images[0]) || ''} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontFamily: '"Playfair Display"', fontWeight: 600, color: '#4A0E17' }}>{item.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#8E8370', display: 'block' }}>Qty: {item.qty}</Typography>
                  <Typography variant="body2" sx={{ color: '#4A0E17', fontWeight: 700 }}>₹{Number(item.price).toLocaleString('en-IN')}</Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#8E8370', letterSpacing: '0.1em' }}>DATE: {new Date(order.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="h6" sx={{ color: '#4A0E17', fontWeight: 700 }}>TOTAL: ₹{order.totalAmount.toLocaleString('en-IN')}</Typography>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}