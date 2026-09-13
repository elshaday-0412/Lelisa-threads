import { Product, ProductReview } from '../types/index.js';
// 50+ Realistic Ethiopian Traditional Clothing Products representing diverse Ethiopian cultures
// Categories: Habesha Kemis, Men's Traditional Wear, Children's Wear, Wedding Collection, Jewelry, Scarves, Shoes, Bags
// Regions: Amhara, Tigray, Oromo, Gurage, Harari, Sidama, Wolayta, Afar, National Heritage

import { normalizeProduct } from '../utils/productUtils.js';





const RAW_SAMPLE_PRODUCTS: Product[] = [];

export const SAMPLE_PRODUCTS: Product[] = RAW_SAMPLE_PRODUCTS.map(normalizeProduct);

export const REGIONS_LIST: Product['region'][] = [
  'Amhara',
  'Tigray',
  'Oromo',
  'Gurage',
  'Harari',
  'Sidama',
  'Wolayta',
  'Afar',
  'National Heritage'
];

export const CATEGORIES_LIST: Product['category'][] = [
  'Habesha Kemis',
  'T-Shirts',
  'Bags',
  'Sweaters'
];

export const USD_EXCHANGE_RATE = 135; // 1 USD approx 135 ETB

export function formatPrice(priceEtb: number, currency: 'ETB' | 'USD' = 'ETB'): string {
  if (currency === 'USD') {
    const usd = (priceEtb / USD_EXCHANGE_RATE).toFixed(2);
    return `$${usd} USD`;
  }
  return `${priceEtb.toLocaleString()} ETB`;
}
