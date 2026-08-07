import React from 'react';
import { useApp } from '../context/AppContext.js';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartCount,
    formatPrice,
    requireAuth,
    t
  } = useApp();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const shippingCost = cartSubtotal > 10000 || cartSubtotal === 0 ? 0 : 350; // free shipping over 10,000 ETB
  const totalAmount = cartSubtotal + shippingCost;

  const handleCheckout = () => {
    requireAuth(() => {
      setIsCartOpen(false);
      navigate('/checkout');
    }, 'Please log in or create an account to proceed to checkout.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FCFBFA] dark:bg-[#181818] text-[#1A1A1A] dark:text-white shadow-2xl border-l border-[#E5E1DA] dark:border-[#2D2D2D] flex flex-col justify-between select-none animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#E5E1DA] dark:border-[#2D2D2D] bg-white dark:bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h2 className="text-base font-serif italic font-semibold text-[#1A1A1A] dark:text-white">
                {t.yourShoppingBag} ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F4F1ED] flex items-center justify-center mb-4 text-[#C5A059]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif italic mb-1 text-[#1A1A1A]">{t.bagEmptyTitle}</h3>
                <p className="text-xs text-gray-500 font-light max-w-xs mb-6">
                  {t.bagEmptySubtitle}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-[11px] uppercase tracking-[0.2em] font-bold rounded-sm transition-colors"
                >
                  {t.exploreCollection}
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  className="flex gap-4 p-4 bg-white dark:bg-[#202020] rounded-sm border border-[#E5E1DA] dark:border-[#333] relative group"
                >
                  {/* Image */}
                  <div className="w-20 h-24 bg-[#F4F1ED] dark:bg-[#2A2A2A] rounded-sm overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-[#1A1A1A] dark:text-white truncate pr-4">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold mt-0.5">
                        {item.product.region} • {item.selectedSize}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-light truncate">
                        Tilet: {item.selectedColor}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      {/* Qty Counter */}
                      <div className="flex items-center border border-[#E5E1DA] dark:border-[#333] rounded-sm bg-[#FCFBFA] dark:bg-[#181818]">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-semibold dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-serif font-bold text-[#1A1A1A] dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white dark:bg-[#141414] border-t border-[#E5E1DA] dark:border-[#2D2D2D] space-y-4">
              {/* Free shipping notice */}
              <div className="flex items-center gap-2 text-xs text-[#C5A059] bg-[#FCFBFA] dark:bg-[#202020] p-2.5 rounded-sm border border-[#E5E1DA] dark:border-[#333]">
                <Truck className="w-4 h-4 shrink-0" />
                <span>
                  {shippingCost === 0
                    ? t.freeShippingQualify
                    : `${t.freeShippingAddMore} (${formatPrice(10000 - cartSubtotal)})`}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t.subtotal}</span>
                  <span className="font-serif">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t.shippingFee}</span>
                  <span className="font-serif">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] dark:text-white pt-2 border-t border-[#E5E1DA] dark:border-[#2D2D2D]">
                  <span className="font-serif italic">{t.total}</span>
                  <span className="font-serif text-[#C5A059]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                {t.proceedCheckout} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <button
                  onClick={clearCart}
                  className="hover:text-red-500 underline uppercase tracking-widest"
                >
                  {t.clearBag}
                </button>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{t.encryptedPayment}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
