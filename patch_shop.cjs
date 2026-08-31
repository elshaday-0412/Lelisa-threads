const fs = require('fs');

let content = fs.readFileSync('src/pages/Shop.tsx', 'utf8');

const oldCategories = `  const categories: Array<CategoryName | 'All'> = [
    'All',
    'Habesha Kemis',
    "Men's Traditional Wear",
    'Wedding Collection',
    "Children's Wear",
    'Jewelry',
    'Scarves',
    'Shoes',
    'Bags'
  ];`;

const newCategories = `  const categories: Array<string> = [
    'All',
    'Habesha Kemis',
    'T-Shirts',
    "Children's Wear",
    'Sweaters',
    'Bags',
    'Scarves',
    'Other Traditional'
  ];`;

content = content.replace(oldCategories, newCategories);
// also replace Array<CategoryName | 'All'> in case of type mismatches

fs.writeFileSync('src/pages/Shop.tsx', content);
console.log("Success Shop");
