import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Building2,
  ShieldCheck,
  Printer,
  ArrowRight,
  Phone,
  Mail,
  QrCode,
  Download,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { getStoredBookings } from '@/data/otaMarketplaceData';

export const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  const booking = useMemo(() => {
    const all = getStoredBookings();
    if (ref) {
      const found = all.find((b) => b.bookingReference === ref);
      if (found) return found;
    }
    return all[0];
  }, [ref]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Success Header Card */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Payment Verified & Departure Locked
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight">
            Your Himalayan Adventure is Confirmed!
          </h1>
          <p className="text-sm text-[#5F6B66] max-w-lg mx-auto">
            The 15% Into Nepal platform reservation fee has been successfully processed. Your operating agency has reserved your guaranteed departure spots.
          </p>
        </div>

        {/* Official Printable Voucher Document */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] shadow-xl overflow-hidden print:border-none print:shadow-none mb-8">
          {/* Voucher Header Ribbon */}
          <div className="bg-[#1A1F1D] text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97706]">
                Official Travel Voucher & Receipt
              </span>
              <h2 className="font-serif text-xl font-bold">INTO NEPAL MARKETPLACE</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#9DA8A3] uppercase block font-mono">
                Booking Reference
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#FBF8F3] tracking-wide">
                {booking.bookingReference}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Tour & Operating Agency Highlight */}
            <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-[#E8E4DD]">
              <div className="w-full sm:w-36 h-28 rounded-xl bg-[#1A1F1D] overflow-hidden shrink-0">
                <img
                  src={booking.listingImage}
                  alt={booking.listingTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-[#1E4B8F]/10 text-[#1E4B8F] rounded">
                  {booking.category}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1F1D] leading-snug">
                  {booking.listingTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F6B66]">
                  <span className="flex items-center gap-1 font-bold text-[#1A1F1D]">
                    <Building2 className="w-3.5 h-3.5 text-[#1E4B8F]" />
                    {booking.agencyName}
                  </span>
                  <span>•</span>
                  <span className="text-[#1B7A5A] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    NTB Lic #{booking.agencyLicense}
                  </span>
                </div>
              </div>

              {/* QR Code Graphic Representation */}
              <div className="p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-16 h-16 text-[#1A1F1D]" />
                <span className="text-[9px] font-mono text-[#5F6B66] mt-1">CHECK-IN SCAN</span>
              </div>
            </div>

            {/* Key Schedule & Travelers Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-1">
                <span className="text-[10px] text-[#5F6B66] uppercase font-bold block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                  Departure Date
                </span>
                <p className="text-sm font-bold text-[#1A1F1D]">{booking.departureDate}</p>
                <p className="text-[11px] text-[#059669] font-medium">Guaranteed Departure</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-1">
                <span className="text-[10px] text-[#5F6B66] uppercase font-bold block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#1E4B8F]" />
                  Participants
                </span>
                <p className="text-sm font-bold text-[#1A1F1D]">{booking.guestCount} Guests</p>
                <p className="text-[11px] text-[#5F6B66] truncate">{booking.travelerName}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-1">
                <span className="text-[10px] text-[#5F6B66] uppercase font-bold block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#1B7A5A]" />
                  Emergency Contact
                </span>
                <p className="text-sm font-bold text-[#1A1F1D] truncate">{booking.agencyPhone}</p>
                <p className="text-[11px] text-[#5F6B66] truncate">{booking.agencyEmail}</p>
              </div>
            </div>

            {/* Authoritative Financial Statement */}
            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#1A1F1D] border-b border-[#E8E4DD] pb-2 flex items-center justify-between">
                <span>Commercial Financial Breakdown</span>
                <span className="text-[11px] font-mono text-[#1B7A5A]">15% RESERVATION MODEL</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#5F6B66]">
                  <span>Total Tour Product Price (100%)</span>
                  <span className="font-semibold text-[#1A1F1D]">${booking.totalProductValue.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[#059669] font-bold bg-[#ECFDF5] p-3 rounded-lg border border-[#A7F3D0]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <div>
                      <span>15% Into Nepal Platform Reservation Fee (PAID)</span>
                      <span className="block text-[10px] font-normal text-[#065F46]">
                        Provider Ref: {booking.platformPaymentReference}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm">${booking.platformFeeAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[#1A1F1D] font-bold p-3 rounded-lg border border-[#E8E4DD] bg-[#FFFFFF]">
                  <div>
                    <span>85% Remaining Balance (PAYABLE TO OPERATING AGENCY)</span>
                    <span className="block text-[10px] font-normal text-[#5F6B66]">
                      {booking.remainingBalanceMethod === 'DIRECT_TO_AGENCY'
                        ? 'Payable directly to agency upon arrival in Kathmandu/Pokhara (Cash/Card)'
                        : 'Held securely in Into Nepal Escrow (Released 14 days post-tour)'}
                    </span>
                  </div>
                  <span className="text-sm">${booking.agencyBalanceAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Agency Meeting Instructions */}
            <div className="text-xs text-[#5F6B66] space-y-2 pt-2">
              <h5 className="font-bold text-[#1A1F1D]">Arrival & Check-In Protocol:</h5>
              <p>
                1. Present this voucher (digital on mobile or printed) to the {booking.agencyName} desk during your pre-trip briefing in Nepal.
              </p>
              <p>
                2. If your remaining balance is payable on arrival, please settle the remaining <strong>${booking.agencyBalanceAmount.toFixed(2)}</strong> before departure day.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>Print Voucher</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/my-bookings">
              <Button className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold">
                <span>View in My Bookings</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/activities">
              <Button variant="ghost" className="text-xs font-bold text-[#5F6B66]">
                Browse More Experiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
