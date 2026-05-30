import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getMyNotifications } from '../api/orderService'; // ✅ Yahan se import karo

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8, minHeight: '80vh', bgcolor: '#FDFBF7' }}>
      <Box sx={{ mb: 6, borderBottom: '1px solid #E5D5BC', pb: 2 }}>
        <Button 
          startIcon={<ArrowBackIos sx={{ fontSize: '0.7rem' }} />} 
          onClick={() => navigate('/')} 
          sx={{ color: '#8E8370', fontSize: '0.7rem', mb: 1, p: 0 }}
        >
          BACK TO HOME
        </Button>
        <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', color: '#4A0E17', fontWeight: 700 }}>
          Notifications
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: '#4A0E17' }} /></Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Box sx={{ fontSize: '3rem', mb: 2 }}>✨</Box>
          <Typography variant="h5" sx={{ color: '#4A0E17', fontWeight: 600 }}>All caught up!</Typography>
          <Typography sx={{ color: '#8E8370', mt: 1 }}>There are no new notifications for you.</Typography>
        </Box>
      ) : (
        <List>
          {notifications.map((notif: any) => (
            <ListItem key={notif.id} sx={{ borderBottom: '1px solid #E5D5BC', py: 2 }}>
              <ListItemText 
                primary={notif.title} 
                secondary={notif.message}
                primaryTypographyProps={{ sx: { fontWeight: 600, color: '#4A0E17' } }}
                secondaryTypographyProps={{ sx: { color: '#8E8370' } }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}