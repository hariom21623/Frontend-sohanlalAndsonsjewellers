import { useCallback, useEffect, useState } from "react";
import MainNavbar from "../components/Users/Navbar/MainNavbar";
import HomeBanner from "../components/Users/Banner/HomeBanner";
import CategoryStrip from "../components/Users/Categories/CategoryStrip";
import FeaturedCollections from "../components/Users/Collections/FeaturedCollections";
import UserFooter from "../components/Users/Footer/MainFooter";
import ProductGrid from "../components/Users/Product/ProductGrid";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { getAllPublic } from "../api/product";
import CartDrawer from "../components/Users/Cart/CartDrawer";

export default function UserHome() {
  // const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [initialProducts, setInitialProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: "", category: "all" });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await getAllPublic({ ...filters, signal });
        if (!signal.aborted) {
          setProducts(res.products || []);
          if (filters.category === "all" && filters.q === "") {
            setInitialProducts(res.products || []);
          }
        }
      } catch (err: any) {
        if (err.name === "CanceledError" || err.message === "canceled") return;
        console.error("Fetch failure:", err);
        setProducts([]);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchProducts();
    return () => { controller.abort(); };
  }, [filters]);

  const handleSearch = useCallback((q: string) => {
    setFilters((prev) => (prev.q === q ? prev : { ...prev, q }));
  }, []);

  const handleCategory = useCallback((cat: string) => {
    setFilters((prev) => (prev.category === cat ? prev : { ...prev, category: cat, q: "" }));
  }, []);

  return (
    <Box sx={{ bgcolor: "#FDFBF7", minHeight: "100vh" }}>
      <MainNavbar onSearch={handleSearch} />
      <CategoryStrip products={initialProducts} onSelect={handleCategory} />
      <HomeBanner category={filters.category} />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: "#4A0E17" }} /></Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, border: "1px dashed #E5D5BC", bgcolor: "#F9F6F0", px: 2 }}>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', color: "#6E6557", fontStyle: "italic", fontSize: "1.1rem" }}>
              No exquisite pieces found matching this collection selection.
            </Typography>
          </Box>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
      <FeaturedCollections />
      <UserFooter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
}