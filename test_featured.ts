import { SAMPLE_PRODUCTS } from './src/data/sampleProducts.js';

const feat = SAMPLE_PRODUCTS.filter(p => p.isFeatured);
console.log("Featured count:", feat.length);
