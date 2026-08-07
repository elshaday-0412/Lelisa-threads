import React, { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { Lock, ShieldAlert, User, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, authLoading, setIsAuthModalOpen, setAuthModalReason } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-[60vh] bg-[#FCFBFA] flex items-center justify-center py-20 px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-semibold">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    const handlePromptSignIn = () => {
      setAuthModalReason(
        adminOnly
          ? 'Please log in with an administrator account to access the Admin Portal.'
          : 'Please log in or create an account to access this protected area.'
      );
      setIsAuthModalOpen(true);
    };

    return (
      <div className="min-h-[70vh] bg-[#FCFBFA] flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full bg-white border border-[#E5E1DA] p-8 md:p-10 rounded-sm shadow-xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
            Authentication Required
          </span>

          <h2 className="text-2xl font-serif font-light text-[#1A1A1A] mb-2">
            Sign in to continue
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">
            Please log in or create an account to access {adminOnly ? 'the Admin Dashboard' : 'your orders, wishlist, and profile settings'}.
          </p>

          <div className="space-y-3">
            <button
              onClick={handlePromptSignIn}
              className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <User className="w-4 h-4" /> Log In / Create Account <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="block w-full text-center text-xs text-gray-500 hover:text-black py-2 underline"
            >
              Continue Browsing Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] bg-[#FCFBFA] flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full bg-white border border-red-200 p-8 md:p-10 rounded-sm shadow-xl text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-bold block mb-1">
            Access Restricted
          </span>

          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-2">
            Administrator Permissions Required
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">
            Your account (<strong className="text-black">{user.email}</strong>) does not have administrator privileges required to access the Admin Portal.
          </p>

          <Link
            to="/dashboard"
            className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors inline-flex items-center justify-center gap-2 shadow-md"
          >
            Return to Customer Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
