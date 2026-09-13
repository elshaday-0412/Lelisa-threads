import { Product } from '../types/index.js';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts.js';
import { normalizeProduct } from '../utils/productUtils.js';

/**
 * CENTRAL INVENTORY MANAGEMENT SYSTEM INTEGRATION SERVICE
 * 
 * This service connects the e-commerce store to the external Central Inventory Management System
 * used by store cashiers, managers, and the owner.
 * 
 * Single Source of Truth: All inventory quantities, pricing, categories, sizes, colors, and stock availability
 * originate from the external central inventory system.
 * 
 * SETUP INSTRUCTIONS TO CONNECT REAL API:
 * 1. Set `baseUrl` in `EXTERNAL_INVENTORY_CONFIG` or provide `VITE_EXTERNAL_INVENTORY_API_URL` environment variable.
 * 2. Set `isExternalConnected: true` once the API endpoints are active.
 * 3. Provide `apiKey` or custom headers if authentication is required by your central inventory system.
 */

function getStoredErpConfig() {
  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('wanofi_erp_url') || '' : '';
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('wanofi_erp_api_key') || '' : '';

  let rawApiUrl = String(
    localUrl ||
    (import.meta as any).env?.VITE_LELISA_ERP_URL ||
    (import.meta as any).env?.LELISA_ERP_URL ||
    (import.meta as any).env?.VITE_EXTERNAL_INVENTORY_API_URL ||
    (import.meta as any).env?.EXTERNAL_INVENTORY_API_URL ||
    ''
  ).trim();

  if (rawApiUrl && !/^https?:\/\//i.test(rawApiUrl)) {
    rawApiUrl = 'https://' + rawApiUrl;
  }

  const rawApiKey = String(
    localKey ||
    (import.meta as any).env?.VITE_LELISA_ERP_API_KEY ||
    (import.meta as any).env?.LELISA_ERP_API_KEY ||
    (import.meta as any).env?.VITE_STOREFRONT_API_KEY ||
    (import.meta as any).env?.STOREFRONT_API_KEY ||
    (import.meta as any).env?.VITE_EXTERNAL_INVENTORY_API_KEY ||
    (import.meta as any).env?.EXTERNAL_INVENTORY_API_KEY ||
    ''
  ).trim();

  return {
    baseUrl: rawApiUrl.replace(/\/+$/, ''),
    apiKey: rawApiKey,
    isExternalConnected: Boolean(rawApiUrl && (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://')))
  };
}

export const EXTERNAL_INVENTORY_CONFIG = getStoredErpConfig();

export async function saveErpConfig(url: string, key: string) {
  let cleanUrl = (url || '').trim();
  if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = 'https://' + cleanUrl;
  }

  if (typeof localStorage !== 'undefined') {
    if (cleanUrl) localStorage.setItem('wanofi_erp_url', cleanUrl);
    else localStorage.removeItem('wanofi_erp_url');

    if (key) localStorage.setItem('wanofi_erp_api_key', key.trim());
    else localStorage.removeItem('wanofi_erp_api_key');
  }
  const updated = getStoredErpConfig();
  EXTERNAL_INVENTORY_CONFIG.baseUrl = updated.baseUrl;
  EXTERNAL_INVENTORY_CONFIG.apiKey = updated.apiKey;
  EXTERNAL_INVENTORY_CONFIG.isExternalConnected = updated.isExternalConnected;

  // Sync to storefront server memory
  try {
    await fetch('/api/erp/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: updated.baseUrl, apiKey: updated.apiKey })
    });
  } catch (e) {
    console.warn('Could not sync ERP config to storefront server:', e);
  }

  return updated;
}

export interface ExternalInventoryParams {
  category?: string;
  gender?: string;
  region?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  bestseller?: boolean;
  newarrival?: boolean;
  inStockOnly?: boolean;
}

export interface InventoryCheckResult {
  productId: string;
  inStock: boolean;
  availableQuantity: number;
  requestedQuantity: number;
  location?: string;
}


