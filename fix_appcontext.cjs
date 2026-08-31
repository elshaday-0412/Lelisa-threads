const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /const formatPrice = \(amountInBirr: number\) => \{[\s\S]*?return `\$\{amountInBirr\.toLocaleString\(\)\} ETB`;\n  };/g;

const newFormatPrice = `const formatPrice = (amountInBirr: number) => {
    if (currencyMode === 'USD') {
      const usd = Math.max(1, Math.round(amountInBirr / exchangeRate)); 
      return '$' + usd.toLocaleString();
    }
    return amountInBirr.toLocaleString() + ' ETB';
  };`;

if (content.match(regex)) {
  content = content.replace(regex, newFormatPrice);
  fs.writeFileSync('src/context/AppContext.tsx', content);
  console.log("Fixed!");
} else {
  console.log("Regex didn't match. Here is the file snippet:");
  const idx = content.indexOf('const formatPrice =');
  console.log(content.substring(idx, idx + 250));
}
