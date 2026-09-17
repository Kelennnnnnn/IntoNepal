import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  Clock,
  PlusCircle,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Layers,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBookingsForAgency, VERIFIED_AGENCIES, ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';

export const AgencyDashboardPage: React.FC = () => {
  const currentAgency = VERIFIED_AGENCIES[0]; // Sherpa Mountain Journeys
  const bookings = useMemo(() => getBookingsForAgency(currentAgency.name), [currentAgency]);
  const activeTours = useMemo(
    () => ALL_OTA_LISTINGS.filter((l) => l.agencyName === currentAgency.name),
    [currentAgency]
  );

  // Financial calculations
  const totalTourValue = bookings.reduce((sum, b) => sum + b.totalProductValue, 0);
  const totalPlatformFees = bookings.reduce((sum, b) => sum + b.platformFeeAmount, 0);
  const totalAgencyBalance = bookings.reduce((sum, b) => sum + b.agencyBalanceAmount, 0);

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Agency Portal Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/agency/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1E4B8F] flex items-center justify-center text-white font-bold">
                SM
              </div>
              <div>
                <span className="font-serif font-bold text-sm text-[#1A1F1D] block leading-none">
                  {currentAgency.name}
                </span>
                <span className="text-[10px] text-[#10B981] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified NTB #{currentAgency.licenseNumber}
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#5F6B66] ml-6 border-l border-[#E8E4DD] pl-6">
              <Link to="/agency/dashboard" className="text-[#1E4B8F] font-bold">
                Overview
              </Link>
              <Link to="/agency/listings" className="hover:text-[#1A1F1D]">
                Tour Listings ({activeTours.length})
              </Link>
              <Link to="/agency/bookings" className="hover:text-[#1A1F1D]">
                Bookings ({bookings.length})
              </Link>
              <Link to="/agency/earnings" className="hover:text-[#1A1F1D]">
                14-Day Settlements
              </Link>
              <Link to="/agency/settings" className="hover:text-[#1A1F1D]">
                Bank Accounts
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/agency/listings/new">
              <Button size="sm" className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Tour</span>
              </Button>
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-[#5F6B66] hover:text-[#1A1F1D] px-2.5 py-1.5 rounded hover:bg-[#FBF8F3]"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </header>

      {/* Main Agency Cockpit View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Top Summary Notice */}
        <div className="p-4 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#1E4B8F]">
            <CheckCircle2 className="w-4 h-4 text-[#1B7A5A]" />
            <span>
              <strong>Marketplace Status: Active & Verified.</strong> Your tours are live with 15% reservation deposit checkout enabled.
            </span>
          </div>
          <div className="text-[11px] text-[#5F6B66]">
            Payout Method: <strong className="text-[#1A1F1D]">NIC ASIA Corporate Bank Wire</strong> ({currentAgency.bankDetails.accountNumber})
          </div>
        </div>

        {/* High-Level Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1: Total Gross Tours */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#5F6B66]">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Tour Value</span>
              <DollarSign className="w-4 h-4 text-[#1E4B8F]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1A1F1D]">
              ${totalTourValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#5F6B66]">Across {bookings.length} confirmed bookings</p>
          </div>

          {/* Metric 2: 85% Agency Balance Due / Escrow */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#5F6B66]">
              <span className="text-xs font-bold uppercase tracking-wider">85% Agency Balance</span>
              <Banknote className="w-4 h-4 text-[#059669]" />
            </div>
            <p className="text-2xl font-extrabold text-[#059669]">
              ${totalAgencyBalance.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#5F6B66]">Your direct revenue after 15% platform fee</p>
          </div>

          {/* Metric 3: Active Listings */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#5F6B66]">
              <span className="text-xs font-bold uppercase tracking-wider">Active Tours</span>
              <Compass className="w-4 h-4 text-[#D97706]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1A1F1D]">
              {activeTours.length} Published
            </p>
            <p className="text-[11px] text-[#059669] font-medium">100% NTB Compliant</p>
          </div>

          {/* Metric 4: 14-Day Post-Tour Settlements */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#5F6B66]">
              <span className="text-xs font-bold uppercase tracking-wider">14-Day Hold Engine</span>
              <Clock className="w-4 h-4 text-[#1B7A5A]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1A1F1D]">
              $892.50
            </p>
            <p className="text-[11px] text-[#1E4B8F]">1 escrow tour holding (settles post-tour)</p>
          </div>
        </div>

        {/* Recent Confirmed Bookings Table */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-[#E8E4DD] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
                Active Operations
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1A1F1D]">
                Confirmed Traveler Bookings
              </h3>
              <p className="text-xs text-[#5F6B66] mt-0.5">
                Every reservation listed here has paid the mandatory 15% platform fee. You are responsible for collecting or receiving the 85% balance.
              </p>
            </div>
            <Link to="/agency/bookings">
              <Button variant="outline" size="sm" className="text-xs font-bold">
                View All Bookings
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF8F3] border-b border-[#E8E4DD] text-[#5F6B66] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Lead Traveler</th>
                  <th className="py-3.5 px-4">Expedition / Tour</th>
                  <th className="py-3.5 px-4">Departure</th>
                  <th className="py-3.5 px-4">Total Value</th>
                  <th className="py-3.5 px-4">15% Fee (Into Nepal)</th>
                  <th className="py-3.5 px-4">85% Agency Balance</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DD]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FBF8F3]/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#1E4B8F]">
                      {b.bookingReference}
                    </td>
                    <td className="py-4 px-4">
                      <strong className="text-[#1A1F1D] block">{b.travelerName}</strong>
                      <span className="text-[11px] text-[#5F6B66]">{b.travelerPhone}</span>
                    </td>
                    <td className="py-4 px-4 max-w-[200px]">
                      <span className="font-semibold text-[#1A1F1D] line-clamp-1">
                        {b.listingTitle}
                      </span>
                      <span className="text-[11px] text-[#5F6B66]">{b.guestCount} Guests</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#1A1F1D]">
                      {b.departureDate}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#1A1F1D]">
                      ${b.totalProductValue.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        ${b.platformFeeAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <strong className="text-[#D97706] block text-sm">
                        ${b.agencyBalanceAmount.toFixed(2)}
                      </strong>
                      <span className="text-[10px] text-[#5F6B66]">
                        {b.remainingBalanceMethod === 'DIRECT_TO_AGENCY'
                          ? 'Collect direct in cash/card'
                          : 'Platform Escrow (14-day hold)'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/booking/confirmation?ref=${b.bookingReference}`}>
                        <Button size="sm" variant="ghost" className="text-xs font-bold text-[#1E4B8F]">
                          Voucher
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agency Tours Quick Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
              Published Itineraries & Tour Packages
            </h3>
            <Link to="/agency/listings" className="text-xs font-bold text-[#1E4B8F] hover:underline flex items-center gap-1">
              <span>Manage all {activeTours.length} listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeTours.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-[#E8E4DD] p-4 flex gap-3 items-center">
                <img src={t.image} alt={t.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#1A1F1D] truncate">{t.title}</h4>
                  <p className="text-[11px] text-[#5F6B66]">{t.duration} • ${t.price} / person</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.2 rounded">
                    Published & Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
