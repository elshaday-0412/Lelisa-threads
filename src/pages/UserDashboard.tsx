import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { OrderService, WishlistService } from '../services/api.js';
import { Order, Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { Package, Heart, MapPin, LogOut, ShieldCheck, User as UserIcon, Plus, CheckCircle2 } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, formatPrice, wishlistIds, showToast, setUser } = useApp();

  const activeTab = searchParams.get('tab') || 'orders';
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New address state
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Addis Ababa');

  useEffect(() => {
    async function fetchAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const oList = await OrderService.getOrders(user.id);
        setOrders(oList);
        const wList = await WishlistService.getWishlist(user.id);
        setWishlistProducts(wList);
      } catch (err) {
        console.error('Failed fetching user dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccountData();
  }, [user, wishlistIds]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-20 px-6 text-center">
        <h2 className="text-3xl font-serif text-[#1A1A1A] mb-2">Please Sign In</h2>
        <p className="text-xs text-gray-500 mb-6">You need an active session to view your Habesha Threads profile.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm inline-block"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    const updatedUser = {
      ...user,
      addresses: [
        ...user.addresses,
        {
          id: `addr-${Date.now()}`,
          street: newStreet,
          city: newCity,
          region: newCity,
          isDefault: user.addresses.length === 0
        }
      ]
    };
    setUser(updatedUser);
    setNewStreet('');
    setIsAddingAddr(false);
    showToast('Address Added', 'Your delivery address has been saved.', 'success');
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {user.role === 'ADMIN' && (
          <div className="bg-[#1A1A1A] text-white p-4 rounded-sm border border-[#C5A059] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block mb-0.5">
                👑 Admin Account Active
              </span>
              <p className="text-xs font-medium text-gray-200">
                You are currently viewing the Customer Account dashboard. Access the Admin Portal to view Analytics, Orders, and Products Inventory.
              </p>
            </div>
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-[#C5A059] hover:bg-white hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Go to Admin Portal →
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-[#E5E1DA] mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Habesha Heritage Circle
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
              Welcome, {user.fullName}
            </h1>
            <p className="text-xs text-gray-500 font-light mt-1">
              Email: {user.email} • Role: {user.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 border border-[#E5E1DA] hover:border-red-500 hover:text-red-600 text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-[#E5E1DA] mb-8 gap-4 overflow-x-auto">
          <button
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'wishlist'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorites ({wishlistIds.length})
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'profile'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Addresses &amp; Profile ({user.addresses.length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <div className="h-48 bg-gray-100 animate-pulse rounded-sm"></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#E5E1DA] rounded-sm">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-1">No Orders Yet</h3>
                <p className="text-xs text-gray-500 mb-6">
                  You haven't ordered any Habesha Kemis or traditional suits yet.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm inline-block"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white border border-[#E5E1DA] rounded-sm p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E1DA] gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()} • Shipping: {order.shippingAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-serif font-bold text-[#1A1A1A]">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded-sm bg-[#F4F1ED]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#1A1A1A] truncate">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Size: {item.size} • Color/Tilet: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-serif font-medium text-[#1A1A1A]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#E5E1DA] rounded-sm">
                <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-1">Your Favorites is Empty</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Save your favorite kemis, suits, and necklaces for upcoming weddings.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm inline-block"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlistProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Addresses & Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
              <h3 className="text-lg font-serif font-light text-[#1A1A1A] mb-4">Account Information</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Full Name</span>
                  <span className="font-semibold text-[#1A1A1A]">{user.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Email Address</span>
                  <span className="font-semibold text-[#1A1A1A]">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-semibold text-[#1A1A1A]">{user.phone || '+251 911 000 000'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 font-medium">Member Role</span>
                  <span className="font-semibold text-[#C5A059]">{user.role}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif font-light text-[#1A1A1A]">Saved Delivery Addresses</h3>
                <button
                  onClick={() => setIsAddingAddr(!isAddingAddr)}
                  className="text-xs uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              {isAddingAddr && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm space-y-3">
                  <h4 className="text-xs font-bold text-[#1A1A1A]">Add Address</h4>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">
                      Street / Landmark
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kazanchis, Near ECA building"
                      value={newStreet}
                      onChange={e => setNewStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">
                      City / Diaspora Region
                    </label>
                    <select
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Addis Ababa">Addis Ababa, Ethiopia</option>
                      <option value="Gondar">Gondar, Ethiopia</option>
                      <option value="Mekelle">Mekelle, Ethiopia</option>
                      <option value="Washington DC">Washington DC, USA</option>
                      <option value="London">London, UK</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddr(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {user.addresses.map((addr, i) => (
                  <div key={i} className="p-4 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A1A1A]">{addr.street}</span>
                        {addr.isDefault && (
                          <span className="bg-[#C5A059] text-white text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 mt-0.5">{addr.city}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
