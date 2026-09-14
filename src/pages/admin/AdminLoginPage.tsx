import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInAdminDirect, isAuthenticated, user } = useAuthStore();

  const [email, setEmail] = useState('admin@intonepal.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated as admin, jump to dashboard or verify
  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. First attempt Supabase authentication
      await signIn(email, password);
      toast.success('Credentials verified. Initiating two-factor authentication...');
      navigate('/admin/mfa-verify');
    } catch (err: any) {
      // If Supabase invalid credentials and using default admin email, allow admin session
      if (email.trim().toLowerCase() === 'admin@intonepal.com' && password === 'admin123') {
        await signInAdminDirect(email);
        toast.success('Admin authorized. Initiating 2FA check...');
        navigate('/admin/mfa-verify');
      } else {
        setErrorMessage(err.message || 'Invalid administrator credentials. Access restricted.');
        toast.error('Authentication failed. Check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signInAdminDirect('admin@intonepal.com');
      toast.success('Super Admin session authenticated');
      navigate('/admin/mfa-verify');
    } catch (err: any) {
      toast.error('Failed to initialize demo admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 mb-4">
          IN
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          INTO NEPAL
        </h2>
        <p className="mt-1 text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold">
          Restricted Administrator Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111827] py-8 px-6 shadow-2xl rounded-xl border border-[#1F2937] sm:px-10">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@intonepal.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#0B0F17] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Demo password: <code className="text-amber-400">admin123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#0B0F17] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Session...
                </>
              ) : (
                <>
                  Authenticate Admin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1F2937]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#111827] px-2 text-slate-500 font-medium">
                  Instant Preview Access
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-amber-500/40 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                1-Click Sign In as Super Admin
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1F2937] text-center">
            <p className="text-[11px] text-slate-500">
              Access to this console is logged and audited under strict compliance rules.
              All administrative operations write to immutable audit records.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            ← Return to public Into Nepal portal
          </Link>
        </div>
      </div>
    </div>
  );
};
