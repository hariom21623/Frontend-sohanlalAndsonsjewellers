import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, Divider, IconButton, Modal } from '@mui/material';
import { FavoriteBorder, ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material'; 
import MainNavbar from '../components/Users/Navbar/MainNavbar';
import UserFooter from '../components/Users/Footer/MainFooter';
import { getByIdPublic } from '../api/product';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  
  // LIGHTBOX MODAL STATE
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await getByIdPublic(id as string);
        setProduct(res.product || res);
      } catch (err) {
        console.error("Error loading product profile:", err);
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

  const handleOriginalPrevImage = (e: any) => {
    e.stopPropagation(); 
    navigatePrevImage();
  };

  const handleOriginalNextImage = (e: any) => {
    e.stopPropagation(); 
    navigateNextImage();
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

        {/* Master Row Flexbox */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 4, md: 6, lg: 8 },
            alignItems: 'flex-start' 
          }}
        >
          {/* Left Column: Image Media Panel */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box 
              onClick={() => setIsLightboxOpen(true)} 
              sx={{
                position: 'relative',
                width: '100%',
                // 🚀 FIXED: Dynamic fluid height handling scales natively without forcing horizontal limits
                maxHeight: { xs: '65vh', sm: '550px', md: '600px' },
                bgcolor: '#FFFFFF', 
                border: '1px solid rgba(74, 14, 23, 0.08)',
                overflow: 'hidden',
                cursor: 'zoom-in',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img 
                src={currentImage} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: 'auto', // 🚀 CRITICAL CHANGE: Auto-height ensures full wide visibility!
                  maxHeight: '600px',
                  objectFit: 'contain', // ✨ Stops left/right side clipping hamesha ke liye
                  display: 'block',
                  zIndex: 2
                }} 
              />

              {imageList.length > 1 && (
                <>
                  <IconButton
                    onClick={handleOriginalPrevImage}
                    sx={{
                      position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)',
                      bgcolor: 'rgba(253, 251, 247, 0.8)', color: '#4A0E17', borderRadius: 0,
                      p: { xs: 1, md: 1.5 }, '&:hover': { bgcolor: '#FDFBF7' }, zIndex: 5
                    }}
                  >
                    <ArrowBackIos sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, pl: '6px' }} />
                  </IconButton>

                  <IconButton
                    onClick={handleOriginalNextImage}
                    sx={{
                      position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)',
                      bgcolor: 'rgba(253, 251, 247, 0.8)', color: '#4A0E17', borderRadius: 0,
                      p: { xs: 1, md: 1.5 }, '&:hover': { bgcolor: '#FDFBF7' }, zIndex: 5
                    }}
                  >
                    <ArrowForwardIos sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Tanishq style thumbnails layout */}
            {imageList.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                {imageList.map((imgUrl: string, idx: number) => (
                  <Box
                    key={`detail-thumb-${idx}`}
                    onClick={() => setActiveImgIndex(idx)}
                    sx={{
                      width: 58,
                      height: 58,
                      border: idx === activeImgIndex ? '2px solid #4A0E17' : '1px solid rgba(0,0,0,0.08)',
                      p: 0.3,
                      cursor: 'pointer',
                      bgcolor: '#FFF',
                      opacity: idx === activeImgIndex ? 1 : 0.55,
                      transition: 'all 0.3s ease',
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <img src={imgUrl} alt="Thumbnail view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Right Column: Specifications Panel */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ pl: { md: 2, lg: 4 }, pt: { md: 1 } }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6E6557', fontWeight: 500, fontSize: '0.75rem' }}>
                {product.category} • Certified Collection
              </Typography>

              <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#4A0E17', mt: 1, mb: 1, fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                {product.name}
              </Typography>

              {product.sku && (
                <Typography variant="caption" sx={{ color: '#A0A0A0', letterSpacing: '0.05em', display: 'block', mb: 2 }}>
                  SKU Model: {product.sku}
                </Typography>
              )}

              <Typography variant="h4" sx={{ fontWeight: 500, color: '#1A1A1A', mb: 3, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </Typography>

              <Divider sx={{ borderColor: '#E5D5BC', mb: 3 }} />

              <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                {hasValidWeight && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6E6557', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Approx Weight
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4A0E17' }}>
                      {product.weight} Grams
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" sx={{ color: '#6E6557', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Metal Polish Base
                  </Typography>
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
                <Button variant="contained" fullWidth sx={{ bgcolor: '#4A0E17', color: '#FDFBF7', py: { xs: 1.5, md: 2 }, letterSpacing: '0.15em', fontWeight: 600, borderRadius: 0, fontSize: { xs: '0.8rem', md: '0.9rem' }, '&:hover': { bgcolor: '#2C050B' } }}>
                  ADD TO SHOPPING BAG
                </Button>
                <IconButton sx={{ border: '1px solid #E5D5BC', px: 2, color: '#4A0E17', borderRadius: 0 }}>
                  <FavoriteBorder />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Fullscreen Extended Lightbox Modal */}
      <Modal
        open={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(16px)', 
          bgcolor: 'rgba(15, 15, 15, 0.92)' 
        }}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            width: { xs: '95vw', md: '85vw' }, 
            height: { xs: '90vh', md: '92vh' }, 
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <IconButton
            onClick={() => setIsLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: { xs: 8, md: 16 },
              right: { xs: 8, md: 16 },
              color: '#FFFFFF',
              bgcolor: 'rgba(74, 14, 23, 0.85)', 
              zIndex: 999,
              p: 1.2,
              '&:hover': { bgcolor: '#4A0E17', color: '#E5D5BC' }
            }}
          >
            <Close sx={{ fontSize: { xs: '1.3rem', md: '1.8rem' } }} />
          </IconButton>

          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              flex: 1, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 2, md: 10 }
            }}
          >
            {imageList.length > 1 && (
              <IconButton
                onClick={navigatePrevImage}
                sx={{
                  position: 'absolute', left: { xs: 4, md: 40 }, top: '50%', transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderRadius: '50%',
                  p: { xs: 1.5, md: 2 }, border: '1px solid rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(74, 14, 23, 0.9)', color: '#E5D5BC' },
                  zIndex: 10
                }}
              >
                <ArrowBackIos sx={{ fontSize: { xs: '1rem', md: '1.4rem' }, pl: '6px' }} />
              </IconButton>
            )}

            <Box
              component="img"
              src={currentImage}
              alt="Fullscreen expanded view asset"
              sx={{
                maxWidth: '100%',
                maxHeight: { xs: '65vh', md: '75vh' },
                objectFit: 'contain',
                boxShadow: '0px 25px 60px rgba(0,0,0,0.95)',
                border: '1px solid rgba(259, 213, 188, 0.12)',
                bgcolor: '#FFF'
              }}
            />

            {imageList.length > 1 && (
              <IconButton
                onClick={navigateNextImage}
                sx={{
                  position: 'absolute', right: { xs: 4, md: 40 }, top: '50%', transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderRadius: '50%',
                  p: { xs: 1.5, md: 2 }, border: '1px solid rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(74, 14, 23, 0.9)', color: '#E5D5BC' },
                  zIndex: 10
                }}
              >
                <ArrowForwardIos sx={{ fontSize: { xs: '1rem', md: '1.4rem' } }} />
              </IconButton>
            )}
          </Box>

          {/* Modal Thumbnails Slider Strip */}
          {imageList.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.8, pb: { xs: 4, md: 2 }, pt: 2, justifyContent: 'center', width: '100%', zIndex: 105 }}>
              {imageList.map((imgUrl: string, idx: number) => (
                <Box
                  key={`modal-thumb-${idx}`}
                  onClick={() => setActiveImgIndex(idx)}
                  sx={{
                    width: { xs: 50, md: 62 },
                    height: { xs: 50, md: 62 },
                    border: idx === activeImgIndex ? '2px solid #E5D5BC' : '1px solid rgba(255,255,255,0.2)',
                    p: 0.4,
                    cursor: 'pointer',
                    bgcolor: '#FFFFFF',
                    opacity: idx === activeImgIndex ? 1 : 0.45,
                    transition: 'all 0.3s ease',
                    '&:hover': { opacity: 1, transform: 'scale(1.05)' }
                  }}
                >
                  <img src={imgUrl} alt="Modal thumbnail view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Modal>

      <UserFooter />
    </Box>
  );
}