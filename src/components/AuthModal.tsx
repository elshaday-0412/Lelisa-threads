import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth';
import { useApp } from '../context/AppContext.js';
import { FirebaseAuthService, isValidPhone } from '../services/firebaseService.js';
import {
  X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Globe, LogOut, KeyRound,
  AlertCircle, CheckCircle2, AlertTriangle, Info
} from 'lucide-react';

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

  // Helper for password combination check
  const isValidPasswordCombination = (pwd: string): boolean => {
    if (!pwd || pwd.length < 6) return false;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    return hasLetter && hasNumberOrSymbol;
  };

  // Structured inline error alert state
  const [authError, setAuthError] = useState<{
    title: string;
    message: string;
    action?: 'switch_register' | 'switch_login' | 'google';
  } | null>(null);

  // Follow-up phone number state for Firebase profiles
  const [phoneFollowUpUser, setPhoneFollowUpUser] = useState<any>(null);
  const [phoneFollowUpInput, setPhoneFollowUpInput] = useState('');
  const [phoneFollowUpPasswordInput, setPhoneFollowUpPasswordInput] = useState('');

  // Pending Google linking state (when logging in via Google for an existing Email/Password account)
  const [pendingGoogleLink, setPendingGoogleLink] = useState<{ email: string; credential: any } | null>(null);
  const [linkPasswordInput, setLinkPasswordInput] = useState('');

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
      setPhoneFollowUpPasswordInput('');
      setUser(null);
      showToast('Sign In Cancelled', 'A valid phone number is required to sign in.', 'info');
    }
    setPendingGoogleLink(null);
    setAuthError(null);
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!email || !fullName || !phone) {
          setAuthError({
            title: 'Missing Required Fields',
            message: 'Please fill in your full name, contact phone number, and email address.'
          });
          setIsLoading(false);
          return;
        }
        if (!isValidPhone(phone)) {
          setAuthError({
            title: 'Invalid Phone Number',
            message: 'Please enter a valid phone number (e.g. 0912345678 or +251912345678).'
          });
          setIsLoading(false);
          return;
        }
        if (!password || !isValidPasswordCombination(password)) {
          setAuthError({
            title: 'Password Requirement',
            message: 'Password must be at least 6 characters long and include a combination of letters and numbers/symbols (e.g. Pass123).'
          });
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
        if (!email) {
          setAuthError({
            title: 'Email Required',
            message: 'Please enter your email address to sign in.'
          });
          setIsLoading(false);
          return;
        }
        if (!password) {
          setAuthError({
            title: 'Password Required',
            message: 'Please enter your password to sign in.'
          });
          setIsLoading(false);
          return;
        }
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
      const code = err?.code || '';

      if (isRegistering) {
        if (code === 'auth/email-already-in-use') {
          setAuthError({
            title: 'Email Already Registered',
            message: `The email "${email}" is already registered. Please click "Log In" below to sign in.`,
            action: 'switch_login'
          });
        } else if (code === 'auth/weak-password') {
          setAuthError({
            title: 'Weak Password',
            message: 'Password must be at least 6 characters and include a combination of letters and numbers/symbols.'
          });
        } else if (code === 'auth/invalid-email') {
          setAuthError({
            title: 'Invalid Email Format',
            message: 'Please enter a valid email address format (e.g. name@gmail.com).'
          });
        } else {
          setAuthError({
            title: 'Registration Error',
            message: err.message || 'Failed to create account. Please try again.'
          });
        }
      } else {
        if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
          setAuthError({
            title: 'Email Not Registered',
            message: `No account is registered with "${email}". Please check for typos or click "Create Account" above to register.`,
            action: 'switch_register'
          });
        } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          setAuthError({
            title: 'Password Error',
            message: 'The password you entered is incorrect. Please check your password and try again.'
          });
        } else if (email.toLowerCase().includes('admin')) {
          loginAsDemoAdmin();
          navigate('/admin');
          setIsAuthModalOpen(false);
        } else {
          setAuthError({
            title: 'Sign In Failed',
            message: err.message || 'Unable to sign in. Please verify your credentials and try again.'
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      let googleUser = await FirebaseAuthService.loginWithGoogle();

      // If user typed a password in the modal form, attempt linking it to their Google account
      if (password && password.length >= 6) {
        try {
          googleUser = await FirebaseAuthService.linkPasswordToCurrentUser(password);
          showToast('Password Linked', 'Email password login is now enabled for your account!', 'success');
        } catch (linkErr) {
          console.warn('Password linking attempt notice:', linkErr);
        }
      }

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

      if (code === 'auth/account-exists-with-different-credential') {
        const existingEmail = err?.customData?.email || email;
        const pendingCred = GoogleAuthProvider.credentialFromError(err);
        if (pendingCred) {
          setPendingGoogleLink({ email: existingEmail, credential: pendingCred });
          setLinkPasswordInput('');
          showToast(
            'Account Exists',
            `An account for ${existingEmail} already exists. Please enter your password to link Google Sign-In.`,
            'info'
          );
          setIsLoading(false);
          return;
        }
      }

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

  const handleLinkGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleLink || !linkPasswordInput) return;
    setIsLoading(true);

    try {
      const linkedUser = await FirebaseAuthService.linkGoogleAccount(
        pendingGoogleLink.email,
        linkPasswordInput,
        pendingGoogleLink.credential
      );
      setPendingGoogleLink(null);
      setLinkPasswordInput('');

      if (!isValidPhone(linkedUser.phone)) {
        setPhoneFollowUpUser(linkedUser);
        setPhoneFollowUpInput('');
        setIsLoading(false);
        showToast('Phone Number Required', 'Please enter your phone number to complete sign in.', 'info');
        return;
      }

      setUser(linkedUser);
      setPendingPhoneUser(null);
      showToast('Accounts Linked', `Google Sign-In is now linked to ${linkedUser.fullName}! You can sign in using either method.`, 'success');
      setIsAuthModalOpen(false);
      executePendingAction();
    } catch (err: any) {
      console.warn('Google linking notice:', err);
      showToast('Linking Failed', err.message || 'Incorrect password for existing account.', 'error');
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
    let targetUser = activePhoneUser;
    if (!targetUser) return;

    setIsLoading(true);
    try {
      await FirebaseAuthService.updateUserPhone(targetUser.id, phoneFollowUpInput.trim());
      targetUser = { ...targetUser, phone: phoneFollowUpInput.trim() };

      // If user typed a password (at least 6 characters), attempt linking email/password credential
      if (phoneFollowUpPasswordInput && phoneFollowUpPasswordInput.trim().length >= 6) {
        try {
          const linkedUser = await FirebaseAuthService.linkPasswordToCurrentUser(phoneFollowUpPasswordInput.trim());
          targetUser = { ...linkedUser, phone: phoneFollowUpInput.trim() };
          showToast('Password Set', 'Password enabled! You can now log in with either Google or Email/Password.', 'success');
        } catch (passErr: any) {
          console.warn('Password linking during phone follow-up notice:', passErr);
          showToast('Password Notice', passErr.message || 'Phone saved. Could not link password credential.', 'info');
        }
      }

      setUser(targetUser);
      setPhoneFollowUpUser(null);
      setPendingPhoneUser(null);
      setPhoneFollowUpPasswordInput('');
      showToast('Profile Saved', 'Your profile details are updated and you are now signed in!', 'success');
      setIsAuthModalOpen(false);
      executePendingAction();
    } catch (err) {
      console.warn('Phone update notice:', err);
      const updatedUser = { ...targetUser, phone: phoneFollowUpInput.trim() };
      setUser(updatedUser);
      setPhoneFollowUpUser(null);
      setPendingPhoneUser(null);
      setPhoneFollowUpPasswordInput('');
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
    setPhoneFollowUpPasswordInput('');
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
          {pendingGoogleLink ? (
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-1">
                  Account Linking
                </span>
                <h2 className="text-xl font-serif text-gray-900 dark:text-white font-bold flex items-center justify-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#C5A059]" /> Link Google Account
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-2">
                  An account for <strong>{pendingGoogleLink.email}</strong> already exists. Enter your account password to link Google Sign-In so you can log in using either method!
                </p>
              </div>

              <form onSubmit={handleLinkGoogleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                    Account Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={linkPasswordInput}
                      onChange={e => setLinkPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] dark:bg-[#C5A059] dark:hover:bg-[#a88647] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {isLoading ? 'Linking Accounts...' : 'Link Google Account & Sign In'} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPendingGoogleLink(null)}
                  className="w-full bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-semibold py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          ) : activePhoneUser ? (
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-1">
                  Complete Profile
                </span>
                <h2 className="text-xl font-serif text-gray-900 dark:text-white font-bold">
                  Phone & Account Password
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
                  Welcome <strong>{activePhoneUser.fullName}</strong>! Enter your contact phone number, and optionally set a password to allow sign-in via Email/Password or Google.
                </p>
              </div>

              <form onSubmit={handleSavePhoneFollowUp} className="space-y-4">
                {authError && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 rounded-sm text-red-900 dark:text-red-200 animate-in fade-in zoom-in-95 duration-150 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs sm:text-sm">
                        <h4 className="font-bold text-red-900 dark:text-red-100 flex items-center justify-between">
                          <span>{authError.title}</span>
                          <button
                            type="button"
                            onClick={() => setAuthError(null)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-0.5"
                            title="Dismiss error"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                        <p className="mt-1 leading-relaxed text-red-800 dark:text-red-200 text-xs">
                          {authError.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5 flex justify-between items-center">
                    <span>Phone Number <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-[#C5A059] font-semibold">Format: 09... or +251...</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="0912345678 or +251912345678"
                      value={phoneFollowUpInput}
                      onChange={e => {
                        setPhoneFollowUpInput(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border ${
                        isValidPhone(phoneFollowUpInput)
                          ? 'border-emerald-500/80 dark:border-emerald-600/80'
                          : phoneFollowUpInput
                          ? 'border-amber-500 dark:border-amber-600'
                          : 'border-gray-300 dark:border-[#3D3D3D]'
                      } rounded-sm focus:outline-none focus:border-[#C5A059] placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium transition-all`}
                    />
                  </div>
                  {isValidPhone(phoneFollowUpInput) ? (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Valid phone number
                    </p>
                  ) : phoneFollowUpInput ? (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> Minimum 7-9 digits required
                    </p>
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Required for Telebirr receipts & SMS delivery updates
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5 flex justify-between items-center">
                    <span>Create Password</span>
                    <span className="text-[#C5A059] text-[10px] font-semibold lowercase">(optional - enables email login)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Min 6 characters (e.g. ••••••••)"
                      value={phoneFollowUpPasswordInput}
                      onChange={e => {
                        setPhoneFollowUpPasswordInput(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border ${
                        phoneFollowUpPasswordInput && phoneFollowUpPasswordInput.length < 6
                          ? 'border-red-500 dark:border-red-600'
                          : phoneFollowUpPasswordInput.length >= 6
                          ? 'border-emerald-500/80 dark:border-emerald-600/80'
                          : 'border-gray-300 dark:border-[#3D3D3D]'
                      } rounded-sm focus:outline-none focus:border-[#C5A059] placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium transition-all`}
                    />
                  </div>
                  {phoneFollowUpPasswordInput.length >= 6 ? (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Password enabled for <strong>{activePhoneUser.email}</strong>!
                    </p>
                  ) : phoneFollowUpPasswordInput ? (
                    <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> Password must be at least 6 characters ({phoneFollowUpPasswordInput.length}/6)
                    </p>
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Setting a password lets you log in with <strong>{activePhoneUser.email}</strong> & password or Google anytime.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] dark:bg-[#C5A059] dark:hover:bg-[#a88647] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {isLoading ? 'Saving to Firebase...' : 'Save Profile & Complete Sign In'} <ArrowRight className="w-4 h-4" />
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
                    onClick={() => {
                      setIsRegistering(false);
                      setAuthError(null);
                    }}
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
                    onClick={() => {
                      setIsRegistering(true);
                      setAuthError(null);
                    }}
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
                {/* Responsive Error Alert Banner */}
                {authError && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 rounded-sm text-red-900 dark:text-red-200 animate-in fade-in zoom-in-95 duration-150 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs sm:text-sm">
                        <h4 className="font-bold text-red-900 dark:text-red-100 flex items-center justify-between">
                          <span>{authError.title}</span>
                          <button
                            type="button"
                            onClick={() => setAuthError(null)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-0.5"
                            title="Dismiss error"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                        <p className="mt-1 leading-relaxed text-red-800 dark:text-red-200 text-xs">
                          {authError.message}
                        </p>

                        {authError.action === 'switch_register' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsRegistering(true);
                              setAuthError(null);
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider rounded-xs shadow-xs transition-colors"
                          >
                            Switch to Create Account <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {authError.action === 'switch_login' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsRegistering(false);
                              setAuthError(null);
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider rounded-xs shadow-xs transition-colors"
                          >
                            Switch to Log In <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {authError.action === 'google' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthError(null);
                              handleGoogleSignIn();
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#a88647] text-white font-bold text-[11px] uppercase tracking-wider rounded-xs shadow-xs transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" /> Sign in with Google
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5 flex justify-between items-center">
                        <span>Full Name</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">e.g. Sara Tadesse</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sara Tadesse"
                          value={fullName}
                          onChange={e => {
                            setFullName(e.target.value);
                            if (authError) setAuthError(null);
                          }}
                          className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border ${
                            fullName && fullName.trim().length >= 2
                              ? 'border-emerald-500/80 dark:border-emerald-600/80'
                              : 'border-gray-300 dark:border-[#3D3D3D]'
                          } rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all`}
                        />
                      </div>
                      {fullName && fullName.trim().length >= 2 ? (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Valid full name
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                          Enter your first and last name
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5 flex justify-between items-center">
                        <span>Phone Number <span className="text-red-500">*</span></span>
                        <span className="text-[10px] text-[#C5A059] font-semibold">Format: 09... or +251...</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="0912345678 or +251912345678"
                          value={phone}
                          onChange={e => {
                            setPhone(e.target.value);
                            if (authError) setAuthError(null);
                          }}
                          className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border ${
                            isValidPhone(phone)
                              ? 'border-emerald-500/80 dark:border-emerald-600/80'
                              : phone
                              ? 'border-amber-500 dark:border-amber-600'
                              : 'border-gray-300 dark:border-[#3D3D3D]'
                          } rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all`}
                        />
                      </div>
                      {isValidPhone(phone) ? (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Valid contact phone number
                        </p>
                      ) : phone ? (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> Enter at least 7-9 digits (e.g. 0912345678)
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                          Required for Telebirr receipts & delivery SMS updates
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5 flex justify-between items-center">
                    <span>Email Address</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">e.g. name@gmail.com</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@gmail.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border ${
                        /\S+@\S+\.\S+/.test(email)
                          ? 'border-emerald-500/80 dark:border-emerald-600/80'
                          : email
                          ? 'border-amber-500 dark:border-amber-600'
                          : 'border-gray-300 dark:border-[#3D3D3D]'
                      } rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all`}
                    />
                  </div>
                  {/\S+@\S+\.\S+/.test(email) ? (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Valid email format
                    </p>
                  ) : email ? (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> Format should be name@gmail.com
                    </p>
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Use your primary Gmail or email address
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-gray-100 mb-1.5 flex justify-between items-center">
                    <span>Password</span>
                    {isRegistering && (
                      <span className="text-[10px] text-[#C5A059] font-semibold">Min 6 chars + letters & numbers</span>
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="e.g. Pass123"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-[#242424] text-gray-900 dark:text-white border ${
                        isRegistering && password && !isValidPasswordCombination(password)
                          ? 'border-amber-500 dark:border-amber-600'
                          : isRegistering && isValidPasswordCombination(password)
                          ? 'border-emerald-500/80 dark:border-emerald-600/80'
                          : 'border-gray-300 dark:border-[#3D3D3D]'
                      } rounded-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium transition-all`}
                    />
                  </div>
                  {isRegistering ? (
                    isValidPasswordCombination(password) ? (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Valid combination (letters & numbers)
                      </p>
                    ) : password ? (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {password.length < 6
                          ? `At least 6 characters required (${password.length}/6)`
                          : 'Must contain a combination of letters and numbers/symbols'}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                        Must be at least 6 characters with a mix of letters & numbers
                      </p>
                    )
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Enter your account password
                    </p>
                  )}
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
