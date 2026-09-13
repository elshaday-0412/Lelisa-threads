import fs from 'fs';
const content = fs.readFileSync('server.ts', 'utf-8');
const matches = content.match(/app\.(post|get|put|delete|patch|all)\(['"`]\/api\/public\/[^'"`]+/g);
console.log(matches);
