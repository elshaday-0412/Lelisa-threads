import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../services/api.js';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await ProductService.getCategories();
        setCategories(list);
      } catch (err) {
        console.error('Failed loading categories', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Curated Shemma &amp; Adornment Categories
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
            The Habesha Heritage Collections
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
            From ceremonial royal Zuria dresses and Lalibela suits to Axumite filigree crosses and Netela wraps, browse our 8 specialized collections.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-sm overflow-hidden border border-[#E5E1DA] hover:border-[#C5A059] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-72 bg-[#F4F1ED] overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] rounded-sm">
                      {cat.count} Pieces
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-serif font-light text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-light mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
