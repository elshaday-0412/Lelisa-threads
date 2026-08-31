import { ExternalInventoryService } from './src/services/externalInventoryService.js';

async function test() {
  const feat = await ExternalInventoryService.getProducts({ featured: true, limit: 4 });
  console.log("Feat count:", feat.products.length);
}
test();
