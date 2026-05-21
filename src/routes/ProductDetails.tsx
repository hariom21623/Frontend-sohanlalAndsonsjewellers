import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, CircularProgress, Divider, IconButton } from '@mui/material';
import { FavoriteBorder, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MainNavbar from '../components/Users/Navbar/MainNavbar';
import UserFooter from '../components/Users/Footer/MainFooter';
import { getByIdPublic } from '../api/product';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

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

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const hasValidWeight = product.weight && String(product.weight).toLowerCase() !== 'n/a' && Number(product.weight) !== 0;

  return (
    <Box sx={{ bgcolor: '#FDFBF7', minHeight: '100vh' }}>
      <MainNavbar onSearch={() => { }} />

      {/* Container spacing adjusts fluidly on mobile (xs) vs desktop (md) */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>

        <Button
          startIcon={<ArrowBackIos sx={{ fontSize: '0.8rem !important' }} />}
          onClick={() => navigate(-1)}
          sx={{ color: '#6E6557', mb: { xs: 2, md: 4 }, letterSpacing: '0.1em', '&:hover': { bgcolor: 'transparent', color: '#4A0E17' } }}
        >
          Back to Collection
        </Button>

        {/* Responsive Grid layout system splits cleanly across breakpoints */}
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>

          {/* Left Column: Image Media Spotlight Frame */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              // 🔥 FIXED: Added responsive maximum height boundary safeguards to prevent blowing up on large desktop setups
              maxHeight: { xs: '70vh', sm: '500px', md: '550px' },
              aspectRatio: '1 / 1.15', // Perfectly balanced classical jewelry showcase portrait ratio
              bgcolor: '#FFFFFF',
              border: '1px solid #E5D5BC',
              overflow: 'hidden',
              mx: 'auto'
            }}>
              <img
                src={currentImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Responsive Minimalist Navigation Arrows */}
              {imageList.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)',
                      bgcolor: 'rgba(253, 251, 247, 0.8)', color: '#4A0E17', borderRadius: 0,
                      p: { xs: 1, md: 1.5 },
                      '&:hover': { bgcolor: '#FDFBF7' }
                    }}
                  >
                    <ArrowBackIos sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, pl: '6px' }} />
                  </IconButton>

                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)',
                      bgcolor: 'rgba(253, 251, 247, 0.8)', color: '#4A0E17', borderRadius: 0,
                      p: { xs: 1, md: 1.5 },
                      '&:hover': { bgcolor: '#FDFBF7' }
                    }}
                  >
                    <ArrowForwardIos sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Grid>

          {/* Right Column: Premium Copy Specifications Text Panel */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ pl: { md: 2, lg: 4 } }}> {/* Adds premium whitespace gutter spacing separation on desktop views only */}

              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6E6557', fontWeight: 500, fontSize: '0.75rem' }}>
                {product.category} • Certified Collection
              </Typography>

              <Typography variant="h3" sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: '#4A0E17',
                mt: 1,
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                lineHeight: 1.2
              }}>
                {product.name}
              </Typography>

              {product.sku && (
                <Typography variant="caption" sx={{ color: '#A0A0A0', letterSpacing: '0.05em', display: 'block', mb: 2 }}>
                  SKU: {product.sku}
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
                {/* Right Column Specifications Section */}
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

                    {/* 🔥 DYNAMIC RULE: Checks product category safely */}
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4A0E17' }}>
                      {product.category === "Gold"
                        ? "Pure Gold Base"
                        : product.category === "Silver"
                          ? "Fine Sterling Silver"
                          : "Premium 1-Gram Gold Polish"
                      }
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {product.description && (
                <Typography variant="body2" sx={{ color: '#444444', lineHeight: 1.7, mb: 4, letterSpacing: '0.02em', fontSize: '0.9rem' }}>
                  {product.description}
                </Typography>
              )}

              {/* Action Buttons with Dynamic Responsive View Adjustments */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#4A0E17',
                    color: '#FDFBF7',
                    py: { xs: 1.5, md: 2 },
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    borderRadius: 0,
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    '&:hover': { bgcolor: '#2C050B' }
                  }}
                >
                  ADD TO SHOPPING BAG
                </Button>
                <IconButton sx={{ border: '1px solid #E5D5BC', px: 2, color: '#4A0E17', borderRadius: 0 }}>
                  <FavoriteBorder />
                </IconButton>
              </Box>

            </Box>
          </Grid>
        </Grid>
      </Container>

      <UserFooter />
    </Box>
  );
}