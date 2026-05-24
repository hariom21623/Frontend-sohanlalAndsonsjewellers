import React from 'react';
import { Grid } from '@mui/material'; // Safe cross-version verification import
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    // Uses structural uniform layout gutters for crisp margins alignment matrix
    <Grid container spacing={{ xs: 2, md: 4 }}>
      {products.map((product) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id || product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}