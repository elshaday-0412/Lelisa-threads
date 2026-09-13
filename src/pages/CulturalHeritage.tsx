import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const CulturalHeritage: React.FC = () => {
  const { t } = useApp();
  return (
    <div className="bg-[#FCFBFA] text-[#1A1A1A] min-h-screen">
      {/* Hero Banner */}
      <section className="py-24 px-6 md:px-16 border-b border-[#E5E1DA] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            {t.heritageHeroSubtitle}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mt-2 mb-6">
            {t.heritageHeroTitle}
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            {t.heritageHeroDesc}
          </p>
        </div>
      </section>

      {/* Story 1: Shemma Weaving */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white text-[#1A1A1A]">
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
              {t.heritageStep1Title}
            </span>
            <h2 className="text-3xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
              {t.heritageStep1Heading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
              {t.heritageStep1Desc1}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              {t.heritageStep1Desc2}
            </p>
          </div>
        </div>
      </section>

      {/* Story 2: Tilet Embroidery */}
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              {t.heritageStep2Title}
            </span>
            <h2 className="text-3xl font-serif font-light text-[#1A1A1A] mt-2 mb-4">
              {t.heritageStep2Heading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
              {t.heritageStep2Desc1}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              {t.heritageStep2Desc2}
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
      <section className="py-20 px-6 md:px-16 border-b border-[#E5E1DA] bg-white text-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              {t.heritageRegionsTitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2">
              {t.heritageRegionsHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#E5E1DA] rounded-sm bg-[#FCFBFA] text-[#1A1A1A]">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                {t.heritageRegion1Name}
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-1 mb-3">
                {t.heritageRegion1Heading}
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                {t.heritageRegion1Desc}
              </p>
            </div>

            <div className="p-8 border border-[#E5E1DA] rounded-sm bg-[#FCFBFA] text-[#1A1A1A]">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                {t.heritageRegion2Name}
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-1 mb-3">
                {t.heritageRegion2Heading}
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                {t.heritageRegion2Desc}
              </p>
            </div>

            <div className="p-8 border border-[#E5E1DA] rounded-sm bg-[#FCFBFA] text-[#1A1A1A]">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                {t.heritageRegion3Name}
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-1 mb-3">
                {t.heritageRegion3Heading}
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                {t.heritageRegion3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-light text-[#1A1A1A] mb-4">
            {t.heritageCtaTitle}
          </h2>
          <p className="text-xs text-gray-600 font-light mb-8">
            {t.heritageCtaDesc}
          </p>
          <Link
            to="/shop"
            className="px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm inline-flex items-center gap-2 transition-all shadow-lg"
          >
            {t.heritageCtaBtn} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
