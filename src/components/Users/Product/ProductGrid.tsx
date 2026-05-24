import React from 'react';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  
  // 🔥 DYNAMIC GROUP-BY-NAME LOGIC PIPELINE
  const getGroupedProducts = (rawProducts: any[]) => {
    if (!rawProducts || !rawProducts.length) return [];
    
    return rawProducts.reduce((acc: any[], current: any) => {
      const existingProduct = acc.find(
        (item) => item.name.toLowerCase().trim() === current.name.toLowerCase().trim()
      );

      if (existingProduct) {
        // COMBINE IMAGES: Saare variants ki photos merge karo
        existingProduct.images = Array.from(
          new Set([...existingProduct.images, ...current.images])
        );
        
        // 🚀 NEW: Saare variant IDs ko ek array mein store kar lo taaki Details page sabko read kar sake
        if (!existingProduct.allVariantIds) {
          existingProduct.allVariantIds = [existingProduct.id || existingProduct._id];
        }
        existingProduct.allVariantIds.push(current.id || current._id);

        if (current.price < existingProduct.price) {
          existingProduct.price = current.price;
        }
      } else {
        // Fresh card object clone with variant tracking array
        acc.push({ 
          ...current,
          allVariantIds: [current.id || current._id]
        });
      }
      return acc;
    }, []);
  };

  const uniqueGroupedProducts = getGroupedProducts(products);

  return (
    <Grid container spacing={{ xs: 2, md: 4 }}>
      {uniqueGroupedProducts.map((product) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id || product._id}>
          {/* 💥 Pure merged product details ke sath Card render hoga */}
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}