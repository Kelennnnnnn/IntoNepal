import React from 'react';
import { CheckCircle2, Calendar, Users, MapPin, ShieldCheck, Download, Phone, MessageSquare, ArrowRight, Printer } from 'lucide-react';
import type { TrekListing } from '../data/treksData';

interface BookingConfirmationProps {
  bookingId: string;
  trek: TrekListing;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  selectedDate: string;
  guests: number;
  totalEstimatedAmount: number;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationProps> = ({
  bookingId,
  trek,
  travelerName,
  travelerEmail,
  travelerPhone,
  selectedDate,
  guests,
  totalEstimatedAmount,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-[#CBD5E1] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-[#1B7A5A] text-white p-6 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">Provisional Booking Confirmed</span>
              <h2 className="text-xl font-bold font-serif">Departure Reserved Successfully!</h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-lg">
            No credit card or online payment was required. Your request has been transmitted directly to the verified Nepali operator.
          </p>

          <div className="absolute top-6 right-6 bg-white/15 px-3 py-1.5 rounded text-right backdrop-blur-xs">
            <span className="text-[10px] text-emerald-100 block">Voucher Reference</span>
            <span className="font-mono text-sm font-bold tracking-wider">{bookingId}</span>
          </div>
        </div>

        {/* Voucher Content */}
        <div className="p-6 space-y-6">
          
          {/* Trip Summary Card */}
          <div className="border border-[#ECEFF3] bg-[#FBF8F3] rounded p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#1E4B8F] uppercase tracking-wide block mb-1">
                  {trek.region} Region • {trek.category}
                </span>
                <h3 className="font-serif font-bold text-base text-[#17222E]">
                  {trek.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6B7C] mt-2">
                  <span className="flex items-center gap-1 font-medium text-[#17222E]">
                    <Calendar className="w-3.5 h-3.5 text-[#1E4B8F]" />
                    Departure: {selectedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-[#17222E]">
                    <Users className="w-3.5 h-3.5 text-[#1E4B8F]" />
                    {guests} {guests === 1 ? 'Trekker' : 'Trekkers'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1E4B8F]" />
                    {trek.location}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#5A6B7C] block">Total Estimated Cost</span>
                <span className="text-xl font-bold font-serif text-[#E8890C]">${totalEstimatedAmount.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block mt-1 font-medium">
                  Pay on arrival in Kathmandu
                </span>
              </div>
            </div>
          </div>

          {/* Operator Direct Contacts */}
          <div className="border border-blue-100 bg-blue-50/50 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#1B7A5A]" />
              <h4 className="text-xs font-bold text-[#17222E]">Verified Nepali Operator Details</h4>
              <span className="text-[10px] bg-white text-[#1E4B8F] border border-blue-200 px-2 py-0.5 rounded font-mono">
                {trek.agencyLicense}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#5A6B7C] block">Agency:</span>
                <span className="font-semibold text-[#17222E]">{trek.agencyName}</span>
                <span className="text-[#5A6B7C] text-[11px] block">{trek.agencyTaanMember}</span>
              </div>
              <div>
                <span className="text-[#5A6B7C] block">Direct Coordination & WhatsApp:</span>
                <span className="font-semibold text-[#17222E] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#1B7A5A]" />
                  {trek.agencyPhone}
                </span>
                <span className="text-[#5A6B7C] text-[11px] block">{trek.agencyEmail}</span>
              </div>
            </div>
          </div>

          {/* Next Steps for Traveler */}
          <div className="space-y-2.5 text-xs text-[#17222E]">
            <h4 className="font-bold text-[#17222E] flex items-center gap-1.5">
              <span>What Happens Next?</span>
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1E4B8F] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <div>
                  <span className="font-semibold">Operator WhatsApp/Email Welcome:</span>
                  <p className="text-[#5A6B7C]">The agency lead will message you at <strong>{travelerPhone}</strong> or <strong>{travelerEmail}</strong> within 12 hours with the Kathmandu briefing schedule.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1E4B8F] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <div>
                  <span className="font-semibold">Pre-Trip Briefing & Equipment Check in Thamel:</span>
                  <p className="text-[#5A6B7C]">Meet your Sherpa guide at the agency office 1 day before departure to verify gear, check permits, and rent sub-zero sleeping bags or down jackets if needed.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1E4B8F] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <div>
                  <span className="font-semibold">Payment on Arrival:</span>
                  <p className="text-[#5A6B7C]">Pay directly to the agency in Kathmandu via Cash (USD, EUR, NPR) or bank wire. No credit card surcharges!</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-[#ECEFF3] bg-[#FBF8F3] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="border border-[#CBD5E1] bg-white hover:bg-gray-50 text-[#17222E] px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save Voucher</span>
            </button>
            <a
              href={`https://wa.me/${trek.agencyPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Agency</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Done & Return to Treks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
