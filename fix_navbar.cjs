const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(
  `<span>{t.freeShippingQualify}</span>`,
  `<span>{t.freeShippingPromo}</span>`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log('Fixed Navbar text');
