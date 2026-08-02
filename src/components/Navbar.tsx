import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { Search, Heart, ShoppingBag, User as UserIcon, ShieldAlert, Menu, X, Globe, Sun, Moon } from 'lucide-react';

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
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="h-20 border-b border-[#E5E1DA] flex items-center justify-between px-6 md:px-12 bg-white sticky top-0 z-40 transition-all shrink-0">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif italic tracking-tight text-[#C5A059] font-bold group-hover:opacity-90 transition-opacity">
              Lelisa Threads
            </span>
          </Link>

          <div className="hidden lg:flex gap-6 text-[11px] uppercase tracking-[0.2em] font-medium opacity-80">
            <Link
              to="/shop?newarrival=true"
              className={`hover:text-[#C5A059] transition-colors pb-1 ${
                location.search.includes('newarrival') ? 'text-[#C5A059] border-b border-[#C5A059]' : ''
              }`}
            >
              {t.shop}
            </Link>
            <Link
              to="/shop"
              className={`hover:text-[#C5A059] transition-colors pb-1 ${
                isActive('/shop') && !location.search.includes('newarrival')
                  ? 'text-[#C5A059] border-b border-[#C5A059]'
                  : ''
              }`}
            >
              {t.allProducts}
            </Link>
            <Link
              to="/categories"
              className={`hover:text-[#C5A059] transition-colors pb-1 ${
                isActive('/categories') ? 'text-[#C5A059] border-b border-[#C5A059]' : ''
              }`}
            >
              {t.categories}
            </Link>
            <Link
              to="/?section=heritage"
              onClick={() => {
                const el = document.getElementById('heritage-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#C5A059] transition-colors pb-1"
            >
              {t.heritage}
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-2.5 py-1 rounded-sm bg-[#C5A059]/10 border border-[#C5A059] hover:bg-[#C5A059] hover:text-white text-[#C5A059] font-bold flex items-center gap-1.5 transition-colors text-[11px] ${
                  isActive('/admin') ? 'bg-[#C5A059] text-white' : ''
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.adminPortal}</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 md:gap-6">
          {/* Search Trigger / Inline Input */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search kemis, region, tilet..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-48 md:w-64 px-3 py-1.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059] text-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2.5 text-gray-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative flex items-center hover:opacity-100 opacity-60 transition-opacity"
              aria-label="Search"
            >
              <span className="text-[11px] uppercase tracking-widest mr-2 md:mr-3 font-bold hidden sm:inline">
                Search
              </span>
              <Search className="w-4 h-4 sm:hidden" />
              <div className="w-[1px] h-4 bg-[#E5E1DA] hidden sm:block"></div>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm p-0.5 bg-[#FCFBFA] dark:bg-[#262626]">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-xs transition-colors ${
                language === 'EN'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#1A1A1A] dark:text-gray-400 dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('AM')}
              className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-xs transition-colors ${
                language === 'AM'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#1A1A1A] dark:text-gray-400 dark:hover:text-white'
              }`}
              title="አማርኛ (Amharic)"
            >
              አማ
            </button>
            <button
              onClick={() => setLanguage('OM')}
              className={`px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-xs transition-colors ${
                language === 'OM'
                  ? 'bg-[#C5A059] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#1A1A1A] dark:text-gray-400 dark:hover:text-white'
              }`}
              title="Afaan Oromoo"
            >
              OM
            </button>
          </div>

          {/* Currency Switcher */}
          <button
            onClick={() => setCurrencyMode(currencyMode === 'ETB' ? 'USD' : 'ETB')}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm hover:border-[#C5A059] transition-colors text-[#C5A059] font-semibold"
            title="Switch Currency Display"
          >
            <Globe className="w-3 h-3" />
            {currencyMode}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 text-gray-600 dark:text-amber-400 hover:text-[#C5A059] dark:hover:text-amber-300 transition-colors border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist */}
          <Link
            to="/dashboard?tab=wishlist"
            className="relative opacity-80 hover:opacity-100 hover:text-[#C5A059] transition-colors"
            title="Favorites"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative opacity-80 hover:opacity-100 hover:text-[#C5A059] transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Login */}
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
            className="opacity-80 hover:opacity-100 hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
            title={user ? `Profile: ${user.fullName}` : 'Sign In'}
          >
            <UserIcon className="w-5 h-5" />
            <span className="hidden xl:inline text-[10px] uppercase tracking-widest font-medium">
              {user ? (user.role === 'ADMIN' ? 'Admin Portal' : user.fullName.split(' ')[0]) : 'Sign In'}
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#1A1A1A] p-1"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E1DA] px-6 py-6 space-y-4 shadow-lg">
          <Link
            to="/shop?newarrival=true"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] font-medium py-2 border-b border-gray-100"
          >
            New Arrivals
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] font-medium py-2 border-b border-gray-100"
          >
            Shop All Collections
          </Link>
          <Link
            to="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] font-medium py-2 border-b border-gray-100"
          >
            Categories
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-[0.2em] font-medium py-2 border-b border-gray-100 text-[#C5A059] font-bold"
            >
              Admin Dashboard
            </Link>
          )}
          <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-[#2D2D2D] mt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (!user) setIsAuthModalOpen(true);
                else navigate('/dashboard');
              }}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] hover:text-[#C5A059]"
            >
              {user ? `My Account (${user.fullName})` : 'Sign In / Register'}
            </button>

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E1DA] dark:border-[#3D3D3D] text-[10px] uppercase font-bold tracking-wider rounded-sm text-[#C5A059]"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
