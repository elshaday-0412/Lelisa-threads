import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, setIsAuthModalOpen, loginAsDemoAdmin, loginAsDemoUser, setUser, showToast } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('user@habeshathreads.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 911 000 000');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!email || !fullName) {
        showToast('Required Fields', 'Please fill in your name and email.', 'error');
        return;
      }
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        fullName,
        phone,
        role: email.toLowerCase().includes('admin') ? 'ADMIN' as const : 'USER' as const,
        addresses: []
      };
      setUser(newUser);
      showToast('Account Created', `Welcome to Habesha Threads, ${fullName}!`, 'success');
      setIsAuthModalOpen(false);
      if (newUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (email.toLowerCase().includes('admin')) {
        loginAsDemoAdmin();
        navigate('/admin');
      } else {
        loginAsDemoUser();
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-[#E5E1DA] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-xl font-serif italic tracking-tight text-[#C5A059] font-bold block mb-1">
              Habesha Threads
            </span>
            <h2 className="text-xl font-serif text-[#1A1A1A]">
              {isRegistering ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-gray-500 font-light mt-1">
              {isRegistering
                ? 'Join our heritage circle for bespoke orders & fast checkout.'
                : 'Sign in to access your orders, wishlist, and saved addresses.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sara Tadesse"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+251 9..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isRegistering ? 'Register Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switchers */}
          <div className="mt-6 pt-6 border-t border-[#E5E1DA]">
            <p className="text-[10px] uppercase tracking-widest text-center text-gray-400 font-bold mb-3">
              One-Click Demo Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoUser();
                  navigate('/dashboard');
                }}
                className="px-3 py-2 bg-[#F4F1ED] hover:bg-[#E5DBCF] text-[#1A1A1A] text-xs font-semibold rounded-sm transition-colors text-center"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  navigate('/admin');
                }}
                className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs font-semibold rounded-sm transition-colors text-center"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-gray-500 hover:text-[#C5A059] transition-colors"
            >
              {isRegistering
                ? 'Already have an account? Sign In'
                : "Don't have an account? Create one"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>JWT Authenticated Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
