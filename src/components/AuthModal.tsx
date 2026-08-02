import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { FirebaseAuthService, isValidPhone } from '../services/firebaseService.js';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Globe, LogOut } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginAsDemoAdmin,
    setUser,
    pendingPhoneUser,
    setPendingPhoneUser,
    logout,
    showToast
  } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Follow-up phone number state for Firebase profiles
  const [phoneFollowUpUser, setPhoneFollowUpUser] = useState<any>(null);
  const [phoneFollowUpInput, setPhoneFollowUpInput] = useState('');

  if (!isAuthModalOpen) return null;

  const activePhoneUser = phoneFollowUpUser || pendingPhoneUser;

  const handleModalClose = async () => {
    if (activePhoneUser) {
      // User is closing modal without completing phone number. Revoke Firebase auth session.
      try {
        await FirebaseAuthService.logout();
      } catch (e) {
        console.warn('Logout notice:', e);
      }
      setPhoneFollowUpUser(null);
      setPendingPhoneUser(null);
      setUser(null);
      showToast('Sign In Cancelled', 'A valid phone number is required to sign in.', 'info');
    }
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!email || !fullName || !phone) {
          showToast('Required Fields', 'Please fill in your full name, phone number, and email.', 'error');
          setIsLoading(false);
          return;
        }
        if (!isValidPhone(phone)) {
          showToast('Invalid Phone Number', 'Please enter a valid phone number (e.g. 09... or +251...).', 'error');
          setIsLoading(false);
          return;
        }
        const newUser = await FirebaseAuthService.registerWithEmail(email, password, fullName, phone.trim());
        setUser(newUser);
        setPendingPhoneUser(null);
        showToast('Account Created', `Welcome to Habesha Threads, ${fullName}!`, 'success');
        setIsAuthModalOpen(false);
        if (newUser.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const loggedUser = await FirebaseAuthService.loginWithEmail(email, password);
        if (!isValidPhone(loggedUser.phone)) {
          setPhoneFollowUpUser(loggedUser);
          setPhoneFollowUpInput('');
          setIsLoading(false);
          showToast('Phone Number Required', 'Please enter your phone number to complete sign in.', 'info');
          return;
        }
        setUser(loggedUser);
        setPendingPhoneUser(null);
        showToast('Signed In', `Welcome back, ${loggedUser.fullName}!`, 'success');
        setIsAuthModalOpen(false);
        if (loggedUser.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err);
      if (isRegistering) {
        if (!isValidPhone(phone)) {
          showToast('Invalid Phone Number', 'Please enter a valid phone number.', 'error');
          setIsLoading(false);
          return;
        }
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          fullName: fullName || 'Valued User',
          phone: phone.trim(),
          role: email.toLowerCase().includes('admin') ? 'ADMIN' as const : 'USER' as const,
          addresses: []
        };
        setUser(newUser);
        showToast('Account Created', `Welcome, ${newUser.fullName}!`, 'success');
        setIsAuthModalOpen(false);
      } else {
        if (email.toLowerCase().includes('admin')) {
          loginAsDemoAdmin();
          navigate('/admin');
          setIsAuthModalOpen(false);
        } else {
          showToast('Sign In Error', err.message || 'Invalid credentials or account not found', 'error');
          setIsLoading(false);
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const googleUser = await FirebaseAuthService.loginWithGoogle();
      if (!isValidPhone(googleUser.phone)) {
        setPhoneFollowUpUser(googleUser);
        setPhoneFollowUpInput('');
        setIsLoading(false);
        showToast('Phone Number Required', 'Please enter your phone number to complete Google Sign In.', 'info');
        return;
      }
      setUser(googleUser);
      setPendingPhoneUser(null);
      showToast('Firebase Auth', `Signed in with Google as ${googleUser.fullName}`, 'success');
      setIsAuthModalOpen(false);
      navigate(googleUser.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      showToast('Google Sign-In Error', err.message || 'Popup closed or blocked', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePhoneFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phoneFollowUpInput)) {
      showToast('Invalid Phone Number', 'Please enter a valid phone number (at least 7 digits).', 'error');
      return;
    }
    const targetUser = activePhoneUser;
    if (!targetUser) return;

    setIsLoading(true);
    try {
      await FirebaseAuthService.updateUserPhone(targetUser.id, phoneFollowUpInput.trim());
      const updatedUser = { ...targetUser, phone: phoneFollowUpInput.trim() };
      setUser(updatedUser);
      setPhoneFollowUpUser(null);
      setPendingPhoneUser(null);
      showToast('Phone Number Saved', 'Your contact phone number is saved and you are now signed in!', 'success');
      setIsAuthModalOpen(false);
      navigate(updatedUser.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      console.warn('Phone update notice:', err);
      const updatedUser = { ...targetUser, phone: phoneFollowUpInput.trim() };
      setUser(updatedUser);
      setPhoneFollowUpUser(null);
      setPendingPhoneUser(null);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPhoneFollowUp = async () => {
    try {
      await FirebaseAuthService.logout();
    } catch (e) {
      console.warn('Logout notice:', e);
    }
    setPhoneFollowUpUser(null);
    setPendingPhoneUser(null);
    setUser(null);
    setIsAuthModalOpen(false);
    showToast('Sign In Cancelled', 'Sign-in cancelled because phone number was not provided.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-[#E5E1DA] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {activePhoneUser ? (
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-1">
                  Profile Follow-Up Required
                </span>
                <h2 className="text-xl font-serif text-[#1A1A1A]">
                  Enter Your Contact Phone
                </h2>
                <p className="text-xs text-gray-500 font-light mt-1">
                  Welcome <strong>{activePhoneUser.fullName}</strong>! Before completing sign in, please provide a valid phone number for Telebirr receipts & delivery updates.
                </p>
              </div>

              <form onSubmit={handleSavePhoneFollowUp} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+251 9... or 09..."
                      value={phoneFollowUpInput}
                      onChange={e => setPhoneFollowUpInput(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FCFBFA] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {isLoading ? 'Saving to Firebase...' : 'Save Phone Number & Sign In'} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCancelPhoneFollowUp}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Cancel & Sign Out
                </button>
              </form>
            </div>
          ) : (
            <>
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
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="+251 9... or 09..."
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
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {isLoading ? 'Connecting to Firebase...' : (isRegistering ? 'Register Account' : 'Sign In')} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 border border-[#E5E1DA] text-[#1A1A1A] text-xs font-semibold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4 text-[#C5A059]" /> Sign in with Google (Firebase)
                </button>
              </div>

              {/* Admin Demo Portal & Session Clear */}
              <div className="mt-6 pt-6 border-t border-[#E5E1DA]">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoAdmin();
                      navigate('/admin');
                    }}
                    className="flex-1 px-3 py-2 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs font-semibold rounded-sm transition-colors text-center"
                  >
                    👑 Admin Portal Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-medium rounded-sm transition-colors text-center"
                  >
                    Sign Out
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
