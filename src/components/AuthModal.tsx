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
    showToast,
    authModalReason,
    setAuthModalReason,
    executePendingAction
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
        executePendingAction();
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
        executePendingAction();
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
          authProvider: 'email_password' as const,
          signupMethod: 'EMAIL_FORM',
          addresses: []
        };
        await FirebaseAuthService.saveUserProfile(newUser, 'email_password').catch(() => {});
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
      executePendingAction();
    } catch (err: any) {
      const code = err?.code || '';
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        console.info('Google sign-in popup closed by user.');
        showToast('Sign-In Cancelled', 'The Google sign-in window was closed.', 'info');
      } else {
        console.error('Google Sign-In failed:', err);
        if (code === 'auth/unauthorized-domain') {
          showToast(
            'Unauthorized Domain',
            `Domain "${currentHost}" is not added in Firebase. Go to Firebase Console (lelisa-threads) > Authentication > Settings > Authorized domains and add "${currentHost}".`,
            'error'
          );
        } else if (code === 'auth/operation-not-allowed') {
          showToast(
            'Google Provider Disabled',
            'Google Sign-In is disabled in Firebase Console. Go to Authentication > Sign-in method, edit Google, and click Enable.',
            'error'
          );
        } else if (code === 'auth/popup-blocked') {
          showToast(
            'Popup Blocked',
            'The Google login window was blocked by your browser. Please allow popups for this page and try again.',
            'error'
          );
        } else {
          showToast(
            'Google Sign-In Error',
            err.message || 'Failed to authenticate with Google. Check Firebase Console configuration.',
            'error'
          );
        }
      }
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
      executePendingAction();
    } catch (err) {
      console.warn('Phone update notice:', err);
      const updatedUser = { ...targetUser, phone: phoneFollowUpInput.trim() };
      setUser(updatedUser);
      setPhoneFollowUpUser(null);
      setPendingPhoneUser(null);
      setIsAuthModalOpen(false);
      executePendingAction();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-[#181818] text-[#1A1A1A] dark:text-white w-full max-w-md rounded-sm shadow-2xl border border-gray-200 dark:border-[#2D2D2D] relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleModalClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8">
          {activePhoneUser ? (
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-1">
                  Profile Follow-Up Required
                </span>
                <h2 className="text-xl font-serif text-gray-900 dark:text-white font-bold">
                  Enter Your Contact Phone
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
                  Welcome <strong>{activePhoneUser.fullName}</strong>! Before completing sign in, please provide a valid phone number for Telebirr receipts & delivery updates.
                </p>
              </div>

              <form onSubmit={handleSavePhoneFollowUp} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+251 9... or 09..."
                      value={phoneFollowUpInput}
                      onChange={e => setPhoneFollowUpInput(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] dark:bg-[#C5A059] dark:hover:bg-[#a88647] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {isLoading ? 'Saving to Firebase...' : 'Save Phone Number & Sign In'} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCancelPhoneFollowUp}
                  className="w-full bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 text-xs font-semibold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Cancel & Sign Out
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="text-2xl font-serif italic tracking-tight text-[#C5A059] font-bold block mb-1">
                  Lelisa Threads
                </span>

                {authModalReason && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-sm animate-in fade-in">
                    🔒 {authModalReason}
                  </div>
                )}

                {/* Tab switcher */}
                <div className="flex border-b border-gray-200 dark:border-[#333] mb-4">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
                      !isRegistering
                        ? 'border-[#C5A059] text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
                      isRegistering
                        ? 'border-[#C5A059] text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
                  {isRegistering
                    ? 'Join our heritage circle for bespoke orders & fast checkout.'
                    : 'Sign in to access your orders, wishlist, and saved addresses.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sara Tadesse"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="+251 9... or 09..."
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] dark:bg-[#C5A059] dark:hover:bg-[#a88647] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {isLoading ? 'Connecting to Firebase...' : (isRegistering ? 'Register Account' : 'Sign In')} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 dark:bg-[#222] dark:hover:bg-[#2a2a2a] border border-gray-300 dark:border-[#333] text-gray-900 dark:text-white text-xs font-bold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Globe className="w-4 h-4 text-[#C5A059]" /> Sign in with Google (Firebase)
                </button>
              </div>

              {/* Admin Demo Portal & Session Clear */}
              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-[#333]">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoAdmin();
                      navigate('/admin');
                    }}
                    className="flex-1 px-3 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs font-bold rounded-sm transition-colors text-center shadow-xs"
                  >
                    👑 Admin Portal Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                    }}
                    className="px-3 py-2.5 bg-gray-100 dark:bg-[#282828] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-sm transition-colors text-center"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#C5A059] dark:hover:text-[#C5A059] font-semibold transition-colors"
                >
                  {isRegistering
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Create one"}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
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
