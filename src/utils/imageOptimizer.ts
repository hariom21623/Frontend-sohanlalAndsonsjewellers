// src/utils/imageOptimizer.ts

/**
 * Cloudinary URLs ko high-quality aur super-fast dynamic WebP asset mein optimize karta hai.
 * Agar image Cloudinary ki nahi hai, toh fallback default link return karega.
 */
export const optimizeImage = (url: string): string => {
  if (!url) return 'https://via.placeholder.com/600x600?text=Sohanlal+Jewellers';

  // Check agar image Cloudinary CDN grid par hosted hai
  if (url.includes('res.cloudinary.com')) {
    // Quality compression (q_auto:best) aur format shift (f_auto) rules inject karein
    return url.replace('/upload/', '/upload/q_auto:best,f_auto,w_1000/');
  }

  return url;
};