import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Button, Card, CardMedia, CardContent, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { ArrowBackIos, FavoriteBorder, Favorite } from '@mui/icons-material'; 
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

  // 🚀 ANTI-FLICKER FIX 1: Instant storage checking immediately on baseline definition state layer
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedWishlist = localStorage.getItem("sls_wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // 🚀 ANTI-FLICKER FIX 2: Wrapped with useCallback to lock functional reference pointer in memory
  const handleGlobalWishlistUpdate = useCallback(() => {
    try {
      const savedWishlist = localStorage.getItem("sls_wishlist");
      const currentIds = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      // Strict equality array checks to avoid infinite hooks lifecycle re-renders loops
      setWishlist((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(currentIds)) return prev;
        return currentIds;
      });
    } catch {
      setWishlist([]);
    }
  }, []);

  // Sync state events smoothly
  useEffect(() => {
    window.addEventListener("sls_wishlist_update", handleGlobalWishlistUpdate);
    window.addEventListener("storage", handleGlobalWishlistUpdate);
    
    return () => {
      window.removeEventListener("sls_wishlist_update", handleGlobalWishlistUpdate);
      window.removeEventListener("storage", handleGlobalWishlistUpdate);
    };
  }, [handleGlobalWishlistUpdate]);

  useEffect(() => {
    if (!name) return;

    async function fetchCollectionVariants() {
      // 🚀 ANTI-FLICKER FIX 3: Dynamic background silent fetch check logic
      // Agar pehle se items data array render state me pade hain, toh heavy spinner screens block mat dikhao!
      if (allVariants.length === 0) {
        setLoading(true);
      }
      
      try {
        const res = await getAllPublic({ q: "", category: "all" });
        const allProducts = res.products || [];
        const decodedTargetName = decodeURIComponent(name || "").toLowerCase().trim();

        const matchedItems = allProducts.filter(
          (p: any) => p.name.toLowerCase().trim() === decodedTargetName
        );
        
        setAllVariants(matchedItems);

        // Maintain sub-category filtration states accurately
        if (selectedSubCategory === "all") {
          setFilteredVariants(matchedItems);
        } else {
          setFilteredVariants(
            matchedItems.filter(
              (item: any) => item.subCategory && item.subCategory.toLowerCase().trim() === selectedSubCategory.toLowerCase().trim()
            )
          );
        }

        const subCategoriesFound = new Set<string>();
        matchedItems.forEach((item: any) => {
          if (item.subCategory && String(item.subCategory).trim() !== "") {
            subCategoriesFound.add(String(item.subCategory).trim());
          }
        });

        setAvailableSubCategories(Array.from(subCategoriesFound));

      } catch (err) {
        console.error("Error running anti-flicker background processing loops:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollectionVariants();
  }, [name]); // 🚀 REMOVED outer state parameters dependencies to stop recursive re-renders flashes

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

  const handleToggleWishlist = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation(); 
    
    let updatedWishlist: string[];
    if (wishlist.includes(itemId)) {
      updatedWishlist = wishlist.filter((id) => id !== itemId);
    } else {
      updatedWishlist = [...wishlist, itemId];
    }

    localStorage.setItem("sls_wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);

    // Synchronize rest of components globally instantly
    window.dispatchEvent(new Event("sls_wishlist_update"));
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

        {/* Title Content */}
        <Box sx={{ mb: { xs: 1, md: 1.8 } }}>
          <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', color: '#4A0E17', fontWeight: 600, mb: 0, textTransform: 'capitalize', fontSize: { xs: '1.2rem', md: '1.6rem' } }}>
            {decodeURIComponent(name || '')} Dynamic Range
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E6557', letterSpacing: '0.01em', fontSize: '0.68rem', display: 'block' }}>
            Explore available premium certified variations.
          </Typography>
        </Box>

        {/* Filters Selectors Strip */}
        {!loading && availableSubCategories.length > 0 && (
          <Box sx={{ mb: { xs: 2.5, md: 3.5 }, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ letterSpacing: '0.05em', color: '#6E6557', fontWeight: 600, fontSize: '0.62rem', textTransform: 'uppercase' }}>
              Filter:
            </Typography>
            
            <ToggleButtonGroup value={selectedSubCategory} exclusive onChange={handleSubCategoryChange} size="small" sx={{ '& .MuiToggleButton-root': { borderRadius: 0, borderColor: '#E5D5BC', color: '#6E6557', fontFamily: '"Montserrat", sans-serif', fontSize: '0.62rem', px: 1.8, py: 0.3, fontWeight: 500, '&.Mui-selected': { bgcolor: '#4A0E17', color: '#FDFBF7', fontWeight: 600 } } }}>
              <ToggleButton value="all">VIEW ALL</ToggleButton>
              {availableSubCategories.map((subName) => (
                <ToggleButton value={subName.toLowerCase().trim()} key={subName}>
                  {subName.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Render Viewport Container Panels Matrix */}
        {loading && allVariants.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#4A0E17' }} />
          </Box>
        ) : filteredVariants.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center', border: '1px dashed #E5D5BC' }}>
            <Typography variant="body2" sx={{ color: '#6E6557', fontStyle: 'italic', fontSize: '0.78rem' }}>
              No items matching this selection available.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: { xs: 2, md: 2.5 }, justifyContent: 'flex-start', alignItems: 'stretch', width: '100%' }}>
            {filteredVariants.map((item: any) => {
              const primaryImg = item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400x500';
              const itemId = item.id || item._id;
              const isWishlisted = wishlist.includes(itemId);

              return (
                <Card 
                  key={`variant-card-${itemId}`} // Sharp dynamic composite keys to stop flashing updates references
                  onClick={() => navigate(`/product/${itemId}`)}
                  sx={{ borderRadius: 0, boxShadow: 'none', bgcolor: 'transparent', cursor: 'pointer', border: 'none', p: 0.5, width: '100%', position: 'relative', transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)', '&:hover': { transform: 'translateY(-4px)' } }}
                >
                  {/* Overlay Heart Actions Layout Button */}
                  <IconButton
                    onClick={(e) => handleToggleWishlist(e, itemId)}
                    sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, bgcolor: 'rgba(253, 251, 247, 0.85)', backdropFilter: 'blur(4px)', color: isWishlisted ? '#4A0E17' : '#6E6557', p: 0.8, borderRadius: '50%', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#FDFBF7', color: '#4A0E17' } }}
                  >
                    {isWishlisted ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                  </IconButton>

                  <Box sx={{ position: 'relative', pt: '85%', overflow: 'hidden', bgcolor: 'transparent', border: 'none' }}>
                    <CardMedia component="img" image={optimizeImage(primaryImg)} alt={item.name} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', border: 'none', outline: 'none' }} />
                  </Box>

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