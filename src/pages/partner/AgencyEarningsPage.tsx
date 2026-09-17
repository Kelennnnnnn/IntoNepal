import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Clock,
  ArrowLeft,
  DollarSign,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VERIFIED_AGENCIES } from '@/data/otaMarketplaceData';

export const AgencyEarningsPage: React.FC = () => {
  const currentAgency = VERIFIED_AGENCIES[0];

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
              Agency Disbursements & 14-Day Post-Tour Settlement Engine
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Settlement Rule Banner */}
        <div className="p-5 rounded-2xl bg-[#EFF3FA] border border-[#1E4B8F]/20 space-y-2">
          <div className="flex items-center gap-2 text-[#1E4B8F] font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Into Nepal 14-Day Post-Tour Settlement Rule</span>
          </div>
          <p className="text-xs text-[#303834] leading-relaxed">
            When travelers opt to pay their 85% remaining balance via <strong>Into Nepal Platform Escrow</strong>, the balance is held safely in escrow during the tour and automatically queued for bank disbursement <strong>14 days after successful expedition completion</strong>. This protects both traveler and agency against cancellations, weather delays, and disputes.
          </p>
        </div>

        {/* Bank Wire Details Card */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DD] pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
                Verified Payout Destination
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
                Primary Bank Clearing Account
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded border border-[#A7F3D0]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              NIC ASIA Verified Wire Recipient
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#5F6B66] block">Bank Name</span>
              <strong className="text-[#1A1F1D]">{currentAgency.bankDetails.bankName}</strong>
            </div>
            <div>
              <span className="text-[#5F6B66] block">Account Name</span>
              <strong className="text-[#1A1F1D]">{currentAgency.bankDetails.accountName}</strong>
            </div>
            <div>
              <span className="text-[#5F6B66] block">Account Number</span>
              <strong className="text-[#1A1F1D] font-mono">{currentAgency.bankDetails.accountNumber}</strong>
            </div>
            <div>
              <span className="text-[#5F6B66] block">SWIFT / BIC Code</span>
              <strong className="text-[#1A1F1D] font-mono">{currentAgency.bankDetails.swiftCode}</strong>
            </div>
          </div>
        </div>

        {/* Escrow Batches & Upcoming Payouts Table */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-[#E8E4DD]">
            <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
              Platform Escrow Settlements Schedule
            </h3>
            <p className="text-xs text-[#5F6B66]">
              Track the 14-day completion countdown for platform-held balances.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF8F3] border-b border-[#E8E4DD] text-[#5F6B66] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Expedition</th>
                  <th className="py-3.5 px-4">Tour Completed</th>
                  <th className="py-3.5 px-4">Escrow Balance (85%)</th>
                  <th className="py-3.5 px-4">14-Day Hold Status</th>
                  <th className="py-3.5 px-4">Wire Release Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DD]">
                <tr className="hover:bg-[#FBF8F3]/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#1E4B8F]">
                    IN-2026-981240
                  </td>
                  <td className="py-4 px-4 font-medium text-[#1A1F1D]">
                    Everest Base Camp & Kala Patthar
                  </td>
                  <td className="py-4 px-4 text-[#5F6B66]">
                    2026-10-28 (Scheduled)
                  </td>
                  <td className="py-4 px-4 font-bold text-[#059669]">
                    $2,378.30
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] bg-[#FEF4E7] px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      Pending Tour Completion
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#1A1F1D]">
                    2026-11-11 (14 Days Post-Tour)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
