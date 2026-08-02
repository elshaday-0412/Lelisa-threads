import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { OrderService, PaymentService } from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CheckCircle2, Lock, ArrowRight, Smartphone, Building2, CreditCard, Globe, Printer, AlertCircle, CheckCircle } from 'lucide-react';
import { Order, PaymentReceipt } from '../types/index.js';

export const Checkout: React.FC = () => {
  const { cart, cartSubtotal, formatPrice, clearCart, user, showToast, t } = useApp();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user ? user.fullName : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(
    user?.addresses?.[0]?.street || 'Bole Road, Around Friendship Building'
  );
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Addis Ababa');
  const [region, setRegion] = useState(user?.addresses?.[0]?.region || 'Addis Ababa');
  const [paymentMethod, setPaymentMethod] = useState<'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'STRIPE_CARD' | 'DIASPORA_CARD' | 'CASH_ON_DELIVERY'>('TELEBIRR');

  // Payment gateway form state
  const [mobileWalletPhone, setMobileWalletPhone] = useState(user?.phone || '');
  const [otpPin, setOtpPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('456');
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentReceipt | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync user details when user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (user.fullName) setCustomerName(user.fullName);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) {
        setCustomerPhone(user.phone);
        setMobileWalletPhone(user.phone);
      }
      if (user.addresses && user.addresses.length > 0) {
        if (user.addresses[0].street) setShippingAddress(user.addresses[0].street);
        if (user.addresses[0].city) setCity(user.addresses[0].city);
        if (user.addresses[0].region) setRegion(user.addresses[0].region);
      }
    }
  }, [user]);

  const handleCustomerPhoneChange = (val: string) => {
    setCustomerPhone(val);
    // Automatically keep mobile wallet phone in sync if not manually detached
    if (!mobileWalletPhone || mobileWalletPhone === customerPhone || mobileWalletPhone === user?.phone) {
      setMobileWalletPhone(val);
    }
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

    setPaymentError(null);
    setIsSubmitting(true);

    try {
      let receipt: PaymentReceipt | null = null;

      // 1. If electronic payment method, invoke real payment processing API
      if (paymentMethod !== 'CASH_ON_DELIVERY') {
        try {
          const resPayment = await PaymentService.processPayment({
            amount: totalAmount,
            currency: 'ETB',
            paymentMethod,
            customerEmail,
            customerName,
            customerPhone,
            mobileNumber: mobileWalletPhone,
            otpPin,
            cardNumber,
            cardExp,
            cardCvc
          });

          if (!resPayment.success || !resPayment.receipt) {
            setPaymentError(resPayment.message || 'Payment authorization failed.');
            showToast('Payment Declined', resPayment.message || 'Please check your payment details and try again.', 'error');
            setIsSubmitting(false);
            return;
          }

          receipt = resPayment.receipt;
          setPaymentReceipt(receipt);
          showToast('Payment Authorized!', `Gateway reference ${receipt.transactionRef} confirmed.`, 'success');
        } catch (paymentErr: any) {
          const errorMsg = paymentErr.response?.data?.error || 'Unable to connect to payment gateway. Please verify your OTP or Card credentials.';
          setPaymentError(errorMsg);
          showToast('Payment Gateway Error', errorMsg, 'error');
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Submit Order with Verified Payment Metadata
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
        totalAmount,
        isPaid: paymentMethod !== 'CASH_ON_DELIVERY',
        transactionRef: receipt?.transactionRef,
        paymentTimestamp: receipt?.timestamp,
        paymentGatewayResponse: receipt?.gatewayDetails.authCode,
        cardLastFour: receipt?.gatewayDetails.cardLastFour,
        mobileWalletPhone: receipt?.gatewayDetails.mobileNumber
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
                  {confirmedOrder.transactionRef || paymentReceipt?.transactionRef || 'COD-OFFLINE'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E5E1DA] pb-2.5">
                <span className="text-gray-500">Authorization Code</span>
                <span className="font-mono font-bold text-green-700">
                  {confirmedOrder.paymentGatewayResponse || paymentReceipt?.gatewayDetails.authCode || 'APPROVED'}
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

            {/* 2. Ethiopian & International Payments */}
            <div className="bg-white p-6 md:p-8 border border-[#E5E1DA] rounded-sm">
              <h2 className="text-xl font-serif text-[#1A1A1A] font-light mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                Payment Gateway &amp; Billing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div
                  onClick={() => { setPaymentMethod('TELEBIRR'); setPaymentError(null); }}
                  className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'TELEBIRR'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Telebirr Instant</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Ethio Telecom SMS OTP
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => { setPaymentMethod('CBE_BIRR'); setPaymentError(null); }}
                  className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'CBE_BIRR'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">CBE Birr</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Commercial Bank Pay
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => { setPaymentMethod('CHAPA'); setPaymentError(null); }}
                  className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'CHAPA'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Chapa Gateway</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Local Bank / Telebirr
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => { setPaymentMethod('STRIPE_CARD'); setPaymentError(null); }}
                  className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'STRIPE_CARD'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Globe className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Stripe Card (Intl)</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Visa • Mastercard • Amex
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => { setPaymentMethod('DIASPORA_CARD'); setPaymentError(null); }}
                  className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'DIASPORA_CARD'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Diaspora Express</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      USD / EUR / GBP Cards
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => { setPaymentMethod('CASH_ON_DELIVERY'); setPaymentError(null); }}
                  className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-[#C5A059] bg-[#FCFBFA]'
                      : 'border-[#E5E1DA] hover:border-gray-400'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">Cash on Delivery</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Addis Ababa Only
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

              {/* Interactive Gateway Form for Electronic Payments */}
              {(paymentMethod === 'TELEBIRR' || paymentMethod === 'CBE_BIRR') && (
                <div className="bg-[#FCFBFA] p-5 border border-[#E5E1DA] rounded-sm space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]">
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      {paymentMethod === 'TELEBIRR' ? 'Ethio Telecom Telebirr Authorization' : 'CBE Birr Direct Mobile Pay'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileWalletPhone(user?.phone || customerPhone || '0911234567');
                        setOtpPin('4829');
                      }}
                      className="text-[10px] uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] font-bold px-2.5 py-1 rounded-sm hover:bg-[#C5A059]/25 transition-colors"
                    >
                      ⚡ Autofill Test OTP (4829)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                        Registered Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0911234567"
                        value={mobileWalletPhone}
                        onChange={e => setMobileWalletPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                        4-Digit SMS OTP / PIN
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Enter SMS OTP PIN"
                        value={otpPin}
                        onChange={e => setOtpPin(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059] font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 italic">
                    * Enter your mobile number and the SMS verification PIN. For testing, use OTP PIN <strong>4829</strong>.
                  </p>
                </div>
              )}

              {(paymentMethod === 'CHAPA' || paymentMethod === 'STRIPE_CARD' || paymentMethod === 'DIASPORA_CARD') && (
                <div className="bg-[#FCFBFA] p-5 border border-[#E5E1DA] rounded-sm space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]">
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      {paymentMethod === 'STRIPE_CARD' ? 'Stripe International Secure Card Pay' : (paymentMethod === 'CHAPA' ? 'Chapa Financial Card & Bank Gateway' : 'Diaspora Express Card Payment')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4242 4242 4242 4242');
                        setCardExp('08/28');
                        setCardCvc('456');
                      }}
                      className="text-[10px] uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] font-bold px-2.5 py-1 rounded-sm hover:bg-[#C5A059]/25 transition-colors"
                    >
                      ⚡ Autofill Test Visa (4242...4242)
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Card Number (Visa / Mastercard / Amex)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• ••••"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                        Expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExp}
                        onChange={e => setCardExp(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059] font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 italic">
                    * PCI-DSS Level 1 compliant TLS 1.3 encrypted transaction. Use any Visa or Mastercard.
                  </p>
                </div>
              )}

              {paymentMethod === 'CASH_ON_DELIVERY' && (
                <div className="bg-amber-50/60 p-4 border border-amber-200/80 rounded-sm text-xs text-amber-900 animate-in fade-in duration-300">
                  <p className="font-semibold mb-1">Addis Ababa City Delivery Only</p>
                  <p className="text-[11px] text-amber-800">
                    You will pay Cash or Telebirr upon receiving your garment at your doorstep. Please ensure someone is present at your delivery address.
                  </p>
                </div>
              )}

              {/* Security & Verification Note */}
              <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>256-Bit SSL Encrypted • Official Habesha Threads Merchant Gateway</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm">
                  Verified Active
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
                className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-sm transition-colors mt-8 flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting
                  ? 'Processing Payment...'
                  : paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'Place Order Now'
                    : 'Authorize Payment & Place Order'}
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
