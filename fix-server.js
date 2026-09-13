import fs from 'fs';
let c = fs.readFileSync('server.ts', 'utf8');
c = c.replace(
  "import { SAMPLE_PRODUCTS, Product } from './src/data/sampleProducts.js';",
  "import { SAMPLE_PRODUCTS } from './src/data/sampleProducts.js';\nimport { Product } from './src/types/index.js';"
);
fs.writeFileSync('server.ts', c);
