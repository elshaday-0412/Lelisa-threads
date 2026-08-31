const fs = require('fs');
let content = fs.readFileSync('src/services/externalInventoryService.ts', 'utf8');

const applyFiltersLogic = `
const applyFiltersAndSort = (list: Product[], params?: ExternalInventoryParams) => {
  let filtered = list;

  if (params?.category && params.category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === String(params.category).toLowerCase());
  }
  if (params?.gender && params.gender !== 'All') {
    filtered = filtered.filter(p => p.gender === params.gender);
  }
  if (params?.region && params.region !== 'All') {
    filtered = filtered.filter(p => p.region.toLowerCase() === String(params.region).toLowerCase());
  }
  if (params?.search) {
    const q = String(params.search).toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }
  if (params?.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= Number(params.minPrice));
  }
  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
  }
  if (params?.featured) {
    filtered = filtered.filter(p => p.isFeatured);
  }
  if (params?.bestseller) {
    filtered = filtered.filter(p => p.isBestSeller);
  }
  if (params?.newarrival) {
    filtered = filtered.filter(p => p.isNewArrival);
  }
  if (params?.inStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Sorting
  if (params?.sort) {
    if (params.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (params.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    if (params.sort === 'newest') filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  return filtered;
};

`;

// find 'export const ExternalInventoryService'
const exportIndex = content.indexOf('export const ExternalInventoryService');

// remove the incorrectly injected 'const applyFiltersAndSort' inside the object
content = content.replace(/const applyFiltersAndSort = \([^]*?return filtered;\n};\n/m, '');

const newContent = content.slice(0, exportIndex) + applyFiltersLogic + content.slice(exportIndex);
fs.writeFileSync('src/services/externalInventoryService.ts', newContent);
console.log('Successfully fixed');
