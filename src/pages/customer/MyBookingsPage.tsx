import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  MapPin,
  Building2,
  ShieldCheck,
  Clock,
  ArrowRight,
  Receipt,
  Phone,
  Mail,
  CheckCircle2,
  Compass,
  Star,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { getBookingsForTraveler, OTABookingRecord, subscribeToBookings } from '@/data/otaMarketplaceData';
import { useAuthStore } from '@/stores/authStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { ReviewOperatorModal } from '@/components/ReviewOperatorModal';
import { DisputeCancellationModal } from '@/components/DisputeCancellationModal';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [refreshTick, setRefreshTick] = useState(0);

  // Modals for Phase 4 traveler lifecycle
  const [reviewModalBooking, setReviewModalBooking] = useState<OTABookingRecord | null>(null);
  const [disputeModalBooking, setDisputeModalBooking] = useState<OTABookingRecord | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToBookings(() => {
      setRefreshTick((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const bookings = useMemo(() => {
    return getBookingsForTraveler(user?.email || user?.id || 'demo');
  }, [user, refreshTick]);

  const filteredBookings = useMemo(() => {
    if (tab === 'upcoming') {
      return bookings.filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'IN_PROGRESS');
    }
    if (tab === 'completed') {
      return bookings.filter((b) => b.bookingStatus === 'COMPLETED');
    }
    return bookings.filter((b) => b.bookingStatus === 'CANCELLED');
  }, [bookings, tab]);

  return (
    <CustomerLayout>
      <div className="bg-[#FBF8F3] border-b border-[#E8E4DD] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
                Traveler Portal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D]">
                My Himalayan Expeditions & Bookings
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
                Manage your confirmed tour departures, view payment breakdowns, and connect with operating agencies.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/safety">
                <Button variant="outline" className="text-xs font-bold border-[#1E4B8F]/30 text-[#1E4B8F] hover:bg-[#EFF3FA]">
                  <ShieldAlert className="w-4 h-4 mr-1.5 text-[#1E4B8F]" />
                  <span>Safety &amp; Permits Hub</span>
                </Button>
              </Link>
              <Link to="/activities">
                <Button className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold">
                  <Compass className="w-4 h-4 mr-1.5" />
                  <span>Explore More Tours</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-8 border-b border-[#E8E4DD] text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('upcoming')}
              className={`pb-3 transition-colors ${
                tab === 'upcoming'
                  ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                  : 'text-[#5F6B66] hover:text-[#1A1F1D]'
              }`}
            >
              Upcoming Departures ({bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length})
            </button>
            <button
              type="button"
              onClick={() => setTab('completed')}
              className={`pb-3 transition-colors ${
                tab === 'completed'
                  ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                  : 'text-[#5F6B66] hover:text-[#1A1F1D]'
              }`}
            >
              Completed Adventures
            </button>
            <button
              type="button"
              onClick={() => setTab('cancelled')}
              className={`pb-3 transition-colors ${
                tab === 'cancelled'
                  ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                  : 'text-[#5F6B66] hover:text-[#1A1F1D]'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EFF3FA] text-[#1E4B8F] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
              No {tab} bookings found
            </h3>
            <p className="text-xs text-[#5F6B66]">
              Browse our verified Nepali tour operators and lock your guaranteed departure with only 15% deposit.
            </p>
            <Link to="/activities">
              <Button className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold mt-2">
                Browse Experiences
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] shadow-sm hover:shadow-md transition-all p-6 space-y-5"
              >
                {/* Card Top: Reference, Status, Operating Agency */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E4DD] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#1E4B8F] bg-[#EFF3FA] px-2.5 py-1 rounded">
                      Ref: {b.bookingReference}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                      <CheckCircle2 className="w-3 h-3" />
                      Departure Confirmed
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#5F6B66]">
                    <Building2 className="w-4 h-4 text-[#1E4B8F]" />
                    <span>Operated by:</span>
                    <strong className="text-[#1A1F1D]">{b.agencyName}</strong>
                    <span className="text-[#1B7A5A] font-semibold">(Lic #{b.agencyLicense})</span>
                  </div>
                </div>

                {/* Card Body: Image, Tour Details, Financial Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left Column (Image & Info) */}
                  <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-full sm:w-40 h-28 rounded-xl bg-[#1A1F1D] overflow-hidden shrink-0">
                      <img
                        src={b.listingImage}
                        alt={b.listingTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#1E4B8F]/10 text-[#1E4B8F] rounded">
                        {b.category}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1F1D] leading-snug">
                        {b.listingTitle}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#5F6B66]">
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{b.departureDate}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#1E4B8F]" />
                          <span>{b.guestCount} Travelers</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Commercial Split */}
                  <div className="lg:col-span-5 p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-2 text-xs">
                    <div className="flex justify-between text-[#5F6B66]">
                      <span>Total Tour Value (100%)</span>
                      <span className="font-semibold text-[#1A1F1D]">
                        {formatPrice(b.totalProductValue)}
                        <span className="text-[10px] text-[#5F6B66] ml-1">
                          (${b.totalProductValue.toFixed(2)})
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#059669] font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>15% Reservation Deposit (PAID)</span>
                      </span>
                      <span>
                        {formatPrice(b.platformFeeAmount)}
                        <span className="text-[10px] text-[#065F46] font-normal ml-1">
                          (${b.platformFeeAmount.toFixed(2)})
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#1A1F1D] pt-1 border-t border-[#E8E4DD]">
                      <div>
                        <span className="font-bold block">85% Agency Balance</span>
                        <span className="text-[10px] text-[#5F6B66]">
                          {b.remainingBalanceMethod === 'DIRECT_TO_AGENCY'
                            ? 'Due directly on arrival in Nepal'
                            : 'Held in Into Nepal Escrow'}
                        </span>
                      </div>
                      <span className="font-bold text-sm text-[#D97706]">
                        {formatPrice(b.agencyBalanceAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E4DD] text-xs">
                  <div className="flex items-center gap-4 text-[#5F6B66]">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#1B7A5A]" />
                      <span>{b.agencyPhone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#1E4B8F]" />
                      <span>{b.agencyEmail}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReviewModalBooking(b)}
                      className="text-xs font-bold text-[#D97706] hover:bg-[#D97706]/10 border-[#D97706]/40"
                    >
                      <Star className="w-3.5 h-3.5 mr-1 fill-[#D97706] text-[#D97706]" />
                      <span>Rate Operator</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDisputeModalBooking(b)}
                      className="text-xs font-semibold text-[#5F6B66] hover:text-[#1A1F1D]"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mr-1 text-[#D97706]" />
                      <span>Reschedule / Dispute</span>
                    </Button>

                    <Link to={`/booking/confirmation?ref=${b.bookingReference}`}>
                      <Button variant="outline" size="sm" className="text-xs font-bold">
                        <Receipt className="w-3.5 h-3.5 mr-1" />
                        <span>Voucher</span>
                      </Button>
                    </Link>

                    <Link to={`/activities/${b.listingId}`}>
                      <Button variant="ghost" size="sm" className="text-xs font-bold text-[#1E4B8F]">
                        <span>Tour Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phase 4 Modals */}
        {reviewModalBooking && (
          <ReviewOperatorModal
            booking={reviewModalBooking}
            isOpen={true}
            onClose={() => setReviewModalBooking(null)}
          />
        )}

        {disputeModalBooking && (
          <DisputeCancellationModal
            booking={disputeModalBooking}
            isOpen={true}
            onClose={() => setDisputeModalBooking(null)}
          />
        )}
      </div>
    </CustomerLayout>
  );
};
