import axios from 'axios';
import { Product, Order, User } from '../types/index.js';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 8000
});

// Interceptor to inject JWT token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ht_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ProductService = {
  async getProducts(params?: Record<string, any>): Promise<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (err) {
      console.warn('API fallback: getProducts', err);
      // Local fallback
      let list = [...SAMPLE_PRODUCTS];
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
            p.region.toLowerCase().includes(q)
        );
      }
      return {
        products: list,
        pagination: { total: list.length, page: 1, limit: list.length, totalPages: 1 }
      };
    }
  },

  async getProduct(idOrSlug: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/${idOrSlug}`);
      return response.data;
    } catch (err) {
      return SAMPLE_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
    }
  },

  async getCategories(): Promise<Array<{ id: string; name: string; slug: string; description: string; image: string; count: number }>> {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (err) {
      const cats = [
        { id: 'cat-1', name: 'Habesha Kemis', slug: 'habesha-kemis', description: 'Handwoven Ethiopian cultural dresses with intricate Tilet embroidery.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', count: 12 },
        { id: 'cat-2', name: "Men's Traditional Wear", slug: 'mens-traditional-wear', description: 'Traditional suits, tunics, and robes for weddings and ceremonies.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', count: 10 },
        { id: 'cat-3', name: 'Wedding Collection', slug: 'wedding-collection', description: 'Regal bridal gowns, groom capes (Koba), and Mels attire.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', count: 6 },
        { id: 'cat-4', name: "Children's Wear", slug: 'childrens-wear', description: 'Charming cultural outfits for boys and girls.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80', count: 8 },
        { id: 'cat-5', name: 'Jewelry', slug: 'jewelry', description: 'Authentic Ethiopian filigree crosses, necklaces, and headpieces.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', count: 8 },
        { id: 'cat-6', name: 'Scarves', slug: 'scarves', description: 'Soft handwoven Netela, Kuta, and Gabi wraps.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80', count: 6 },
        { id: 'cat-7', name: 'Shoes', slug: 'shoes', description: 'Traditional leather chamma sandals and Tilet-accented loafers.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', count: 5 },
        { id: 'cat-8', name: 'Bags', slug: 'bags', description: 'Leather and woven Tilet totes, evening clutches, and Agelgil bags.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', count: 7 }
      ];
      return cats;
    }
  },

  async addReview(productId: string, userName: string, rating: number, comment: string) {
    const response = await api.post('/reviews', { productId, userName, rating, comment });
    return response.data;
  },

  async createProduct(data: any): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export const OrderService = {
  async createOrder(orderData: any): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getOrders(userId?: string): Promise<Order[]> {
    const response = await api.get('/orders', { params: { userId } });
    return response.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export const AdminService = {
  async getStats(): Promise<any> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async createProduct(data: any): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export const WishlistService = {
  async getWishlist(userId: string): Promise<Product[]> {
    try {
      const response = await api.get('/wishlist', { params: { userId } });
      return response.data;
    } catch {
      return [];
    }
  },

  async toggleWishlist(userId: string, productId: string): Promise<{ isWishlisted: boolean; wishlist: string[] }> {
    const response = await api.post('/wishlist/toggle', { userId, productId });
    return response.data;
  }
};
