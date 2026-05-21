import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

interface CategoryStripProps {
  products: any[]; 
  onSelect: (category: string) => void;
}

export default function CategoryStrip({ products, onSelect }: CategoryStripProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!products || products.length === 0) return;

    // Database ke live products se unique categories nikalyein
    const uniqueCats = Array.from(
      new Set(products.map((p: any) => p.category).filter(Boolean))
    ) as string[];

    setDynamicCategories(uniqueCats);
  }, [products]);

  // Agar database khali hai toh strip render mat karo
  if (dynamicCategories.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: { xs: 'flex-start', sm: 'center' }, 
      gap: { xs: 3, md: 5 }, 
      my: 0, 
      py: 1.5, 
      px: { xs: 2, sm: 4 },
      bgcolor: '#FDFBF7', 
      borderBottom: '1px solid #E5D5BC',
      overflowX: 'auto', 
      whiteSpace: 'nowrap',
      WebkitOverflowScrolling: 'touch',
      '&::-webkit-scrollbar': { display: 'none' }, 
    }}>
      
      {/* 🔥 RULE 1: 'View All' sirf tabhi dikhega jab 2 ya usse zyada categories available hongi */}
      {dynamicCategories.length >= 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            onClick={() => { setSelectedCategory("all"); onSelect("all"); }}
            sx={{
              color: selectedCategory === "all" ? '#4A0E17' : '#6E6557',
              fontWeight: selectedCategory === "all" ? 600 : 400,
              fontSize: { xs: '0.8rem', md: '0.85rem' },
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              '&:hover': { bgcolor: 'transparent', color: '#4A0E17' }
            }}
          >
            View All
          </Button>
          <Box sx={{ width: selectedCategory === "all" ? '16px' : '0px', height: '2px', bgcolor: '#4A0E17', transition: 'width 0.2s ease', mt: 0.5 }} />
        </Box>
      )}

      {/* 2. Dynamic Categories mapping layer */}
      {dynamicCategories.map((category) => {
        // Agar sirf 1 hi category hai, toh automatically wahi select ho jaye fallback condition ke liye
        const isSelected = dynamicCategories.length === 1 ? true : selectedCategory === category;
        
        return (
          <Box key={category} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              onClick={() => { 
                if (dynamicCategories.length > 1) {
                  setSelectedCategory(category); 
                  onSelect(category); 
                }
              }}
              sx={{
                color: isSelected ? '#4A0E17' : '#6E6557',
                fontWeight: isSelected ? 600 : 400,
                fontSize: { xs: '0.8rem', md: '0.85rem' },
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                // Agar single category hai toh click disabled kar dein taaki unneeded API re-fetch na ho
                cursor: dynamicCategories.length === 1 ? 'default' : 'pointer',
                '&:hover': { bgcolor: 'transparent', color: '#4A0E17' }
              }}
            >
              {category}
            </Button>
            <Box sx={{ width: isSelected ? '16px' : '0px', height: '2px', bgcolor: '#4A0E17', transition: 'width 0.2s ease', mt: 0.5 }} />
          </Box>
        );
      })}
    </Box>
  );
}