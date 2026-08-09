import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { ProductService, OrderService } from '../services/api.js';
import { Product, Order, CategoryName, RegionName } from '../types/index.js';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  RefreshCw,
  Users,
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  FileText,
  Tag
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, formatPrice, showToast } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('analytics');

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrderDossier, setSelectedOrderDossier] = useState<Order | null>(null);
  const [selectedProductBuyers, setSelectedProductBuyers] = useState<Product | null>(null);

  // Form state for New Product
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(4500);
  const [newOrigPrice, setNewOrigPrice] = useState<number | undefined>(5200);
  const [newStock, setNewStock] = useState(12);
  const [newCategory, setNewCategory] = useState<CategoryName>('Habesha Kemis');
  const [newRegion, setNewRegion] = useState<RegionName>('Amhara');
  const [newMaterial, setNewMaterial] = useState('100% Handwoven Organic Ethiopian Cotton Shemma');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  );
  const [newGender, setNewGender] = useState<'WOMEN' | 'MEN' | 'UNISEX' | 'KIDS'>('WOMEN');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    try {
      const pRes = await ProductService.getProducts({ limit: 100 });
      setProducts(pRes.products);

      const oRes = await OrderService.getAllOrders();
      setOrders(oRes);
    } catch (err) {
      console.error('Failed loading admin data', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle stock adjustment (+ or - delta)
  const handleAdjustStock = async (prodId: string, currentStock: number, delta: number) => {
    const newStockVal = Math.max(0, currentStock + delta);
    try {
      await ProductService.updateStock(prodId, newStockVal);
      setProducts(prev => prev.map(p => (p.id === prodId ? { ...p, stock: newStockVal } : p)));
      showToast('Stock Adjusted', `Stock quantity updated to ${newStockVal} units.`, 'success');
    } catch (err) {
      showToast('Error', 'Failed to update stock in database.', 'error');
    }
  };

  // Handle direct stock input update
  const handleDirectStockUpdate = async (prodId: string, value: string) => {
    const newStockVal = Math.max(0, parseInt(value, 10) || 0);
    try {
      await ProductService.updateStock(prodId, newStockVal);
      setProducts(prev => prev.map(p => (p.id === prodId ? { ...p, stock: newStockVal } : p)));
      showToast('Stock Saved', `Stock set to ${newStockVal} units.`, 'success');
    } catch (err) {
      showToast('Error', 'Failed to save stock.', 'error');
    }
  };

  // Delete product entirely
  const handleDeleteProduct = async (prodId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" entirely from the catalog? This action cannot be undone.`)) return;
    try {
      await ProductService.deleteProduct(prodId);
      setProducts(prev => prev.filter(p => p.id !== prodId));
      showToast('Product Deleted', `"${name}" has been permanently removed.`, 'info');
    } catch (err) {
      showToast('Error', 'Failed to delete product.', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const created = await ProductService.createProduct({
        name: newName,
        slug: newName.toLowerCase().replace(/\s+/g, '-'),
        category: newCategory,
        region: newRegion,
        price: Number(newPrice),
        originalPrice: newOrigPrice ? Number(newOrigPrice) : undefined,
        images: [newImage],
        description: newDesc || `${newName} handwoven Shemma with royal Tilet embroidery from ${newRegion}.`,
        rating: 5.0,
        reviewCount: 1,
        stock: Number(newStock),
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Measurement'],
        colors: ['White & Gold Tilet', 'Royal Blue Accent', 'Emerald Green Tilet'],
        material: newMaterial,
        featured: true,
        newArrival: true,
        gender: newGender,
        reviews: []
      });

      setProducts(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewName('');
      showToast('Product Created', `${created.name} is now live in the store.`, 'success');
    } catch (err) {
      showToast('Error', 'Failed creating product.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      if (selectedOrderDossier?.id === orderId) {
        setSelectedOrderDossier(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showToast('Order Status Updated', `Order #${updated.orderNumber} is now ${newStatus}.`, 'success');
    } catch (err) {
      showToast('Error', 'Could not update order status.', 'error');
    }
  };

  // Analytics calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
  const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);
  const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Regional breakdown
  const regionalCounts: Record<string, number> = {};
  products.forEach(p => {
    const region = p.region || 'National Heritage';
    regionalCounts[region] = (regionalCounts[region] || 0) + 1;
  });

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    const cat = p.category || 'Habesha Kemis';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Filtered lists
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.customerPhone.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  // Helper function to find buyers for a specific product
  const getBuyersForProduct = (productId: string) => {
    const buyerRecords: Array<{
      order: Order;
      quantityBought: number;
      size?: string;
      color?: string;
      itemTotal: number;
    }> = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        const itemProdId = item.productId || (item as any).product?.id;
        if (itemProdId === productId || item.name.toLowerCase() === selectedProductBuyers?.name.toLowerCase()) {
          buyerRecords.push({
            order,
            quantityBought: item.quantity,
            size: item.size,
            color: item.color,
            itemTotal: item.price * item.quantity
          });
        }
      });
    });

    return buyerRecords;
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-[#E5E1DA] mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Wanofi Design Executive Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
              Inventory &amp; Customer Orders Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="px-4 py-2 bg-white border border-[#E5E1DA] hover:border-[#C5A059] text-xs uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Heritage Piece
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Store Revenue</p>
            <p className="text-3xl font-serif font-bold text-[#1A1A1A] mt-1">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-green-600 font-medium mt-1">From {orders.length} placed customer orders</p>
          </div>

          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Stock Units</p>
            <p className="text-3xl font-serif font-bold text-[#1A1A1A] mt-1">{totalStockUnits.toLocaleString()} pcs</p>
            <p className="text-[11px] text-[#C5A059] font-medium mt-1">Valued at {formatPrice(totalInventoryValue)}</p>
          </div>

          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Low Stock Alert</p>
            <p className="text-3xl font-serif font-bold text-amber-600 mt-1">{lowStockProducts.length} items</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Stock ≤ 5 units remaining</p>
          </div>

          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Out of Stock</p>
            <p className="text-3xl font-serif font-bold text-red-600 mt-1">{outOfStockProducts.length} items</p>
            <p className="text-[11px] text-red-600 font-medium mt-1">Requires immediate stock boost</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E5E1DA] mb-8 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics' ? 'border-[#C5A059] text-[#1A1A1A]' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics &amp; Stock Health
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products' ? 'border-[#C5A059] text-[#1A1A1A]' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventory &amp; Stock Control ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'border-[#C5A059] text-[#1A1A1A]' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Customer Orders &amp; Buyers ({orders.length})
          </button>
        </div>

        {/* -------------------------------------------------------------
            TAB 1: ANALYTICS & STOCK HEALTH
           ------------------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Regional Report */}
              <div className="bg-white border border-[#E5E1DA] rounded-sm p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E1DA] mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Regional Collection Stocks</h3>
                    <p className="text-[11px] text-gray-500">Inventory allocation by cultural region</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest bg-[#C5A059]/10 text-[#C5A059] font-bold px-2.5 py-1 rounded-sm">
                    {Object.keys(regionalCounts).length} Regions
                  </span>
                </div>
                <div className="space-y-3">
                  {Object.entries(regionalCounts).map(([region, count]) => {
                    const percentage = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={region} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-[#1A1A1A]">
                          <span>{region}</span>
                          <span>{count} garments ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#FCFBFA] border border-[#E5E1DA] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C5A059] h-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Report */}
              <div className="bg-white border border-[#E5E1DA] rounded-sm p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E1DA] mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Category Allocation</h3>
                    <p className="text-[11px] text-gray-500">Active stock distribution across product lines</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest bg-gray-100 text-[#1A1A1A] font-bold px-2.5 py-1 rounded-sm">
                    {Object.keys(categoryCounts).length} Categories
                  </span>
                </div>
                <div className="space-y-3">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const percentage = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-[#1A1A1A]">
                          <span>{cat}</span>
                          <span>{count} styles ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#FCFBFA] border border-[#E5E1DA] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1A1A1A] h-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Inventory Table in Analytics */}
            <div className="bg-white border border-[#E5E1DA] rounded-sm p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E1DA] mb-4 gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Inventory Health Overview</h3>
                  <p className="text-[11px] text-gray-500">Adjust stock or inspect customer buyers</p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs uppercase tracking-widest text-[#C5A059] font-bold hover:underline"
                >
                  Manage Full Catalog &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    <tr>
                      <th className="py-3 px-4">Garment</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock Controls (+ / -)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Customer Buyers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DA]">
                    {products.slice(0, 8).map(p => {
                      const stockVal = p.stock || 0;
                      const buyersCount = getBuyersForProduct(p.id).length;
                      return (
                        <tr key={p.id} className="hover:bg-[#FCFBFA]/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#1A1A1A]">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600">{p.category}</td>
                          <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">{formatPrice(p.price)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleAdjustStock(p.id, stockVal, -1)}
                                className="w-6 h-6 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm flex items-center justify-center text-xs font-bold"
                                title="Decrease stock by 1"
                              >
                                <Minus className="w-3 h-3 text-gray-700" />
                              </button>
                              <span className="w-10 text-center font-bold text-sm">{stockVal}</span>
                              <button
                                onClick={() => handleAdjustStock(p.id, stockVal, 1)}
                                className="w-6 h-6 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm flex items-center justify-center text-xs font-bold"
                                title="Increase stock by 1"
                              >
                                <Plus className="w-3 h-3 text-gray-700" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {stockVal === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                <X className="w-3 h-3" /> Out of Stock
                              </span>
                            ) : stockVal <= 5 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                <AlertTriangle className="w-3 h-3" /> Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedProductBuyers(p)}
                              className="px-3 py-1 bg-[#FCFBFA] border border-[#E5E1DA] hover:border-[#C5A059] text-[10px] font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-1 text-[#1A1A1A] transition-colors"
                            >
                              <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                              {buyersCount} {buyersCount === 1 ? 'Buyer' : 'Buyers'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: PRODUCTS INVENTORY MONITORING (CENTRAL INVENTORY SYSTEM)
           ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Central Inventory Information Banner */}
            <div className="bg-[#1A1A1A] text-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-[#C5A059]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h3 className="font-serif font-bold text-sm tracking-wide text-white">Central Inventory Management System Connected</h3>
                </div>
                <p className="text-xs text-gray-300 font-light max-w-3xl leading-relaxed">
                  All product catalogs, stock quantities, prices, categories, and item availability are fetched live from the central inventory management system used by cashiers, store managers, and the owner. The website no longer maintains its own separate catalog database.
                </p>
              </div>
              <button
                onClick={loadAdminData}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08d4b] text-white text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Inventory
              </button>
            </div>

            <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm">
              {/* Table Header & Search */}
              <div className="p-4 border-b border-[#E5E1DA] bg-[#FCFBFA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by garment name, region, or category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E1DA] text-xs rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Showing <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> of {products.length} central inventory products
                </div>
              </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Garment</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Region</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Adjust Stock Amount</th>
                    <th className="py-3.5 px-4">Buyers History</th>
                    <th className="py-3.5 px-4 text-right">Delete / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA]">
                  {filteredProducts.map(prod => {
                    const buyersCount = getBuyersForProduct(prod.id).length;
                    return (
                      <tr key={prod.id} className="hover:bg-[#FCFBFA]/50 transition-colors">
                        {/* Garment Image & Name */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded-sm bg-[#F4F1ED] shrink-0 border border-[#E5E1DA]"
                          />
                          <div>
                            <span className="font-bold text-[#1A1A1A] block">{prod.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {prod.id}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 font-semibold text-gray-700">{prod.category}</td>

                        {/* Region */}
                        <td className="py-3 px-4">
                          <span className="bg-[#FCFBFA] border border-[#E5E1DA] px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-[#C5A059]">
                            {prod.region}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">
                          {formatPrice(prod.price)}
                        </td>

                        {/* Direct Stock Increase/Decrease Controls */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustStock(prod.id, prod.stock, -1)}
                              className="w-7 h-7 bg-white hover:bg-gray-100 border border-[#E5E1DA] rounded-sm flex items-center justify-center text-gray-700 transition-colors active:bg-gray-200"
                              title="Decrease stock amount by 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={prod.stock}
                              onChange={e => handleDirectStockUpdate(prod.id, e.target.value)}
                              className={`w-14 px-2 py-1 text-center font-bold text-xs border rounded-sm focus:outline-none focus:border-[#C5A059] ${
                                prod.stock === 0
                                  ? 'bg-red-50 text-red-700 border-red-300'
                                  : prod.stock <= 5
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-white text-gray-900 border-[#E5E1DA]'
                              }`}
                              title="Directly enter stock amount"
                            />

                            <button
                              onClick={() => handleAdjustStock(prod.id, prod.stock, 1)}
                              className="w-7 h-7 bg-white hover:bg-gray-100 border border-[#E5E1DA] rounded-sm flex items-center justify-center text-gray-700 transition-colors active:bg-gray-200"
                              title="Increase stock amount by 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            <span className="text-[10px] text-gray-400 font-semibold ml-1">pcs</span>
                          </div>
                        </td>

                        {/* Buyers History */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedProductBuyers(prod)}
                            className="px-3 py-1 bg-white border border-[#E5E1DA] hover:border-[#C5A059] text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 text-[#1A1A1A] transition-colors"
                          >
                            <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>{buyersCount} {buyersCount === 1 ? 'Buyer' : 'Buyers'}</span>
                          </button>
                        </td>

                        {/* Delete Action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 ml-auto"
                            title="Delete this heritage product entirely"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: ORDERS MANAGEMENT & USER BUYERS DETAILS
           ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm">
            {/* Order Search Bar */}
            <div className="p-4 border-b border-[#E5E1DA] bg-[#FCFBFA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, phone, order #..."
                  value={orderSearchTerm}
                  onChange={e => setOrderSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E1DA] text-xs rounded-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Total Orders: <strong className="text-[#1A1A1A]">{orders.length}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Order # &amp; Date</th>
                    <th className="py-3.5 px-4">Customer Details (Who Bought)</th>
                    <th className="py-3.5 px-4">Items Purchased</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Fulfillment Status</th>
                    <th className="py-3.5 px-4 text-right">Customer Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA]">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FCFBFA]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1A1A1A]">
                        <div>{order.orderNumber}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Customer Details Column */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1A1A]">{order.customerName}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{order.customerEmail}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold mt-1">
                          {order.userId === 'guest' ? 'Guest Customer' : `User ID: ${order.userId}`}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-gray-800 font-medium">
                              • {item.name} <span className="text-[#C5A059] font-bold">({item.quantity}x)</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">
                        {formatPrice(order.totalAmount)}
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{order.paymentMethod}</div>
                        <div className="mt-0.5">
                          <span
                            className={`inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm border ${
                              order.isPaid || order.paymentMethod !== 'CASH_ON_DELIVERY'
                                ? 'bg-green-50 text-green-800 border-green-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {order.isPaid || order.paymentMethod !== 'CASH_ON_DELIVERY' ? '✓ PAID' : 'UNPAID COD'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={e => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm border focus:outline-none ${
                            order.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Dossier button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDossier(order)}
                          className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODAL 1: PRODUCT BUYERS HISTORY MODAL
           ------------------------------------------------------------- */}
        {selectedProductBuyers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-3xl rounded-sm p-6 md:p-8 border border-[#E5E1DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProductBuyers(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 pb-6 border-b border-[#E5E1DA] mb-6">
                <img
                  src={selectedProductBuyers.images[0]}
                  alt={selectedProductBuyers.name}
                  className="w-16 h-20 object-cover rounded-sm bg-[#F4F1ED] border border-[#E5E1DA]"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                    Garment Sales Breakdown
                  </span>
                  <h2 className="text-2xl font-serif text-[#1A1A1A] mt-0.5">
                    {selectedProductBuyers.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedProductBuyers.category} • {selectedProductBuyers.region} Region • {formatPrice(selectedProductBuyers.price)}
                  </p>
                </div>
              </div>

              {/* Buyers Table */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                  Customer Purchase Log ({getBuyersForProduct(selectedProductBuyers.id).length} Orders Found)
                </h3>

                {getBuyersForProduct(selectedProductBuyers.id).length === 0 ? (
                  <div className="p-8 text-center bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm text-gray-500 text-xs">
                    No customer purchases recorded for this heritage garment yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#E5E1DA] rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        <tr>
                          <th className="py-2.5 px-3">Customer Name</th>
                          <th className="py-2.5 px-3">Contact (Email / Phone)</th>
                          <th className="py-2.5 px-3">Order # &amp; Date</th>
                          <th className="py-2.5 px-3">Variant Selected</th>
                          <th className="py-2.5 px-3">Qty &amp; Total</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E1DA]">
                        {getBuyersForProduct(selectedProductBuyers.id).map((record, idx) => (
                          <tr key={idx} className="hover:bg-[#FCFBFA]/50">
                            <td className="py-3 px-3 font-bold text-[#1A1A1A]">
                              {record.order.customerName}
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-gray-700">{record.order.customerEmail}</div>
                              <div className="text-[10px] text-gray-400">{record.order.customerPhone}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-[#C5A059]">{record.order.orderNumber}</div>
                              <div className="text-[10px] text-gray-400">
                                {new Date(record.order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-gray-600">
                              {record.size || 'Standard'} / {record.color || 'Default Tilet'}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-[#1A1A1A]">{record.quantityBought} pcs</span>
                              <div className="text-[10px] font-serif font-semibold text-gray-600">
                                {formatPrice(record.itemTotal)}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="bg-green-100 text-green-800 text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm">
                                {record.order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex justify-end">
                <button
                  onClick={() => setSelectedProductBuyers(null)}
                  className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODAL 2: CUSTOMER ORDER DOSSIER MODAL
           ------------------------------------------------------------- */}
        {selectedOrderDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-2xl rounded-sm p-6 md:p-8 border border-[#E5E1DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedOrderDossier(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Customer Dossier &amp; Order Invoice
              </span>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mt-1 mb-6">
                Order #{selectedOrderDossier.orderNumber}
              </h2>

              {/* Customer Profile Box */}
              <div className="bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm p-4 mb-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E5E1DA] pb-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>Buyer Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Full Name</span>
                    <span className="font-bold text-[#1A1A1A]">{selectedOrderDossier.customerName}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Account Status</span>
                    <span className="font-bold text-[#C5A059]">
                      {selectedOrderDossier.userId === 'guest' ? 'Guest Buyer' : `Registered User (${selectedOrderDossier.userId})`}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Email Address</span>
                    <span className="text-gray-800 font-medium">{selectedOrderDossier.customerEmail}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Phone Number</span>
                    <span className="text-gray-800 font-medium">{selectedOrderDossier.customerPhone}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Delivery Address</span>
                    <span className="text-gray-800 font-medium">
                      {selectedOrderDossier.shippingAddress}, {selectedOrderDossier.city}, {selectedOrderDossier.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3 mb-6">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                  Purchased Items List
                </h3>

                <div className="border border-[#E5E1DA] rounded-sm divide-y divide-[#E5E1DA]">
                  {selectedOrderDossier.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-12 object-cover rounded-sm bg-[#F4F1ED]"
                          />
                        )}
                        <div>
                          <p className="font-bold text-[#1A1A1A]">{item.name}</p>
                          <p className="text-[10px] text-gray-500">
                            Size: {item.size || 'Standard'} • Color: {item.color || 'Standard'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-serif">
                        <span className="font-bold text-[#1A1A1A]">{item.quantity}x</span>
                        <p className="text-[#C5A059] font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial & Status Summary */}
              <div className="border-t border-[#E5E1DA] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-serif font-bold">{formatPrice(selectedOrderDossier.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Express Delivery</span>
                  <span className="font-serif font-bold">{formatPrice(selectedOrderDossier.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#E5E1DA]">
                  <span>Total Amount Paid</span>
                  <span className="font-serif text-[#C5A059]">{formatPrice(selectedOrderDossier.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrderDossier(null)}
                  className="px-6 py-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODAL 3: ADD PRODUCT MODAL
           ------------------------------------------------------------- */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-2xl rounded-sm p-6 md:p-8 border border-[#E5E1DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Catalog Management
              </span>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mt-1 mb-6">
                Add New Ethiopian Heritage Piece
              </h2>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sheba Royal 24K Gold Embroidered Kemis"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as CategoryName)}
                      className="w-full px-3 py-2 bg-white border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Habesha Kemis">Habesha Kemis</option>
                      <option value="Men's Traditional Wear">Men&apos;s Traditional Wear</option>
                      <option value="Wedding Collection">Wedding Collection</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Scarves">Scarves &amp; Netela</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Region
                    </label>
                    <select
                      value={newRegion}
                      onChange={e => setNewRegion(e.target.value as RegionName)}
                      className="w-full px-3 py-2 bg-white border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Amhara">Amhara Heritage</option>
                      <option value="Tigray">Tigray Heritage</option>
                      <option value="Oromo">Oromo Heritage</option>
                      <option value="Gurage">Gurage Heritage</option>
                      <option value="Harari">Harari Heritage</option>
                      <option value="National Heritage">National Heritage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Audience
                    </label>
                    <select
                      value={newGender}
                      onChange={e => setNewGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="WOMEN">WOMEN</option>
                      <option value="MEN">MEN</option>
                      <option value="UNISEX">UNISEX</option>
                      <option value="KIDS">KIDS</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Price (ETB / Birr)
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={e => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={newOrigPrice || ''}
                      onChange={e => setNewOrigPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Initial Stock Level
                    </label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={e => setNewStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={newImage}
                    onChange={e => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Description &amp; Tilet Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Handwoven cotton Shemma with golden cross Tilet..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full p-3 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E1DA]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-bold rounded-sm uppercase tracking-widest transition-colors"
                  >
                    Publish to Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
