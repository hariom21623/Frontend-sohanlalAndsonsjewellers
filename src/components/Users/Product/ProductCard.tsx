import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // 🔥 Added

interface ProductCardProps {
  product: {
    id: string; // Ensure checking matching key parameters
    _id?: string;
    name: string;
    price: number;
    images: string[];
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const productId = product.id || product._id; // Fallback check for safe tracking ID
  const { name, price, images, category } = product;
  
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentImage = isHovered && images && images[1] 
    ? images[1] 
    : (images && images[0] ? images[0] : 'https://via.placeholder.com/400x500?text=Premium+Jewellery');

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${productId}`)} // 🔥 Routes straight to product profile details view
      sx={{ 
        position: 'relative', 
        border: 'none', 
        bgcolor: 'transparent',
        boxShadow: 'none',
        cursor: 'pointer', // High luxury product interaction clue
        '&:hover .bag-button': { opacity: 1, transform: 'translateY(0)' } 
      }}
    >
      {/* Wishlist Icon */}
      <IconButton 
        onClick={(e) => {
          e.stopPropagation(); // Stops routing from triggering when clicking heart icon!
          setIsWishlisted(!isWishlisted);
        }}
        sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#FFFFFF' } }}
      >
        {isWishlisted ? <Favorite sx={{ color: '#4A0E17' }} /> : <FavoriteBorder />}
      </IconButton>

      {/* Luxury Portrait Image Aspect Ratio */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: '125%', bgcolor: '#F9F6F0' }}>
        <CardMedia
          component="img"
          image={currentImage}
          alt={name}
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)'
          }}
        />
        
        {/* Quick Add Overlay */}
        <Box 
          className="bag-button"
          sx={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, opacity: 0, 
            transform: 'translateY(8px)', transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0))'
          }}
        >
          <Button 
            fullWidth variant="contained"
            onClick={(e) => {
              e.stopPropagation(); // Prevent going to page when adding straight to cart box
              alert("Added to bag!");
            }}
            sx={{ 
              bgcolor: '#FFFFFF', color: '#1A1A1A', borderRadius: 0, boxShadow: 'none', letterSpacing: '0.1em', fontSize: '0.75rem',
              '&:hover': { bgcolor: '#4A0E17', color: '#FFFFFF', boxShadow: 'none' }, py: 1.2 
            }}
          >
            ADD TO BAG
          </Button>
        </Box>
      </Box>

      {/* Details Area */}
      <CardContent sx={{ px: 0, py: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#999999', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
          {category}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, my: 0.5, color: '#1A1A1A' }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A0E17' }}>
          ₹{price.toLocaleString('en-IN')}
        </Typography>
      </CardContent>
    </Card>
  );
}