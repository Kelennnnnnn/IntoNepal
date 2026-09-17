import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, Lock, Mail, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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

export const PartnerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signInAgencyDirect = useAuthStore((state) => state.signInAgencyDirect);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginCooldown, setLoginCooldown] = useState(0);

  // Signup form state
  const [agencyName, setAgencyName] = useState('');
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
        recordLoginAttempt(cleanEmail);
        const nextCheck = checkLoginRateLimit(cleanEmail);
        if (!nextCheck.allowed) {
          setLoginCooldown(nextCheck.retryAfterSeconds);
        }
        throw error;
      }

      resetLoginRateLimit(cleanEmail);
      toast.success('Welcome back to Partner Portal!');
      
      const from = (location.state as any)?.from?.pathname || '/partner/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Invalid agency credentials. Please check your email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = signupEmail.trim().toLowerCase();

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
            agency_name: agencyName.trim(),
            role: 'partner',
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
      toast.success('Agency registration received! Please verify your email.');
    } catch (err: any) {
      toast.error(err.message || 'Agency registration failed.');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-bold text-xl mb-4 shadow-lg">
          IN
        </div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
          Partner & Agency Portal
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Direct operations for government-verified Himalayan trekking operators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-slate-200">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'text-slate-900 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Partner Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'text-slate-900 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Agency Onboarding
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
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
                  Agency Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="agency@example.com"
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
                  <span>{isLoggingIn ? 'Authenticating...' : 'Sign In as Operator'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative py-1 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">or</span>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await signInAgencyDirect();
                    toast.success('Signed in as Himalayan Glacier Expeditions (Operator)');
                    navigate('/agency/dashboard');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Demo Operator 1-Click Access</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <Link to="/" className="hover:text-slate-900">
                  ← Back to Traveler Explore
                </Link>
                <Link to="/admin/login" className="hover:text-slate-900">
                  Platform Admin
                </Link>
              </div>
            </form>
          ) : signupSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Agency Application Submitted
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We sent an authentication email to <span className="font-bold text-slate-900">{signupEmail}</span>.
                Verify your address to proceed to the government license document upload.
              </p>
              <button
                onClick={() => {
                  setSignupSuccess(false);
                  setActiveTab('login');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Return to Operator Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
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
                  Registered Agency Legal Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Himalayan Trail Guides Pvt. Ltd."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agency Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="info@youragency.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Master Password
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
                  <span>{isSigningUp ? 'Submitting Application...' : 'Register Operator Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
