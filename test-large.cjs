const axios = require('axios');

async function run() {
  const largeString = 'a'.repeat(5 * 1024 * 1024);
  const res = await axios.put('http://localhost:3000/api/products/prod-1', {
    name: 'Test Update',
    category: 'Bags',
    region: 'Tigray',
    images: [largeString]
  });
  console.log(res.status);
}
run().catch(console.error);
