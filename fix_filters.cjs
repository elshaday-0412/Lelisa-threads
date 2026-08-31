const fs = require('fs');
const content = fs.readFileSync('src/services/externalInventoryService.ts', 'utf8');

const applyFiltersLogic = `
const applyFiltersAndSort = (list, params) => {
  let filtered = list;

  if (params?.category && params.category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === String(params.category).toLowerCase());
  }
  if (params?.gender && params.gender !== 'All') {
    filtered = filtered.filter(p => p.gender === params.gender);
  }
  if (params?.region && params.region !== 'All') {
    filtered = filtered.filter(p => p.region.toLowerCase() === String(params.region).toLowerCase());
  }
  if (params?.search) {
    const q = String(params.search).toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }
  if (params?.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= Number(params.minPrice));
  }
  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
  }
  if (params?.featured) {
    filtered = filtered.filter(p => p.isFeatured);
  }
  if (params?.bestseller) {
    filtered = filtered.filter(p => p.isBestSeller);
  }
  if (params?.newarrival) {
    filtered = filtered.filter(p => p.isNewArrival);
  }
  if (params?.inStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Sorting
  if (params?.sort) {
    if (params.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (params.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    if (params.sort === 'newest') filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  return filtered;
};
`;

const getProductsMethod = `
  async getProducts(params?: ExternalInventoryParams): Promise<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
    source: 'EXTERNAL_CENTRAL_INVENTORY' | 'MOCK_PREVIEW_INVENTORY';
  }> {
    let rawList: Product[] | null = null;
    let source: 'EXTERNAL_CENTRAL_INVENTORY' | 'MOCK_PREVIEW_INVENTORY' = 'MOCK_PREVIEW_INVENTORY';

    // 1. Try server-to-server endpoint on Storefront Express Backend (/api/erp/catalog)
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.gender) query.append('gender', params.gender);
      if (params?.region) query.append('region', params.region);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const serverRes = await fetch(\`/api/erp/catalog?\${query.toString()}\`);
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.source === 'EXTERNAL_CENTRAL_INVENTORY' && Array.isArray(data.products)) {
          rawList = data.products.map((p: any) => normalizeProduct(p));
          source = 'EXTERNAL_CENTRAL_INVENTORY';
        }
      }
    } catch (err) {
      console.warn('Server-side ERP proxy call notice:', err);
    }

    // 2. Direct browser fetch if configured
    if (!rawList && EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
      try {
        const query = new URLSearchParams();
        if (params?.category) query.append('category', params.category);
        if (params?.gender) query.append('gender', params.gender);
        if (params?.region) query.append('region', params.region);
        if (params?.search) query.append('search', params.search);
        if (params?.sort) query.append('sort', params.sort);
        if (params?.page) query.append('page', String(params.page));
        if (params?.limit) query.append('limit', String(params.limit));

        let endpoint = \`\${EXTERNAL_INVENTORY_CONFIG.baseUrl}/api/public/catalog\`;
        if (query.toString()) endpoint += \`?\${query.toString()}\`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'x-api-key': EXTERNAL_INVENTORY_CONFIG.apiKey,
          'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
        };

        let response = await fetch(endpoint, { headers });
        if (response.status === 404) {
          endpoint = \`\${EXTERNAL_INVENTORY_CONFIG.baseUrl}/products?\${query.toString()}\`;
          response = await fetch(endpoint, { headers });
        }

        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : (data.products || data.items || []);
          rawList = items.map((item: any) => {
            if (item.variantId && !item.id) {
              return normalizeProduct({
                id: String(item.variantId),
                name: String(item.productName || item.sku || 'Traditional Attire'),
                slug: \`product-\${item.variantId}\`,
                price: Number(item.price) || 0,
                stock: item.availableQuantity ?? (item.inStock ? 10 : 0),
                sizes: item.size ? [item.size] : ['M', 'L'],
                colors: item.color ? [item.color] : ['Gold'],
                description: \`SKU: \${item.sku || item.variantId}. High quality handwoven garment.\`,
                category: 'Habesha Kemis',
                region: 'National Heritage',
                material: '100% Pure Handwoven Ethiopian Cotton',
                gender: 'WOMEN',
                images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
                rating: 4.8,
                reviewCount: 12,
                reviews: []
              });
            }
            return normalizeProduct(item);
          });
          source = 'EXTERNAL_CENTRAL_INVENTORY';
        }
      } catch (err) {
        console.warn('Central Inventory API fetch notice (using local inventory fallback):', err);
      }
    }

    // 3. Fallback to local sample dataset
    if (!rawList) {
      rawList = SAMPLE_PRODUCTS.map(normalizeProduct);
      source = 'MOCK_PREVIEW_INVENTORY';
    }

    // --- APPLY FILTERS & SORTING ---
    const filteredList = applyFiltersAndSort(rawList, params);

    const page = params?.page || 1;
    const limit = params?.limit || filteredList.length || 12;
    const total = filteredList.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filteredList.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      pagination: { total, page, limit, totalPages },
      source
    };
  },
`;

const startIndex = content.indexOf('  async getProducts(');
const getProductIndex = content.indexOf('  async getProduct(idOrSlug');

if (startIndex !== -1 && getProductIndex !== -1) {
  const before = content.substring(0, startIndex);
  const after = content.substring(getProductIndex);
  const newContent = before + applyFiltersLogic + getProductsMethod + after;
  fs.writeFileSync('src/services/externalInventoryService.ts', newContent);
  console.log('Successfully updated getProducts');
} else {
  console.log('Failed to find indices');
}
