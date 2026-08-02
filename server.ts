import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_PRODUCTS, Product } from './src/data/sampleProducts.js';

// In-Memory Database for Live Preview & Production Demo
let products: Product[] = [...SAMPLE_PRODUCTS];

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    region: string;
    isDefault: boolean;
  }>;
}

let users: User[] = [
  {
    id: 'user-admin',
    email: 'admin@habeshathreads.com',
    fullName: 'Sara Tadesse (Admin)',
    phone: '+251 911 234 567',
    role: 'ADMIN',
    addresses: [
      {
        id: 'addr-1',
        street: 'Bole Road, Around Friendship',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        isDefault: true
      }
    ]
  },
  {
    id: 'user-customer',
    email: 'user@habeshathreads.com',
    fullName: 'Dawit Abebe',
    phone: '+251 912 876 543',
    role: 'USER',
    addresses: [
      {
        id: 'addr-2',
        street: 'Kazanchis, Near ECA',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        isDefault: true
      }
    ]
  }
];

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
  items: Array<{
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }>;
}

let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HT-84721',
    userId: 'user-customer',
    customerName: 'Dawit Abebe',
    customerEmail: 'user@habeshathreads.com',
    customerPhone: '+251 912 876 543',
    shippingAddress: 'Kazanchis, Near ECA',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    status: 'DELIVERED',
    paymentMethod: 'TELEBIRR',
    isPaid: true,
    subtotal: 18500,
    shippingCost: 0,
    totalAmount: 18500,
    createdAt: '2026-07-28T14:32:00.000Z',
    items: [
      {
        id: 'item-1',
        productId: 'hb-001',
        name: 'Sheba Royal Gold Habesha Kemis',
        price: 18500,
        quantity: 1,
        size: 'M',
        color: 'White & Royal Gold',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'HT-93041',
    userId: 'user-customer',
    customerName: 'Dawit Abebe',
    customerEmail: 'user@habeshathreads.com',
    customerPhone: '+251 912 876 543',
    shippingAddress: 'Kazanchis, Near ECA',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    status: 'PROCESSING',
    paymentMethod: 'CBE_BIRR',
    isPaid: true,
    subtotal: 21300,
    shippingCost: 0,
    totalAmount: 21300,
    createdAt: '2026-07-31T09:15:00.000Z',
    items: [
      {
        id: 'item-2',
        productId: 'mn-001',
        name: 'Lalibela Embroidered Traditional Men’s Suit',
        price: 14500,
        quantity: 1,
        size: 'L',
        color: 'White & Gold Collar',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'item-3',
        productId: 'jw-001',
        name: 'Axumite 24K Gold-Plated Filigree Cross Necklace',
        price: 6800,
        quantity: 1,
        size: '18 Inch Chain',
        color: 'Pure Gold',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

let wishlists: { [userId: string]: string[] } = {
  'user-customer': ['hb-001', 'hb-003', 'jw-001'],
  'user-admin': ['wd-001']
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // REST API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Habesha Threads REST API', timestamp: new Date().toISOString() });
  });

  // GET /api/products - filtering, pagination, sorting
  app.get('/api/products', (req, res) => {
    const {
      category,
      gender,
      region,
      search,
      minPrice,
      maxPrice,
      sort,
      page = '1',
      limit = '12',
      featured,
      bestseller,
      newarrival
    } = req.query;

    let result = [...products];

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (gender && gender !== 'All') {
      result = result.filter(p => p.gender === gender);
    }
    if (region && region !== 'All') {
      result = result.filter(p => p.region.toLowerCase() === String(region).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }
    if (featured === 'true') {
      result = result.filter(p => p.isFeatured);
    }
    if (bestseller === 'true') {
      result = result.filter(p => p.isBestSeller);
    }
    if (newarrival === 'true') {
      result = result.filter(p => p.isNewArrival);
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.max(1, parseInt(String(limit), 10));
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum);
    const paginated = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      products: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  });

  // GET /api/products/:idOrSlug
  app.get('/api/products/:idOrSlug', (req, res) => {
    const { idOrSlug } = req.params;
    const product = products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // GET /api/categories
  app.get('/api/categories', (req, res) => {
    const categoriesList = [
      { id: 'cat-1', name: 'Habesha Kemis', slug: 'habesha-kemis', description: 'Handwoven Ethiopian cultural dresses with intricate Tilet embroidery.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-2', name: "Men's Traditional Wear", slug: 'mens-traditional-wear', description: 'Traditional suits, tunics, and robes for weddings and ceremonies.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-3', name: 'Wedding Collection', slug: 'wedding-collection', description: 'Regal bridal gowns, groom capes (Koba), and Mels attire.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-4', name: "Children's Wear", slug: 'childrens-wear', description: 'Charming cultural outfits for boys and girls.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-5', name: 'Jewelry', slug: 'jewelry', description: 'Authentic Ethiopian filigree crosses, necklaces, and headpieces.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-6', name: 'Scarves', slug: 'scarves', description: 'Soft handwoven Netela, Kuta, and Gabi wraps.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-7', name: 'Shoes', slug: 'shoes', description: 'Traditional leather chamma sandals and Tilet-accented loafers.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-8', name: 'Bags', slug: 'bags', description: 'Leather and woven Tilet totes, evening clutches, and Agelgil bags.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' }
    ];

    const withCount = categoriesList.map(cat => ({
      ...cat,
      count: products.filter(p => p.category === cat.name).length
    }));

    res.json(withCount);
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // For demo, accept any password or default
    const token = `jwt_token_${user.id}_${Date.now()}`;
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  });

  // POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    const { email, password, fullName, phone } = req.body;
    if (!email || !fullName) {
      return res.status(400).json({ error: 'Email and Full Name are required' });
    }
    const existing = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      phone: phone || '',
      role: email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
      addresses: []
    };
    users.push(newUser);
    const token = `jwt_token_${newUser.id}_${Date.now()}`;
    res.status(201).json({
      token,
      user: newUser
    });
  });

  // GET /api/orders
  app.get('/api/orders', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      return res.json(orders.filter(o => o.userId === userId));
    }
    res.json(orders);
  });

  // GET /api/orders/:id
  app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  // POST /api/orders
  app.post('/api/orders', (req, res) => {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      region,
      paymentMethod,
      items,
      subtotal,
      shippingCost,
      totalAmount
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items cannot be empty' });
    }

    const newOrder: Order = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: `HT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: userId || 'guest',
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      region,
      status: 'PROCESSING',
      paymentMethod: paymentMethod || 'TELEBIRR',
      isPaid: true,
      subtotal,
      shippingCost: shippingCost || 0,
      totalAmount,
      createdAt: new Date().toISOString(),
      items
    };

    orders.unshift(newOrder);

    // Save address to user if logged in
    if (userId && userId !== 'guest') {
      const user = users.find(u => u.id === userId);
      if (user && !user.addresses.some(a => a.street === shippingAddress)) {
        user.addresses.push({
          id: `addr-${Date.now()}`,
          street: shippingAddress,
          city,
          region,
          isDefault: user.addresses.length === 0
        });
      }
    }

    res.status(201).json(newOrder);
  });

  // PATCH /api/orders/:id/status - Admin update order status
  app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    res.json(order);
  });

  // GET /api/admin/stats - Admin Dashboard analytics
  app.get('/api/admin/stats', (req, res) => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.isPaid ? o.totalAmount : 0), 0);
    const totalOrders = orders.length;
    const totalProductsCount = products.length;
    const totalCustomersCount = users.length;

    // Sales by Category
    const salesByCategory: { [key: string]: number } = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod ? prod.category : 'Habesha Kemis';
        salesByCategory[cat] = (salesByCategory[cat] || 0) + item.price * item.quantity;
      });
    });

    const categoryChartData = Object.entries(salesByCategory).map(([name, value]) => ({
      name,
      value
    }));

    // Revenue chart data (6 months)
    const revenueChartData = [
      { month: 'Mar', revenue: 145000, orders: 12 },
      { month: 'Apr', revenue: 210000, orders: 18 },
      { month: 'May', revenue: 315000, orders: 25 },
      { month: 'Jun', revenue: 420000, orders: 31 },
      { month: 'Jul', revenue: 530000, orders: 42 },
      { month: 'Aug', revenue: 645000, orders: 48 }
    ];

    // Low stock items
    const lowStockProducts = products.filter(p => p.stock <= 5);

    // Best sellers
    const popularProducts = products.filter(p => p.isBestSeller).slice(0, 6);

    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalProducts: totalProductsCount,
        totalCustomers: totalCustomersCount
      },
      revenueChartData,
      categoryChartData,
      lowStockProducts,
      popularProducts,
      recentOrders: orders.slice(0, 8)
    });
  });

  // POST /api/products - Admin create product
  app.post('/api/products', (req, res) => {
    const prodData = req.body;
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      slug: prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    products.unshift(newProd);
    res.status(201).json(newProd);
  });

  // PUT /api/products/:id - Admin edit product
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products[index] = {
      ...products[index],
      ...req.body
    };
    res.json(products[index]);
  });

  // DELETE /api/products/:id - Admin delete product
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = products.splice(index, 1)[0];
    res.json({ success: true, deleted });
  });

  // POST /api/reviews
  app.post('/api/reviews', (req, res) => {
    const { productId, userName, rating, comment } = req.body;
    const prod = products.find(p => p.id === productId);
    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      userName: userName || 'Anonymous Habesha',
      rating: Number(rating) || 5,
      comment: comment || '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    prod.reviews.unshift(newRev);
    prod.reviewCount = prod.reviews.length;
    prod.rating = Number((prod.reviews.reduce((s, r) => s + r.rating, 0) / prod.reviews.length).toFixed(1));
    res.status(201).json(newRev);
  });

  // GET /api/wishlist
  app.get('/api/wishlist', (req, res) => {
    const { userId = 'user-customer' } = req.query;
    const list = wishlists[String(userId)] || [];
    const wishedProducts = products.filter(p => list.includes(p.id));
    res.json(wishedProducts);
  });

  // POST /api/wishlist/toggle
  app.post('/api/wishlist/toggle', (req, res) => {
    const { userId = 'user-customer', productId } = req.body;
    if (!wishlists[userId]) {
      wishlists[userId] = [];
    }
    const idx = wishlists[userId].indexOf(productId);
    let isWishlisted = false;
    if (idx === -1) {
      wishlists[userId].push(productId);
      isWishlisted = true;
    } else {
      wishlists[userId].splice(idx, 1);
      isWishlisted = false;
    }
    res.json({ isWishlisted, wishlist: wishlists[userId] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Habesha Threads Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
