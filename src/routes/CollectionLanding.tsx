import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Button, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ArrowBackIos, FavoriteBorder, Favorite } from '@mui/icons-material';
import MainNavbar from '../components/Users/Navbar/MainNavbar';
import UserFooter from '../components/Users/Footer/MainFooter';
import { getAllPublic } from '../api/product';
import { optimizeImage } from '../utils/imageOptimizer';

export default function CollectionLanding() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filteredVariants, setFilteredVariants] = useState<any[]>([]);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedWishlist = localStorage.getItem("sls_wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch { return []; }
  });

  const handleGlobalWishlistUpdate = useCallback(() => {
    try {
      const savedWishlist = localStorage.getItem("sls_wishlist");
      const currentIds = savedWishlist ? JSON.parse(savedWishlist) : [];
      setWishlist(currentIds);
    } catch { setWishlist([]); }
  }, []);

  useEffect(() => {
    window.addEventListener("sls_wishlist_update", handleGlobalWishlistUpdate);
    return () => window.removeEventListener("sls_wishlist_update", handleGlobalWishlistUpdate);
  }, [handleGlobalWishlistUpdate]);

  useEffect(() => {
    if (!name) return;

    async function fetchCollectionVariants() {
      setLoading(true);
      try {
        const res = await getAllPublic({ q: "", category: "all" });
        const allProducts = res.products || [];
        const decodedTargetName = decodeURIComponent(name || "").toLowerCase().trim();

        const matchedItems = allProducts.filter((p: any) => {
          const productName = p.name ? p.name.toLowerCase().trim() : "";
          return productName.includes(decodedTargetName) || decodedTargetName.includes(productName);
        });

        // ✅ Bas wahi state set karo jo use ho rahi hai
        setFilteredVariants(matchedItems);
      } catch (err) { console.error("Error:", err); } 
      finally { setLoading(false); }
    }
    fetchCollectionVariants();
  }, [name]);

  const handleToggleWishlist = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    let updated = wishlist.includes(itemId) ? wishlist.filter(id => id !== itemId) : [...wishlist, itemId];
    localStorage.setItem("sls_wishlist", JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event("sls_wishlist_update"));
  };

  return (
    <Box sx={{ bgcolor: '#FDFBF7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MainNavbar onSearch={() => {}} />
      <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 3 }, flex: 1 }}>
        <Button startIcon={<ArrowBackIos sx={{ fontSize: '0.62rem !important' }} />} onClick={() => navigate('/')} sx={{ color: '#6E6557', mb: 1, fontSize: '0.7rem' }}>BACK TO HOME</Button>
        
        <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', color: '#4A0E17', fontWeight: 600, textTransform: 'capitalize' }}>
          {decodeURIComponent(name || '')} Range
        </Typography>

        {loading ? <CircularProgress sx={{ color: '#4A0E17', mt: 5 }} /> : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5, mt: 3 }}>
            {filteredVariants.map((item: any) => {
              const itemId = (item.id || item._id || "").toString();
              const stock = Number(item.stock || 0);
              const isOutOfStock = stock <= 0;
              const isWishlisted = wishlist.includes(itemId);

              return (
                <Card 
                  key={itemId}
                  onClick={() => !isOutOfStock && navigate(`/product/${itemId}`)}
                  sx={{ 
                    borderRadius: 0, boxShadow: 'none', bgcolor: 'transparent', cursor: isOutOfStock ? 'default' : 'pointer',
                    opacity: isOutOfStock ? 0.6 : 1, filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                    transition: '0.3s', '&:hover': { transform: isOutOfStock ? 'none' : 'translateY(-4px)' }
                  }}
                >
                  <IconButton onClick={(e) => handleToggleWishlist(e, itemId)} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, bgcolor: 'rgba(255,255,255,0.8)' }}>
                    {isWishlisted ? <Favorite sx={{ color: '#4A0E17' }} /> : <FavoriteBorder />}
                  </IconButton>
                  
                  <Box sx={{ pt: '85%', position: 'relative' }}>
                    <CardMedia component="img" image={optimizeImage(item.images?.[0])} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Box>

                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#8E8370' }}>{item.subCategory?.toUpperCase()}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: '"Playfair Display"', fontWeight: 600 }}>{item.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#4A0E17', fontWeight: 700 }}>₹{Number(item.price).toLocaleString('en-IN')}</Typography>
                    {isOutOfStock && <Typography variant="caption" sx={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</Typography>}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
      <UserFooter />
    </Box>
  );
}