import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../../../contexts/AuthProvider";
import { useCart } from "../../../contexts/CartProvider";

type Product = any;

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const image =
    (product.images && Array.isArray(product.images) && product.images[0]) ||
    "/placeholder.png";

  const handleView = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAdd = () => {
    if (!token) {
      // redirect to login / show modal
      navigate("/login");
      return;
    }
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
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flex: "1 1 auto" }}>
        <Typography variant="subtitle1" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.subCategory || product.category}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6">₹{product.price?.toFixed?.(2) ?? product.price}</Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" startIcon={<VisibilityIcon />} onClick={handleView}>
          View
        </Button>

        <Button
          size="small"
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAdd}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? "Out of stock" : "Add"}
        </Button>
      </CardActions>
    </Card>
  );
}
