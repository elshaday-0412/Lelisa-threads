const axios = require('axios');

async function run() {
  try {
    const res = await axios.put('http://localhost:3000/api/products/prod-1', {
      name: 'Test Update',
      category: "Men's Traditional Wear",
      region: 'Tigray',
      sizes: ['M'],
      price: 100,
      images: ['https://test.com/image.jpg'],
      description: 'desc',
      stock: 10
    });
    console.log("SUCCESS:", res.status);
  } catch(e) {
    console.error("ERROR:", e.response ? e.response.status : e.message);
    if(e.response && e.response.data) console.error(e.response.data);
  }
}
run().catch(console.error);
