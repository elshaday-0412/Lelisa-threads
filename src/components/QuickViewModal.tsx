import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { X, Heart, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RatingStars } from './RatingStars.js';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted, formatPrice, requireAuth } = useApp();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [qty, setQty] = useState<number>(1);

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || quickViewProduct.sizes[0] || 'Standard';
  const currentColor = selectedColor || quickViewProduct.colors[0] || 'White & Gold';
  const wishlisted = isWishlisted(quickViewProduct.id);

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(quickViewProduct, currentSize, currentColor, qty);
      setQuickViewProduct(null);
    }, 'Please log in or create an account to add items to your shopping bag.');
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(quickViewProduct, currentSize, currentColor, qty);
      setQuickViewProduct(null);
      navigate('/checkout');
    }, 'Please log in or create an account to proceed to checkout.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-[#181818] text-[#1A1A1A] dark:text-white w-full max-w-4xl rounded-sm shadow-2xl border border-[#E5E1DA] dark:border-[#2D2D2D] relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-[#222] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] dark:text-white flex items-center justify-center transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="h-64 sm:h-80 md:h-auto min-h-[260px] bg-[#F4F1ED] dark:bg-[#252525] relative overflow-hidden">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#181818]/90 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] rounded-sm shadow-xs">
              {quickViewProduct.region} Heritage
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold">
                {quickViewProduct.category}
              </p>
              <h2 className="text-2xl font-serif text-[#1A1A1A] dark:text-white font-light mt-1 mb-2">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <RatingStars
                  rating={quickViewProduct.rating}
                  reviewCount={quickViewProduct.reviewCount}
                  size="md"
                />
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-xs text-[#C5A059] font-medium">In Stock ({quickViewProduct.stock})</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white">
                  {formatPrice(quickViewProduct.price)}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6">
                {quickViewProduct.description}
              </p>

              {/* Material Badge */}
              <div className="mb-5 bg-[#FCFBFA] dark:bg-[#202020] p-3 border border-[#E5E1DA] dark:border-[#333] rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Weave & Material</p>
                <p className="text-xs text-[#1A1A1A] dark:text-white font-medium mt-0.5">{quickViewProduct.material}</p>
              </div>

              {/* Sizes */}
              <div className="mb-5">
                <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] dark:text-white font-bold mb-2">
                  Select Size: <span className="text-[#C5A059] font-normal">{currentSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${
                        currentSize === size
                          ? 'border-[#1A1A1A] dark:border-white bg-[#1A1A1A] dark:bg-white text-white dark:text-black'
                          : 'border-[#E5E1DA] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white hover:border-[#C5A059]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] dark:text-white font-bold mb-2">
                  Tilet & Colorway: <span className="text-[#C5A059] font-normal">{currentColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${
                        currentColor === color
                          ? 'border-[#C5A059] bg-[#C5A059] text-white'
                          : 'border-[#E5E1DA] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white hover:border-[#C5A059]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E5E1DA] dark:border-[#2D2D2D]">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E5E1DA] dark:border-[#333] rounded-sm bg-white dark:bg-[#222]">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2.5 text-xs font-bold hover:text-[#C5A059] dark:text-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold dark:text-white">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-2.5 text-xs font-bold hover:text-[#C5A059] dark:text-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.15em] font-bold py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>

                {/* Favorite */}
                <button
                  onClick={() => requireAuth(() => toggleWishlist(quickViewProduct.id), 'Please log in or create an account to save items to your wishlist.')}
                  className={`w-12 border border-[#E5E1DA] hover:border-[#C5A059] flex items-center justify-center rounded-sm transition-colors ${
                    wishlisted ? 'bg-[#C5A059]/10 border-[#C5A059]' : ''
                  }`}
                  title={wishlisted ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlisted ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#1A1A1A]'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#C5A059] hover:bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] font-bold py-3 rounded-sm transition-colors"
                >
                  Buy Now — Express
                </button>

                <button
                  onClick={() => {
                    setQuickViewProduct(null);
                    navigate(`/product/${quickViewProduct.id}`);
                  }}
                  className="px-4 border border-[#E5E1DA] hover:border-[#1A1A1A] text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center gap-1"
                >
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-500 font-light">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Authentic Ethiopian craftsmanship • Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
