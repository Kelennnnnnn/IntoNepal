import React from 'react';
import { X, Mountain, ShieldAlert, FileText, CheckCircle2, HeartPulse, DollarSign, Compass } from 'lucide-react';

interface TrekPrepGuideModalProps {
  onClose: () => void;
}

export const TrekPrepGuideModal: React.FC<TrekPrepGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-[#CBD5E1] overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-[#ECEFF3] px-6 py-4 flex items-center justify-between bg-[#17222E] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Mountain className="w-5 h-5 text-[#E8890C]" />
            <div>
              <h3 className="font-bold font-serif text-base">Nepal Trekking & Altitude Safety Handbook</h3>
              <p className="text-[11px] text-gray-300">Essential guidance for planning your Himalayan adventure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Section 1: Altitude Safety */}
          <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
            <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2 mb-2">
              <HeartPulse className="w-4 h-4 text-amber-700" />
              <span>Acute Mountain Sickness (AMS) Golden Rules</span>
            </h4>
            <div className="space-y-2 text-amber-900 leading-relaxed">
              <p>
                Above 3,000 meters (9,800 ft), your body requires time to acclimatize to lower atmospheric oxygen pressure:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Climb High, Sleep Low:</strong> Ascend during day hikes for acclimatization, but descend to sleep at lower altitudes.</li>
                <li><strong>Sleeping Elevation Rule:</strong> Avoid increasing your sleeping elevation by more than 500m (1,640 ft) per day above 3,000m.</li>
                <li><strong>Hydration:</strong> Drink 3 to 4 liters of clean water daily. Avoid alcohol and sedatives.</li>
                <li><strong>Never Ascend with Symptoms:</strong> If you experience persistent headache, nausea, dizziness, or insomnia, notify your Sherpa guide immediately and rest or descend.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Permits */}
          <div className="border border-[#ECEFF3] rounded-lg p-4 bg-white">
            <h4 className="font-bold text-sm text-[#17222E] flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#1E4B8F]" />
              <span>Official Nepal Trekking Permits (Included in Bookings)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-[#FBF8F3] border border-[#ECEFF3]">
                <span className="font-bold text-[#17222E] block">TIMS Card (Mandatory)</span>
                <p className="text-[#5A6B7C] text-[11px] mt-0.5">Trekkers Information Management System card managed by TAAN and Nepal Tourism Board.</p>
              </div>
              <div className="p-2.5 rounded bg-[#FBF8F3] border border-[#ECEFF3]">
                <span className="font-bold text-[#17222E] block">National Park Permits</span>
                <p className="text-[#5A6B7C] text-[11px] mt-0.5">Sagarmatha (Everest), Annapurna (ACAP), Langtang permits arranged directly by your licensed agency.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Insurance & Helicopter Rescue */}
          <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-4 text-[#17222E]">
            <h4 className="font-bold text-sm text-[#1E4B8F] flex items-center gap-2 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-[#1E4B8F]" />
              <span>Travel Insurance Requirement</span>
            </h4>
            <p className="text-[#5A6B7C] leading-relaxed">
              Every trekker traveling above 3,000m must carry comprehensive international travel insurance that explicitly covers <strong>helicopter search and medical evacuation up to 6,000 meters</strong>. Trusted providers include World Nomads, Ripcord, and Global Rescue.
            </p>
          </div>

          {/* Section 4: Visa on Arrival & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-[#ECEFF3] rounded p-3 bg-white">
              <span className="font-bold text-[#17222E] block mb-1">Tourist Visa on Arrival</span>
              <p className="text-[#5A6B7C] text-[11px] leading-relaxed">
                Available at Kathmandu (KTM) airport. 15 Days ($30 USD), 30 Days ($50 USD), or 90 Days ($125 USD). Payable in cash or card.
              </p>
            </div>
            <div className="border border-[#ECEFF3] rounded p-3 bg-white">
              <span className="font-bold text-[#17222E] block mb-1">Tipping Culture in Nepal</span>
              <p className="text-[#5A6B7C] text-[11px] leading-relaxed">
                Tipping is customary and deeply appreciated. Industry standard is ~$10-$15 per day for your Sherpa Guide and ~$8-$10 per day for your Porter, shared among group members.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-[#ECEFF3] bg-[#FBF8F3] px-6 py-3.5 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-4 py-1.5 rounded text-xs font-semibold cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
