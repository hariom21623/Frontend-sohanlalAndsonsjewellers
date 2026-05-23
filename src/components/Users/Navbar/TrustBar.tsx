import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TrustBar() {
  // 🚀 AUTOMATIC DAY CHECKER ENGINE
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday...
  
  let shippingLimit = "2,000"; // Default limit

  // 🎲 Hafta ke dino ke hisab se pricing automatic badlegi
  if (today === 6 || today === 0) {
    shippingLimit = "1,500"; // Weekend (Saturday-Sunday) ko special offer
  } else if (today === 1 || today === 2) {
    shippingLimit = "2,500"; // Monday-Tuesday ko thoda extra incentive
  } else {
    shippingLimit = "2,000"; // Wednesday, Thursday, Friday ko normal limit
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: '#E5D5BC',   // Royal gold background
        color: '#4A0E17',     // Deep burgundy text
        textAlign: 'center', 
        py: 0.8,
        px: 2,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(74, 14, 23, 0.1)',
        boxSizing: 'border-box'
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          fontWeight: 700, 
          fontSize: { xs: '0.65rem', sm: '0.72rem' }, 
          fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
          display: 'inline-block'
        }}
      >
        Free Shipping on Orders Above ₹{shippingLimit} • 100% Certified Premium Selections
      </Typography>
    </Box>
  );
}