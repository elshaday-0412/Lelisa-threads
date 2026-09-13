const axios = require('axios');

async function run() {
  const res = await axios.put('http://localhost:3000/api/products/prod-1', {
    name: 'Test Update',
    category: 'Bags',
    region: 'Tigray',
    images: ['https://test.com/image.jpg']
  });
  console.log(res.data);
}
run().catch(console.error);
