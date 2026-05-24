import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Card, CardMedia, CardContent, IconButton, Button } from "@mui/material";
import { DeleteOutline, ShoppingBagOutlined, ArrowBackIos } from "@mui/icons-material"; // 🚀 INJECTED: ArrowBackIos Icon
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/Users/Navbar/MainNavbar";
import UserFooter from "../components/Users/Footer/MainFooter";
import { getAllPublic } from "../api/product";
import { useCart } from "../contexts/CartProvider"; 
import { optimizeImage } from "../utils/imageOptimizer";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const loadWishlistProducts = async () => {
    try {
      const savedWishlistRaw = localStorage.getItem("sls_wishlist");
      const wishlistIds: string[] = savedWishlistRaw ? JSON.parse(savedWishlistRaw) : [];

      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        return;
      }

      const res = await getAllPublic({ q: "", category: "all" });
      const allProducts = res.products || [];

      const filtered = allProducts.filter((p: any) => 
        wishlistIds.includes(p.id || p._id)
      );

      setWishlistItems(filtered);
    } catch (err) {
      console.error("Error running reactive data layout compilation mapping:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlistProducts();
  }, []);

  const handleRemoveItem = (itemId: string) => {
    const savedWishlistRaw = localStorage.getItem("sls_wishlist");
    let wishlistIds: string[] = savedWishlistRaw ? JSON.parse(savedWishlistRaw) : [];
    
    wishlistIds = wishlistIds.filter(id => id !== itemId);
    localStorage.setItem("sls_wishlist", JSON.stringify(wishlistIds));
    
    setWishlistItems(prev => prev.filter(item => (item.id || item._id) !== itemId));
    window.dispatchEvent(new Event("sls_wishlist_update"));
  };

  const handleMoveToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation(); 
    
    addToCart({
      productId: item.id || item._id,
      name: item.name,
      price: Number(item.price),
      qty: 1, 
      image: item.images && item.images[0] ? item.images[0] : "https://via.placeholder.com/400x500",
      sku: item.sku || "N/A",
      // 🚀 FIXED: Passes physical max inventory bounds safely. Fallback to 1 if backend says 0
      maxStock: item.stock && Number(item.stock) > 0 ? Number(item.stock) : 1
    });

    handleRemoveItem(item.id || item._id);
  };

  return (
    <Box sx={{ bgcolor: "#FDFBF7", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <MainNavbar onSearch={() => {}} />

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* 🚀 🔥 INJECTED: Premium Luxury Back Button matching the layout brand guidelines */}
        <Button
          startIcon={<ArrowBackIos sx={{ fontSize: '0.65rem !important' }} />}
          onClick={() => navigate(-1)} // Takes user back exactly to their previous coordinate location smoothly
          sx={{ 
            color: '#6E6557', 
            mb: { xs: 2, md: 3 }, 
            fontSize: '0.72rem', 
            letterSpacing: '0.1em', 
            alignSelf: 'flex-start', 
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 500,
            '&:hover': { bgcolor: 'transparent', color: '#4A0E17' } 
          }}
        >
          Back to Showroom
        </Button>

        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', color: "#4A0E17", fontWeight: 600, mb: 1 }}>
            Your Favorites
          </Typography>
          <Typography variant="body2" sx={{ color: "#6E6557", letterSpacing: "0.04em", fontSize: "0.85rem" }}>
            Review or shift items directly into your luxury shopping bag grid stack.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Typography variant="body2" sx={{ color: "#6E6557", fontStyle: "italic" }}>Loading curated showroom layouts...</Typography>
          </Box>
        ) : wishlistItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, border: "1px dashed rgba(229, 213, 188, 0.6)", bgcolor: "#FFF" }}>
            <Typography variant="body2" sx={{ color: "#6E6557", fontStyle: "italic", mb: 3 }}>
              Your wishlist container is currently empty.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: "#4A0E17", color: "#FFF", borderRadius: 0, px: 4, py: 1.4, fontWeight: 600, letterSpacing: "0.1em", "&:hover": { bgcolor: "#2C050B" } }}>
              DISCOVER JEWELLERY
            </Button>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: "grid", 
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, 
              gap: { xs: 2.5, md: 3.5 }
            }}
          >
            {wishlistItems.map((item) => {
              const primaryImg = item.images && item.images[0] ? item.images[0] : "https://via.placeholder.com/400x500";
              const itemId = item.id || item._id;

              return (
                <Card 
                  key={itemId}
                  onClick={() => navigate(`/product/${itemId}`)}
                  sx={{ 
                    borderRadius: 0, 
                    boxShadow: "none", 
                    bgcolor: "#FFF", 
                    cursor: "pointer", 
                    position: "relative", 
                    p: 2, 
                    border: "1px solid rgba(229, 213, 188, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "translateY(-4px)" }
                  }}
                >
                  <Box>
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); handleRemoveItem(itemId); }}
                      sx={{ position: "absolute", top: 12, right: 12, zIndex: 12, bgcolor: "rgba(253, 251, 247, 0.9)", color: "#A0A0A0", "&:hover": { color: "#4A0E17", bgcolor: "#FFF" } }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>

                    <Box sx={{ position: "relative", pt: "95%", overflow: "hidden", mb: 1 }}>
                      <CardMedia component="img" image={optimizeImage(primaryImg)} alt={item.name} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }} />
                    </Box>

                    <CardContent sx={{ textAlign: "center", pt: 1, pb: "0px !important", px: 0 }}>
                      <Typography variant="body2" sx={{ color: '#8E8370', fontSize: '0.62rem', letterSpacing: '0.04em', mb: 0.2, fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.subCategory || "EXCLUSIVE COLLECTION"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: "#1A1A1A", fontSize: "0.92rem", lineHeight: 1.2 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#A0A0A0', display: 'block', mt: 0.2, fontSize: '0.65rem' }}>
                        Ref: {item.sku || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#4A0E17", mt: 0.8, fontSize: "0.95rem" }}>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </Typography>
                    </CardContent>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => handleMoveToCart(e, item)}
                    startIcon={<ShoppingBagOutlined sx={{ fontSize: "1rem !important" }} />}
                    sx={{
                      mt: 2.5,
                      bgcolor: "#4A0E17",
                      color: "#FDFBF7",
                      borderRadius: 0,
                      py: 1.2,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#2C050B", boxShadow: "none" }
                    }}
                  >
                    ADD TO BAG
                  </Button>

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