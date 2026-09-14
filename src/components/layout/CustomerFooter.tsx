import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { PORTAL_URLS, isAll } from '@/lib/portal';

export const CustomerFooter: React.FC = () => {
  const partnerPortalUrl = isAll ? '/agency' : PORTAL_URLS.partner;

  return (
    <footer className="bg-[#1A1F1D] text-[#D9D3C9] border-t border-[#303834]">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-[#303834] bg-[#141817]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#1B7A5A] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">100% Verified Nepali Agencies</h4>
                <p className="text-xs text-[#9DA8A3] mt-0.5">
                  Every operator holds an active license with Nepal's Ministry of Tourism and TAAN accreditation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Protected Escrow Payments</h4>
                <p className="text-xs text-[#9DA8A3] mt-0.5">
                  Your funds are secured until departure date. No risk of operator default.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#1E4B8F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Direct Local Pricing</h4>
                <p className="text-xs text-[#9DA8A3] mt-0.5">
                  Zero foreign middlemen markup. Fair wages directly supporting local Sherpas and guides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Story */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#272E2B] flex items-center justify-center text-[#D97706]">
                <Mountain className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-white tracking-tight">
                INTO NEPAL
              </span>
            </div>
            <p className="text-xs text-[#9DA8A3] leading-relaxed max-w-sm">
              The ethical Himalayan marketplace directly connecting conscious global travelers
              with government-verified Nepali trekking and expedition specialists.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#1B7A5A] bg-[#1B7A5A]/10 px-2.5 py-1 rounded border border-[#1B7A5A]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B7A5A] animate-pulse"></span>
                Official Tourism Partner Network
              </span>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div>
            <h5 className="font-serif text-xs uppercase font-bold tracking-wider text-white mb-3">
              Destinations
            </h5>
            <ul className="space-y-2 text-xs text-[#9DA8A3]">
              <li>
                <Link to="/activities?location=Everest" className="hover:text-white transition-colors">
                  Everest / Khumbu
                </Link>
              </li>
              <li>
                <Link to="/activities?location=Annapurna" className="hover:text-white transition-colors">
                  Annapurna Region
                </Link>
              </li>
              <li>
                <Link to="/activities?location=Langtang" className="hover:text-white transition-colors">
                  Langtang & Helambu
                </Link>
              </li>
              <li>
                <Link to="/activities?location=Manaslu" className="hover:text-white transition-colors">
                  Manaslu Circuit
                </Link>
              </li>
              <li>
                <Link to="/activities?location=Mustang" className="hover:text-white transition-colors">
                  Upper Mustang
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition-colors font-semibold text-[#D97706]">
                  All Himalayan Treks →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trekkers & Support */}
          <div>
            <h5 className="font-serif text-xs uppercase font-bold tracking-wider text-white mb-3">
              Traveler Info
            </h5>
            <ul className="space-y-2 text-xs text-[#9DA8A3]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Why Verified Agencies
                </Link>
              </li>
              <li>
                <Link to="/cancellation-policy" className="hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-white transition-colors">
                  Track My Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Agencies & Legal */}
          <div>
            <h5 className="font-serif text-xs uppercase font-bold tracking-wider text-white mb-3">
              Agency Partners
            </h5>
            <ul className="space-y-2 text-xs text-[#9DA8A3]">
              <li>
                <a href={partnerPortalUrl} className="hover:text-white transition-colors text-[#D97706] font-medium">
                  Agency Portal Login
                </a>
              </li>
              <li>
                <a href={isAll ? '/agency/onboarding' : `${PORTAL_URLS.partner}/agency/onboarding`} className="hover:text-white transition-colors">
                  Register as an Agency
                </a>
              </li>
              <li className="pt-2 border-t border-[#303834] mt-2">
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#303834] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A8781]">
          <p>© {new Date().getFullYear()} Into Nepal Technologies Pvt. Ltd. Thamel, Kathmandu, Nepal.</p>
          <div className="flex items-center gap-4">
            <span>Kathmandu (GMT +5:45)</span>
            <span>•</span>
            <span>NPR & USD Escrow Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
