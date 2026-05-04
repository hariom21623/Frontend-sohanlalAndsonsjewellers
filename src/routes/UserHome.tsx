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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    category: "all",
  });

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await getAllPublic(filters);
        if (active) setProducts(res.products || []);
      } catch (err) {
        console.error(err);
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, [filters]);

  const handleSearch = useCallback((q: string) => {
    setFilters((prev) => (prev.q === q ? prev : { ...prev, q }));
  }, []);

  const handleCategory = useCallback((cat: string) => {
    setFilters((prev) => (prev.category === cat ? prev : { ...prev, category: cat }));
  }, []);

  return (
    <>
      <MainNavbar onSearch={handleSearch} />

      <CategoryStrip onSelect={handleCategory} />

      {/* 🔥 Banner */}
      <HomeBanner category={filters.category} />

      {/* 🔥 Products displayed horizontally */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography>No Products Available</Typography>
          </Box>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>

      <FeaturedCollections />
      <UserFooter />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}