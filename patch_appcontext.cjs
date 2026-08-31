const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace("return `${usd.toLocaleString()}`;", "return '$' + usd.toLocaleString();");

fs.writeFileSync('src/context/AppContext.tsx', content);
