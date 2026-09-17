import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Compass,
  Building2,
  Mountain,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { PORTAL_URLS, isAll } from '@/lib/portal';
import { useCurrencyStore, SUPPORTED_CURRENCIES, CurrencyCode } from '@/stores/currencyStore';

export const CustomerHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const partnerPortalUrl = isAll ? '/agency' : PORTAL_URLS.partner;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E8E4DD] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Into Nepal Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1A1F1D] flex items-center justify-center text-[#D97706] group-hover:bg-[#1E4B8F] transition-colors">
            <Mountain className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg tracking-tight text-[#1A1F1D] leading-none group-hover:text-[#D97706] transition-colors">
              INTO NEPAL
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#5F6B66] leading-tight mt-0.5">
              Experiences & Tours
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links: explore, intonepal, and support pages only */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1A1F1D]">
          <Link
            to="/activities"
            className={`transition-colors hover:text-[#D97706] ${
              location.pathname === '/activities' ? 'text-[#D97706]' : 'text-[#1A1F1D]'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/intonepal"
            className={`transition-colors hover:text-[#D97706] ${
              location.pathname.startsWith('/intonepal') || location.pathname.startsWith('/into-nepal')
                ? 'text-[#D97706]'
                : 'text-[#1A1F1D]'
            }`}
          >
            Into Nepal
          </Link>
          <Link
            to="/support"
            className={`transition-colors hover:text-[#D97706] ${
              location.pathname === '/support' || location.pathname === '/contact'
                ? 'text-[#D97706]'
                : 'text-[#1A1F1D]'
            }`}
          >
            Support
          </Link>
        </nav>

        {/* Right Actions: Minimal & Purposeful */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] hover:bg-[#E8E4DD]/50 transition-colors text-xs font-semibold text-[#1A1F1D]"
              title="Change display currency"
            >
              <span>{SUPPORTED_CURRENCIES[currency].flag}</span>
              <span>{currency}</span>
              <span className="text-[#5F6B66] text-[10px]">({SUPPORTED_CURRENCIES[currency].symbol.trim()})</span>
            </button>

            {currencyDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-[#E8E4DD] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#5F6B66] border-b border-[#E8E4DD]/60">
                  Select Currency
                </div>
                {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
                  const item = SUPPORTED_CURRENCIES[code];
                  const isSelected = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#1E4B8F]/10 text-[#1E4B8F] font-bold'
                          : 'text-[#1A1F1D] hover:bg-[#FBF8F3]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {isSelected && <span className="text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to={partnerPortalUrl}
            className="text-xs font-semibold text-[#5F6B66] hover:text-[#1E4B8F] transition-colors flex items-center gap-1.5 ml-1"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1E4B8F]" />
            <span>For Agencies</span>
          </Link>

          <div className="h-4 w-[1px] bg-[#E8E4DD]" />

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E4DD] bg-[#FBF8F3] hover:bg-[#E8E4DD]/40 transition-colors text-xs font-semibold text-[#1A1F1D]"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-[#1E4B8F] text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[110px] truncate">{user?.name || 'Account'}</span>
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-xl border border-[#E8E4DD] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-[#E8E4DD]/60">
                    <p className="text-xs font-bold text-[#1A1F1D] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#5F6B66] truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1A1F1D] hover:bg-[#FBF8F3]"
                  >
                    <Calendar className="w-4 h-4 text-[#5F6B66]" />
                    My Bookings
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1A1F1D] hover:bg-[#FBF8F3]"
                  >
                    <UserIcon className="w-4 h-4 text-[#5F6B66]" />
                    Profile Settings
                  </Link>

                  <div className="border-t border-[#E8E4DD]/60 my-1"></div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#C8362E] hover:bg-[#FDF0EF] text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" className="font-semibold text-xs rounded-lg px-4">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-[#1A1F1D] hover:bg-[#FBF8F3] rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8E4DD] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-[#1A1F1D]">
            <Link
              to="/activities"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 border-b border-[#E8E4DD]/40 ${
                location.pathname === '/activities' ? 'text-[#D97706]' : 'text-[#1A1F1D]'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/intonepal"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 border-b border-[#E8E4DD]/40 ${
                location.pathname.startsWith('/intonepal') || location.pathname.startsWith('/into-nepal')
                  ? 'text-[#D97706]'
                  : 'text-[#1A1F1D]'
              }`}
            >
              Into Nepal
            </Link>
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 border-b border-[#E8E4DD]/40 ${
                location.pathname === '/support' || location.pathname === '/contact'
                  ? 'text-[#D97706]'
                  : 'text-[#1A1F1D]'
              }`}
            >
              Support
            </Link>

            <Link
              to={partnerPortalUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-[#E8E4DD]/40 text-[#1E4B8F] flex items-center gap-2 text-xs"
            >
              <Building2 className="w-4 h-4" />
              For Tour Agencies
            </Link>

            {/* Mobile Currency Bar */}
            <div className="py-2.5 border-b border-[#E8E4DD]/40 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">
                Display Currency
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
                  const item = SUPPORTED_CURRENCIES[code];
                  const isSelected = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                        isSelected
                          ? 'bg-[#1E4B8F] text-white border-[#1E4B8F]'
                          : 'bg-[#FBF8F3] text-[#1A1F1D] border-[#E8E4DD]'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{code}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="pt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="p-3 bg-[#FBF8F3] rounded-lg border border-[#E8E4DD]">
                  <p className="text-xs font-bold text-[#1A1F1D]">{user?.name}</p>
                  <p className="text-xs text-[#5F6B66]">{user?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2 rounded border border-[#E8E4DD] text-xs font-semibold text-[#1A1F1D]"
                  >
                    <Calendar className="w-4 h-4" />
                    Bookings
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2 rounded border border-[#E8E4DD] text-xs font-semibold text-[#1A1F1D]"
                  >
                    <UserIcon className="w-4 h-4" />
                    Account
                  </Link>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  block
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" block>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
