import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Button, Card, CardMedia, CardContent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import MainNavbar from '../components/Users/Navbar/MainNavbar';
import UserFooter from '../components/Users/Footer/MainFooter';
import { getAllPublic } from '../api/product';
import { optimizeImage } from '../utils/imageOptimizer';

export default function CollectionLanding() {
  const { name } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [allVariants, setAllVariants] = useState<any[]>([]); 
  const [filteredVariants, setFilteredVariants] = useState<any[]>([]); 
  
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  useEffect(() => {
    if (!name) return;

    async function fetchCollectionVariants() {
      setLoading(true);
      try {
        const res = await getAllPublic({ q: "", category: "all" });
        const allProducts = res.products || [];
        const decodedTargetName = decodeURIComponent(name || "").toLowerCase().trim();

        const matchedItems = allProducts.filter(
          (p: any) => p.name.toLowerCase().trim() === decodedTargetName
        );
        
        setAllVariants(matchedItems);
        setFilteredVariants(matchedItems);

        const subCategoriesFound = new Set<string>();
        matchedItems.forEach((item: any) => {
          if (item.subCategory && String(item.subCategory).trim() !== "") {
            subCategoriesFound.add(String(item.subCategory).trim());
          }
        });

        setAvailableSubCategories(Array.from(subCategoriesFound));
        setSelectedSubCategory("all"); 

        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        }, 30);

      } catch (err) {
        console.error("Error loading collection variants:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollectionVariants();
  }, [name]);

  const handleSubCategoryChange = (event: React.MouseEvent<HTMLElement>, newSubCategory: string | null) => {
    if (newSubCategory !== null) {
      setSelectedSubCategory(newSubCategory);
      if (newSubCategory === "all") {
        setFilteredVariants(allVariants);
      } else {
        const filtered = allVariants.filter(
          (item: any) => item.subCategory && item.subCategory.toLowerCase().trim() === newSubCategory.toLowerCase().trim()
        );
        setFilteredVariants(filtered);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#FDFBF7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MainNavbar onSearch={() => {}} />

      <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Button
          startIcon={<ArrowBackIos sx={{ fontSize: '0.62rem !important' }} />}
          onClick={() => navigate('/')}
          sx={{ color: '#6E6557', mb: { xs: 0.5, md: 1 }, fontSize: '0.7rem', letterSpacing: '0.08em', alignSelf: 'flex-start', '&:hover': { bgcolor: 'transparent', color: '#4A0E17' } }}
        >
          Back to Home
        </Button>

        {/* Header Content Info Block */}
        <Box sx={{ mb: { xs: 1, md: 1.8 } }}>
          <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', color: '#4A0E17', fontWeight: 600, mb: 0, textTransform: 'capitalize', fontSize: { xs: '1.2rem', md: '1.6rem' } }}>
            {decodeURIComponent(name || '')} Dynamic Range
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E6557', letterSpacing: '0.01em', fontSize: '0.68rem', display: 'block' }}>
            Explore available premium certified variations.
          </Typography>
        </Box>

        {/* Dynamic Filters Selector Strip */}
        {!loading && availableSubCategories.length > 0 && (
          <Box sx={{ mb: { xs: 2.5, md: 3.5 }, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ letterSpacing: '0.05em', color: '#6E6557', fontWeight: 600, fontSize: '0.62rem', textTransform: 'uppercase' }}>
              Filter:
            </Typography>
            
            <ToggleButtonGroup
              value={selectedSubCategory}
              exclusive
              onChange={handleSubCategoryChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 0,
                  borderColor: '#E5D5BC',
                  color: '#6E6557',
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: '0.62rem',
                  px: 1.8,
                  py: 0.3,
                  fontWeight: 500,
                  '&.Mui-selected': {
                    bgcolor: '#4A0E17',
                    color: '#FDFBF7',
                    fontWeight: 600
                  }
                }
              }}
            >
              <ToggleButton value="all">VIEW ALL</ToggleButton>
              {availableSubCategories.map((subName) => (
                <ToggleButton value={subName.toLowerCase().trim()} key={subName}>
                  {subName.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#4A0E17' }} />
          </Box>
        ) : filteredVariants.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center', border: '1px dashed #E5D5BC' }}>
            <Typography variant="body2" sx={{ color: '#6E6557', fontStyle: 'italic', fontSize: '0.78rem' }}>
              No items matching this selection available.
            </Typography>
          </Box>
        ) : (
          /* 🚀 🔥 FIXED 4-COLUMN PLATINUM GRID Blueprints Matrix */
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',          
                sm: '1fr 1fr',      
                md: '1fr 1fr 1fr 1fr' // ✨ STRICTLY FORCES 4 CARDS PER ROW DISPLAY
              },
              gap: { xs: 2, md: 2.5 }, // Compact standard grid spacing parameters
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              width: '100%'
            }}
          >
            {filteredVariants.map((item: any) => {
              const primaryImg = item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400x500';
              return (
                <Card 
                  key={item.id || item._id}
                  onClick={() => navigate(`/product/${item.id || item._id}`)}
                  sx={{ 
                    borderRadius: 0, 
                    boxShadow: 'none', 
                    bgcolor: 'transparent', // ✨ Blends seamlessly into website canvas background
                    cursor: 'pointer',
                    border: 'none', // 🚀 TERMINATED INNER DOUBLE CARDBOARD BOX BORDERS
                    p: 0.5, 
                    width: '100%',
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  {/* Aspect Framing Layer with Border Reset */}
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      pt: '85%', // Compact responsive bounding ratio box
                      overflow: 'hidden', 
                      bgcolor: 'transparent', // 🚀 REMOVED GRAY BACKDROP TO KILL DOUBLE BORDERS
                      border: 'none'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={optimizeImage(primaryImg)}
                      alt={item.name}
                      sx={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                        objectFit: 'contain', // Keeps structural ring frames sharp
                        border: 'none', // 🚀 Ensures image canvas itself carries zero overlapping lines
                        outline: 'none'
                      }}
                    />
                  </Box>

                  {/* Compact Description Blocks Layer Row Mapping */}
                  <CardContent sx={{ textAlign: 'center', pt: 1, pb: '0px !important', px: 0, bgcolor: 'transparent' }}>
                    <Typography variant="body2" sx={{ color: '#8E8370', fontSize: '0.62rem', letterSpacing: '0.04em', mb: 0, fontWeight: 700 }}>
                      {item.subCategory ? String(item.subCategory).toUpperCase() : 'EXCLUSIVE'}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#1A1A1A', fontSize: '0.88rem', mb: 0, lineHeight: 1.1 }}>
                      {item.name}
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: '#A0A0A0', display: 'block', mb: 0, fontSize: '0.65rem' }}>
                      Ref: {item.sku}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#4A0E17', fontSize: '0.85rem', mt: 0.2 }}>
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </Typography>
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