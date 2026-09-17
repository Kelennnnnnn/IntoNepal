import React from 'react';
import {
  ShieldCheck,
  Scale,
  HeartHandshake,
  Stethoscope,
  Shirt,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PorterWelfareModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName?: string;
}

export const PorterWelfareModal: React.FC<PorterWelfareModalProps> = ({
  isOpen,
  onClose,
  agencyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8E4DD] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1B7A5A] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xs">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                  Verified Ethical Charter
                </span>
                <span className="text-xs text-white/80">IPPG &amp; TAAN Audited</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white mt-1">
                Himalayan Porter &amp; Guide Welfare Guarantee
              </h2>
            </div>
          </div>
          <p className="text-xs text-white/90 mt-2.5 leading-relaxed">
            Every booking through Into Nepal enforces the 5 Golden Rules of the International Porter Protection Group (IPPG) and Nepal Tourism Board guidelines.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1F1D]">
          {agencyName && (
            <div className="p-3.5 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#1E4B8F] shrink-0" />
                <span className="text-xs text-[#1E4B8F] font-semibold">
                  <span className="font-bold">{agencyName}</span> complies with all 5 welfare mandates and maintains active mountain rescue insurance for all crew members.
                </span>
              </div>
            </div>
          )}

          {/* 5 Core Welfare Mandates */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1A1F1D] uppercase tracking-wider">
              The 5 Non-Negotiable Standards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Rule 1: Weight Limits */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E4DD] shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-[#D97706] font-bold text-xs">
                  <Scale className="w-4 h-4" />
                  <span>1. Strict 20–25 kg Load Limits</span>
                </div>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Porters carry a maximum of 25 kg in lower foothills and 20 kg over high passes (Thorong La, Cho La, Larkya La). Duffels are weighed at trailheads.
                </p>
                <div className="text-[11px] font-semibold text-[#1B7A5A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Scales checked at trailhead</span>
                </div>
              </div>

              {/* Rule 2: Gear & Footwear */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E4DD] shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-[#1E4B8F] font-bold text-xs">
                  <Shirt className="w-4 h-4" />
                  <span>2. Cold-Weather Gear &amp; Shoes</span>
                </div>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  No flip-flops or cotton sweats. All porters are supplied with windproof jackets, warm fleeces, UV400 sunglasses, and mountain-traction boots.
                </p>
                <div className="text-[11px] font-semibold text-[#1B7A5A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pre-departure gear inspection</span>
                </div>
              </div>

              {/* Rule 3: Rescue & Life Insurance */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E4DD] shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-[#1B7A5A] font-bold text-xs">
                  <Stethoscope className="w-4 h-4" />
                  <span>3. Mandatory 6,000m Rescue Insurance</span>
                </div>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  All local crew are covered by comprehensive medical and emergency helicopter evacuation policies with direct hospital billing, valid up to 6,000m.
                </p>
                <div className="text-[11px] font-semibold text-[#1B7A5A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Helicopter evacuation guaranteed</span>
                </div>
              </div>

              {/* Rule 4: Fair Living Wage */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E4DD] shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-[#7C3AED] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Fair Minimum Wages</span>
                </div>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Wages exceed the TAAN union recommended baseline (NPR 2,800–3,500/day + food &amp; lodging stipends). No unpaid apprenticeships or deductions.
                </p>
                <div className="text-[11px] font-semibold text-[#1B7A5A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Direct payout without agency cuts</span>
                </div>
              </div>
            </div>

            {/* Rule 5: Shelter & Equality */}
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DD] shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FEF4E7] text-[#D97706] shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1F1D]">
                  5. Equal Teahouse Shelter &amp; Warm Meals
                </h4>
                <p className="text-xs text-[#5F6B66] mt-0.5 leading-relaxed">
                  Porters sleep in designated indoor dry rooms with blankets or warm sleeping pads—never outside in open caves or drafty barns. They receive hot dal bhat meals alongside guests.
                </p>
              </div>
            </div>
          </div>

          {/* Tipping Guidance */}
          <div className="p-4 rounded-xl bg-[#FEF4E7] border border-[#D97706]/30 space-y-2">
            <h4 className="text-xs font-bold text-[#D97706] uppercase tracking-wide">
              Himalayan Tipping Etiquette (Customary Guidelines)
            </h4>
            <p className="text-xs text-[#1A1F1D] leading-relaxed">
              Tips are distributed at the farewell dinner on the final trail evening in Lukla, Pokhara, or Kathmandu. Standard benchmarks are:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#1A1F1D]">
              <div className="p-2 rounded-lg bg-white/70 border border-[#D97706]/20">
                <span>Lead Guide:</span> <span className="text-[#D97706]">$12–$15 / day</span> (per group)
              </div>
              <div className="p-2 rounded-lg bg-white/70 border border-[#D97706]/20">
                <span>Porter:</span> <span className="text-[#D97706]">$8–$10 / day</span> (per group)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F2EC] border-t border-[#E8E4DD] flex items-center justify-between">
          <span className="text-[11px] text-[#5F6B66]">
            Audited under Nepal Tourism Act 2035 &amp; IPPG Guidelines
          </span>
          <Button
            onClick={onClose}
            className="bg-[#1B7A5A] hover:bg-[#156046] text-white text-xs font-bold px-5"
          >
            Understood &amp; Agreed
          </Button>
        </div>
      </div>
    </div>
  );
};
