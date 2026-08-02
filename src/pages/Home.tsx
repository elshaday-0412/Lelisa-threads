import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../services/api.js';
import { Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, Globe2 } from 'lucide-react';

export const Home: React.FC = () => {
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
      name: 'Amhara Heritage',
      origin: 'Gondar & Lalibela',
      desc: 'Known for pristine white handwoven cotton Shemma with rich Tilet embroidery featuring golden crosses and royal geometric bands.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Amhara'
    },
    {
      name: 'Tigray Heritage',
      origin: 'Axum & Raya',
      desc: 'Celebrated for vibrant Raya braiding, intricate Axumite Zuria patterns, and exquisite silver and gold filigree adornments.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Tigray'
    },
    {
      name: 'Oromo Heritage',
      origin: 'Woyya & Abba Gadaa',
      desc: 'Distinctive handwoven Woyya robes with bold red, black, and white Tilet motifs representing unity and traditional leadership.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Oromo'
    },
    {
      name: 'Harari & Gurage',
      origin: 'Ge-Gara & Enset Weaves',
      desc: 'Richly dyed silk and cotton weaves with intricate floral and geometric embroidery worn during celebrations and wedding ceremonies.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
      link: '/shop?region=Harari'
    }
  ];

  return (
    <div className="flex flex-col bg-[#FCFBFA]">
      {/* Clean Minimalism Hero Section matching approved HTML */}
      <section className="flex flex-col justify-center items-center text-center px-6 md:px-12 py-20 md:py-28 bg-[#FCFBFA] border-b border-[#E5E1DA] relative overflow-hidden">
        {/* Decorative subtle background symbol watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <span className="text-[320px] font-serif select-none">❖</span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-sm md:text-base font-serif italic tracking-wide text-[#C5A059] font-bold block mb-3">
            The Habesha Heritage Collection
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1A1A1A] tracking-tight leading-[1.1] mb-6">
            Eternal Threads of Culture &amp; Ceremony
          </h1>

          <p className="text-sm md:text-base text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Handwoven by master artisans in Ethiopia. Each Habesha Kemis, traditional suit, and Axumite jewel carries centuries of Shemma craftsmanship—crafted for weddings, celebrations, and generations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              Explore All Collections
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop?category=Wedding+Collection"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F4F1ED] text-[#1A1A1A] border border-[#E5E1DA] hover:border-[#C5A059] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all"
            >
              Bridal &amp; Mels Couture
            </Link>
          </div>

          {/* Key proof points */}
          <div className="mt-14 pt-10 border-t border-[#E5E1DA]/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">100% Cotton</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">Authentic Shemma</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">Handwoven</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">Tilet Embroidery</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">Bespoke Fit</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">Custom Tailoring</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-serif font-bold text-[#1A1A1A]">Global Express</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-0.5">Addis • US • Europe</p>
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
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
                Explore Traditional Collections
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#C5A059] flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
            >
              View All 8 Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/shop?category=Habesha+Kemis"
              className="group relative h-96 rounded-sm overflow-hidden border border-[#E5E1DA] block"
            >
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                alt="Habesha Kemis"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Women's Heritage
                </span>
                <h3 className="text-xl font-serif font-light mt-1">Habesha Kemis</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  Handwoven Zuria dresses with royal Tilet embroidery.
                </p>
              </div>
            </Link>

            <Link
              to="/shop?category=Men%27s+Traditional+Wear"
              className="group relative h-96 rounded-sm overflow-hidden border border-[#E5E1DA] block"
            >
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Men's Traditional Wear"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Men's Royal
                </span>
                <h3 className="text-xl font-serif font-light mt-1">Traditional Suits</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  Embroidered cotton suits, tunics &amp; Koba capes.
                </p>
              </div>
            </Link>

            <Link
              to="/shop?category=Wedding+Collection"
              className="group relative h-96 rounded-sm overflow-hidden border border-[#E5E1DA] block"
            >
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                alt="Wedding Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Bridal &amp; Mels
                </span>
                <h3 className="text-xl font-serif font-light mt-1">Wedding Collection</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  Regal wedding gowns with 24K gold-threaded Tilet.
                </p>
              </div>
            </Link>

            <Link
              to="/shop?category=Jewelry"
              className="group relative h-96 rounded-sm overflow-hidden border border-[#E5E1DA] block"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
                alt="Axumite Jewelry"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                  Adornments
                </span>
                <h3 className="text-xl font-serif font-light mt-1">Axumite Jewelry</h3>
                <p className="text-xs text-white/70 font-light mt-1">
                  Handcrafted filigree crosses &amp; ceremonial headpieces.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Artisan Spotlight
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
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
                <div key={i} className="h-96 bg-[#F4F1ED] animate-pulse rounded-sm"></div>
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
              Weaving Across Ethiopia
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
              Regional Tilet &amp; Traditions
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
              Every region of Ethiopia weaves its story into the fabric of the Shemma. From the historic castles of Gondar to the ancient obelisks of Axum, discover garments that celebrate regional identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {heritageRegions.map((reg, idx) => (
              <Link
                key={idx}
                to={reg.link}
                className="bg-white p-6 border border-[#E5E1DA] rounded-sm hover:border-[#C5A059] transition-all flex flex-col justify-between group"
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
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    {reg.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  <span>Explore Region</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white">
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
              Shop All New Arrivals <ArrowRight className="w-3.5 h-3.5" />
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
              The Art of Shemma
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mt-3 mb-6 leading-tight">
              From the Artisan's Loom to Your Celebratory Moment
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-8">
              Every Habesha Threads garment begins with pure Ethiopian cotton spun by hand into delicate thread. Master weavers then loom the Shemma on traditional wooden looms, while skilled embroiderers stitch the Tilet pattern—a labor of love taking up to 4 weeks per dress.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-2xl font-serif font-bold text-[#C5A059]">4+ Weeks</p>
                <p className="text-xs text-white/60 mt-1 font-light">Handweaving &amp; Embroidery Time</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-[#C5A059]">100% Organic</p>
                <p className="text-xs text-white/60 mt-1 font-light">Ethiopian High-Grade Cotton</p>
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
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Cultural Guarantee</p>
              <p className="text-xs font-serif font-semibold mt-1">
                &ldquo;Wearing our heritage with pride across the globe.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-6 md:px-16 bg-[#FCFBFA] border-b border-[#E5E1DA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Voices of our Heritage Circle
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2">
              Loved by Habeshas Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#E5E1DA] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#C5A059] mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs font-light text-gray-700 leading-relaxed italic">
                  &ldquo;I ordered the Sheba Royal Gold Habesha Kemis for my wedding Mels ceremony in Washington DC. The tailoring was flawless and the Tilet gold threads glimmered in every photo!&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-[#1A1A1A]">Helen Mekonnen</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Washington, DC</p>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#E5E1DA] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#C5A059] mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs font-light text-gray-700 leading-relaxed italic">
                  &ldquo;The Lalibela Embroidered Traditional Suit for my husband fit like bespoke Savile Row tailoring. High-grade cotton and the embroidery is authentic. We will be ordering again.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-[#1A1A1A]">Bethelhem &amp; Dawit</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Addis Ababa, Ethiopia</p>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#E5E1DA] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#C5A059] mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs font-light text-gray-700 leading-relaxed italic">
                  &ldquo;The 24K Gold-Plated Filigree Cross Necklace is an absolute work of art. It reminds me of the ancient Axum crosses my grandmother wore. Truly stunning craftsmanship.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-[#1A1A1A]">Yared Kassahun</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">London, UK</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
