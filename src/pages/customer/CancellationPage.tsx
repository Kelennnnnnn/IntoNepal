import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';

export const CancellationPage: React.FC = () => {
  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-[#E8E4DD]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E4DD] text-xs font-bold text-[#1E4B8F]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Traveler & Operator Policy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">
              Booking, Deposit & Cancellation Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6B66]">
              Clear, transparent rules governing your 15% booking reservation deposit, weather contingencies, and local agency balance settlements.
            </p>
          </div>

          {/* Section 1: 15% Booking Escrow & 85% Local Settlement */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#1E4B8F]" />
              <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">
                Marketplace Reservation & Payment Structure
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
              When booking any trekking package or tour on Into Nepal, you pay a secure <strong>15% booking deposit</strong> online. This deposit is safely allocated to your chosen local operator to guarantee your guide assignment, reserve teahouse slots, issue government TIMS and National Park permits, and book domestic mountain flights (e.g. Kathmandu/Ramechhap to Lukla).
            </p>
            <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
              The remaining <strong>85% balance</strong> is settled directly with your verified local operating agency upon your arrival in Kathmandu or Pokhara prior to departure. Payment methods include major credit cards, cash in convertible foreign currencies (USD, EUR, GBP, AUD, CAD) or Nepalese Rupees (NPR).
            </p>
          </div>

          {/* Section 2: Traveler Cancellation Tiers */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#C8362E]" />
              <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">
                Traveler Voluntary Cancellation Schedule
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-1">
                <div className="font-bold text-[#1A1F1D] flex items-center justify-between">
                  <span>30+ Days Prior to Departure Date</span>
                  <span className="text-[#16A34A] font-extrabold">Full Deposit Refundable (Less $50 Admin/Bank Fee)</span>
                </div>
                <p className="text-[#5F6B66] text-xs">
                  If you cancel more than 30 days before your trek start date, your 15% deposit is fully refunded minus standard international transaction and banking processing fees.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-1">
                <div className="font-bold text-[#1A1F1D] flex items-center justify-between">
                  <span>15 to 29 Days Prior to Departure Date</span>
                  <span className="text-[#D97706] font-extrabold">50% Deposit Credit / Free Date Rescheduling</span>
                </div>
                <p className="text-[#5F6B66] text-xs">
                  Permits may already be submitted to government departments. 50% of the deposit is converted into a lifetime travel credit, or you may reschedule your departure date to any future season free of penalty.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-1">
                <div className="font-bold text-[#1A1F1D] flex items-center justify-between">
                  <span>Less Than 14 Days Prior to Departure Date</span>
                  <span className="text-[#C8362E] font-extrabold">Non-Refundable Deposit</span>
                </div>
                <p className="text-[#5F6B66] text-xs">
                  Because domestic flight tickets (Lukla, Pokhara, Jomsom), restricted area permits, and guide/porter logistics are non-refundable government expenditures, the 15% deposit cannot be refunded. However, the remaining 85% balance is NOT incurred.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Himalayan Weather & Force Majeure */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">
                Weather Delays, Lukla Flights & Force Majeure
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
              Mountain flying in Nepal is strictly visual flight rules (VFR). If mountain flights into Lukla, Jomsom, or Dolpa are grounded due to adverse fog, cloud cover, or heavy snow:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5F6B66] space-y-2">
              <li>
                <strong>Helicopter Sharing:</strong> When scheduled fixed-wing flights are cancelled, operators can arrange helicopter flights subject to seat availability and supplementary charter costs approved by the traveler.
              </li>
              <li>
                <strong>Itinerary Rerouting:</strong> If weather closures persist, travelers can seamlessly switch to an alternative classic trek (such as Annapurna Foothills, Langtang Valley, or Helambu) with all unused permit and flight credits applied towards the substitute adventure.
              </li>
            </ul>
          </div>

          {/* Section 4: Mandatory High-Altitude Medical Insurance */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 sm:p-8 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
              <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">
                Mandatory Emergency Evacuation Insurance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
              Every traveler embarking on high-altitude itineraries above 3,000 meters must possess active travel insurance covering medical expenses, helicopter search and rescue, and repatriation up to 6,000m. Insurance details are verified by your operating agency during arrival briefing in Kathmandu.
            </p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
