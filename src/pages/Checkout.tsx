import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { OrderService, PaymentService } from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CheckCircle2, Lock, ArrowRight, Smartphone, Building2, CreditCard, Globe, Printer, AlertCircle, CheckCircle } from 'lucide-react';
import { Order, PaymentReceipt } from '../types/index.js';

export const Checkout: React.FC = () => {
  const { cart, cartSubtotal, formatPrice, clearCart, user, showToast, requireAuth } = useApp();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user ? user.fullName : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(
    user?.addresses?.[0]?.street || 'Bole Road, Around Friendship Building'
  );
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Addis Ababa');
  const [region, setRegion] = useState(user?.addresses?.[0]?.region || 'Addis Ababa');
  const [paymentMethod, setPaymentMethod] = useState<'CHAPA' | 'CASH_ON_DELIVERY'>('CHAPA');

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync user details when user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (user.fullName) setCustomerName(user.fullName);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        if (user.addresses[0].street) setShippingAddress(user.addresses[0].street);
        if (user.addresses[0].city) setCity(user.addresses[0].city);
        if (user.addresses[0].region) setRegion(user.addresses[0].region);
      }
    }
  }, [user]);

  const handleCustomerPhoneChange = (val: string) => {
    setCustomerPhone(val);
  };

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

    requireAuth(async () => {
      setPaymentError(null);
      setIsSubmitting(true);

      try {
        if (paymentMethod === 'CHAPA') {
          // Initialize Chapa Hosted Checkout
          const resChapa = await PaymentService.createChapaCheckout({
            userId: user ? user.id : 'guest',
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            region,
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
          });

          if (resChapa.success && resChapa.checkoutUrl) {
            showToast('Redirecting...', 'Connecting to Chapa Secure Hosted Payment Gateway...', 'info');
            window.location.href = resChapa.checkoutUrl;
            return;
          } else {
            const errorMsg = resChapa.error || 'Failed to initialize Chapa Payment Session.';
            setPaymentError(errorMsg);
            showToast('Payment Initialization Error', errorMsg, 'error');
            setIsSubmitting(false);
            return;
          }
        } else {
          // Cash on Delivery Order
          const payload = {
            userId: user ? user.id : 'guest',
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            region,
            paymentMethod: 'CASH_ON_DELIVERY',
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
            totalAmount,
            isPaid: false
          };

          const resOrder = await OrderService.createOrder(payload);
          setConfirmedOrder(resOrder);
          clearCart();
          showToast('Order Placed Successfully!', `Your order ${resOrder.orderNumber} is confirmed.`, 'success');
          window.scrollTo(0, 0);
        }
      } catch (err: any) {
        console.error('Checkout error:', err);
        const errMessage = err.response?.data?.error || err.message || 'There was a problem placing your order. Please try again.';
        setPaymentError(errMessage);
        showToast('Order Error', errMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }, 'Please log in or create an account to place your order.');
  };

  // Success Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-16 px-6 md:px-16">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-[#E5E1DA] rounded-sm shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Shemma Celebration Confirmed
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2 mb-3">
              Thank You, {confirmedOrder.customerName}!
            </h1>
            <p className="text-xs md:text-sm text-gray-600 font-light mb-8 max-w-lg mx-auto">
              We have received your order <strong className="text-black">{confirmedOrder.orderNumber}</strong>. We will begin preparing your authentic Ethiopian weave immediately.
            </p>
          </div>

          {/* Official Merchant Payment Receipt Box */}
          <div className="bg-[#FCFBFA] border-2 border-[#C5A059]/40 rounded-sm p-6 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E1DA] mb-4 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-sm">Official Merchant Payment Receipt</h3>
                  <p className="text-[10px] text-gray-500">Habesha Threads Addis Ababa • Verified Gateway Transaction</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${
                confirmedOrder.isPaid ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {confirmedOrder.isPaid ? '✓ PAID IN FULL' : 'PAY ON DELIVERY'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Order Reference</span>
                <span className="font-bold text-[#1A1A1A]">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Payment Gateway</span>
                <span className="font-bold text-[#C5A059]">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Transaction Reference</span>
                <span className="font-mono font-bold text-[#1A1A1A]">
                  {confirmedOrder.transactionRef || 'COD-OFFLINE'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Authorization Code</span>
                <span className="font-mono font-bold text-green-700">
                  {confirmedOrder.paymentGatewayResponse || 'APPROVED'}
                </span>
              </div>
              {confirmedOrder.cardLastFour && (
                <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                  <span className="text-gray-500">Card Billed</span>
                  <span className="font-semibold text-[#1A1A1A]">•••• •••• •••• {confirmedOrder.cardLastFour}</span>
                </div>
              )}
              {confirmedOrder.mobileWalletPhone && (
                <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                  <span className="text-gray-500">Mobile Wallet Number</span>
                  <span className="font-semibold text-[#1A1A1A]">{confirmedOrder.mobileWalletPhone}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Shipping Address</span>
                <span className="font-semibold text-[#1A1A1A]">{confirmedOrder.shippingAddress}, {confirmedOrder.city}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-serif font-bold text-base text-[#1A1A1A]">{formatPrice(confirmedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E1DA] flex justify-between items-center text-[11px] text-gray-500">
              <span>Receipt issued: {new Date(confirmedOrder.createdAt).toLocaleString()}</span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E1DA] hover:bg-gray-100 text-[#1A1A1A] text-xs font-semibold rounded-sm transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save Receipt
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard?tab=orders"
              className="px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors text-center"
            >
              View Order in Account
            </Link>
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-white hover:bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] text-xs uppercase tracking-widest font-bold rounded-sm transition-colors text-center"
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
                    onChange={e => handleCustomerPhoneChange(e.target.value)}
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

            {/* 2. Payment Options: Chapa Online Gateway & Cash on Delivery */}
            <div className="bg-white p-6 md:p-8 border border-[#E5E1DA] rounded-sm">
              <h2 className="text-xl font-serif text-[#1A1A1A] font-light mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                Payment Gateway &amp; Billing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => { setPaymentMethod('CHAPA'); setPaymentError(null); }}
                  className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'CHAPA'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Chapa Secure Checkout</h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Telebirr • CBE Birr • Awash Birr • Visa / Mastercard
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => { setPaymentMethod('CASH_ON_DELIVERY'); setPaymentError(null); }}
                  className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Cash on Delivery</h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay Cash or Telebirr upon doorstep delivery (Addis Ababa)
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-sm flex items-center gap-2.5 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Gateway Explanations */}
              {paymentMethod === 'CHAPA' && (
                <div className="bg-[#FCFBFA] p-5 border border-[#E5E1DA] rounded-sm space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E5E1DA]">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-[#1A1A1A]">Chapa Financial Technologies Hosted Checkout</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    When you click place order below, you will be securely redirected to Chapa's official checkout page where you can choose <strong>Telebirr</strong>, <strong>CBE Birr</strong>, <strong>Awash Birr</strong>, or <strong>Credit/Debit Cards</strong>. Your payment is verified instantly.
                  </p>
                </div>
              )}

              {paymentMethod === 'CASH_ON_DELIVERY' && (
                <div className="bg-amber-50/60 p-4 border border-amber-200/80 rounded-sm text-xs text-amber-900 animate-in fade-in duration-300">
                  <p className="font-semibold mb-1">Addis Ababa Doorstep Delivery</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    You will pay Cash or Telebirr upon receiving your garment at your doorstep. Please ensure someone is present at your delivery address.
                  </p>
                </div>
              )}

              {/* Security & Verification Note */}
              <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>256-Bit SSL Encrypted • Powered by Chapa Gateway</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm">
                  Verified Gateway
                </span>
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
                className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-sm transition-colors mt-8 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Connecting to Gateway...'
                  : paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'Place Order (Cash on Delivery)'
                    : 'Pay with Chapa Secure Checkout'}
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
