const fs = require('fs');
let content = fs.readFileSync('src/translations/translations.ts', 'utf8');

// Add to the interface
content = content.replace(
  `  freeShippingQualify: string;`,
  `  freeShippingQualify: string;
  freeShippingPromo: string;`
);

// Add to en
content = content.replace(
  `    freeShippingQualify: 'You qualify for Free Express Shipping!',`,
  `    freeShippingQualify: 'You qualify for Free Express Shipping!',
    freeShippingPromo: 'Free Express Shipping on orders over 10,000 ETB!',`
);

// Add to am
content = content.replace(
  `    freeShippingQualify: 'ነፃ የፈጣን ማድረስ አገልግሎት አግኝተዋል!',`,
  `    freeShippingQualify: 'ነፃ የፈጣን ማድረስ አገልግሎት አግኝተዋል!',
    freeShippingPromo: 'ከ10,000 ብር በላይ ለሆኑ ትዕዛዞች በነፃ እናደርሳለን!',`
);

// Add to om
content = content.replace(
  `    freeShippingQualify: 'Geejjiba Basaasaa Bilisaa Argattaniirtu!',`,
  `    freeShippingQualify: 'Geejjiba Basaasaa Bilisaa Argattaniirtu!',
    freeShippingPromo: 'Ajaja qarshii 10,000 ol ta\'eef geejjibni bilisa!',`
);

fs.writeFileSync('src/translations/translations.ts', content);
console.log('Fixed translations');
