import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Compass,
  Users,
  CalendarCheck,
  CreditCard,
  Star,
  FileText,
  Sliders,
  Mail,
  KeyRound,
  ExternalLink,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  CheckCircle2,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { fetchPlatformSettings, fetchAdminAgencies, fetchContactSubmissions, fetchOutstandingPayouts, type SystemSettingsState } from '../../lib/adminData';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<SystemSettingsState>({
    maintenance_mode: false,
    payments_enabled: true,
    payouts_enabled: true,
    commission_rate: 15,
  });

  const [pendingAgenciesCount, setPendingAgenciesCount] = useState(0);
  const [unreadContactsCount, setUnreadContactsCount] = useState(0);
  const [unpaidPayoutsCount, setUnpaidPayoutsCount] = useState(0);

  const loadIndicators = async () => {
    try {
      const [s, agencies, contacts, outstanding] = await Promise.all([
        fetchPlatformSettings(),
        fetchAdminAgencies(),
        fetchContactSubmissions(),
        fetchOutstandingPayouts(),
      ]);
      setSettings(s);
      setPendingAgenciesCount(agencies.filter((a) => a.status === 'pending').length);
      setUnreadContactsCount(contacts.filter((c) => c.status === 'new').length);
      setUnpaidPayoutsCount(outstanding.length);
    } catch (err) {
      console.debug('Failed loading header indicators:', err);
    }
  };

  useEffect(() => {
    loadIndicators();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out from Admin Console');
      navigate('/admin/login');
    } catch (err) {
      navigate('/admin/login');
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Agencies',
      path: '/admin/agencies',
      icon: ShieldCheck,
      badge: pendingAgenciesCount > 0 ? pendingAgenciesCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      label: 'Listings',
      path: '/admin/listings',
      icon: Compass,
    },
    {
      label: 'Users & Roles',
      path: '/admin/users',
      icon: Users,
    },
    {
      label: 'Bookings',
      path: '/admin/bookings',
      icon: CalendarCheck,
    },
    {
      label: 'Payments & Escrow',
      path: '/admin/payments',
      icon: CreditCard,
      badge: unpaidPayoutsCount > 0 ? unpaidPayoutsCount : undefined,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
    {
      label: 'Reviews',
      path: '/admin/reviews',
      icon: Star,
    },
    {
      label: 'Audit Log',
      path: '/admin/audit',
      icon: FileText,
    },
    {
      label: 'Platform Settings',
      path: '/admin/settings',
      icon: Sliders,
    },
    {
      label: 'Contact Inquiries',
      path: '/admin/contact-submissions',
      icon: Mail,
      badge: unreadContactsCount > 0 ? unreadContactsCount : undefined,
      badgeColor: 'bg-blue-500 text-white font-bold',
    },
    {
      label: 'MFA Security',
      path: '/admin/mfa-setup',
      icon: KeyRound,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 flex">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* DARK ADMIN SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F17] text-slate-300 border-r border-[#1F2937] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* BRAND HEADER */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1F2937] bg-[#070A10]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#D97706] flex items-center justify-center text-slate-950 font-black text-sm tracking-tighter shadow-sm">
              IN
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                INTO NEPAL
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
                Admin Console
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#1E293B] text-amber-400 font-semibold shadow-xs border-l-2 border-amber-500'
                    : 'text-slate-300 hover:bg-[#161F2E] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* EMERGENCY STATUS BADGE & USER SECTION */}
        <div className="p-3 border-t border-[#1F2937] bg-[#070A10] space-y-3">
          {/* PLATFORM HEALTH SUMMARY */}
          <div className="p-2 rounded-md bg-[#111827] border border-[#1F2937] text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Platform Mode:</span>
              {settings.maintenance_mode ? (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" /> Maintenance
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Commission:</span>
              <span className="font-mono text-amber-300 font-semibold">
                {settings.commission_rate}%
              </span>
            </div>
          </div>

          {/* ADMIN PROFILE */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Super Admin'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@intonepal.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* TOP STATUS HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {title || 'Admin Console'}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* QUICK SYSTEM PILLS & CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Realtime Status indicators */}
            <div className="hidden md:flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1 bg-slate-50 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.maintenance_mode ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
                {settings.maintenance_mode ? 'Maintenance Active' : 'System Healthy'}
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.payments_enabled ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                Payments {settings.payments_enabled ? 'ON' : 'OFF'}
              </span>
            </div>

            {/* Public Site Link */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Public Site</span>
            </Link>

            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
