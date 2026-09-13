import fs from 'fs';
let c = fs.readFileSync('src/data/sampleProducts.ts', 'utf8');
c = c.replace(/export interface ProductReview \{[\s\S]*?\}/, '');
c = c.replace(/export interface Product \{[\s\S]*?\}/, '');
c = "import { Product, ProductReview } from '../types/index.js';\n" + c;
fs.writeFileSync('src/data/sampleProducts.ts', c);
