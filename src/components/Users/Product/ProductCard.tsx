import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { optimizeImage } from '../../../utils/imageOptimizer'; 

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { name, images, category } = product; 

  // 🚀 SMART MODEL IMAGE EXTRACTOR: Target image index 1 or 2 if available for contextual colored backgrounds
  const activeRawImage = images && images.length > 1 
    ? (images[1].includes('placeholder') && images[2] ? images[2] : images[1]) // Tries index 1 first, then index 2
    : (images && images[0] ? images[0] : 'https://via.placeholder.com/400x500?text=Premium+Jewellery');

  return (
    <Card 
      onClick={() => navigate(`/collection/${encodeURIComponent(name.trim())}`)} 
      sx={{ 
        position: 'relative', 
        border: 'none', 
        bgcolor: 'transparent',
        boxShadow: 'none',
        cursor: 'pointer'
      }}
    >
      {/* Luxury Portrait Image Frame — 🚀 FIXED: REMOVED ALL BORDERS FOR SEAMLESS TANISHQ FIT */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: '125%', bgcolor: 'transparent' }}>
        <CardMedia
          component="img"
          image={optimizeImage(activeRawImage)} 
          alt={name}
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            objectFit: 'cover' // Makes sure model images scale natively without squash cuts
          }}
        />
      </Box>

      {/* Details Display Workspace */}
      <CardContent sx={{ px: 0, py: 1.8, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            textTransform: 'uppercase', color: '#8E8370', letterSpacing: '0.22em', 
            fontSize: '0.62rem', fontWeight: 700, display: 'block', mb: 0.8 
          }}
        >
          {category ? category.split(' ')[0] : 'Luxury'}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: '"Playfair Display", serif', fontWeight: 500, 
            color: '#4A0E17 !important', fontSize: '1.08rem', letterSpacing: '0.03em'
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}