// Habesha Threads Shared TypeScript Types

export type CategoryName =
  | 'Habesha Kemis'
  | "Men's Traditional Wear"
  | "Children's Wear"
  | 'Wedding Collection'
  | 'Jewelry'
  | 'Scarves'
  | 'Shoes'
  | 'Bags';

export type RegionName =
  | 'Amhara'
  | 'Tigray'
  | 'Oromo'
  | 'Gurage'
  | 'Harari'
  | 'Sidama'
  | 'Wolayta'
  | 'Afar'
  | 'National Heritage';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in ETB
  originalPrice?: number;
  category: CategoryName;
  region: RegionName;
  material: string;
  gender: 'WOMEN' | 'MEN' | 'KIDS' | 'UNISEX';
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  region: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY';
  isPaid: boolean;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface UserAddress {
  id: string;
  street: string;
  city: string;
  region: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  addresses: UserAddress[];
}
