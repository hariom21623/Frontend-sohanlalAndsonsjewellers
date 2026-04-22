import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/product";
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
        const res = await getProductById(id);
        setProduct(res.product || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!product) return <Container>Loading...</Container>;

  const images = Array.isArray(product.images) ? product.images : [];

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
      {/* MAIN FLEX WRAPPER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* LEFT IMAGE SECTION */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "420px",
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              <Box sx={{ width: "100%", height: 420, background: "#eee" }} />
            )}

            {/* Image thumbnails */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              {images.slice(0, 4).map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={"thumb-" + idx}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>

        {/* RIGHT INFO SECTION */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {product.name}
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 1 }} color="text.secondary">
            SKU: {product.sku}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <Typography variant="h6" color="primary">
              ₹ {product.price.toFixed(2)}
            </Typography>

            <Chip
              label={product.category}
              sx={{ ml: 2, fontWeight: 600 }}
              size="small"
            />
            {product.subCategory && (
              <Chip label={product.subCategory} size="small" sx={{ ml: 1 }} />
            )}
          </Box>

          <Typography sx={{ mt: 3 }}>{product.description}</Typography>

          {/* BUTTONS */}
          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button variant="contained" size="large" onClick={handleAdd}>
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
