import { useEffect, useState, useCallback } from "react";
import TanishqNavbar from "../components/Users/Navbar/MainNavbar";
import CategoryStrip from "../components/Users/Categories/FeatureCategories";
import FeaturedCollections from "../components/Users/Collections/FeaturedCollections";
import TrendingSlider from "../components/Users/Trending/TrendingSlider";
import UserFooter from "../components/Users/Footer/MainFooter";
import ProductFilters from "../components/Users/Product/ProductFilters";
import ProductGrid from "../components/Users/Product/ProductGrid";
import { Container, Box, CircularProgress } from "@mui/material";
import { getAllPublic } from "../api/product";
import CartDrawer from "../components/Users/Cart/CartDrawer";

export default function UserHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: "", category: "all" });
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ FIX: useCallback
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllPublic(filters);
      setProducts(res.products);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ अब warning नहीं आएगी
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <>
      <TanishqNavbar />
      <CategoryStrip />

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <ProductFilters
          onFilter={(vals) =>
            setFilters({
              q: vals.q ?? "",
              category: vals.category ?? "all",
            })
          }
          initial={filters}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>

      <FeaturedCollections />
      <TrendingSlider />
      <UserFooter />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}