import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Users,
  Phone,
  Mail,
  Receipt,
  Download,
  Radio,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBookingsForAgency, VERIFIED_AGENCIES, subscribeToBookings } from '@/data/otaMarketplaceData';
import { toast } from 'sonner';

export const AgencyBookingsPage: React.FC = () => {
  const currentAgency = VERIFIED_AGENCIES[0];
  const [filter, setFilter] = useState<'ALL' | 'DIRECT' | 'ESCROW'>('ALL');
  const [search, setSearch] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  // Subscribe to real-time booking updates
  useEffect(() => {
    const unsubscribe = subscribeToBookings((newBooking) => {
      setRefreshTick((prev) => prev + 1);
      toast.success(
        `New Reservation: ${newBooking.travelerName} booked ${newBooking.listingTitle} ($${newBooking.totalProductValue})`,
        { duration: 5000 }
      );
    });
    return unsubscribe;
  }, []);

  const bookings = useMemo(() => {
    // refreshTick included to force recalculation on new events
    return getBookingsForAgency(currentAgency.name).filter((b) => {
      const matchSearch =
        b.travelerName.toLowerCase().includes(search.toLowerCase()) ||
        b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
        b.listingTitle.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === 'ALL'
          ? true
          : filter === 'DIRECT'
          ? b.remainingBalanceMethod === 'DIRECT_TO_AGENCY'
          : b.remainingBalanceMethod === 'INTO_NEPAL_PLATFORM';

      return matchSearch && matchFilter;
    });
  }, [currentAgency, search, filter, refreshTick]);

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/agency/dashboard" className="text-xs text-[#5F6B66] hover:text-[#1A1F1D] flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-[#E8E4DD]">|</span>
            <h1 className="font-serif font-bold text-base text-[#1A1F1D]">
              All Confirmed Bookings & Passenger Manifest
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Filter / Search Bar */}
        <div className="bg-white rounded-xl border border-[#E8E4DD] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#5F6B66]" />
            <input
              type="text"
              placeholder="Search by traveler name, booking ref, or tour..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-[#1A1F1D]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5F6B66] font-semibold">Remaining Balance Terms:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="p-1.5 rounded border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-medium text-[#1A1F1D] outline-none"
            >
              <option value="ALL">All Payments</option>
              <option value="DIRECT">Direct on Arrival (85% to Agency Desk)</option>
              <option value="ESCROW">Platform Escrow (14-Day Hold)</option>
            </select>
          </div>
        </div>

        {/* Bookings Manifest Table */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF8F3] border-b border-[#E8E4DD] text-[#5F6B66] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Lead Traveler</th>
                  <th className="py-3.5 px-4">Tour Title</th>
                  <th className="py-3.5 px-4">Departure</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">15% Deposit Paid</th>
                  <th className="py-3.5 px-4">85% Balance Due</th>
                  <th className="py-3.5 px-4">Collection Terms</th>
                  <th className="py-3.5 px-4 text-right">Voucher</th>
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
                      <span className="text-[11px] text-[#5F6B66]">{b.travelerEmail}</span>
                    </td>
                    <td className="py-4 px-4 max-w-[200px] truncate font-medium text-[#1A1F1D]">
                      {b.listingTitle}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#1A1F1D]">
                      {b.departureDate}
                    </td>
                    <td className="py-4 px-4 text-[#1A1F1D]">
                      {b.guestCount}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#059669]">
                      ${b.platformFeeAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#D97706]">
                      ${b.agencyBalanceAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[11px] font-medium text-[#5F6B66]">
                        {b.remainingBalanceMethod === 'DIRECT_TO_AGENCY'
                          ? 'Cash/Card on Arrival in Nepal'
                          : 'Platform Escrow (Held 14-Days)'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/booking/confirmation?ref=${b.bookingReference}`}>
                        <Button size="sm" variant="outline" className="text-xs font-bold">
                          <Receipt className="w-3.5 h-3.5 mr-1" />
                          <span>Voucher</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
