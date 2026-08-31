const fs = require('fs');

let content = fs.readFileSync('src/services/externalInventoryService.ts', 'utf8');

// I will insert a post-processing step right after `rawList` is fetched, before applyFiltersAndSort
const postProcessingLogic = `
    // --- CATEGORY MAPPING & FEATURED FIX ---
    if (rawList) {
      rawList = rawList.map(p => {
        const nameLower = p.name.toLowerCase();
        
        // Category Translations
        if (nameLower.includes('borsaa') || nameLower.includes('borsa')) {
          p.category = 'Bags';
        } else if (nameLower.includes('shamizii') || nameLower.includes('shamiizii') || nameLower.includes('shamiz')) {
          p.category = 'T-Shirts' as any;
        } else if (nameLower.includes('shurabii') || nameLower.includes('shurabi')) {
          p.category = 'Sweaters' as any;
        } else if (nameLower.includes('daima') || nameLower.includes('da\\'iima')) {
          p.category = "Children's Wear";
        } else if (nameLower.includes('scarf') || nameLower.includes('netela')) {
          p.category = 'Scarves';
        } else if (nameLower.includes('kemis') || nameLower.includes('qemis')) {
          p.category = 'Habesha Kemis';
        } else {
          // If it doesn't match our specific new ones, but has a generic one, keep it or set to Other
          if (p.category === 'Habesha Kemis' && nameLower.includes('homo')) {
            p.category = 'Other Traditional' as any;
          }
        }
        
        // Ensure some products are featured / new arrival so home page isn't empty
        p.isFeatured = true;
        p.isNewArrival = true;
        p.isBestSeller = true;

        return p;
      });
    }
`;

const targetAnchor = "// --- APPLY FILTERS & SORTING ---";
if (content.includes(targetAnchor)) {
  content = content.replace(targetAnchor, postProcessingLogic + '\n    ' + targetAnchor);
  fs.writeFileSync('src/services/externalInventoryService.ts', content);
  console.log("Success");
} else {
  console.log("Target not found");
}
