import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  ShieldAlert,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  Truck,
  Sparkles,
  ChevronRight,
  PackageCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlistIds,
    setIsCartOpen,
    user,
    setIsAuthModalOpen,
    currencyMode,
    setCurrencyMode,
    isDarkMode,
    toggleDarkMode,
    language,
    setLanguage,
    t
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full shrink-0 shadow-xs border-b border-[#EBE7DF] dark:border-[#2A2A2A] transition-colors duration-200">
      {/* Top Utility Announcement Bar */}
      <div className="bg-white dark:bg-[#0D0D0D] text-[#1A1A1A] dark:text-white text-[10px] md:text-[11px] py-1.5 px-4 sm:px-8 flex items-center justify-between font-medium tracking-wider border-b border-[#EBE7DF] dark:border-[#1F1F1F]">
        <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{t.freeShippingQualify}</span>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto text-gray-800 dark:text-white/90">
          {/* Language Switcher */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-xs p-0.5 border border-black/10 dark:border-white/10">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-2xs transition-colors ${
                language === 'EN'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('AM')}
              className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-2xs transition-colors ${
                language === 'AM'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white'
              }`}
              title="አማርኛ (Amharic)"
            >
              አማ
            </button>
            <button
              onClick={() => setLanguage('OM')}
              className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-2xs transition-colors ${
                language === 'OM'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white'
              }`}
              title="Afaan Oromoo"
            >
              OM
            </button>
          </div>

          <div className="w-[1px] h-3 bg-gray-300 dark:bg-white/20"></div>

          {/* Currency Toggle */}
          <button
            onClick={() => setCurrencyMode(currencyMode === 'ETB' ? 'USD' : 'ETB')}
            className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#A37F38] dark:text-[#C5A059] hover:text-black dark:hover:text-white transition-colors"
            title="Toggle Currency Display (ETB / USD)"
          >
            <Globe className="w-3 h-3 text-[#A37F38] dark:text-[#C5A059]" />
            <span>{currencyMode}</span>
          </button>

          <div className="w-[1px] h-3 bg-gray-300 dark:bg-white/20"></div>

          {/* Theme Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-gray-700" />
            )}
          </button>

          {user?.role === 'ADMIN' && (
            <>
              <div className="w-[1px] h-3 bg-gray-300 dark:bg-white/20 hidden sm:block"></div>
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1 text-[#A37F38] dark:text-[#C5A059] hover:underline font-bold text-[10px]"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Admin</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="h-16 sm:h-20 bg-white dark:bg-[#141414] text-[#1A1A1A] dark:text-white flex items-center justify-between px-4 sm:px-8 md:px-12 transition-colors">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-serif italic tracking-tight text-[#C5A059] font-bold group-hover:opacity-90 transition-opacity">
              Lelisa Threads
            </span>
          </Link>

          {/* Center Links (Desktop Layout) */}
          <div className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em] font-medium opacity-90">
            <Link
              to="/shop?newarrival=true"
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${
                location.search.includes('newarrival')
                  ? 'text-[#C5A059] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059]'
                  : ''
              }`}
            >
              {t.shop}
            </Link>
            <Link
              to="/shop"
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${
                isActive('/shop') && !location.search.includes('newarrival')
                  ? 'text-[#C5A059] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059]'
                  : ''
              }`}
            >
              {t.allProducts}
            </Link>
            <Link
              to="/categories"
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${
                isActive('/categories')
                  ? 'text-[#C5A059] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059]'
                  : ''
              }`}
            >
              {t.categories}
            </Link>
            <Link
              to="/heritage"
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${
                isActive('/heritage')
                  ? 'text-[#C5A059] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059]'
                  : ''
              }`}
            >
              {t.heritage}
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-2.5 py-1 rounded-xs bg-[#C5A059]/10 border border-[#C5A059] hover:bg-[#C5A059] hover:text-white text-[#C5A059] font-bold flex items-center gap-1.5 transition-all text-[10px] ${
                  isActive('/admin') ? 'bg-[#C5A059] text-white' : ''
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.adminPortal}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Field or Expand Trigger */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
              <input
                type="text"
                autoFocus
                placeholder="Search kemis, region, tilet..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-36 sm:w-56 md:w-64 pl-3 pr-8 py-1.5 text-xs bg-[#FCFBFA] dark:bg-[#222] border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] text-[#1A1A1A] dark:text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2.5 text-gray-400 hover:text-black dark:hover:text-white"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
              aria-label="Search items"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="text-[11px] uppercase tracking-widest font-semibold hidden xl:inline">
                Search
              </span>
            </button>
          )}

          {/* Wishlist Link */}
          <Link
            to="/dashboard?tab=wishlist"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors relative"
            title="Wishlist & Favorites"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-xs">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors relative"
            title="Shopping Cart Drawer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Profile Trigger */}
          <button
            onClick={() => {
              if (user) {
                if (user.role === 'ADMIN') {
                  navigate('/admin');
                } else {
                  navigate('/dashboard');
                }
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E1DA] dark:border-[#333] hover:border-[#C5A059] rounded-sm text-gray-800 dark:text-gray-200 hover:text-[#C5A059] transition-colors"
            title={user ? `Logged in as ${user.fullName}` : 'Sign In'}
          >
            <UserIcon className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              {user ? (user.role === 'ADMIN' ? 'Admin' : user.fullName.split(' ')[0]) : 'Sign In'}
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-sm text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
            aria-label="Toggle Mobile Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Modern Slide-over Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
          {/* Dark Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content Container */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-[#181818] text-[#1A1A1A] dark:text-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Top Bar */}
            <div className="p-5 border-b border-[#E5E1DA] dark:border-[#2D2D2D] flex items-center justify-between bg-[#FCFBFA] dark:bg-[#141414]">
              <span className="text-lg font-serif italic text-[#C5A059] font-bold">
                Lelisa Threads
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-gray-600 dark:text-gray-300"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Drawer Body */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto">
              {/* Search Bar in Mobile Menu */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search Habesha Kemis, Tilet..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FCFBFA] dark:bg-[#222] border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] text-[#1A1A1A] dark:text-white"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </form>

              {/* Main Nav Links */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-2 px-1">
                  Navigation
                </span>
                <Link
                  to="/shop?newarrival=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-sm hover:bg-gray-50 dark:hover:bg-[#222] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>New Arrivals</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-sm hover:bg-gray-50 dark:hover:bg-[#222] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Shop All Collections</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/categories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-sm hover:bg-gray-50 dark:hover:bg-[#222] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Categories Gallery</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/heritage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-sm hover:bg-gray-50 dark:hover:bg-[#222] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Cultural Heritage</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-sm bg-[#C5A059]/10 text-[#C5A059] text-xs uppercase tracking-widest font-bold transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Admin Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </Link>
                )}
              </div>

              {/* Featured Category Quick-Links */}
              <div className="space-y-1.5 pt-4 border-t border-[#E5E1DA] dark:border-[#2D2D2D]">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-2 px-1">
                  Popular Categories
                </span>
                <Link
                  to="/shop?category=Habesha+Kemis"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-gray-700 dark:text-gray-300 hover:text-[#C5A059] py-1 px-1 font-light"
                >
                  • Habesha Kemis (Women's Dresses)
                </Link>
                <Link
                  to="/shop?category=Men%27s+Traditional+Wear"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-gray-700 dark:text-gray-300 hover:text-[#C5A059] py-1 px-1 font-light"
                >
                  • Men's Traditional Wear
                </Link>
                <Link
                  to="/shop?category=Wedding+Collection"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-gray-700 dark:text-gray-300 hover:text-[#C5A059] py-1 px-1 font-light"
                >
                  • Wedding & Mels Couture
                </Link>
                <Link
                  to="/shop?category=Jewelry"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs text-gray-700 dark:text-gray-300 hover:text-[#C5A059] py-1 px-1 font-light"
                >
                  • Axumite Filigree Jewelry
                </Link>
              </div>

              {/* Account Quick Options */}
              <div className="pt-4 border-t border-[#E5E1DA] dark:border-[#2D2D2D]">
                {user ? (
                  <div className="bg-[#FCFBFA] dark:bg-[#222] p-3 rounded-sm border border-[#E5E1DA] dark:border-[#333] space-y-2">
                    <div className="text-xs">
                      <p className="font-bold text-[#1A1A1A] dark:text-white">{user.fullName}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-bold py-2 rounded-xs transition-colors"
                    >
                      My Orders & Account
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" /> Sign In / Register
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 bg-[#FCFBFA] dark:bg-[#121212] border-t border-[#E5E1DA] dark:border-[#2D2D2D] text-[10px] text-gray-500 flex justify-between items-center">
              <span>Currency: <strong className="text-[#C5A059]">{currencyMode}</strong></span>
              <span>Lang: <strong className="text-[#C5A059]">{language}</strong></span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
