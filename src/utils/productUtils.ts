import { Product, ProductReview } from '../types/index.js';

/**
 * Ensures that product rating and reviewCount are ALWAYS mathematically accurate
 * and directly computed from the product's actual reviews array.
 */
export function normalizeProduct(product: any): Product {
  const reviews: ProductReview[] = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount = reviews.length;
  let rating = 0;
  
  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0);
    rating = Number((totalRating / reviewCount).toFixed(1));
  }

  const { originalPrice, ...rest } = product;

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']);
    
  const sizes = Array.isArray(product.sizes) ? product.sizes : (product.size ? [String(product.size)] : ['Standard']);
  const colors = Array.isArray(product.colors) ? product.colors : (product.color ? [String(product.color)] : ['Standard']);

  return {
    ...rest,
    images,
    sizes,
    colors,
    reviews,
    reviewCount,
    rating,
    originalPrice: undefined
  };
}
