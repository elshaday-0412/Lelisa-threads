const fs = require('fs');

let content = fs.readFileSync('src/types/index.ts', 'utf8');

const oldCategories = `export type CategoryName =
  | 'Habesha Kemis'
  | "Men's Traditional Wear"
  | "Children's Wear"
  | 'Wedding Collection'
  | 'Jewelry'
  | 'Scarves'
  | 'Shoes'
  | 'Bags';`;

const newCategories = `export type CategoryName =
  | 'Habesha Kemis'
  | "Men's Traditional Wear"
  | "Children's Wear"
  | 'Wedding Collection'
  | 'Jewelry'
  | 'Scarves'
  | 'Shoes'
  | 'Bags'
  | 'T-Shirts'
  | 'Sweaters'
  | 'Other Traditional';`;

content = content.replace(oldCategories, newCategories);
fs.writeFileSync('src/types/index.ts', content);
console.log("Success Types");
