import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Heart,
  Calendar,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Mountain,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { PORTAL_URLS, isAll } from '@/lib/portal';

export const CustomerHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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

  const partnerPortalUrl = isAll
    ? '/agency'
    : PORTAL_URLS.partner;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E4DD] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Into Nepal Home"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1A1F1D] flex items-center justify-center text-[#D97706] shadow-sm group-hover:bg-[#1E4B8F] transition-colors">
            <Mountain className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[#1A1F1D] leading-none group-hover:text-[#D97706] transition-colors">
              INTO NEPAL
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#5F6B66] leading-tight">
              Verified Treks
            </span>
          </div>
        </Link>

        {/* Desktop Primary Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#1A1F1D]">
          <Link
            to="/activities"
            className={`transition-colors hover:text-[#D97706] ${
              location.pathname === '/activities' ? 'text-[#D97706] font-semibold' : ''
            }`}
          >
            Explore Treks
          </Link>
          <Link
            to="/activities?location=Everest"
            className="transition-colors hover:text-[#D97706]"
          >
            Everest
          </Link>
          <Link
            to="/activities?location=Annapurna"
            className="transition-colors hover:text-[#D97706]"
          >
            Annapurna
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-1.5 transition-colors hover:text-[#D97706]"
          >
            <ShieldCheck className="w-4 h-4 text-[#1B7A5A]" />
            <span>Why Verified</span>
          </Link>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/wishlist"
            className="p-2 text-[#5F6B66] hover:text-[#C8362E] hover:bg-[#FBF8F3] rounded-md transition-colors"
            title="Saved Treks"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>

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
                  className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-lg border border-[#E8E4DD] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E8E4DD]/60">
                    <p className="text-xs font-bold text-[#1A1F1D] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#5F6B66] truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 text-[10px] font-semibold bg-[#EFF3FA] text-[#1E4B8F] rounded">
                      Traveler
                    </span>
                  </div>

                  <Link
                    to="/bookings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1A1F1D] hover:bg-[#FBF8F3]"
                  >
                    <Calendar className="w-4 h-4 text-[#5F6B66]" />
                    My Bookings
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1A1F1D] hover:bg-[#FBF8F3]"
                  >
                    <Heart className="w-4 h-4 text-[#5F6B66]" />
                    Saved Treks
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1A1F1D] hover:bg-[#FBF8F3]"
                  >
                    <UserIcon className="w-4 h-4 text-[#5F6B66]" />
                    Account Settings
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
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <a
                href={partnerPortalUrl}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs text-[#5F6B66] hover:text-[#1A1F1D] px-2.5 py-1.5 rounded hover:bg-[#FBF8F3] transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-[#D97706]" />
                Agency Portal
              </a>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/wishlist"
            className="p-2 text-[#5F6B66] hover:text-[#C8362E]"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-[#1A1F1D] hover:bg-[#FBF8F3] rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8E4DD] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#1A1F1D]">
            <Link
              to="/activities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E8E4DD]/40"
            >
              Explore All Treks
            </Link>
            <Link
              to="/activities?location=Everest"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E8E4DD]/40"
            >
              Everest Region
            </Link>
            <Link
              to="/activities?location=Annapurna"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E8E4DD]/40"
            >
              Annapurna Circuit & Sanctuary
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E8E4DD]/40 flex items-center gap-2 text-[#1B7A5A]"
            >
              <ShieldCheck className="w-4 h-4" />
              Why Verified Agencies
            </Link>
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
                    to="/bookings"
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
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" block>
                    Sign In / Register
                  </Button>
                </Link>
                <a
                  href={partnerPortalUrl}
                  className="block text-center text-xs text-[#5F6B66] py-2 hover:text-[#1A1F1D]"
                >
                  Agency Partner Login
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
