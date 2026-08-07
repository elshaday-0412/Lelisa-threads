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

export const EXTERNAL_INVENTORY_CONFIG = {
  baseUrl: (import.meta as any).env?.VITE_EXTERNAL_INVENTORY_API_URL || '',
  isExternalConnected: Boolean((import.meta as any).env?.VITE_EXTERNAL_INVENTORY_API_URL),
  apiKey: (import.meta as any).env?.VITE_EXTERNAL_INVENTORY_API_KEY || ''
};

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

export const ExternalInventoryService = {
  /**
   * Fetch products catalog & stock levels from Central Inventory System
   */
  async getProducts(params?: ExternalInventoryParams): Promise<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
    source: 'EXTERNAL_CENTRAL_INVENTORY' | 'MOCK_PREVIEW_INVENTORY';
  }> {
    try {
      if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
        const query = new URLSearchParams();
        if (params?.category) query.append('category', params.category);
        if (params?.gender) query.append('gender', params.gender);
        if (params?.region) query.append('region', params.region);
        if (params?.search) query.append('search', params.search);
        if (params?.sort) query.append('sort', params.sort);
        if (params?.page) query.append('page', String(params.page));
        if (params?.limit) query.append('limit', String(params.limit));

        const response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/products?${query.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
          }
        });

        if (!response.ok) {
          throw new Error(`Central Inventory API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : (data.products || []);
        const normalized = rawList.map(normalizeProduct);

        return {
          products: normalized,
          pagination: data.pagination || {
            total: normalized.length,
            page: params?.page || 1,
            limit: params?.limit || normalized.length,
            totalPages: 1
          },
          source: 'EXTERNAL_CENTRAL_INVENTORY'
        };
      }

      // Prepared modular fallback consumer returning central inventory dataset
      let list = SAMPLE_PRODUCTS.map(normalizeProduct);

      if (params?.category && params.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === String(params.category).toLowerCase());
      }
      if (params?.gender && params.gender !== 'All') {
        list = list.filter(p => p.gender === params.gender);
      }
      if (params?.region && params.region !== 'All') {
        list = list.filter(p => p.region.toLowerCase() === String(params.region).toLowerCase());
      }
      if (params?.search) {
        const q = String(params.search).toLowerCase();
        list = list.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.region.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q)
        );
      }
      if (params?.minPrice !== undefined) {
        list = list.filter(p => p.price >= Number(params.minPrice));
      }
      if (params?.maxPrice !== undefined) {
        list = list.filter(p => p.price <= Number(params.maxPrice));
      }
      if (params?.featured) {
        list = list.filter(p => p.isFeatured);
      }
      if (params?.bestseller) {
        list = list.filter(p => p.isBestSeller);
      }
      if (params?.newarrival) {
        list = list.filter(p => p.isNewArrival);
      }
      if (params?.inStockOnly) {
        list = list.filter(p => p.stock > 0);
      }

      // Sorting
      if (params?.sort) {
        if (params.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
        if (params.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
        if (params.sort === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        if (params.sort === 'newest') list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      }

      const page = params?.page || 1;
      const limit = params?.limit || list.length || 12;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const paginated = list.slice((page - 1) * limit, page * limit);

      return {
        products: paginated,
        pagination: { total, page, limit, totalPages },
        source: 'MOCK_PREVIEW_INVENTORY'
      };
    } catch (err) {
      console.error('Error fetching products from Central Inventory Service:', err);
      return {
        products: [],
        pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
        source: 'EXTERNAL_CENTRAL_INVENTORY'
      };
    }
  },

  /**
   * Fetch a single product by ID or Slug from Central Inventory
   */
  async getProduct(idOrSlug: string): Promise<Product | null> {
    try {
      if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
        const response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/products/${idOrSlug}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
          }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return normalizeProduct(data);
      }

      const found = SAMPLE_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      return found ? normalizeProduct(found) : null;
    } catch (err) {
      console.error('Error fetching product from Central Inventory:', err);
      return null;
    }
  },

  /**
   * Fetch category definitions and stock counts from Central Inventory
   */
  async getCategories(): Promise<Array<{ id: string; name: string; slug: string; description: string; image: string; count: number }>> {
    try {
      if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
        const response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
          }
        });
        if (response.ok) {
          return await response.json();
        }
      }

      const baseCategories = [
        { id: 'cat-1', name: 'Habesha Kemis', slug: 'habesha-kemis', description: 'Handwoven Ethiopian cultural dresses with intricate Tilet embroidery.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-2', name: "Men's Traditional Wear", slug: 'mens-traditional-wear', description: 'Traditional suits, tunics, and robes for weddings and ceremonies.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-3', name: 'Wedding Collection', slug: 'wedding-collection', description: 'Regal bridal gowns, groom capes (Koba), and Mels attire.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-4', name: "Children's Wear", slug: 'childrens-wear', description: 'Charming cultural outfits for boys and girls.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-5', name: 'Jewelry', slug: 'jewelry', description: 'Authentic Ethiopian filigree crosses, necklaces, and headpieces.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-6', name: 'Scarves', slug: 'scarves', description: 'Soft handwoven Netela, Kuta, and Gabi wraps.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-7', name: 'Shoes', slug: 'shoes', description: 'Traditional leather chamma sandals and Tilet-accented loafers.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
        { id: 'cat-8', name: 'Bags', slug: 'bags', description: 'Leather and woven Tilet totes, evening clutches, and Agelgil bags.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' }
      ];

      return baseCategories.map(cat => ({
        ...cat,
        count: SAMPLE_PRODUCTS.filter(p => p.category === cat.name).length
      }));
    } catch (err) {
      console.error('Error fetching categories from Central Inventory:', err);
      return [];
    }
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
   * Notify Central Inventory of order placement to reserve/deduct stock
   */
  async notifyOrderPlaced(items: Array<{ productId: string; quantity: number }>): Promise<boolean> {
    try {
      if (EXTERNAL_INVENTORY_CONFIG.isExternalConnected && EXTERNAL_INVENTORY_CONFIG.baseUrl) {
        const response = await fetch(`${EXTERNAL_INVENTORY_CONFIG.baseUrl}/inventory/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Inventory-Api-Key': EXTERNAL_INVENTORY_CONFIG.apiKey
          },
          body: JSON.stringify({ items })
        });
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
  }
};
