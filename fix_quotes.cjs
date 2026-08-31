const fs = require('fs');
let content = fs.readFileSync('src/translations/translations.ts', 'utf8');

content = content.replace(
  `freeShippingPromo: 'Ajaja qarshii 10,000 ol ta'eef geejjibni bilisa!'`,
  `freeShippingPromo: 'Ajaja qarshii 10,000 ol ta\\'eef geejjibni bilisa!'`
);

fs.writeFileSync('src/translations/translations.ts', content);
