const fs = require('fs');
let c = fs.readFileSync('src/translations/translations.ts', 'utf8');

c = c.replace(/  gondarLalibela: string;\n/, ''); // removes the first occurrence
c = c.replace(/    gondarLalibela: 'Gondar & Lalibela Tilet',\n/, '');
c = c.replace(/    gondarLalibela: 'የጎንደር እና የላሊበላ ጥበብ',\n/, '');
c = c.replace(/    gondarLalibela: 'Aadaa Gondar fi Lalibela',\n/, '');

fs.writeFileSync('src/translations/translations.ts', c);
