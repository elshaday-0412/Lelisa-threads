const fs = require('fs');
let content = fs.readFileSync('src/services/externalInventoryService.ts', 'utf8');

const oldLogic = `        // Ensure some products are featured / new arrival so home page isn't empty
        p.isFeatured = true;
        p.isNewArrival = true;
        p.isBestSeller = true;

        return p;
      });`;

const newLogic = `        // Pseudo-randomly assign featured and new arrival based on the product ID hash
        // so that only *some* products appear in these sections, not all of them.
        const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        
        // Every 3rd item is featured, every 4th is new arrival, every 5th is best seller
        p.isFeatured = charCodeSum % 3 === 0;
        p.isNewArrival = charCodeSum % 4 === 0;
        p.isBestSeller = charCodeSum % 5 === 0;

        return p;
      });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/services/externalInventoryService.ts', content);
console.log("Replaced tags logic");