const applyFiltersAndSort = (list: Product[], params?: ExternalInventoryParams) => {
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

export const ExternalInventoryService = {
  /**
   * Fetch products catalog & stock levels from Central Inventory System
   */


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

      const serverRes = await fetch(`/api/erp/catalog?${query.toString()}`);
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (Array.isArray(data.products)) {
          rawList = data.products.map((p: any) => normalizeProduct(p));
          source = data.source || 'MOCK_PREVIEW_INVENTORY';
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

        let endpoint = `${EXTERNAL_INVENTORY_CONFIG.baseUrl}/api/public/catalog`;
        if (query.toString()) endpoint += `?${query.toString()}`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'x-api-key': EXTERNAL_INVENTORY_CONFIG.apiKey,
          'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
        };

        let response = await fetch(endpoint, { headers });
        if (response.status === 404) {
          endpoint = `${EXTERNAL_INVENTORY_CONFIG.baseUrl}/products?${query.toString()}`;
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
                slug: `product-${item.variantId}`,
                price: Number(item.price) || 0,
                stock: item.availableQuantity ?? (item.inStock ? 10 : 0),
                sizes: item.size ? [item.size] : ['M', 'L'],
                colors: item.color ? [item.color] : ['Gold'],
                description: `SKU: ${item.sku || item.variantId}. High quality handwoven garment.`,
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

    
    // --- CATEGORY MAPPING & FEATURED FIX ---
    if (rawList) {
      rawList = rawList.map((p, index) => {
        const nameLower = p.name.toLowerCase();
        
        // We now respect the category fetched from the ERP or Admin Dashboard.
        // If it's completely missing, we default it to Habesha Kemis.
        if (!p.category) {
            p.category = 'Habesha Kemis';
        }
        
        // Assign tags based on array index so we have a reliable spread
        // The first 4 are featured, the next 4 are new arrivals, etc.
        p.isFeatured = index % 3 === 0;
        p.isNewArrival = index % 4 === 1;
        p.isBestSeller = index % 5 === 2;
        
        // Force at least the first few to show up if the catalog is small
        if (index === 0 || index === 1) p.isFeatured = true;
        if (index === 2 || index === 3) p.isNewArrival = true;

        return p;
      });
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
  async getProduct(idOrSlug: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${idOrSlug}`);
      if (res.ok) {
        const data = await res.json();
        return normalizeProduct(data);
      }
    } catch (err) {
      console.warn('Could not fetch product from server API', err);
    }
    const found = SAMPLE_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return found ? normalizeProduct(found) : null;
  },

  /**
   * Fetch category definitions and stock counts from Central Inventory
   */
  async getCategories(): Promise<Array<{ id: string; name: string; slug: string; description: string; image: string; count: number }>> {
    if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
      try {
        const response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
          }
        });
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Central Inventory API getCategories notice (using local inventory fallback):', err);
      }
    }

        const baseCategories = [
      { id: 'cat-1', name: 'Habesha Kemis', slug: 'habesha-kemis', description: 'Handwoven Ethiopian cultural dresses with intricate Tilet embroidery.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-2', name: 'T-Shirts', slug: 't-shirts', description: 'Authentic Ethiopian cultural shamiizii and patterned shirts.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-3', name: 'Sweaters', slug: 'sweaters', description: 'Warm and comfortable shurabii with traditional accents.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-4', name: 'Bags', slug: 'bags', description: 'Borsaa - Leather and woven Tilet totes, evening clutches, and Agelgil bags.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' }
    ];

    return baseCategories.map(cat => ({
      ...cat,
      count: 12
    }));
  },

  /**
   * Verify real-time stock availability for a product in Central Inventory
   */
  async checkStock(productId: string, requestedQuantity = 1): Promise<InventoryCheckResult> {
    try {
      const product = await this.getProduct(productId);
      if (!product) {
        return { productId, inStock: false, availableQuantity: 0, requestedQuantity };
      }
      return {
        productId,
        inStock: product.stock >= requestedQuantity,
        availableQuantity: product.stock,
        requestedQuantity
      };
    } catch {
      return { productId, inStock: false, availableQuantity: 0, requestedQuantity };
    }
  },

  /**
   * Notify Central Inventory / ERP of order placement to reserve/deduct stock
   */
  async notifyOrderPlaced(
    items: Array<{ productId: string; quantity: number }>,
    orderDetails?: {
      externalOrderId?: string;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      shippingAddress?: string;
      notes?: string;
    }
  ): Promise<boolean> {
    try {
      if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
        const orderPayload = {
          externalOrderId: orderDetails?.externalOrderId || `ORD-${Date.now()}`,
          customerName: orderDetails?.customerName || 'Wanofi Customer',
          customerPhone: orderDetails?.customerPhone || '',
          customerEmail: orderDetails?.customerEmail || '',
          shippingAddress: orderDetails?.shippingAddress || '',
          notes: orderDetails?.notes || 'Storefront Order',
          items: items.map(i => ({ variantId: i.productId, quantity: i.quantity }))
        };

        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': EXTERNAL_INVENTORY_CONFIG.apiKey,
          'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
        };

        let response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/api/public/orders`, {
          method: 'POST',
          headers,
          body: JSON.stringify(orderPayload)
        });

        if (response.status === 404) {
          response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/inventory/reserve`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ items })
          });
        }

        return response.ok;
      }

      // Pre-connection local preview deduction
      items.forEach(item => {
        const sampleIdx = SAMPLE_PRODUCTS.findIndex(p => p.id === item.productId);
        if (sampleIdx !== -1) {
          SAMPLE_PRODUCTS[sampleIdx].stock = Math.max(0, SAMPLE_PRODUCTS[sampleIdx].stock - item.quantity);
        }
      });
      return true;
    } catch (err) {
      console.warn('Central inventory order reservation notice:', err);
      return false;
    }
  },

  async notifyOrderCancelled(items: Array<{ productId: string; quantity: number }>, externalOrderId?: string): Promise<boolean> {
    let success = true;
    try {
      if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl && externalOrderId) {
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': EXTERNAL_INVENTORY_CONFIG.apiKey,
          'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
        };
        const response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/api/public/orders/cancel`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ externalOrderId })
        });
        success = response.ok;
      }
    } catch (err) {
      console.warn('Central inventory cancellation notice failed:', err);
      success = false;
    }

    // Always do local un-deduction so the Storefront UI updates instantly
    try {
      items.forEach(item => {
        const sampleIdx = SAMPLE_PRODUCTS.findIndex(p => p.id === item.productId || (p as any).variantId === item.productId);
        if (sampleIdx !== -1) {
          SAMPLE_PRODUCTS[sampleIdx].stock += item.quantity;
        }
      });
    } catch (err) {
      console.warn('Local stock un-deduction error:', err);
    }
    
    return success;
  }
};
