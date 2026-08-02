import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { QuickViewModal } from './components/QuickViewModal.js';
import { AuthModal } from './components/AuthModal.js';
import { ToastContainer } from './components/ToastContainer.js';

// Pages
import { Home } from './pages/Home.js';
import { Shop } from './pages/Shop.js';
import { Categories } from './pages/Categories.js';
import { ProductDetails } from './pages/ProductDetails.js';
import { Checkout } from './pages/Checkout.js';
import { UserDashboard } from './pages/UserDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { CulturalHeritage } from './pages/CulturalHeritage.js';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FCFBFA] text-[#1A1A1A] selection:bg-[#C5A059] selection:text-white">
          <Navbar />

          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/heritage" element={<CulturalHeritage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Global overlays & drawers */}
          <CartDrawer />
          <QuickViewModal />
          <AuthModal />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
