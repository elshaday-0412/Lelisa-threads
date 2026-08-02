import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { OrderService, WishlistService, PaymentService } from '../services/api.js';
import { Order, Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { Package, Heart, MapPin, LogOut, ShieldCheck, User as UserIcon, Plus, CheckCircle2, CreditCard, Smartphone, Building2, Globe, X, Lock, AlertCircle, Printer } from 'lucide-react';

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

  // Online Bill Payment Modal State
  const [selectedBillOrder, setSelectedBillOrder] = useState<Order | null>(null);
  const [billPaymentMethod, setBillPaymentMethod] = useState<'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'STRIPE_CARD'>('TELEBIRR');
  const [billPhone, setBillPhone] = useState('0911234567');
  const [billOtp, setBillOtp] = useState('4829');
  const [billCardNum, setBillCardNum] = useState('4242 4242 4242 4242');
  const [billCardExp, setBillCardExp] = useState('08/28');
  const [billCardCvc, setBillCardCvc] = useState('456');
  const [billSubmitting, setBillSubmitting] = useState(false);
  const [billError, setBillError] = useState<string | null>(null);

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

  const handlePayBillOnline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillOrder) return;
    setBillError(null);
    setBillSubmitting(true);
    try {
      const res = await PaymentService.processPayment({
        amount: selectedBillOrder.totalAmount,
        currency: 'ETB',
        paymentMethod: billPaymentMethod,
        customerEmail: user?.email || 'customer@example.com',
        customerName: selectedBillOrder.customerName,
        customerPhone: selectedBillOrder.customerPhone,
        mobileNumber: billPhone,
        otpPin: billOtp,
        cardNumber: billCardNum,
        cardExp: billCardExp,
        cardCvc: billCardCvc
      });

      if (!res.success || !res.receipt) {
        setBillError(res.message || 'Payment authorization declined.');
        showToast('Payment Failed', res.message || 'Please verify your payment details.', 'error');
        return;
      }

      setOrders(prev => prev.map(o => {
        if (o.id === selectedBillOrder.id) {
          return {
            ...o,
            isPaid: true,
            paymentMethod: billPaymentMethod,
            transactionRef: res.receipt.transactionRef,
            paymentTimestamp: res.receipt.timestamp,
            paymentGatewayResponse: res.receipt.gatewayDetails.authCode,
            cardLastFour: res.receipt.gatewayDetails.cardLastFour,
            mobileWalletPhone: res.receipt.gatewayDetails.mobileNumber
          };
        }
        return o;
      }));

      showToast('Bill Paid Successfully!', `Transaction reference ${res.receipt.transactionRef} confirmed.`, 'success');
      setSelectedBillOrder(null);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Unable to connect to payment gateway.';
      setBillError(msg);
      showToast('Payment Gateway Error', msg, 'error');
    } finally {
      setBillSubmitting(false);
    }
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm border ${
                          order.isPaid || order.paymentMethod !== 'CASH_ON_DELIVERY'
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {order.isPaid || order.paymentMethod !== 'CASH_ON_DELIVERY' ? '✓ PAID IN FULL' : 'PAY ON DELIVERY'}
                      </span>
                      <span
                        className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-serif font-bold text-[#1A1A1A]">
                        {formatPrice(order.totalAmount)}
                      </span>
                      {(!order.isPaid || order.paymentMethod === 'CASH_ON_DELIVERY') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBillOrder(order);
                            setBillError(null);
                          }}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-[#C5A059] hover:bg-[#1A1A1A] text-white transition-colors flex items-center gap-1 shadow-sm"
                        >
                          ⚡ Pay Bill Online
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payment gateway metadata banner */}
                  <div className="mt-2 mb-3 px-3 py-2 bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600">
                    <div className="flex items-center gap-3">
                      <span><strong>Gateway:</strong> {order.paymentMethod}</span>
                      {order.transactionRef && (
                        <span>• <strong>Transaction Ref:</strong> <code className="font-mono text-black">{order.transactionRef}</code></span>
                      )}
                      {order.cardLastFour && (
                        <span>• <strong>Card:</strong> •••• {order.cardLastFour}</span>
                      )}
                      {order.mobileWalletPhone && (
                        <span>• <strong>Wallet:</strong> {order.mobileWalletPhone}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {order.paymentTimestamp ? new Date(order.paymentTimestamp).toLocaleString() : 'Authorized'}
                    </span>
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

        {/* Online Bill Payment Modal */}
        {selectedBillOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-lg rounded-sm p-6 md:p-8 border border-[#E5E1DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedBillOrder(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Online Bill Settlement
              </span>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mt-1 mb-2">
                Pay Order #{selectedBillOrder.orderNumber}
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Total Amount Due: <strong className="text-[#1A1A1A] font-serif text-sm">{formatPrice(selectedBillOrder.totalAmount)}</strong>
              </p>

              {billError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{billError}</span>
                </div>
              )}

              <form onSubmit={handlePayBillOnline} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-2">
                    Select Gateway
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setBillPaymentMethod('TELEBIRR')}
                      className={`p-3 rounded-sm border cursor-pointer flex items-center gap-2 ${
                        billPaymentMethod === 'TELEBIRR' ? 'border-[#C5A059] bg-[#FCFBFA]' : 'border-[#E5E1DA]'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-bold">Telebirr SMS</span>
                    </div>
                    <div
                      onClick={() => setBillPaymentMethod('CBE_BIRR')}
                      className={`p-3 rounded-sm border cursor-pointer flex items-center gap-2 ${
                        billPaymentMethod === 'CBE_BIRR' ? 'border-[#C5A059] bg-[#FCFBFA]' : 'border-[#E5E1DA]'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-bold">CBE Birr</span>
                    </div>
                    <div
                      onClick={() => setBillPaymentMethod('CHAPA')}
                      className={`p-3 rounded-sm border cursor-pointer flex items-center gap-2 ${
                        billPaymentMethod === 'CHAPA' ? 'border-[#C5A059] bg-[#FCFBFA]' : 'border-[#E5E1DA]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-bold">Chapa Gateway</span>
                    </div>
                    <div
                      onClick={() => setBillPaymentMethod('STRIPE_CARD')}
                      className={`p-3 rounded-sm border cursor-pointer flex items-center gap-2 ${
                        billPaymentMethod === 'STRIPE_CARD' ? 'border-[#C5A059] bg-[#FCFBFA]' : 'border-[#E5E1DA]'
                      }`}
                    >
                      <Globe className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-bold">Stripe Card</span>
                    </div>
                  </div>
                </div>

                {(billPaymentMethod === 'TELEBIRR' || billPaymentMethod === 'CBE_BIRR') && (
                  <div className="space-y-3 bg-[#FCFBFA] p-4 border border-[#E5E1DA] rounded-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A]">Mobile Wallet OTP</span>
                      <button
                        type="button"
                        onClick={() => { setBillPhone('0911234567'); setBillOtp('4829'); }}
                        className="text-[10px] text-[#C5A059] font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded-sm"
                      >
                        ⚡ Fill Test (4829)
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={billPhone}
                        onChange={e => setBillPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E1DA] rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">SMS PIN / OTP</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={billOtp}
                        onChange={e => setBillOtp(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E1DA] rounded-sm bg-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {(billPaymentMethod === 'CHAPA' || billPaymentMethod === 'STRIPE_CARD') && (
                  <div className="space-y-3 bg-[#FCFBFA] p-4 border border-[#E5E1DA] rounded-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A]">Card Payment</span>
                      <button
                        type="button"
                        onClick={() => {
                          setBillCardNum('4242 4242 4242 4242');
                          setBillCardExp('08/28');
                          setBillCardCvc('456');
                        }}
                        className="text-[10px] text-[#C5A059] font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded-sm"
                      >
                        ⚡ Fill Test Visa
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={billCardNum}
                        onChange={e => setBillCardNum(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E1DA] rounded-sm bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Expiry</label>
                        <input
                          type="text"
                          required
                          value={billCardExp}
                          onChange={e => setBillCardExp(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E5E1DA] rounded-sm bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">CVC</label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={billCardCvc}
                          onChange={e => setBillCardCvc(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E5E1DA] rounded-sm bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E1DA]">
                  <button
                    type="button"
                    onClick={() => setSelectedBillOrder(null)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-widest text-[11px] rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={billSubmitting}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-bold uppercase tracking-widest text-[11px] rounded-sm transition-colors shadow-md"
                  >
                    {billSubmitting ? 'Processing Bill...' : `Authorize & Pay ${formatPrice(selectedBillOrder.totalAmount)}`}
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
