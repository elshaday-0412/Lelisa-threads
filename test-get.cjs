const axios = require('axios');

async function run() {
  const res = await axios.get('http://localhost:3000/api/products');
  const prod1 = res.data.find(p => p.id === 'prod-1');
  console.log(prod1);
}
run().catch(console.error);
