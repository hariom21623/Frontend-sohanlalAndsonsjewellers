import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Card, CardMedia, CardContent, IconButton, Button } from "@mui/material";
import { DeleteOutline, ArrowBackIos } from "@mui/icons-material";
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
    setLoading(true);
    try {
      const saved = localStorage.getItem("sls_wishlist");
      const ids: string[] = saved ? JSON.parse(saved) : [];
      const res = await getAllPublic({ q: "", category: "all" });
      const allProducts = Array.isArray(res) ? res : (res.products || []);
      const filtered = allProducts.filter((p: any) => ids.includes((p.id || p._id || "").toString()));
      setWishlistItems(filtered);
    } catch (err) { console.error("Error:", err); } finally { setLoading(false); }
  };

  useEffect(() => { loadWishlistProducts(); }, []);

  const handleRemoveItem = (itemId: string) => {
    const saved = localStorage.getItem("sls_wishlist");
    let ids: string[] = saved ? JSON.parse(saved) : [];
    ids = ids.filter(id => id !== itemId);
    localStorage.setItem("sls_wishlist", JSON.stringify(ids));
    setWishlistItems(prev => prev.filter(item => (item.id || item._id || "").toString() !== itemId));
    window.dispatchEvent(new Event("sls_wishlist_update"));
  };

  return (
    <Box sx={{ bgcolor: "#FDFBF7", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <MainNavbar onSearch={() => { }} />
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Button startIcon={<ArrowBackIos sx={{ fontSize: '0.7rem' }} />} onClick={() => navigate(-1)} sx={{ color: '#6E6557', mb: 3, fontSize: '0.7rem', fontWeight: 600 }}>BACK TO SHOWROOM</Button>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 5, fontFamily: '"Playfair Display", serif', color: "#4A0E17", fontWeight: 600 }}>Your Favorites</Typography>

        {loading ? <Box sx={{ textAlign: "center" }}><Typography>Loading...</Typography></Box>
          : wishlistItems.length === 0 ? <Box sx={{ textAlign: "center" }}><Typography>Wishlist is empty.</Typography></Box>
            : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
                {wishlistItems.map((item) => {
                  const itemId = (item.id || item._id || "").toString();
                  const stock = Number(item.stock || item.Stock || 0);
                  const isOutOfStock = stock <= 0;

                  return (
                    <Card key={itemId} sx={{
                      borderRadius: 0, boxShadow: "none", bgcolor: "#FFF",
                      border: "1px solid rgba(229, 213, 188, 0.35)",
                      display: "flex", flexDirection: "column", height: "100%"
                    }}>
                      <IconButton onClick={() => handleRemoveItem(itemId)} sx={{ alignSelf: 'flex-end', color: "#4A0E17", p: 0.5, m: 0.5 }}><DeleteOutline /></IconButton>

                      <Box onClick={() => !isOutOfStock && navigate(`/product/${itemId}`)} sx={{ cursor: isOutOfStock ? 'default' : 'pointer', px: 2, flex: 1 }}>
                        <CardMedia component="img" image={optimizeImage(item.images?.[0])} sx={{ height: 160, objectFit: 'contain' }} />
                        <CardContent sx={{ textAlign: "center", py: 1 }}>
                          <Typography variant="caption" sx={{ color: '#8E8370', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>{item.subCategory}</Typography>
                          <Typography variant="body2" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: "#1A1A1A", my: 0.2 }}>{item.name}</Typography>
                          <Typography variant="h6" sx={{ color: "#4A0E17", fontWeight: 700, fontSize: '0.9rem' }}>₹{Number(item.price).toLocaleString("en-IN")}</Typography>
                          {isOutOfStock && <Typography variant="caption" sx={{ color: 'red', fontWeight: 'bold', display: 'block', mt: 0.2 }}>OUT OF STOCK</Typography>}
                        </CardContent>
                      </Box>

                      <Button
                        variant="contained" fullWidth disabled={isOutOfStock}
                        onClick={() => {
                          // 🚀 FIXED: Image ko explicit bhejo
                          addToCart({
                            ...item,
                            productId: itemId,
                            qty: 1,
                            maxStock: stock,
                            image: item.images?.[0] || "https://via.placeholder.com/400x500" // Image ensure ki
                          });
                          handleRemoveItem(itemId);
                        }}
                        sx={{ mt: 2.5, bgcolor: isOutOfStock ? "#E0E0E0" : "#4A0E17", color: isOutOfStock ? "#666" : "#FFF", borderRadius: 0, py: 1.2, fontSize: "0.75rem", fontWeight: 600, marginTop: 'auto' }}
                      >
                        {isOutOfStock ? "OUT OF STOCK" : "ADD TO BAG"}
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