import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../services/api.js';
import { normalizeProduct } from '../utils/productUtils.js';
import { Product } from '../types/index.js';
import { useApp } from '../context/AppContext.js';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, ChevronRight, Award } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.js';
import { RatingStars } from '../components/RatingStars.js';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isWishlisted, formatPrice, user, showToast, requireAuth } = useApp();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'care'>('details');

  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const p = await ProductService.getProduct(id);
        if (p) {
          setProduct(p);
          setSelectedSize(p.sizes[0] || 'Standard');
          setSelectedColor(p.colors[0] || 'White & Gold');
          // Load similar
          const simRes = await ProductService.getProducts({ category: p.category, limit: 4 });
          setSimilarProducts(simRes.products.filter(item => item.id !== p.id));
        }
      } catch (err) {
        console.error('Failed loading product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-20 px-6 md:px-16 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-20 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-serif text-[#1A1A1A] mb-4">Garment Not Found</h2>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm inline-block"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, qty);
    }, 'Please log in or create an account to add items to your shopping bag.');
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, qty);
      navigate('/checkout');
    }, 'Please log in or create an account to proceed to checkout.');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    requireAuth(async () => {
      setIsSubmittingReview(true);
      try {
        const newRev = await ProductService.addReview(
          product.id,
          user ? user.fullName : 'Anonymous Habesha',
          ratingInput,
          commentInput,
          user?.id,
          user?.email
        );
        setProduct(prev => {
          if (!prev) return prev;
          const updatedReviews = [newRev, ...(prev.reviews || [])];
          const updatedProduct = normalizeProduct({
            ...prev,
            reviews: updatedReviews
          });
          return updatedProduct;
        });
        setCommentInput('');
        showToast('Review Submitted', 'Thank you for sharing your experience with our heritage circle.', 'success');
      } catch (err) {
        showToast('Error', 'Failed submitting your review. Please try again.', 'error');
      } finally {
        setIsSubmittingReview(false);
      }
    }, 'Please log in or create an account to write a review.');
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1A1A1A] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row-reverse gap-4">
            {/* Active big image */}
            <div className="flex-1 h-[450px] sm:h-[620px] bg-[#F4F1ED] rounded-sm overflow-hidden relative border border-[#E5E1DA]">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm">
                {product.region} Region Heritage
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-24 sm:w-24 sm:h-28 bg-[#F4F1ED] rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIdx === idx ? 'border-[#C5A059]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Form / Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                    {product.category} • {product.region}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] font-light mt-1 mb-3">
                    {product.name}
                  </h1>
                </div>

                <button
                  onClick={() => requireAuth(() => toggleWishlist(product.id), 'Please log in or create an account to save items to your wishlist.')}
                  className={`w-11 h-11 rounded-full border border-[#E5E1DA] hover:border-[#C5A059] flex items-center justify-center transition-colors ${
                    wishlisted ? 'bg-[#C5A059]/10 border-[#C5A059]' : ''
                  }`}
                  title={wishlisted ? 'Remove from Favorites' : 'Save to Favorites'}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlisted ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#1A1A1A]'
                    }`}
                  />
                </button>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E1DA]">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  title="View customer reviews"
                >
                  <RatingStars
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    size="md"
                  />
                </button>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold text-[#C5A059]">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Bespoke Order Only'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-serif font-bold text-[#1A1A1A]">
                  {formatPrice(product.price)}
                </span>
              </div>

              <p className="text-xs text-gray-600 font-light leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Material Info */}
              <div className="bg-[#F4F1ED]/50 p-4 border border-[#E5E1DA] rounded-sm mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Weave &amp; Fabric</p>
                  <p className="text-xs text-[#1A1A1A] font-semibold mt-0.5">{product.material}</p>
                </div>
                <Award className="w-6 h-6 text-[#C5A059] shrink-0" />
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                    Size: <span className="text-[#C5A059] font-normal">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => {
                      showToast(
                        'Custom Tailoring Available',
                        'You can provide exact shoulder & height measurements at checkout.',
                        'info'
                      );
                    }}
                    className="text-[11px] uppercase tracking-widest text-gray-500 underline hover:text-[#C5A059]"
                  >
                    Bespoke Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-medium rounded-sm border transition-all ${
                        selectedSize === size
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A] border-[#E5E1DA] hover:border-[#C5A059]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color & Tilet Selection */}
              <div className="mb-8">
                <label className="block text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-2">
                  Tilet &amp; Colorway: <span className="text-[#C5A059] font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-4 py-2 text-xs font-medium rounded-sm border transition-all ${
                        selectedColor === col
                          ? 'bg-[#C5A059] text-white border-[#C5A059]'
                          : 'bg-white text-[#1A1A1A] border-[#E5E1DA] hover:border-[#C5A059]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="mb-6">
                {product.stock <= 0 ? (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <span>Currently Out of Stock — Master weavers preparing next edition.</span>
                  </div>
                ) : product.stock <= 5 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                      <span>Limited Stock: Only {product.stock} units remaining!</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">Fast Dispatch</span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs font-medium rounded-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    <span>In Stock ({product.stock} units ready in Addis Ababa vault)</span>
                  </div>
                )}
              </div>

              {/* Add to Cart / Buy Now */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#E5E1DA] rounded-sm bg-white">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={product.stock <= 0}
                      className="px-3.5 py-3 text-xs font-bold hover:text-[#C5A059] disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">{product.stock <= 0 ? 0 : qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      disabled={product.stock <= 0 || qty >= product.stock}
                      className="px-3.5 py-3 text-xs font-bold hover:text-[#C5A059] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 ${
                      product.stock <= 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1A1A1A] hover:bg-[#C5A059] text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className={`w-full text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-sm transition-colors shadow-md ${
                    product.stock <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-[#C5A059] hover:bg-[#1A1A1A] text-white'
                  }`}
                >
                  {product.stock <= 0 ? 'Item Currently Unavailable' : 'Buy Now — Express Celebration Shipping'}
                </button>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#E5E1DA]">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>DHL Express Worldwide</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Authentic Ethiopian Weave</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Details, Care & Reviews */}
        <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden mb-20">
          <div className="flex border-b border-[#E5E1DA] bg-[#FCFBFA]">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-8 py-4 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-[#C5A059] text-[#1A1A1A] bg-white'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Weaving Story &amp; Specifications
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`px-8 py-4 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors ${
                activeTab === 'care'
                  ? 'border-[#C5A059] text-[#1A1A1A] bg-white'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Shemma Care Instructions
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#C5A059] text-[#1A1A1A] bg-white'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Customer Reviews ({product.reviews.length})
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-600 leading-relaxed font-light">
                <div>
                  <h3 className="text-base font-serif font-semibold text-[#1A1A1A] mb-3">
                    Authentic Shemma Heritage
                  </h3>
                  <p className="mb-4">
                    The {product.name} is a masterwork of Ethiopian cultural fashion. Spun from long-staple organic Ethiopian cotton, the Shemma fabric is breathable yet structured, making it perfect for both daytime ceremonies and evening receptions.
                  </p>
                  <p>
                    The Tilet borders are woven with metallic gold and colored threads, representing regional blessings and historical motifs preserved since the Axumite empire.
                  </p>
                </div>
                <div className="bg-[#FCFBFA] p-6 border border-[#E5E1DA] rounded-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1A1A1A]">Region of Origin</span>
                    <span>{product.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1A1A1A]">Category</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1A1A1A]">Weaving Method</span>
                    <span>Traditional Wooden Loom (Handwoven)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1A1A1A]">Custom Fit Support</span>
                    <span>Available upon request</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-light">
                <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">
                  How to Care for your Habesha Kemis &amp; Traditional Wear
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Hand Washing Recommended:</strong> Wash gently in cold water using a mild pH-neutral liquid soap. Avoid harsh detergents or bleach that can fade Tilet embroidery.
                  </li>
                  <li>
                    <strong>Dry Cleaning:</strong> For garments with heavy metallic 24K gold thread Tilet or velvet accents, professional dry cleaning is strongly advised.
                  </li>
                  <li>
                    <strong>Ironing:</strong> Press on a low-to-medium heat setting while the garment is slightly damp, or use a cloth barrier over the Tilet border.
                  </li>
                  <li>
                    <strong>Storage:</strong> Store folded in a breathable cotton garment bag away from direct sunlight.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating Overview Box */}
                <div className="p-6 bg-white dark:bg-[#1C1C1C] border border-[#E5E1DA] dark:border-[#333] rounded-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#E5E1DA] dark:border-[#333] pb-6 md:pb-0 md:pr-6 text-center">
                    <span className="text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A] dark:text-[#C5A059]">
                      {product.rating.toFixed(1)}
                    </span>
                    <RatingStars rating={product.rating} showScore={false} showCount={false} size="lg" className="my-2" />
                    <span className="text-xs text-[#C5A059] dark:text-[#C5A059] uppercase tracking-widest font-semibold">
                      Based on {product.reviewCount} customer {product.reviewCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  {/* Rating Breakdown Bars */}
                  <div className="md:col-span-7 space-y-2">
                    {[5, 4, 3, 2, 1].map(numStars => {
                      const count = product.reviews.filter(r => Math.round(r.rating) === numStars).length;
                      const pct = product.reviews.length > 0 ? Math.round((count / product.reviews.length) * 100) : (numStars === 5 ? 100 : 0);
                      return (
                        <div key={numStars} className="flex items-center gap-3 text-xs">
                          <span className="w-12 text-[#1A1A1A] dark:text-[#C5A059] font-semibold shrink-0 flex items-center gap-1">
                            {numStars} <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                          </span>
                          <div className="flex-1 h-2 bg-[#F4F1ED] dark:bg-[#2B2B2B] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#C5A059] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <span className="w-10 text-right text-[#C5A059] dark:text-[#C5A059] text-[11px] font-mono font-bold shrink-0">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit review form */}
                <form onSubmit={handleReviewSubmit} className="bg-[#FCFBFA] dark:bg-[#1A1A1A] p-6 border border-[#E5E1DA] dark:border-[#333] rounded-sm">
                  <h4 className="text-sm font-serif font-semibold text-[#1A1A1A] dark:text-[#C5A059] mb-3">
                    Share Your Review
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] dark:text-[#C5A059] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user ? user.fullName : 'Anonymous Habesha'}
                        className="w-full px-3 py-2 text-xs bg-gray-100 dark:bg-[#252525] border border-[#E5E1DA] dark:border-[#333] rounded-sm text-[#1A1A1A] dark:text-[#C5A059] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] dark:text-[#C5A059] mb-1">
                        Rating
                      </label>
                      <select
                        value={ratingInput}
                        onChange={e => setRatingInput(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252525] border border-[#E5E1DA] dark:border-[#333] text-[#1A1A1A] dark:text-[#C5A059] font-bold rounded-sm focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="5" className="text-[#C5A059] bg-white dark:bg-[#252525]">★★★★★ (5 - Exceptional)</option>
                        <option value="4" className="text-[#C5A059] bg-white dark:bg-[#252525]">★★★★☆ (4 - Excellent)</option>
                        <option value="3" className="text-[#C5A059] bg-white dark:bg-[#252525]">★★★☆☆ (3 - Good)</option>
                        <option value="2" className="text-[#C5A059] bg-white dark:bg-[#252525]">★★☆☆☆ (2 - Fair)</option>
                        <option value="1" className="text-[#C5A059] bg-white dark:bg-[#252525]">★☆☆☆☆ (1 - Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] dark:text-[#C5A059] mb-1">
                      Your Comments
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about the fit, weaving quality, or celebration where you wore it..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      className="w-full p-3 text-xs bg-white dark:bg-[#252525] border border-[#E5E1DA] dark:border-[#333] text-[#1A1A1A] dark:text-[#C5A059] font-semibold placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 bg-[#1A1A1A] dark:bg-[#C5A059] hover:bg-[#C5A059] dark:hover:bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>

                {/* List of reviews */}
                <div className="space-y-6">
                  {product.reviews.length === 0 ? (
                    <p className="text-xs text-[#C5A059] font-medium italic">
                      No reviews yet for this garment. Be the first to review!
                    </p>
                  ) : (
                    product.reviews.map(rev => (
                      <div
                        key={rev.id}
                        className="p-6 bg-white dark:bg-[#1C1C1C] border border-[#E5E1DA] dark:border-[#333] rounded-sm flex flex-col sm:flex-row justify-between items-start gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#C5A059]">{rev.userName}</span>
                            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] bg-[#FCFBFA] dark:bg-[#252525] px-2 py-0.5 border border-[#E5E1DA] dark:border-[#333] rounded-sm font-bold">
                              Verified Habesha Buyer
                            </span>
                          </div>
                          <div className="mb-2">
                            <RatingStars rating={rev.rating} showScore={false} showCount={false} size="sm" />
                          </div>
                          <p className="text-xs text-[#1A1A1A] dark:text-[#C5A059] font-medium leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#C5A059] font-semibold shrink-0">
                          {rev.createdAt}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar / Related Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-8">
              You May Also Appreciate in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
