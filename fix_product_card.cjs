const fs = require('fs');
let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// Use aspect-[3/4] instead of h-72 md:h-80
content = content.replace(
  `h-72 md:h-80 bg-[#F4F1ED] mb-3 relative rounded-sm overflow-hidden border border-[#E5E1DA]/50`,
  `aspect-[3/4] bg-[#F4F1ED] mb-4 relative rounded-sm overflow-hidden border border-[#E5E1DA]/50`
);

// Tweak typography slightly
content = content.replace(
  `text-sm font-serif font-semibold text-[#1A1A1A]`,
  `text-[15px] font-serif font-semibold text-[#1A1A1A]`
);
content = content.replace(
  `text-[10px] uppercase tracking-widest text-[#C5A059] font-bold truncate`,
  `text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold truncate mb-1`
);
content = content.replace(
  `text-sm font-medium text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors truncate`,
  `text-sm font-medium text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors truncate leading-snug`
);

fs.writeFileSync('src/components/ProductCard.tsx', content);
console.log('Fixed ProductCard');
