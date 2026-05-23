import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { optimizeImage } from '../../../utils/imageOptimizer'; // 🚀 Cloudinary Engine Link

interface ProductCardProps {
  product: {
    id: string; 
    _id?: string;
    name: string;
    price: number;
    images: string[];
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const productId = product.id || product._id; 
  const { name, price, images, category } = product;
  
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback checker dynamic logic
  const activeRawImage = isHovered && images && images[1] 
    ? images[1] 
    : (images && images[0] ? images[0] : 'https://via.placeholder.com/400x500?text=Premium+Jewellery');

  // 🔥 HIGH-SPEED CDN OPTIMIZATION INJECTED HERE Cleanly
  const optimizedImageURL = optimizeImage(activeRawImage);

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${productId}`)} 
      sx={{ 
        position: 'relative', 
        border: 'none', 
        bgcolor: 'transparent',
        boxShadow: 'none',
        cursor: 'pointer', 
        '&:hover .bag-button': { opacity: 1, transform: 'translateY(0)' } 
      }}
    >
      {/* 🚀 Wishlist Button: Synced with Dark Theme Palette */}
      <IconButton 
        onClick={(e) => {
          e.stopPropagation(); 
          setIsWishlisted(!isWishlisted);
        }}
        sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          zIndex: 2, 
          bgcolor: 'rgba(10,10,10,0.7)', 
          color: isWishlisted ? '#E5D5BC' : '#FFFFFF',
          border: '1px solid rgba(229, 213, 188, 0.2)',
          '&:hover': { bgcolor: '#141414', color: '#E5D5BC' } 
        }}
      >
        {isWishlisted ? <Favorite /> : <FavoriteBorder />}
      </IconButton>

      {/* Luxury Portrait Image Frame */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: '125%', bgcolor: '#141414' }}>
        <CardMedia
          component="img"
          image={optimizedImageURL} // 🔥 Direct Optimized Fast Engine Link
          alt={name}
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
          }}
        />
        
        {/* Quick Add Overlay System (Tailored to match Luxe Template Image) */}
        <Box 
          className="bag-button"
          sx={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, p: 1.5, opacity: 0, 
            transform: 'translateY(8px)', transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            background: 'linear-gradient(to top, rgba(10,10,10,0.8), rgba(0,0,0,0))'
          }}
        >
          <Button 
            fullWidth 
            variant="contained"
            onClick={(e) => {
              e.stopPropagation(); 
              alert("Exquisite piece added to bag!");
            }}
            sx={{ 
              bgcolor: '#E5D5BC', 
              color: '#0A0A0A', 
              borderRadius: 0, 
              boxShadow: 'none', 
              letterSpacing: '0.15em', 
              fontSize: '0.7rem',
              fontWeight: 600,
              '&:hover': { bgcolor: '#FFFFFF', color: '#0A0A0A', boxShadow: 'none' }, 
              py: 1.2 
            }}
          >
            ADD TO BAG
          </Button>
        </Box>
      </Box>

      {/* Details Display Workspace (Dark Regal Palette Refined) */}
      <CardContent sx={{ px: 0, py: 1.8, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#B3B3B3', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 500 }}>
          {category ? category.split(' ')[0] : 'Luxury'}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: '"Playfair Display", serif', 
            fontWeight: 500, 
            my: 0.4, 
            color: '#FFFFFF',
            fontSize: '1.02rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            px: 1
          }}
        >
          {name}
        </Typography>
        
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#E5D5BC', letterSpacing: '0.02em', fontSize: '0.95rem' }}>
          {price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Price on Request'}
        </Typography>
      </CardContent>
    </Card>
  );
}