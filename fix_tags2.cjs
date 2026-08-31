const fs = require('fs');
let content = fs.readFileSync('src/services/externalInventoryService.ts', 'utf8');

const oldLogic = `    // --- CATEGORY MAPPING & FEATURED FIX ---
    if (rawList) {
      rawList = rawList.map(p => {`;

const newLogic = `    // --- CATEGORY MAPPING & FEATURED FIX ---
    if (rawList) {
      rawList = rawList.map((p, index) => {`;

const oldLogic2 = `        // Pseudo-randomly assign featured and new arrival based on the product ID hash
        // so that only *some* products appear in these sections, not all of them.
        const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        
        // Every 3rd item is featured, every 4th is new arrival, every 5th is best seller
        p.isFeatured = charCodeSum % 3 === 0;
        p.isNewArrival = charCodeSum % 4 === 0;
        p.isBestSeller = charCodeSum % 5 === 0;`;

const newLogic2 = `        // Assign tags based on array index so we have a reliable spread
        // The first 4 are featured, the next 4 are new arrivals, etc.
        p.isFeatured = index % 3 === 0;
        p.isNewArrival = index % 4 === 1;
        p.isBestSeller = index % 5 === 2;
        
        // Force at least the first few to show up if the catalog is small
        if (index === 0 || index === 1) p.isFeatured = true;
        if (index === 2 || index === 3) p.isNewArrival = true;`;

content = content.replace(oldLogic, newLogic).replace(oldLogic2, newLogic2);
fs.writeFileSync('src/services/externalInventoryService.ts', content);
console.log("Replaced tags logic again");
