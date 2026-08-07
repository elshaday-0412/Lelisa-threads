import { Product, ProductReview } from '../types/index.js';

/**
 * Ensures that product rating and reviewCount are ALWAYS mathematically accurate
 * and directly computed from the product's actual reviews array.
 */
export function normalizeProduct(product: Product): Product {
  const reviews: ProductReview[] = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount = reviews.length;
  let rating = 0;
  
  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    rating = Number((totalRating / reviewCount).toFixed(1));
  }

  const { originalPrice, ...rest } = product;

  return {
    ...rest,
    reviews,
    reviewCount,
    rating,
    originalPrice: undefined
  };
}
