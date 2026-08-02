import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Heart, Eye, Star, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isWishlisted, setQuickViewProduct, addToCart, formatPrice } = useApp();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="flex flex-col group cursor-pointer select-none">
      {/* Image Container */}
      <div className="h-72 md:h-80 bg-[#F4F1ED] mb-3 relative rounded-sm overflow-hidden border border-[#E5E1DA]/50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Subtle mix-blend accent from theme */}
        <div className="absolute inset-0 bg-[#E5DBCF] mix-blend-multiply opacity-10 group-hover:opacity-0 transition-opacity pointer-events-none"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.stock <= 0 ? (
            <span className="bg-red-600 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold rounded-sm shadow-sm">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-600 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold rounded-sm shadow-sm">
              Only {product.stock} Left
            </span>
          ) : null}
          {product.isFeatured && (
            <span className="bg-[#1A1A1A] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold rounded-sm">
              Featured
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C5A059] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold rounded-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-110"
          aria-label="Add to Wishlist"
          title={wishlisted ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#1A1A1A]'
            }`}
          />
        </button>

        {/* Hover Action Bar: Quick View & Quick Bag */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-[#1A1A1A] text-[10px] uppercase tracking-widest py-2.5 font-bold rounded-sm shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            Quick View
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) {
                addToCart(product, product.sizes[0], product.colors[0], 1);
              }
            }}
            disabled={product.stock <= 0}
            className={`w-10 flex items-center justify-center rounded-sm shadow-md transition-colors ${
              product.stock <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#1A1A1A] hover:bg-[#C5A059] text-white'
            }`}
            title={product.stock <= 0 ? 'Out of Stock' : 'Quick Add to Bag'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold truncate">
            {product.region} / {product.category}
          </p>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span className="font-semibold text-[#1A1A1A]">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-sm font-serif font-semibold text-[#1A1A1A]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <p className="text-[11px] font-serif text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
