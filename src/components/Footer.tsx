import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import wanofiLogo from '../assets/images/logo.png';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast, t } = useApp();

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Subscribed to VIP Drops', 'Thank you for joining Wanofi Design heritage circle.', 'success');
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-12 px-6 md:px-16 shrink-0 border-t border-[#2A2A2A]">
      {/* Value props banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10 text-center md:text-left">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <Truck className="w-5 h-5 text-[#C5A059] shrink-0" />
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white">{t.expressDelivery}</h4>
            <p className="text-xs text-white/60 font-light mt-0.5">{t.footerExpressDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0" />
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white">{t.artisanCrafted}</h4>
            <p className="text-xs text-white/60 font-light mt-0.5">{t.footerArtisanDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <RefreshCw className="w-5 h-5 text-[#C5A059] shrink-0" />
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white">{t.bespokeFitting}</h4>
            <p className="text-xs text-white/60 font-light mt-0.5">{t.bespokeFittingDesc}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src={wanofiLogo}
              alt="Wanofi Design Logo"
              className="w-11 h-11 rounded-full object-cover border border-[#C5A059]/60 shadow-xs group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xl font-serif italic tracking-tight text-[#C5A059] font-bold block">
                {t.brandName}
              </span>
              <span className="text-[10px] text-white/60 tracking-wider font-mono flex items-center gap-1 mt-0.5">
                <Phone className="w-2.5 h-2.5 text-[#C5A059]" /> 0911704132 / 0919454971
              </span>
              <span className="text-[10px] text-white/60 tracking-wider font-mono flex items-center gap-1 mt-1">
                <Mail className="w-2.5 h-2.5 text-[#C5A059]" /> dam09031@gmail.com
              </span>
            </div>
          </Link>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Preserving the sacred weaving heritage of Shemma and Tilet. Crafted for celebrations, weddings, and modern elegance.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-5">{t.collectionsHeader}</h4>
          <ul className="space-y-2.5 text-xs text-white/70 font-light">
            <li>
              <Link to="/shop?category=Habesha+Kemis" className="hover:text-[#C5A059] transition-colors">
                Habesha Kemis
              </Link>
            </li>
            <li>
              <Link to="/shop?category=T-Shirts" className="hover:text-[#C5A059] transition-colors">
                T-Shirts & Shirts
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Sweaters" className="hover:text-[#C5A059] transition-colors">
                Sweaters (Shurabii)
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Children%27s+Wear" className="hover:text-[#C5A059] transition-colors">
                Children's Wear
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Scarves" className="hover:text-[#C5A059] transition-colors">
                Netela & Gabi Wraps
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Bags" className="hover:text-[#C5A059] transition-colors">
                Traditional Bags
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-5">{t.culturalHeritageHeader}</h4>
          <ul className="space-y-2.5 text-xs text-white/70 font-light">
            <li>
              <Link to="/shop?region=Amhara" className="hover:text-[#C5A059] transition-colors">
                Gondar & Lalibela Tilet
              </Link>
            </li>
            <li>
              <Link to="/shop?region=Tigray" className="hover:text-[#C5A059] transition-colors">
                Tigray Raya & Axum Zuria
              </Link>
            </li>
            <li>
              <Link to="/shop?region=Oromo" className="hover:text-[#C5A059] transition-colors">
                Oromo Woyya & Abba Gadaa
              </Link>
            </li>
            <li>
              <Link to="/shop?region=Harari" className="hover:text-[#C5A059] transition-colors">
                Harari Ge-Gara Silk
              </Link>
            </li>
            <li>
              <Link to="/shop?region=Gurage" className="hover:text-[#C5A059] transition-colors">
                Gurage Enset Kemis
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-5">{t.vipHeritageCircle}</h4>
          <p className="text-xs text-white/60 mb-4 font-light">
            Receive private notifications for seasonal weaves and bespoke bridal releases.
          </p>
          <form onSubmit={handleNewsletter} className="flex">
            <input
              type="email"
              required
              placeholder={t.emailPlaceholder}
              className="bg-white/10 text-xs px-3 py-2 rounded-l-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white placeholder-white/40 w-full"
            />
            <button
              type="submit"
              className="bg-[#C5A059] text-[#1A1A1A] px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-r-sm hover:bg-white transition-colors"
            >
              {t.subscribe}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar matching Clean Minimalism design HTML */}
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] font-medium">
        <div className="flex gap-8 opacity-60">
          <span>{t.expressDelivery}</span>
          <span>{t.artisanCrafted}</span>
          <span>{t.securePayments}</span>
        </div>
        <div className="flex gap-6">
          <Link to="/privacy" className="opacity-60 hover:opacity-100 transition-opacity">
            {t.privacy}
          </Link>
          <span className="text-[#C5A059]">{t.copyright}</span>
        </div>
      </div>
    </footer>
  );
};
