import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AgencyOnboardingStatusPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E4DD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/agency" className="flex items-center gap-2">
            <span className="font-serif font-black text-lg text-[#1A1F1D]">INTO NEPAL</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B8F] bg-[#EFF6FF] px-2 py-0.5 rounded">
              Partner Portal
            </span>
          </Link>

          <Link to="/agency/dashboard">
            <Button variant="outline" size="sm" className="text-xs font-bold flex items-center gap-1.5">
              <span>View Demo Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 space-y-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DD]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#065F46] mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Application Approved & Verified</span>
              </div>
              <h1 className="font-serif text-2xl font-black text-[#1A1F1D]">
                Himalayan Glacier Trekking Pvt. Ltd.
              </h1>
              <p className="text-xs text-[#5F6B66] mt-1">
                License: NTB-DOT-1992/048 • Registered in Kathmandu, Nepal
              </p>
            </div>

            <Link to="/agency/dashboard">
              <Button
                variant="primary"
                size="md"
                className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-2"
              >
                <span>Enter Operator Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Verification Timeline */}
          <div className="pt-6 space-y-6">
            <h2 className="font-serif font-bold text-sm text-[#1A1F1D]">Verification Audit Log</h2>

            <div className="relative border-l-2 border-[#10B981] ml-4 space-y-6 text-xs">
              {/* Step 1 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white" />
                <div className="font-bold text-[#1A1F1D]">Initial Application & KYC Submitted</div>
                <div className="text-[#5F6B66] mt-0.5">
                  Company PAN, Registration certificate, and NTB operating license uploaded.
                </div>
                <div className="text-[10px] text-[#5F6B66] mt-1">Status: Completed</div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white" />
                <div className="font-bold text-[#1A1F1D]">Department of Tourism & TAAN License Validation</div>
                <div className="text-[#5F6B66] mt-0.5">
                  Verified against the official Ministry of Culture, Tourism & Civil Aviation registry.
                </div>
                <div className="text-[10px] text-[#5F6B66] mt-1">Status: Verified by Admin</div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white" />
                <div className="font-bold text-[#1A1F1D]">Local Bank Settlement Account Configured</div>
                <div className="text-[#5F6B66] mt-0.5">
                  Nabil Bank Commercial Account (SWIFT: NABILNPKA) authenticated for direct 85% cash settlements and 15% escrow releases.
                </div>
                <div className="text-[10px] text-[#5F6B66] mt-1">Status: Verified</div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white" />
                <div className="font-bold text-[#1A1F1D]">Marketplace Inventory Publishing Enabled</div>
                <div className="text-[#5F6B66] mt-0.5">
                  All listings are visible to global travelers with atomic slot reservations active.
                </div>
                <div className="text-[10px] text-[#10B981] font-bold mt-1">Active & Live</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help & Operator Support */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] flex items-center justify-center text-[#1E4B8F] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1A1F1D]">Dedicated Operator Desk in Kathmandu</h3>
              <p className="text-[11px] text-[#5F6B66]">
                Questions about permit issuance, itinerary approvals, or wire payouts?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-[#1E4B8F]">+977 1 4700999</span>
            <span className="text-[#E8E4DD]">|</span>
            <span className="text-[#5F6B66]">partners@intonepal.com</span>
          </div>
        </div>
      </main>
    </div>
  );
};
