const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replaceAll(
  `h-96 rounded-sm overflow-hidden border border-[#E5E1DA] block`,
  `aspect-[3/4] rounded-sm overflow-hidden border border-[#E5E1DA]/50 block shadow-sm hover:shadow-md transition-shadow`
);

content = content.replace(
  `h-96 bg-[#F4F1ED] animate-pulse rounded-sm`,
  `aspect-[3/4] bg-[#F4F1ED] animate-pulse rounded-sm`
);

fs.writeFileSync('src/pages/Home.tsx', content);
