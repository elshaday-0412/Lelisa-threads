import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { X, Star, Heart, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted, formatPrice } = useApp();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [qty, setQty] = useState<number>(1);

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || quickViewProduct.sizes[0] || 'Standard';
  const currentColor = selectedColor || quickViewProduct.colors[0] || 'White & Gold';
  const wishlisted = isWishlisted(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize, currentColor, qty);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, currentSize, currentColor, qty);
    setQuickViewProduct(null);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden border border-[#E5E1DA] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="h-80 md:h-[480px] bg-[#F4F1ED] relative overflow-hidden">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] rounded-sm">
              {quickViewProduct.region} Heritage
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[480px] overflow-y-auto">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold">
                {quickViewProduct.category}
              </p>
              <h2 className="text-2xl font-serif text-[#1A1A1A] font-light mt-1 mb-2">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                  <span className="text-sm font-semibold">{quickViewProduct.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({quickViewProduct.reviewCount} reviews)</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-[#C5A059] font-medium">In Stock ({quickViewProduct.stock})</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-serif font-bold text-[#1A1A1A]">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-base font-serif text-gray-400 line-through">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 font-light leading-relaxed mb-6">
                {quickViewProduct.description}
              </p>

              {/* Material Badge */}
              <div className="mb-5 bg-[#FCFBFA] p-3 border border-[#E5E1DA] rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Weave & Material</p>
                <p className="text-xs text-[#1A1A1A] font-medium mt-0.5">{quickViewProduct.material}</p>
              </div>

              {/* Sizes */}
              <div className="mb-5">
                <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] font-bold mb-2">
                  Select Size: <span className="text-[#C5A059] font-normal">{currentSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${
                        currentSize === size
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                          : 'border-[#E5E1DA] bg-white text-[#1A1A1A] hover:border-[#C5A059]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] font-bold mb-2">
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
                          : 'border-[#E5E1DA] bg-white text-[#1A1A1A] hover:border-[#C5A059]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E5E1DA]">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E5E1DA] rounded-sm bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2.5 text-xs font-bold hover:text-[#C5A059]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-2.5 text-xs font-bold hover:text-[#C5A059]"
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
                  onClick={() => toggleWishlist(quickViewProduct.id)}
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
