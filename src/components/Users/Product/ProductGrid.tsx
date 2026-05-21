import React from 'react';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <Grid container spacing={{ xs: 2, md: 4 }}>
      {products.map((product) => (
        // Changed "item xs={6} sm={4} md={3}" to modern "size={{ xs: 6, sm: 4, md: 3 }}"
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}