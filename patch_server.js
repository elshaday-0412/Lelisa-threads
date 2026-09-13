import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const regex = /try \{\s+const erpRes = await axios\.post\(\`\$\{\erpConfig\.url\}\/products\`,[\s\S]*?\} catch \(err: any\) \{\s+console\.warn\('\[ERP SYNC ERROR\] Failed to push new product to ERP:', err\.message\);\s+\}/;

const replacement = `try {
        const endpointsToTry = [
          \`/api/products\`,
          \`/products\`,
          \`/api/public/products\`,
          \`/api/public/catalog\`,
          \`/api/inventory/products\`
        ];
        
        let success = false;
        for (const ep of endpointsToTry) {
          if (success) break;
          console.log(\`[ERP SYNC] Trying POST \${ep}...\`);
          try {
            const erpRes = await axios.post(\`\${erpConfig.url}\${ep}\`, payload, { headers, timeout: 5000 });
            if (erpRes.data && (erpRes.data.id || erpRes.data.success || erpRes.data.product)) {
              newProd.id = String(erpRes.data.id || (erpRes.data.product && erpRes.data.product.id) || newProd.id);
              success = true;
              console.log(\`[ERP SYNC] Successfully pushed product to ERP using \${ep}\`);
            } else if (erpRes.status >= 200 && erpRes.status < 300) {
              success = true;
              console.log(\`[ERP SYNC] Successfully pushed product to ERP using \${ep} (no ID returned)\`);
            }
          } catch (e: any) {
             console.warn(\`[ERP SYNC] POST \${ep} failed with status \${e.response?.status}\`);
          }
        }
        
        if (!success) {
           console.warn('[ERP SYNC ERROR] Failed to push new product to ERP on all known endpoints');
        }
      } catch (err: any) {
        console.warn('[ERP SYNC ERROR] Unexpected error pushing to ERP:', err.message);
      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with loop!");
