const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Refine main hero H1
content = content.replace(
  `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1A1A1A] tracking-tight leading-[1.1] mb-6`,
  `text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-light text-[#1A1A1A] tracking-tight leading-[1.05] mb-8`
);

// Refine hero subtitle
content = content.replace(
  `text-sm md:text-base text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-10`,
  `text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-12`
);

// Buttons
content = content.replace(
  `px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 group`,
  `px-10 py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-[11px] uppercase tracking-[0.25em] font-semibold rounded-sm transition-all shadow-xl flex items-center justify-center gap-3 group`
);

content = content.replace(
  `px-8 py-4 bg-white hover:bg-[#F4F1ED] text-[#1A1A1A] border border-[#E5E1DA] hover:border-[#C5A059] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all`,
  `px-10 py-4 bg-transparent hover:bg-white text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C5A059] text-[11px] uppercase tracking-[0.25em] font-semibold rounded-sm transition-all`
);

// Icon metrics section
content = content.replace(
  `mt-14 pt-10 border-t border-[#E5E1DA]/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center`,
  `mt-20 pt-14 border-t border-[#E5E1DA]/60 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center`
);

// Make 'text-3xl md:text-4xl' to 'text-4xl md:text-5xl' for section headers
content = content.replace(
  `text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1`,
  `text-4xl md:text-[2.75rem] font-serif font-light text-[#1A1A1A] mt-2 leading-tight`
);
content = content.replace(
  `text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1`,
  `text-4xl md:text-[2.75rem] font-serif font-light text-[#1A1A1A] mt-2 leading-tight`
); // twice

// Category cards height from h-96 to a better aspect ratio
content = content.replace(
  `h-96 rounded-sm overflow-hidden border border-[#E5E1DA] block`,
  `aspect-[3/4] rounded-sm overflow-hidden border border-[#E5E1DA]/50 block shadow-sm hover:shadow-md transition-shadow`
);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log('Fixed Home');
