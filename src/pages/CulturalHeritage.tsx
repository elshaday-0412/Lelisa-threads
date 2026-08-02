import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const CulturalHeritage: React.FC = () => {
  return (
    <div className="bg-[#FCFBFA] min-h-screen">
      {/* Hero Banner */}
      <section className="py-24 px-6 md:px-16 border-b border-[#E5E1DA] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            The Soul of Ethiopia
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mt-2 mb-6">
            The Living Heritage of Shemma &amp; Tilet
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            For over three millennia, the traditional handwoven Ethiopian dress has been a canvas of identity, spirituality, and celebration. Discover the artistry behind every Lelisa Threads creation.
          </p>
        </div>
      </section>

      {/* Story 1: Shemma Weaving */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-[#F4F1ED] rounded-sm overflow-hidden border border-[#E5E1DA]">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
              alt="Handweaving Shemma"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Step 1: Spun by Hand
            </span>
            <h2 className="text-3xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
              The Pure Ethiopian Cotton Shemma
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
              Garment creation begins in the highlands of Ethiopia, where organic, long-staple cotton is harvested. Women artisans spin the raw fleece into fine cotton thread using a traditional spindle known as a &ldquo;enzirt.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              Once spun, master weavers—known as &ldquo;Shemane&rdquo;—sit at wooden handlooms to weave the fabric strip by strip. The result is a luminous white cotton cloth that is breathable in summer yet insulating in mountain breezes.
            </p>
          </div>
        </div>
      </section>

      {/* Story 2: Tilet Embroidery */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Step 2: Sacred Geometry
            </span>
            <h2 className="text-3xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
              Tilet: The Language of Borders
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
              The defining glory of every Habesha Kemis is the &ldquo;Tilet&rdquo;—the intricate decorative border woven along the hem, sleeves, and center bodice. Using silk and metallic 24K gold threads, weavers embed ancient motifs.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              Common motifs include the Lalibela cross, the Axumite obelisk steps, and royal diamond patterns. A complex bridal Tilet can take up to three weeks of continuous weaving to complete.
            </p>
          </div>
          <div className="order-1 lg:order-2 aspect-[4/3] bg-[#F4F1ED] rounded-sm overflow-hidden border border-[#E5E1DA]">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
              alt="Tilet Embroidery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Regional Traditions Grid */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Diversity in Unity
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2">
              Regional Dress Across Ethiopia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#E5E1DA] rounded-sm bg-[#FCFBFA]">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                Northern Highlands
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-1 mb-3">
                Amhara &amp; Tigray Traditions
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Known for immaculate white Shemma dresses with gold and royal blue Tilet bands. Women style their hair in intricate Sheruba braids and drape matching Netela shawls during church services.
              </p>
            </div>

            <div className="p-8 border border-[#E5E1DA] rounded-sm bg-[#FCFBFA]">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                Southern &amp; Central Valleys
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-1 mb-3">
                Oromo &amp; Gurage Heritage
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Bold red, black, and white geometric Woyya robes worn during Irreecha and wedding festivities, celebrating agricultural abundance and the democratic Gadaa heritage.
              </p>
            </div>

            <div className="p-8 border border-[#E5E1DA] rounded-sm bg-[#FCFBFA]">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                Eastern &amp; Walled City
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-1 mb-3">
                Harari Cultural Elegance
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Rich silk and cotton tunics with vibrant crimson and saffron embroidery, paired with heirloom silver jewelry and headpieces worn in the historic walled city of Harar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-light text-[#1A1A1A] mb-4">
            Wear Your Heritage with Pride
          </h2>
          <p className="text-xs text-gray-600 font-light mb-8">
            Explore our curated catalog of authentic, handwoven garments crafted by master artisans in Addis Ababa and across Ethiopia.
          </p>
          <Link
            to="/shop"
            className="px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm inline-flex items-center gap-2 transition-all shadow-lg"
          >
            Explore Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
