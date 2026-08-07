import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { QuickViewModal } from './components/QuickViewModal.js';
import { AuthModal } from './components/AuthModal.js';
import { ToastContainer } from './components/ToastContainer.js';

import { ProtectedRoute } from './components/ProtectedRoute.js';

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
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] text-[#1A1A1A] dark:text-white selection:bg-[#C5A059] selection:text-white">
          <Navbar />

          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tracking"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
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
