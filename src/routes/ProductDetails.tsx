import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, Divider, IconButton, Modal, Snackbar, Alert } from '@mui/material';
import { FavoriteBorder, Favorite, ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';
import MainNavbar from '../components/Users/Navbar/MainNavbar';
import UserFooter from '../components/Users/Footer/MainFooter';
import { getByIdPublic, getAllPublic } from '../api/product'; // 🚀 INJECTED: getAllPublic for backup search
import { useCart } from '../contexts/CartProvider';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  // Dedicated stable state for keeping the numerical stock sequence
  const [verifiedStock, setVerifiedStock] = useState<number>(0);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedWishlist = localStorage.getItem("sls_wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // Short bypass hook allows inspect actions transparently during dev sessions

  const syncWishlistFromStorage = useCallback(() => {
    try {
      const savedWishlist = localStorage.getItem("sls_wishlist");
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("sls_wishlist_update", syncWishlistFromStorage);
    window.addEventListener("storage", syncWishlistFromStorage);
    return () => {
      window.removeEventListener("sls_wishlist_update", syncWishlistFromStorage);
      window.removeEventListener("storage", syncWishlistFromStorage);
    };
  }, [syncWishlistFromStorage]);

  useEffect(() => {
    if (!id) return;
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await getByIdPublic(id as string);
        const baseProduct = res.product || res;
        setProduct(baseProduct);

        // Try extracting stock natively from the response first
        let extractedRaw: any = undefined;
        if (res) {
          if (res.Stock !== undefined) extractedRaw = res.Stock;
          else if (res.stock !== undefined) extractedRaw = res.stock;
        }
        if (extractedRaw === undefined && baseProduct) {
          if (baseProduct.Stock !== undefined) extractedRaw = baseProduct.Stock;
          else if (baseProduct.stock !== undefined) extractedRaw = baseProduct.stock;
        }

        let parsedResult = parseInt(extractedRaw, 10);

        // 🚀 🔥 THE CRITICAL DEEP FALLBACK TRAP:
        // If single product API returns undefined/NaN, cross-reference data from full array catalog instantly!
        if (isNaN(parsedResult) || extractedRaw === undefined) {
          console.log("⚠️ Stock field missing in single product API. Launching background array catalog recovery check...");
          
          const fallbackRes = await getAllPublic({ q: "", category: "all" });
          const allProducts = fallbackRes.products || [];
          
          // Hunt down matching element row targets by exact dynamic ID matching parameters
          const matchedInCatalog = allProducts.find((p: any) => (p.id || p._id) === id);
          
          if (matchedInCatalog) {
            const catalogStock = matchedInCatalog.Stock !== undefined ? matchedInCatalog.Stock : matchedInCatalog.stock;
            parsedResult = parseInt(catalogStock, 10);
            console.log("🎯 Match found in fallback catalog arrays query! Caching real stock boundary:", parsedResult);
          }
        }

        setVerifiedStock(isNaN(parsedResult) ? 0 : parsedResult);

      } catch (err) {
        console.error("Error running advanced structural product loader session loop:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#FDFBF7', minHeight: '100vh' }}>
        <MainNavbar onSearch={() => { }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#4A0E17' }} />
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ bgcolor: '#FDFBF7', minHeight: '100vh' }}>
        <MainNavbar onSearch={() => { }} />
        <Container sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
            Exquisite Item Profile Not Found
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ borderColor: '#4A0E17', color: '#4A0E17' }}>
            Back To Showroom
          </Button>
        </Container>
      </Box>
    );
  }

  const imageList = Array.isArray(product.images) ? product.images : [];
  const currentImage = imageList[activeImgIndex] || 'https://via.placeholder.com/500x600?text=Premium+Jewellery';

  const navigatePrevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const navigateNextImage = () => {
    setActiveImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleOriginalPrevImage = (e: any) => { e.stopPropagation(); navigatePrevImage(); };
  const handleOriginalNextImage = (e: any) => { e.stopPropagation(); navigateNextImage(); };

  // Strict validation checker maps if count parameters outnumber zero limits
  const isAvailableInInventory = verifiedStock > 0; 

  const handleAddToBag = () => {
    if (!isAvailableInInventory) return;
    
    addToCart({
      productId: product.id || product._id,
      name: product.name,
      price: Number(product.price),
      qty: 1,
      image: currentImage,
      sku: product.sku || 'N/A',
      maxStock: verifiedStock 
    });

    setToastOpen(true);
  };

  const currentProductId = product.id || product._id;
  const isCurrentlyWishlisted = wishlist.includes(currentProductId);

  const handleToggleDetailsWishlist = () => {
    let updatedWishlist: string[];
    if (isCurrentlyWishlisted) {
      updatedWishlist = wishlist.filter(id => id !== currentProductId);
    } else {
      updatedWishlist = [...wishlist, currentProductId];
    }
    localStorage.setItem("sls_wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    window.dispatchEvent(new Event("sls_wishlist_update"));
  };

  const hasValidWeight = product.weight && String(product.weight).toLowerCase() !== 'n/a' && Number(product.weight) !== 0;

  return (
    <Box sx={{ bgcolor: '#FDFBF7', minHeight: '100vh' }}>
      <MainNavbar onSearch={() => { }} />

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Button
          startIcon={<ArrowBackIos sx={{ fontSize: '0.8rem !important' }} />}
          onClick={() => navigate(-1)}
          sx={{ color: '#6E6557', mb: { xs: 2, md: 4 }, letterSpacing: '0.1em', '&:hover': { bgcolor: 'transparent', color: '#4A0E17' } }}
        >
          Back to Collection
        </Button>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6, lg: 8 }, alignItems: 'flex-start' }}>
          
          {/* Left Column Image Media Grid */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              onClick={() => setIsLightboxOpen(true)}
              sx={{
                position: 'relative', width: '100%', maxHeight: { xs: '65vh', sm: '550px', md: '600px' },
                bgcolor: '#FFFFFF', border: '1px solid rgba(74, 14, 23, 0.08)', overflow: 'hidden',
                cursor: 'zoom-in', display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <img src={currentImage} alt={product.name} style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', display: 'block', zIndex: 2 }} />

              {imageList.length > 1 && (
                <>
                  <IconButton onClick={handleOriginalPrevImage} sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', bgcolor: 'rgba(253, 251, 247, 0.8)', color: '#4A0E17', borderRadius: 0, p: { xs: 1, md: 1.5 }, '&:hover': { bgcolor: '#FDFBF7' }, zIndex: 5 }}>
                    <ArrowBackIos sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, pl: '6px' }} />
                  </IconButton>
                  <IconButton onClick={handleOriginalNextImage} sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', bgcolor: 'rgba(253, 251, 247, 0.8)', color: '#4A0E17', borderRadius: 0, p: { xs: 1, md: 1.5 }, '&:hover': { bgcolor: '#FDFBF7' }, zIndex: 5 }}>
                    <ArrowForwardIos sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
                  </IconButton>
                </>
              )}
            </Box>

            {imageList.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                {imageList.map((imgUrl: string, idx: number) => (
                  <Box key={`detail-thumb-${imgUrl}`} onClick={() => setActiveImgIndex(idx)} sx={{ width: 58, height: 58, border: idx === activeImgIndex ? '2px solid #4A0E17' : '1px solid rgba(0,0,0,0.08)', p: 0.3, cursor: 'pointer', bgcolor: '#FFF', opacity: idx === activeImgIndex ? 1 : 0.55, transition: 'all 0.3s ease', '&:hover': { opacity: 1 } }}>
                    <img src={imgUrl} alt="Thumbnail view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Right Column Specifications Text Info Panels */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ pl: { md: 2, lg: 4 }, pt: { md: 1 } }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6E6557', fontWeight: 500, fontSize: '0.75rem' }}>
                {product.category} • Certified Collection
              </Typography>

              <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#4A0E17', mt: 1, mb: 1, fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                {product.name}
              </Typography>

              {product.sku && (
                <Typography variant="caption" sx={{ color: '#A0A0A0', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                  SKU Model: {product.sku}
                </Typography>
              )}

              {/* 🚀 REAL-TIME AUTOMATIC FALLBACK RESOLVED INDICATOR */}
              <Typography variant="caption" sx={{ color: isAvailableInInventory ? '#2E7D32' : '#D32F2F', fontWeight: 700, display: 'block', mb: 2, letterSpacing: '0.02em', fontSize: '0.8rem' }}>
                {isAvailableInInventory ? `● Live Availability: ${verifiedStock} Units Left` : '● Out of Stock'}
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 500, color: '#1A1A1A', mb: 3, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </Typography>

              <Divider sx={{ borderColor: '#E5D5BC', mb: 3 }} />

              <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                {hasValidWeight && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6E6557', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approx Weight</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4A0E17' }}>{product.weight} Grams</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" sx={{ color: '#6E6557', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metal Polish Base</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#4A0E17' }}>
                    {product.category === "Gold" ? "Pure Gold Base" : product.category === "Silver" ? "Fine Sterling Silver" : "Premium 1-Gram Gold Polish"}
                  </Typography>
                </Box>
              </Box>

              {product.description && (
                <Typography variant="body2" sx={{ color: '#444444', lineHeight: 1.7, mb: 4, letterSpacing: '0.02em', fontSize: '0.9rem' }}>
                  {product.description}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleAddToBag}
                  disabled={!isAvailableInInventory} // Unlocks dynamically only if catalog background verification succeeds!
                  sx={{ 
                    bgcolor: '#4A0E17', color: '#FDFBF7', py: { xs: 1.5, md: 2 }, letterSpacing: '0.15em', fontWeight: 600, borderRadius: 0, fontSize: { xs: '0.8rem', md: '0.9rem' }, 
                    '&:hover': { bgcolor: '#2C050B' },
                    '&:disabled': { bgcolor: '#A0A0A0 !important', color: '#FFF !important', cursor: 'not-allowed' }
                  }}
                >
                  {isAvailableInInventory ? "ADD TO SHOPPING BAG" : "OUT OF STOCK"}
                </Button>
                
                <IconButton 
                  onClick={handleToggleDetailsWishlist}
                  sx={{ 
                    border: '1px solid #E5D5BC', px: 2, color: '#4A0E17', borderRadius: 0,
                    bgcolor: isCurrentlyWishlisted ? 'rgba(74, 14, 23, 0.05)' : 'transparent', transition: 'all 0.3s ease'
                  }}
                >
                  {isCurrentlyWishlisted ? <Favorite sx={{ color: '#4A0E17' }} /> : <FavoriteBorder />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Lightbox Modal */}
      <Modal open={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(16px)', bgcolor: 'rgba(15, 15, 15, 0.92)' }}>
        <Box sx={{ position: 'relative', width: { xs: '95vw', md: '85vw' }, height: { xs: '90vh', md: '92vh' }, outline: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton onClick={() => setIsLightboxOpen(false)} sx={{ position: 'absolute', top: { xs: 8, md: 16 }, right: { xs: 8, md: 16 }, color: '#FFFFFF', bgcolor: 'rgba(74, 14, 23, 0.85)', zIndex: 999, p: 1.2, '&:hover': { bgcolor: '#4A0E17', color: '#E5D5BC' } }}>
            <Close sx={{ fontSize: { xs: '1.3rem', md: '1.8rem' } }} />
          </IconButton>
          <Box sx={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 10 } }}>
            {imageList.length > 1 && (
              <IconButton onClick={navigatePrevImage} sx={{ position: 'absolute', left: { xs: 4, md: 40 }, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderRadius: '50%', p: { xs: 1.5, md: 2 }, border: '1px solid rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(74, 14, 23, 0.9)', color: '#E5D5BC' }, zIndex: 10 }}>
                <ArrowBackIos sx={{ fontSize: { xs: '1rem', md: '1.4rem' }, pl: '6px' }} />
              </IconButton>
            )}
            <Box component="img" src={currentImage} alt="Fullscreen expanded asset" sx={{ maxWidth: '100%', maxHeight: { xs: '65vh', md: '75vh' }, objectFit: 'contain', boxShadow: '0px 25px 60px rgba(0,0,0,0.95)', border: '1px solid rgba(259, 213, 188, 0.12)', bgcolor: '#FFF' }} />
            {imageList.length > 1 && (
              <IconButton onClick={navigateNextImage} sx={{ position: 'absolute', right: { xs: 4, md: 40 }, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderRadius: '50%', p: { xs: 1.5, md: 2 }, border: '1px solid rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(74, 14, 23, 0.9)', color: '#E5D5BC' }, zIndex: 10 }}>
                <ArrowForwardIos sx={{ fontSize: { xs: '1rem', md: '1.4rem' } }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Modal>

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ bgcolor: '#4A0E17', color: '#FDFBF7', borderRadius: 0, fontFamily: '"Montserrat", sans-serif', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', boxShadow: '0px 8px 25px rgba(0,0,0,0.2)', px: 3, py: 1, '& .MuiAlert-icon': { color: '#E5D5BC', fontSize: '1.1rem' } }}>
          ✨ Item successfully added to your bag!
        </Alert>
      </Snackbar>

      <UserFooter />
    </Box>
  );
}