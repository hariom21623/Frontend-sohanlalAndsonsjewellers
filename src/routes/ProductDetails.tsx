import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getByIdPublic } from "../api/product"; // ✅ FIXED
import { useAuth } from "../contexts/AuthProvider";
import { useCart } from "../contexts/CartProvider";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await getByIdPublic(id!); // ✅ FIXED
        setProduct(res.product);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return <Container sx={{ mt: 6 }}>Product not found</Container>;
  }

  let images: string[] = [];

  if (Array.isArray(product.images)) {
    images = product.images;
  } else if (typeof product.images === "string") {
    try {
      images = JSON.parse(product.images);
    } catch {
      images = [product.images];
    }
  }

  const handleAdd = () => {
    if (!token) return navigate("/login");

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: images[0] || "/placeholder.png",
      sku: product.sku,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <img
              src={images[0] || "/placeholder.png"}
              alt={product.name}
              style={{
                width: "100%",
                height: "420px",
                objectFit: "cover",
              }}
            />
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">{product.name}</Typography>
          <Typography sx={{ mt: 1 }}>SKU: {product.sku}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            ₹ {product.price}
          </Typography>

          <Typography sx={{ mt: 3 }}>
            {product.description || "No description"}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" onClick={handleAdd}>
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}