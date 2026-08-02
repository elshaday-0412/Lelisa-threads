import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductService } from '../services/api.js';
import { Product, CategoryName, RegionName } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { SlidersHorizontal, Grid, List, X, Search, ChevronDown, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const categoryParam = searchParams.get('category') || 'All';
  const regionParam = searchParams.get('region') || 'All';
  const genderParam = searchParams.get('gender') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'default';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: Array<CategoryName | 'All'> = [
    'All',
    'Habesha Kemis',
    "Men's Traditional Wear",
    'Wedding Collection',
    "Children's Wear",
    'Jewelry',
    'Scarves',
    'Shoes',
    'Bags'
  ];

  const regions: Array<RegionName | 'All'> = [
    'All',
    'Amhara',
    'Tigray',
    'Oromo',
    'Gurage',
    'Harari',
    'National Heritage'
  ];

  const genders = ['All', 'WOMEN', 'MEN', 'UNISEX', 'KIDS'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await ProductService.getProducts({
          category: categoryParam,
          region: regionParam,
          gender: genderParam,
          search: searchParam,
          sort: sortParam,
          limit: 30
        });
        setProducts(res.products);
        setTotalCount(res.pagination.total);
      } catch (err) {
        console.error('Failed fetching shop products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryParam, regionParam, genderParam, searchParam, sortParam]);

  const updateParam = (key: string, val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === 'All' || val === '' || val === 'default') {
      newParams.delete(key);
    } else {
      newParams.set(key, val);
    }
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#E5E1DA] pb-8 mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Shemma &amp; Tilet Marketplace
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] mt-2 mb-3">
            {categoryParam !== 'All' ? categoryParam : 'The Complete Heritage Collection'}
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-light">
            {regionParam !== 'All' && `Region: ${regionParam} • `}
            Showing {products.length} authentic handwoven Ethiopian garments and ceremonial accessories.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Left Buttons: Filter Drawer Trigger & Active Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E1DA] hover:border-[#C5A059] rounded-sm text-xs uppercase tracking-widest font-bold text-[#1A1A1A] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              Filters {isFilterOpen ? 'Active' : ''}
            </button>

            {/* Active Badges */}
            {categoryParam !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                {categoryParam}
                <button onClick={() => updateParam('category', 'All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {regionParam !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                Region: {regionParam}
                <button onClick={() => updateParam('region', 'All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {genderParam !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                For: {genderParam}
                <button onClick={() => updateParam('gender', 'All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchParam && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                Query: &ldquo;{searchParam}&rdquo;
                <button onClick={() => updateParam('search', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(categoryParam !== 'All' ||
              regionParam !== 'All' ||
              genderParam !== 'All' ||
              searchParam !== '' ||
              sortParam !== 'default') && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-red-500 underline flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            )}
          </div>

          {/* Right: Search, Sorting, Grid/List view */}
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search tilet, name, region..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full sm:w-56 pl-3 pr-8 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
              />
              <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <select
              value={sortParam}
              onChange={e => updateParam('sort', e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059] text-[#1A1A1A] font-medium"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Ratings</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            <div className="flex border border-[#E5E1DA] rounded-sm bg-white overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:text-black'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:text-black'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white p-6 border border-[#E5E1DA] rounded-sm mb-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-3">
                  Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateParam('category', cat)}
                      className={`px-3 py-1 text-xs rounded-sm border transition-all ${
                        categoryParam === cat
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold'
                          : 'bg-[#FCFBFA] text-gray-700 border-[#E5E1DA] hover:border-[#C5A059]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-3">
                  Regional Heritage
                </h4>
                <div className="flex flex-wrap gap-2">
                  {regions.map(reg => (
                    <button
                      key={reg}
                      onClick={() => updateParam('region', reg)}
                      className={`px-3 py-1 text-xs rounded-sm border transition-all ${
                        regionParam === reg
                          ? 'bg-[#C5A059] text-white border-[#C5A059] font-semibold'
                          : 'bg-[#FCFBFA] text-gray-700 border-[#E5E1DA] hover:border-[#C5A059]'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-3">
                  Audience / Gender
                </h4>
                <div className="flex flex-wrap gap-2">
                  {genders.map(g => (
                    <button
                      key={g}
                      onClick={() => updateParam('gender', g)}
                      className={`px-3 py-1 text-xs rounded-sm border transition-all ${
                        genderParam === g
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold'
                          : 'bg-[#FCFBFA] text-gray-700 border-[#E5E1DA] hover:border-[#C5A059]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Gallery */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="h-96 bg-gray-200 animate-pulse rounded-sm"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E5E1DA] rounded-sm">
            <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">No Heritage Garments Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any items matching your current filters. Try resetting your search query or region filter.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(prod => (
              <div
                key={prod.id}
                className="bg-white border border-[#E5E1DA] p-4 rounded-sm flex flex-col sm:flex-row gap-6 items-center hover:border-[#C5A059] transition-colors"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full sm:w-36 h-44 object-cover rounded-sm bg-[#F4F1ED]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                    {prod.region} • {prod.category}
                  </span>
                  <h3 className="text-xl font-serif text-[#1A1A1A] mt-1">{prod.name}</h3>
                  <p className="text-xs text-gray-600 font-light mt-2 line-clamp-2">
                    {prod.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>Material: {prod.material}</span>
                    <span>•</span>
                    <span>Sizes: {prod.sizes.join(', ')}</span>
                  </div>
                </div>
                <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E5E1DA]">
                  <div>
                    <p className="text-lg font-serif font-bold text-[#1A1A1A]">
                      {formatPrice(prod.price)}
                    </p>
                    {prod.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </p>
                    )}
                  </div>
                  <a
                    href={`/product/${prod.id}`}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
                  >
                    View Piece
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
