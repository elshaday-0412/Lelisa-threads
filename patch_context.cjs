const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const oldContextValue = `        currencyMode,
        setCurrencyMode,`;

const newContextValue = `        currencyMode,
        setCurrencyMode,
        exchangeRate,`;

content = content.replace(oldContextValue, newContextValue);
fs.writeFileSync('src/context/AppContext.tsx', content);

let typesContent = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
const oldType = `  currencyMode: 'ETB' | 'USD';
  setCurrencyMode: (mode: 'ETB' | 'USD') => void;`;

const newType = `  currencyMode: 'ETB' | 'USD';
  setCurrencyMode: (mode: 'ETB' | 'USD') => void;
  exchangeRate: number;`;

typesContent = typesContent.replace(oldType, newType);
fs.writeFileSync('src/context/AppContext.tsx', typesContent);
console.log('Exposed exchangeRate');
