import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../services/api.js';
import { Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { SEO } from '../components/SEO.js';
import { useApp } from '../context/AppContext.js';
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, Globe2 } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const featRes = await ProductService.getProducts({ featured: true, limit: 4 });
        const newRes = await ProductService.getProducts({ newarrival: true, limit: 4 });
        setFeaturedProducts(featRes.products);
        setNewArrivals(newRes.products);
      } catch (e) {
        console.error('Failed loading home data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heritageRegions = [
    {
      name: t.amharaHeritage,
      origin: t.gondarLalibela,
      desc: t.amharaDesc,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Amhara'
    },
    {
      name: t.tigrayHeritage,
      origin: t.axumRaya,
      desc: t.tigrayDesc,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Tigray'
    },
    {
      name: t.oromoHeritage,
      origin: t.woyyaAbbaGadaa,
      desc: t.oromoDesc,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Oromo'
    },
    {
      name: t.harariGurage,
      origin: t.geGaraEnset,
      desc: t.harariDesc,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Harari'
    }
  ];

  return (
    <div className="flex flex-col bg-[#FCFBFA] text-[#1A1A1A]">
      <SEO 
        title="Home"
        description="Wanofi Design — Premium Ethiopian Traditional Clothing & Custom Couture. Explore our handcrafted {t.catHabeshaKemis}, {t.catWedding}s, and authentic cultural heritage garments."
        keywords="Wanofi Design, Ethiopian Traditional Clothing, {t.catHabeshaKemis}, Custom Couture, Ethiopian Wedding, Tilet, Handwoven Fashion"
      />
      {/* Clean Minimalism Hero Section matching approved HTML */}
      <section className="flex flex-col justify-center items-center text-center px-6 md:px-12 py-20 md:py-28 bg-[#FCFBFA] border-b border-[#E5E1DA] relative overflow-hidden">
        {/* Decorative subtle background symbol watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <span className="text-[320px] font-serif select-none">❖</span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-sm md:text-base font-serif italic tracking-wide text-[#C5A059] font-bold block mb-3">
            {t.brandName}
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-light text-[#1A1A1A] tracking-tight leading-[1.05] mb-8">
            {t.heroTitle}
          </h1>

          <p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-12">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-[11px] uppercase tracking-[0.25em] font-semibold rounded-sm transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
              {t.shopNow}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/?section=heritage"
              onClick={() => {
                const el = document.getElementById('heritage-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-white text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#C5A059] text-[11px] uppercase tracking-[0.25em] font-semibold rounded-sm transition-all"
            >
              {t.exploreHeritage}
            </Link>
          </div>

          {/* Key proof points */}
          <div className="mt-20 pt-14 border-t border-[#E5E1DA]/60 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">{t.artisanCrafted}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">Shemma</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">{t.authenticShemma}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">Express</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">{t.expressDelivery}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">Telebirr</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">{t.securePayments}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Curated Galleries
              </span>
              <h2 className="text-4xl md:text-[2.75rem] font-serif font-light text-[#1A1A1A] mt-2 leading-tight">
                Explore Traditional Collections
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#C5A059] flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
            >
              {t.viewAllCategories} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/shop?category=Habesha+Kemis"
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-[#E5E1DA]/50 block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                alt={t.catHabeshaKemis}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  {t.catHabeshaKemis}
                </span>
                <h3 className="text-xl font-serif font-light mt-1">{t.catHabeshaKemis}</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  {t.catHabeshaKemisDesc}
                </p>
              </div>
            </Link>

            <Link
              to="/shop?category=T-Shirts"
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-[#E5E1DA]/50 block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
                alt={t.catTShirts}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  {t.catTShirts}
                </span>
                <h3 className="text-xl font-serif font-light mt-1">{t.catTShirts}</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  {t.catTShirtsDesc}
                </p>
              </div>
            </Link>

            <Link
              to="/shop?category=Bags"
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-[#E5E1DA]/50 block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
                alt={t.catBags}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  {t.catBags}
                </span>
                <h3 className="text-xl font-serif font-light mt-1">{t.catBags}</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  {t.catBagsDesc}
                </p>
              </div>
            </Link>

            <Link
              to="/shop?category=Sweaters"
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-[#E5E1DA]/50 block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1612040905953-3fdfdfbc3d45?auto=format&fit=crop&w=800&q=80"
                alt={t.catSweaters}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  {t.catSweaters}
                </span>
                <h3 className="text-xl font-serif font-light mt-1">{t.catSweaters}</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  {t.catSweatersDesc}
                </p>
              </div>
            </Link>          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Artisan Spotlight
              </span>
              <h2 className="text-4xl md:text-[2.75rem] font-serif font-light text-[#1A1A1A] mt-2 leading-tight">
                Featured Heritage Pieces
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#C5A059] flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
            >
              Browse All Featured <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#F4F1ED] animate-pulse rounded-sm"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The Heritage Story Section */}
      <section id="heritage-section" className="py-24 px-6 md:px-16 bg-[#F4F1ED]/50 border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              {t.weavingAcrossEthiopia}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
              {t.regionalTiletTitle}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              {t.everyRegionWeaves}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {heritageRegions.map((reg, idx) => (
              <Link
                key={idx}
                to={reg.link}
                className="bg-white text-[#1A1A1A] p-6 border border-[#E5E1DA] rounded-sm hover:border-[#C5A059] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 bg-[#F4F1ED] mb-4 rounded-sm overflow-hidden">
                    <img
                      src={reg.image}
                      alt={reg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                    {reg.origin}
                  </span>
                  <h3 className="text-lg font-serif font-semibold text-[#1A1A1A] mt-1 mb-2">
                    {reg.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                    {reg.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2D2D2D] flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  <span>{t.exploreRegion}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Just Arrived From Shemma Looms
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
                New Arrivals &amp; Seasonal Weaves
              </h2>
            </div>
            <Link
              to="/shop?newarrival=true"
              className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#C5A059] flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
            >
              {t.shopAllNew} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Banner */}
      <section className="py-24 px-6 md:px-16 bg-[#1A1A1A] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              {t.artOfShemma}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mt-3 mb-6 leading-tight">
              {t.fromArtisan}
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-8">{t.everyGarment}</p>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-2xl font-serif font-bold text-[#C5A059]">{t.handweavingTime}</p>
                <p className="text-xs text-white/60 mt-1 font-light">{t.handweavingDesc}</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-[#C5A059]">{t.organicCotton}</p>
                <p className="text-xs text-white/60 mt-1 font-light">{t.organicCottonDesc}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#C5A059]/30">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                alt="Ethiopian Traditional Weaving"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-[#1A1A1A] p-6 rounded-sm shadow-xl border border-[#E5E1DA] hidden sm:block max-w-xs">
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">{t.culturalGuarantee}</p>
              <p className="text-xs font-serif font-semibold mt-1">
                &ldquo;Wearing our heritage with pride across the globe.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-6 md:px-16 bg-[#FCFBFA] text-[#1A1A1A] border-b border-[#E5E1DA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              {t.voicesTitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2">
              {t.lovedBy}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white text-[#1A1A1A] p-8 border border-[#E5E1DA] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#C5A059] mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs font-light text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  &ldquo;{t.test1Desc}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2D2D2D]">
                <p className="text-xs font-bold text-[#1A1A1A] dark:text-white">{t.test1Name}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.test1Loc}</p>
              </div>
            </div>

            <div className="bg-white text-[#1A1A1A] p-8 border border-[#E5E1DA] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#C5A059] mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs font-light text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  &ldquo;{t.test2Desc}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2D2D2D]">
                <p className="text-xs font-bold text-[#1A1A1A] dark:text-white">{t.test2Name}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.test2Loc}</p>
              </div>
            </div>

            <div className="bg-white text-[#1A1A1A] p-8 border border-[#E5E1DA] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#C5A059] mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs font-light text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  &ldquo;The 24K Gold-Plated Filigree Cross Necklace is an absolute work of art. It reminds me of the ancient Axum crosses my grandmother wore. Truly stunning craftsmanship.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2D2D2D]">
                <p className="text-xs font-bold text-[#1A1A1A] dark:text-white">{t.test3Name}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.test3Loc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
