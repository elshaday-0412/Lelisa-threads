import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { ProductService, OrderService } from '../services/api.js';
import { Product, Order, CategoryName, RegionName } from '../types/index.js';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, formatPrice, showToast } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('analytics');

  // Modal State for Add Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

      // Try loading all orders
      const oRes = await OrderService.getAllOrders();
      setOrders(oRes);
    } catch (err) {
      console.error('Failed loading admin data', err);
    } finally {
      setLoading(false);
    }
  }

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
      showToast('Product Created', `${created.name} is now live on Habesha Threads.`, 'success');
    } catch (err) {
      showToast('Error', 'Failed creating product.', 'error');
    }
  };

  const handleDeleteProduct = async (prodId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the marketplace?`)) return;
    try {
      await ProductService.deleteProduct(prodId);
      setProducts(prev => prev.filter(p => p.id !== prodId));
      showToast('Product Removed', `${name} has been deleted.`, 'info');
    } catch (err) {
      showToast('Error', 'Failed to remove product.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      showToast('Order Status Updated', `Order #${updated.orderNumber} is now ${newStatus}.`, 'success');
    } catch (err) {
      showToast('Error', 'Could not update order status.', 'error');
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
  const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);
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

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-[#E5E1DA] mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Habesha Threads Executive Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
              Marketplace Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="px-4 py-2 bg-white border border-[#E5E1DA] hover:border-[#C5A059] text-xs uppercase tracking-widest font-bold rounded-sm flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Heritage Piece
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Gross Volume</p>
            <p className="text-3xl font-serif font-bold text-[#1A1A1A] mt-1">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-green-600 font-medium mt-1">↑ 24% vs last celebration season</p>
          </div>
          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Orders Placed</p>
            <p className="text-3xl font-serif font-bold text-[#1A1A1A] mt-1">{orders.length}</p>
            <p className="text-[11px] text-gray-500 font-medium mt-1">Across Addis Ababa &amp; Diaspora</p>
          </div>
          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Catalog Inventory</p>
            <p className="text-3xl font-serif font-bold text-[#1A1A1A] mt-1">{products.length}</p>
            <p className="text-[11px] text-[#C5A059] font-medium mt-1">8 Cultural collections active</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E1DA] mb-8 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics' ? 'border-[#C5A059] text-[#1A1A1A]' : 'border-transparent text-gray-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics &amp; Inventory Reports
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products' ? 'border-[#C5A059] text-[#1A1A1A]' : 'border-transparent text-gray-400'
            }`}
          >
            <Package className="w-4 h-4" />
            Products Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'border-[#C5A059] text-[#1A1A1A]' : 'border-transparent text-gray-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders Management ({orders.length})
          </button>
        </div>

        {/* Analytics & Inventory Reports View */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Inventory Valuation & Health Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Catalog Valuation</p>
                <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{formatPrice(totalInventoryValue)}</p>
                <p className="text-[11px] text-[#C5A059] font-medium mt-1">Combined retail stock value</p>
              </div>
              <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Units in Stock</p>
                <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{totalStockUnits.toLocaleString()} pcs</p>
                <p className="text-[11px] text-gray-500 font-medium mt-1">Across {products.length} heritage styles</p>
              </div>
              <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Average Order Value</p>
                <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{formatPrice(avgOrderValue)}</p>
                <p className="text-[11px] text-green-600 font-medium mt-1">Bespoke &amp; RTW orders</p>
              </div>
              <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Low Stock Warning</p>
                <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{lowStockProducts.length} items</p>
                <p className="text-[11px] text-amber-600 font-medium mt-1">Stock ≤ 5 units remaining</p>
              </div>
            </div>

            {/* Two Column Grid: Regional Inventory Report + Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Regional Inventory Distribution Table */}
              <div className="bg-white border border-[#E5E1DA] rounded-sm p-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E1DA] mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Regional Inventory Report</h3>
                    <p className="text-[11px] text-gray-500">Catalog distribution by cultural heritage region</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest bg-[#C5A059]/10 text-[#C5A059] font-bold px-2.5 py-1 rounded-sm">
                    Live Feed
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(regionalCounts).map(([region, count]) => {
                    const percentage = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={region} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-[#1A1A1A]">
                          <span>{region}</span>
                          <span>{count} styles ({percentage}%)</span>
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

              {/* Category Inventory Breakdown Table */}
              <div className="bg-white border border-[#E5E1DA] rounded-sm p-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E1DA] mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Category Inventory Report</h3>
                    <p className="text-[11px] text-gray-500">Active stock allocation by collection</p>
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

            {/* Comprehensive Products Stock & Health Table */}
            <div className="bg-white border border-[#E5E1DA] rounded-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E1DA] mb-4 gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Detailed Inventory &amp; Stock Status</h3>
                  <p className="text-[11px] text-gray-500">Real-time unit availability across all heritage collections</p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs uppercase tracking-widest text-[#C5A059] font-bold hover:underline"
                >
                  Manage Inventory →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    <tr>
                      <th className="py-3 px-4">Heritage Piece</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Units in Stock</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1DA]">
                    {products.map(p => {
                      const stockVal = p.stock || 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#FCFBFA]/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#1A1A1A]">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600">{p.category}</td>
                          <td className="py-3 px-4 text-gray-600">{p.region}</td>
                          <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">{formatPrice(p.price)}</td>
                          <td className="py-3 px-4 font-semibold text-[#1A1A1A]">{stockVal} units</td>
                          <td className="py-3 px-4">
                            {stockVal <= 5 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                <AlertTriangle className="w-3 h-3" /> Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                              </span>
                            )}
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

        {/* Products Table */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Garment</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Region</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA]">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-[#FCFBFA]/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-12 object-cover rounded-sm bg-[#F4F1ED]"
                        />
                        <div>
                          <span className="font-bold text-[#1A1A1A] block">{prod.name}</span>
                          <span className="text-[10px] text-gray-400">ID: {prod.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700">{prod.category}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[#FCFBFA] border border-[#E5E1DA] px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-[#C5A059]">
                          {prod.region}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">
                        {formatPrice(prod.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            prod.stock < 5 ? 'text-red-500' : 'text-green-700'
                          }`}
                        >
                          {prod.stock} pcs
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCFBFA] border-b border-[#E5E1DA] text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA]">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FCFBFA]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1A1A1A]">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{order.customerName}</div>
                        <div className="text-[10px] text-gray-400">{order.customerEmail}</div>
                        <div className="text-[10px] text-gray-500">{order.city}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate text-gray-700">
                          {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
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
                    className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm"
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
                      Gender / Audience
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
                      Original Price (Optional)
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
                      Stock Level
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
