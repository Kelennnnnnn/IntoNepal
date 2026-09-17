import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Lock, Mail, User, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import {
  checkLoginRateLimit,
  recordLoginAttempt,
  resetLoginRateLimit,
  checkSignupRateLimit,
  recordSignupAttempt,
  resetSignupRateLimit,
} from '@/lib/rateLimit';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signInTravelerDirect = useAuthStore((state) => state.signInTravelerDirect);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginCooldown, setLoginCooldown] = useState(0);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupCooldown, setSignupCooldown] = useState(0);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Cooldown countdowns
  useEffect(() => {
    if (loginCooldown <= 0) return;
    const t = setInterval(() => setLoginCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [loginCooldown]);

  useEffect(() => {
    if (signupCooldown <= 0) return;
    const t = setInterval(() => setSignupCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [signupCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Rate limit check
    const check = checkLoginRateLimit(cleanEmail);
    if (!check.allowed) {
      setLoginCooldown(check.retryAfterSeconds);
      toast.error(`Too many login attempts. Please wait ${check.retryAfterSeconds}s.`);
      return;
    }

    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: loginPassword,
      });

      if (error) {
        // Record failed attempt
        recordLoginAttempt(cleanEmail);
        const nextCheck = checkLoginRateLimit(cleanEmail);
        if (!nextCheck.allowed) {
          setLoginCooldown(nextCheck.retryAfterSeconds);
        }
        throw error;
      }

      // Success - reset rate limit
      resetLoginRateLimit(cleanEmail);
      toast.success('Welcome back to Into Nepal!');
      
      const from = (location.state as any)?.from?.pathname || '/account';
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = signupEmail.trim().toLowerCase();

    // Rate limit check
    const check = checkSignupRateLimit(cleanEmail);
    if (!check.allowed) {
      setSignupCooldown(check.retryAfterSeconds);
      toast.error(`Too many registration attempts. Please wait ${check.retryAfterSeconds}s.`);
      return;
    }

    setIsSigningUp(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupName.trim(),
            role: 'customer',
          },
        },
      });

      if (error) {
        recordSignupAttempt(cleanEmail);
        const nextCheck = checkSignupRateLimit(cleanEmail);
        if (!nextCheck.allowed) {
          setSignupCooldown(nextCheck.retryAfterSeconds);
        }
        throw error;
      }

      resetSignupRateLimit(cleanEmail);
      setSignupSuccess(true);
      toast.success('Account created! Check your email to verify your address.');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header tabs */}
          <div className="flex border-b border-slate-200 bg-slate-100/60">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 border-b-2 border-amber-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 border-b-2 border-amber-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center space-y-1 mb-6">
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Sign in to Traveler Portal
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage bookings, view guide chats, and track mountain permits.
                  </p>
                </div>

                {loginCooldown > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-amber-900 text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Rate limited: Please wait <span className="font-bold">{loginCooldown}s</span> before retrying.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="traveler@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isLoggingIn || loginCooldown > 0}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isLoggingIn ? 'Verifying...' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="relative py-1 flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">or</span>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await signInTravelerDirect();
                      toast.success('Signed in as Sarah Jenkins (Verified Traveler)');
                      const destination = (location.state as any)?.from?.pathname || '/my-bookings';
                      navigate(destination);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs rounded-xl border border-sky-300 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Demo Traveler 1-Click Access</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500">
                    Are you a licensed trekking operator?{' '}
                    <Link to="/partner/login" className="text-amber-600 font-semibold hover:underline">
                      Agency Partner Login
                    </Link>
                  </span>
                </div>
              </form>
            ) : signupSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Verification Email Sent
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We have dispatched a confirmation link to <span className="font-bold text-slate-900">{signupEmail}</span>.
                  Click the link in your inbox to finalize your registration.
                </p>
                <button
                  onClick={() => {
                    setSignupSuccess(false);
                    setActiveTab('login');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="text-center space-y-1 mb-6">
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Create Traveler Account
                  </h2>
                  <p className="text-xs text-slate-500">
                    Book directly with verified Nepali agencies without intermediary commissions.
                  </p>
                </div>

                {signupCooldown > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-amber-900 text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Rate limited: Please wait <span className="font-bold">{signupCooldown}s</span> before retrying.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="traveler@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSigningUp || signupCooldown > 0}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isSigningUp ? 'Registering...' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
