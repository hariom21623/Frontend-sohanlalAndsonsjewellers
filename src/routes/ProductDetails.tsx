import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ArrowBack,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { getByIdPublic } from "../api/product";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await getByIdPublic(id);
      const data = res.product;

      setProduct(data);

      let imgs: string[] = [];

      if (Array.isArray(data.images)) imgs = data.images;
      else if (typeof data.images === "string") {
        try {
          imgs = JSON.parse(data.images);
        } catch {
          imgs = [data.images];
        }
      }

      setImages(imgs);
    })();
  }, [id]);

  const next = () => {
    if (current < images.length - 1) setCurrent(current + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const formatCategory = (cat: string) => {
    if (cat === "1Gram Gold Polished Jewellery") return "1 Gram Gold";
    return cat;
  };

  if (!product) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      
      {/* 🔥 BACK BUTTON */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper sx={{ p: 2, textAlign: "center", position: "relative" }}>

        {/* LEFT */}
        {images.length > 1 && (
          <IconButton
            onClick={prev}
            disabled={current === 0}
            sx={{ position: "absolute", top: "50%", left: 10 }}
          >
            <ArrowBackIos />
          </IconButton>
        )}

        {/* IMAGE */}
        <Box
          sx={{
            height: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={images[current] || "/placeholder.png"}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* RIGHT */}
        {images.length > 1 && (
          <IconButton
            onClick={next}
            disabled={current === images.length - 1}
            sx={{ position: "absolute", top: "50%", right: 10 }}
          >
            <ArrowForwardIos />
          </IconButton>
        )}
      </Paper>

      {/* INFO */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        {product.name}
      </Typography>

      <Chip
  label={formatCategory(product.category)}
  size="small"
  sx={{
    mt: 1,
    maxWidth: "100%",
    whiteSpace: "normal",      // ✅ wrap allow
    height: "auto",
    "& .MuiChip-label": {
      display: "block",
      whiteSpace: "normal",
      lineHeight: 1.2,
      px: 1,
      py: 0.5,
      textAlign: "center",
    },
  }}
/>

      {product.subCategory && (
        <Typography variant="body2" color="text.secondary">
          {product.subCategory}
        </Typography>
      )}

      <Typography variant="h6" sx={{ mt: 1 }}>
        ₹ {product.price}
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }}>
        Add to Cart
      </Button>
    </Container>
  );
}