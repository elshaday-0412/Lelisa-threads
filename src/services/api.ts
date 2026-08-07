import axios from 'axios';
import { Product, Order, User, PaymentReceipt } from '../types/index.js';
import { FirestoreOrderService } from './firebaseService.js';
import { ExternalInventoryService } from './externalInventoryService.js';
import { normalizeProduct } from '../utils/productUtils.js';

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
    const res = await ExternalInventoryService.getProducts(params);
    return {
      products: res.products,
      pagination: res.pagination
    };
  },

  async getProduct(idOrSlug: string): Promise<Product | null> {
    return await ExternalInventoryService.getProduct(idOrSlug);
  },

  async getCategories(): Promise<Array<{ id: string; name: string; slug: string; description: string; image: string; count: number }>> {
    return await ExternalInventoryService.getCategories();
  },

  async addReview(productId: string, userName: string, rating: number, comment: string, userId?: string, userEmail?: string) {
    try {
      const { FirestoreReviewService } = await import('./firebaseService.js');
      const review = await FirestoreReviewService.addReview({
        productId,
        userId: userId || 'anonymous',
        userName,
        userEmail,
        rating,
        comment
      });
      return review;
    } catch {
      const response = await api.post('/reviews', { productId, userName, rating, comment });
      return response.data;
    }
  },

  // Notice: Product modifications (creation/editing/deletion) are handled directly in the central inventory system
  async createProduct(data: any): Promise<Product> {
    console.warn('Central Inventory System notice: Product catalog management is external.');
    return await ExternalInventoryService.getProduct(data.id || 'hb-001') || (data as Product);
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    console.warn('Central Inventory System notice: Stock and pricing edits originate from the central inventory system.');
    const prod = await ExternalInventoryService.getProduct(id);
    return prod || (data as Product);
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    console.warn('Central Inventory System notice: Stock updates originate from the central inventory system.');
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    console.warn('Central Inventory System notice: Product deletions originate from the central inventory system.');
    return { success: true };
  }
};

export const OrderService = {
  async createOrder(orderData: any): Promise<Order> {
    try {
      const newOrder: Order = {
        id: orderData.id || `ord-${Date.now()}`,
        orderNumber: orderData.orderNumber || `HT-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: orderData.userId || 'guest',
        customerName: orderData.customerName || 'Valued Customer',
        customerEmail: orderData.customerEmail || 'customer@habeshathreads.com',
        customerPhone: orderData.customerPhone || '+251 911 000 000',
        shippingAddress: orderData.shippingAddress || 'Addis Ababa',
        city: orderData.city || 'Addis Ababa',
        region: orderData.region || 'Addis Ababa',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shippingCost: orderData.shippingCost || 0,
        totalAmount: orderData.totalAmount || 0,
        paymentMethod: orderData.paymentMethod || 'TELEBIRR',
        isPaid: Boolean(orderData.isPaid),
        transactionRef: orderData.transactionRef,
        paymentTimestamp: orderData.paymentTimestamp,
        paymentGatewayResponse: orderData.paymentGatewayResponse,
        cardLastFour: orderData.cardLastFour,
        mobileWalletPhone: orderData.mobileWalletPhone,
        status: orderData.status || 'CONFIRMED',
        createdAt: orderData.createdAt || new Date().toISOString()
      };

      await FirestoreOrderService.createOrder(newOrder);
      return newOrder;
    } catch (err) {
      console.warn('Firestore fallback: createOrder', err);
      const response = await api.post('/orders', orderData);
      return response.data;
    }
  },

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const orders = await FirestoreOrderService.getOrders(userId);
      if (orders.length > 0) return orders;
      const response = await api.get('/orders', { params: { userId } });
      return response.data;
    } catch {
      return [];
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const orders = await FirestoreOrderService.getOrders();
      if (orders.length > 0) return orders;
      const response = await api.get('/orders');
      return response.data;
    } catch {
      return [];
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const orders = await FirestoreOrderService.getOrders();
      const found = orders.find(o => o.id === id);
      if (found) return found;
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    try {
      await FirestoreOrderService.updateOrderStatus(id, status as any);
      const orders = await FirestoreOrderService.getOrders();
      const updated = orders.find(o => o.id === id);
      if (updated) return updated;
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    }
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

export const PaymentService = {
  async processPayment(payload: {
    amount: number;
    currency?: string;
    paymentMethod: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    mobileNumber?: string;
    otpPin?: string;
    cardNumber?: string;
    cardExp?: string;
    cardCvc?: string;
  }): Promise<{ success: boolean; message: string; receipt: PaymentReceipt }> {
    const response = await api.post('/payments/process', payload);
    return response.data;
  },

  async getReceipt(transactionRef: string): Promise<PaymentReceipt> {
    const response = await api.get(`/payments/receipt/${transactionRef}`);
    return response.data;
  }
};
