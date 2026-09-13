import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const regex = /const headers:?.*?=\s*\{\s*'Content-Type': 'application\/json',\s*'x-api-key': erpConfig\.apiKey,\s*'X-Inventory-Api-Key': erpConfig\.apiKey\s*\};/g;

const replacement = `const headers = {
          'Content-Type': 'application/json',
          'x-api-key': erpConfig.apiKey,
          'X-Inventory-Api-Key': erpConfig.apiKey,
          'Authorization': \`Bearer \${erpConfig.apiKey}\`,
          'api-key': erpConfig.apiKey
        };`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
console.log("Patched all headers in server.ts");
