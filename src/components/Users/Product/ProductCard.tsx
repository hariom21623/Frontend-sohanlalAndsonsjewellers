import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../../../contexts/AuthProvider";
import { useCart } from "../../../contexts/CartProvider";

export default function ProductCard({ product }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [open, setOpen] = useState(false);

  const image =
  Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : "/placeholder.png";

  const goLogin = (path: string) => {
    setOpen(true);
    setTimeout(() => {
      navigate("/login", { state: { from: path } });
    }, 1500);
  };

  const handleView = () => {
    if (!token) return goLogin(`/product/${product.id}`);
    navigate(`/product/${product.id}`);
  };

  const handleAdd = () => {
    if (!token) return goLogin(location.pathname);

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image,
      sku: product.sku || "",
    });
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia component="img" height="180" image={image} />

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="subtitle1">{product.name}</Typography>
          <Typography variant="body2">
            {product.subCategory || product.category}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography variant="h6">
              ₹{product.price}
            </Typography>
          </Box>
        </CardContent>

        <CardActions>
          <Button onClick={handleView} startIcon={<VisibilityIcon />}>
            View
          </Button>

          <Button
            onClick={handleAdd}
            startIcon={<AddShoppingCartIcon />}
            disabled={product.stock <= 0}
            variant="contained"
          >
            {product.stock <= 0 ? "Out of stock" : "Add"}
          </Button>
        </CardActions>
      </Card>

      <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
        <Alert severity="warning" variant="filled">
          Please login first
        </Alert>
      </Snackbar>
    </>
  );
}