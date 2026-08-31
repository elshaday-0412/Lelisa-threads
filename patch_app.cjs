const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('PrivacyPolicy')) {
  content = content.replace(
    `import { CulturalHeritage } from './pages/CulturalHeritage.js';`,
    `import { CulturalHeritage } from './pages/CulturalHeritage.js';\nimport { PrivacyPolicy } from './pages/PrivacyPolicy.js';`
  );
  content = content.replace(
    `<Route path="/categories" element={<Categories />} />`,
    `<Route path="/categories" element={<Categories />} />\n              <Route path="/privacy" element={<PrivacyPolicy />} />`
  );
  fs.writeFileSync('src/App.tsx', content);
  console.log('Patched App.tsx');
}
