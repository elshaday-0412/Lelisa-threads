const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

content = content.replace(
  `h-[450px] sm:h-[620px] bg-[#F4F1ED] rounded-sm overflow-hidden relative border border-[#E5E1DA]`,
  `h-[500px] sm:h-[720px] bg-[#F4F1ED] rounded-sm overflow-hidden relative border border-[#E5E1DA]`
);

content = content.replace(
  `text-3xl md:text-4xl font-serif text-[#1A1A1A] font-light mt-1 mb-3`,
  `text-4xl md:text-5xl lg:text-[3.25rem] font-serif text-[#1A1A1A] font-light mt-2 mb-4 leading-[1.1]`
);

content = content.replace(
  `text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold`,
  `text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold`
);

content = content.replace(
  `w-full py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xl`,
  `w-full py-5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-[11px] uppercase tracking-[0.25em] font-bold rounded-sm transition-colors flex items-center justify-center gap-3 shadow-xl`
);

fs.writeFileSync('src/pages/ProductDetails.tsx', content);
console.log('Fixed ProductDetails');
