import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { OrderService } from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CheckCircle2, Lock, ArrowRight, Smartphone, Building2, CreditCard } from 'lucide-react';
import { Order } from '../types/index.js';

export const Checkout: React.FC = () => {
  const { cart, cartSubtotal, formatPrice, clearCart, user, showToast } = useApp();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user ? user.fullName : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+251 911 234 567');
  const [shippingAddress, setShippingAddress] = useState(
    user?.addresses?.[0]?.street || 'Bole Road, Around Friendship Building'
  );
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Addis Ababa');
  const [region, setRegion] = useState(user?.addresses?.[0]?.region || 'Addis Ababa');
  const [paymentMethod, setPaymentMethod] = useState<'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY'>('TELEBIRR');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const shippingCost = cartSubtotal > 10000 || cartSubtotal === 0 ? 0 : 350;
  const totalAmount = cartSubtotal + shippingCost;

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-20 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-serif text-[#1A1A1A] mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">
          Please add Habesha garments or jewelry to your bag before checking out.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm inline-block transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) {
      showToast('Missing Details', 'Please complete your name, email, and delivery address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user ? user.id : 'guest',
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        region,
        paymentMethod,
        items: cart.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          image: item.product.images[0]
        })),
        subtotal: cartSubtotal,
        shippingCost,
        totalAmount
      };

      const resOrder = await OrderService.createOrder(payload);
      setConfirmedOrder(resOrder);
      clearCart();
      showToast('Order Placed Successfully!', `Your order ${resOrder.orderNumber} is confirmed.`, 'success');
      window.scrollTo(0, 0);
    } catch (err) {
      showToast('Order Error', 'There was a problem placing your order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-16 px-6 md:px-16">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-[#E5E1DA] rounded-sm shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
            Shemma Celebration Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2 mb-3">
            Thank You, {confirmedOrder.customerName}!
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-light mb-8">
            We have received your order <strong className="text-black">{confirmedOrder.orderNumber}</strong>. We will begin preparing your authentic Ethiopian weave immediately.
          </p>

          <div className="bg-[#FCFBFA] p-6 border border-[#E5E1DA] rounded-sm text-left mb-8 space-y-4 text-xs">
            <div className="flex justify-between border-b border-[#E5E1DA] pb-3">
              <span className="text-gray-500">Order Number</span>
              <span className="font-bold text-[#1A1A1A]">{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E1DA] pb-3">
              <span className="text-gray-500">Payment Gateway</span>
              <span className="font-bold text-[#C5A059]">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E1DA] pb-3">
              <span className="text-gray-500">Shipping Address</span>
              <span className="font-bold text-[#1A1A1A]">{confirmedOrder.shippingAddress}, {confirmedOrder.city}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E1DA] pb-3">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-serif font-bold text-base text-[#1A1A1A]">{formatPrice(confirmedOrder.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Dispatch</span>
              <span className="font-semibold text-green-600">3-5 Business Days (DHL/Express)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard?tab=orders"
              className="px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
            >
              View Order in Account
            </Link>
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-white hover:bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA] py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Secure Checkout
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] mt-1">
            Complete Your Habesha Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact & Address */}
            <div className="bg-white p-6 md:p-8 border border-[#E5E1DA] rounded-sm">
              <h2 className="text-xl font-serif text-[#1A1A1A] font-light mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
                Delivery &amp; Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sara Tadesse"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sara@example.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Phone Number (for Courier SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 911 234 567"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    City / Diaspora Location
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Addis Ababa">Addis Ababa, Ethiopia</option>
                    <option value="Gondar">Gondar, Ethiopia</option>
                    <option value="Bahir Dar">Bahir Dar, Ethiopia</option>
                    <option value="Mekelle">Mekelle, Ethiopia</option>
                    <option value="Hawassa">Hawassa, Ethiopia</option>
                    <option value="Adama">Adama, Ethiopia</option>
                    <option value="Washington DC (Diaspora)">Washington DC, USA (Diaspora Express)</option>
                    <option value="London (Diaspora)">London, UK (Diaspora Express)</option>
                    <option value="Stockholm (Diaspora)">Stockholm, Sweden (Diaspora Express)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                  Street Address / Landmark
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bole Road, Around Friendship Building, Apt 402"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* 2. Ethiopian & International Payments */}
            <div className="bg-white p-6 md:p-8 border border-[#E5E1DA] rounded-sm">
              <h2 className="text-xl font-serif text-[#1A1A1A] font-light mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod('TELEBIRR')}
                  className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'TELEBIRR'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Telebirr Instant</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Instant mobile wallet authorization via Ethio Telecom.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('CBE_BIRR')}
                  className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'CBE_BIRR'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">CBE Birr</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Commercial Bank of Ethiopia direct mobile payment.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('CHAPA')}
                  className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'CHAPA'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Chapa Card / Diaspora</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Visa, Mastercard, &amp; local Ethiopian bank transfers.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Cash on Delivery</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Pay upon delivery (Addis Ababa address only).
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Security Note */}
              <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex items-center gap-2 text-xs text-gray-500">
                <Lock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>256-Bit Encrypted Demo Transaction • Instant confirmation without charge.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 border border-[#E5E1DA] rounded-sm sticky top-28">
              <h2 className="text-xl font-serif text-[#1A1A1A] font-light mb-6 border-b border-[#E5E1DA] pb-4">
                Your Celebration Summary ({cart.length} items)
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto mb-6 pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 text-xs">
                    <div className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-sm bg-[#F4F1ED]"
                      />
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] line-clamp-1">{item.product.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Size: {item.selectedSize} • Tilet: {item.selectedColor}
                        </p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-[#1A1A1A] shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#E5E1DA] text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-serif">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-serif">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-3 border-t border-[#E5E1DA]">
                  <span className="font-serif italic">Total Due</span>
                  <span className="font-serif text-[#C5A059]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-sm transition-colors mt-8 flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? 'Confirming Order...' : 'Place Order Now'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <Link to="/shop" className="text-xs text-gray-400 hover:text-black underline">
                  Return to Shopping Bag
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
