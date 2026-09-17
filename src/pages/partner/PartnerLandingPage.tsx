import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  Lock,
  ArrowRight,
  Globe,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PartnerLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col justify-between">
      {/* Partner Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A1F1D] flex items-center justify-center text-[#D97706]">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg tracking-tight text-[#1A1F1D] leading-none">
                INTO NEPAL
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#1E4B8F] leading-tight">
                Agency Partner Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/" className="text-[#5F6B66] hover:text-[#1A1F1D]">
              Traveler Marketplace
            </Link>
            <Link to="/agency/login" className="text-[#1E4B8F] hover:underline">
              Partner Sign In
            </Link>
            <Link to="/agency/onboarding">
              <Button className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold px-4 py-2">
                Register Agency
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-[#1A1F1D] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa"
            alt="Himalayan range"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#272E2B] border border-white/20 text-xs font-semibold text-[#FEF4E7]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Exclusively for Licensed Nepal Tour Operators</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Grow Your Agency with Direct Global Bookings
          </h1>

          <p className="text-base sm:text-lg text-[#D9D3C9] max-w-2xl mx-auto leading-relaxed">
            Stop losing 25%–35% to foreign OTA aggregators. Into Nepal charges only a fair <strong>15% reservation fee</strong> to travelers. You retain <strong>85% of your tour price</strong> with guaranteed departures and direct customer relationships.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/agency/onboarding">
              <Button className="bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold px-6 py-6 rounded-xl shadow-lg flex items-center gap-2">
                <span>Start Free Agency Application</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/agency/dashboard">
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 text-xs font-bold px-5 py-6 rounded-xl">
                <span>Preview Agency Cockpit Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Commercial Model 15/85 Pillar Showcase */}
      <section className="py-16 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
              Fair Transparent Economics
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D]">
              How the 15% / 85% Model Works For You
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66]">
              Designed in partnership with Trekking Agencies’ Association of Nepal (TAAN) and local operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF3FA] text-[#1E4B8F] flex items-center justify-center font-bold text-lg">
                100%
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
                You Control Your Pricing
              </h3>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                Set your exact package rates without predatory discount demands. If your Everest Base Camp trek is $1,200, you advertise $1,200.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F9F6] border border-[#1B7A5A]/30 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-lg">
                15%
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
                Mandatory Reservation Fee
              </h3>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                Into Nepal collects a 15% reservation fee from the traveler at checkout to cover marketing, 24/7 global support, and secure gateway processing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FEF4E7] border border-[#F6B26B]/50 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-[#D97706] flex items-center justify-center font-bold text-lg">
                85%
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
                Remaining Agency Balance
              </h3>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                The 85% balance is paid directly to you by the traveler upon arrival in Nepal, or held in platform escrow and disbursed 14 days post-tour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operator Advantages */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F1D]">
            Why Nepal’s Best Operators Choose Into Nepal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-5 rounded-xl bg-white border border-[#E8E4DD] space-y-2">
            <CheckCircle2 className="w-5 h-5 text-[#059669]" />
            <h4 className="font-bold text-sm text-[#1A1F1D]">No Upfront Fees</h4>
            <p className="text-[#5F6B66]">Free to register, list unlimited tours, and publish guaranteed departure schedules.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E8E4DD] space-y-2">
            <Building2 className="w-5 h-5 text-[#1E4B8F]" />
            <h4 className="font-bold text-sm text-[#1A1F1D]">Verified Operator Badge</h4>
            <p className="text-[#5F6B66]">Your government NTB license and TAAN accreditation are verified, giving travelers maximum trust.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E8E4DD] space-y-2">
            <Users className="w-5 h-5 text-[#D97706]" />
            <h4 className="font-bold text-sm text-[#1A1F1D]">Direct Traveler Comms</h4>
            <p className="text-[#5F6B66]">Direct messaging and phone/WhatsApp dispatch for gear prep, medical checks, and flight updates.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E8E4DD] space-y-2">
            <Clock className="w-5 h-5 text-[#1B7A5A]" />
            <h4 className="font-bold text-sm text-[#1A1F1D]">Automated Bank Payouts</h4>
            <p className="text-[#5F6B66]">Direct bank clearing via NIC ASIA and standard SWIFT wire to your official Nepali corporate account.</p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#1E4B8F] text-white text-center space-y-4 max-w-3xl mx-auto shadow-lg">
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            Ready to list your expeditions on Into Nepal?
          </h3>
          <p className="text-xs sm:text-sm text-[#D9D3C9] max-w-lg mx-auto">
            Applications are typically reviewed and verified within 2 business days upon submitting your Nepal Tourism Board license.
          </p>
          <Link to="/agency/onboarding">
            <Button className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs px-6 py-5 rounded-xl">
              Start 4-Step Agency Registration
            </Button>
          </Link>
        </div>
      </section>

      {/* Partner Footer */}
      <footer className="bg-[#1A1F1D] text-[#9DA8A3] py-8 border-t border-[#303834] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 Into Nepal Pvt. Ltd. Official Partner Network. Kathmandu, Nepal.</p>
          <div className="flex gap-4">
            <Link to="/cancellation" className="hover:text-white">Cancellation Terms</Link>
            <Link to="/contact" className="hover:text-white">Partner Support</Link>
            <Link to="/" className="text-[#D97706] hover:underline">Traveler Marketplace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
