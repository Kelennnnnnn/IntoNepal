import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Mountain,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plane,
  Radio,
  Briefcase,
  HeartHandshake,
  Compass,
  Check,
  Send,
  Building2,
  Info,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { useCurrencyStore } from '@/stores/currencyStore';
import {
  useCustomTripStore,
  RegionKey,
  AccommodationTier,
  GuideTier,
  PorterRatio,
} from '@/stores/customTripStore';
import { useAuthStore } from '@/stores/authStore';
import { VERIFIED_AGENCIES } from '@/data/otaMarketplaceData';
import { PorterWelfareModal } from '@/components/welfare/PorterWelfareModal';

export const CustomItineraryPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { formatPrice, currency } = useCurrencyStore();
  const { submitDraft, activeDraft, updateDraft } = useCustomTripStore();

  const [step, setStep] = useState<number>(1);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);
  const [welfareModalOpen, setWelfareModalOpen] = useState<boolean>(false);

  // Form State initialized from activeDraft
  const [region, setRegion] = useState<RegionKey>(activeDraft.region || 'Everest');
  const [targetTrek, setTargetTrek] = useState<string>(
    searchParams.get('trek') || activeDraft.targetTrek || 'Everest Base Camp & Kala Patthar'
  );
  const [partySize, setPartySize] = useState<number>(activeDraft.partySize || 2);
  const [departureMonth, setDepartureMonth] = useState<string>(activeDraft.departureMonth || 'October 2026');
  const [tripDurationDays, setTripDurationDays] = useState<number>(activeDraft.tripDurationDays || 14);
  const [routePacing, setRoutePacing] = useState<any>(activeDraft.routePacing || 'Classic Standard');
  const [accommodationTier, setAccommodationTier] = useState<AccommodationTier>(
    activeDraft.accommodationTier || 'standard_teahouse'
  );
  const [guideTier, setGuideTier] = useState<GuideTier>(activeDraft.guideTier || 'certified_english');
  const [porterRatio, setPorterRatio] = useState<PorterRatio>(
    activeDraft.porterRatio || '1_porter_2_trekkers'
  );

  // Add-ons
  const [helicopterDescent, setHelicopterDescent] = useState<boolean>(
    activeDraft.addOns?.helicopterDescent || false
  );
  const [oxygenCylinderSafetyKit, setOxygenCylinderSafetyKit] = useState<boolean>(
    activeDraft.addOns?.oxygenCylinderSafetyKit || true
  );
  const [satelliteCommunicator, setSatelliteCommunicator] = useState<boolean>(
    activeDraft.addOns?.satelliteCommunicator || true
  );
  const [gearRentalPackage, setGearRentalPackage] = useState<boolean>(
    activeDraft.addOns?.gearRentalPackage || false
  );
  const [kathmanduHeritageDay, setKathmanduHeritageDay] = useState<boolean>(
    activeDraft.addOns?.kathmanduHeritageDay || false
  );
  const [porterTipFund, setPorterTipFund] = useState<boolean>(
    activeDraft.addOns?.porterTipFund || true
  );

  // Traveler Details
  const [travelerName, setTravelerName] = useState<string>(user?.name || '');
  const [travelerEmail, setTravelerEmail] = useState<string>(user?.email || '');
  const [travelerPhone, setTravelerPhone] = useState<string>('+1 415 555 0199');
  const [travelerCountry, setTravelerCountry] = useState<string>('United States 🇺🇸');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Sync draft to store
  useEffect(() => {
    updateDraft({
      region,
      targetTrek,
      partySize,
      departureMonth,
      tripDurationDays,
      routePacing,
      accommodationTier,
      guideTier,
      porterRatio,
      addOns: {
        helicopterDescent,
        oxygenCylinderSafetyKit,
        satelliteCommunicator,
        gearRentalPackage,
        kathmanduHeritageDay,
        porterTipFund,
      },
      travelerName,
      travelerEmail,
      travelerPhone,
      travelerCountry,
      specialRequests,
    });
  }, [
    region,
    targetTrek,
    partySize,
    departureMonth,
    tripDurationDays,
    routePacing,
    accommodationTier,
    guideTier,
    porterRatio,
    helicopterDescent,
    oxygenCylinderSafetyKit,
    satelliteCommunicator,
    gearRentalPackage,
    kathmanduHeritageDay,
    porterTipFund,
    travelerName,
    travelerEmail,
    travelerPhone,
    travelerCountry,
    specialRequests,
  ]);

  // Live Dynamic Price Estimation
  const calculateEstimates = () => {
    let baseDailyPerPerson = 75; // Standard teahouse, food, guide baseline
    if (accommodationTier === 'comfort_lodges') baseDailyPerPerson += 45;
    if (accommodationTier === 'luxury_mountain_lodges') baseDailyPerPerson += 135;

    if (guideTier === 'senior_sherpa') baseDailyPerPerson += 15;
    if (guideTier === 'multilingual_guide') baseDailyPerPerson += 20;

    if (porterRatio === '1_porter_1_trekker') baseDailyPerPerson += 18;

    let addOnTotal = 0;
    if (helicopterDescent) addOnTotal += 1100 * (partySize > 1 ? 2 : 1);
    if (oxygenCylinderSafetyKit) addOnTotal += 180;
    if (satelliteCommunicator) addOnTotal += 120;
    if (gearRentalPackage) addOnTotal += 75 * partySize;
    if (kathmanduHeritageDay) addOnTotal += 120 * partySize;
    if (porterTipFund) addOnTotal += 50 * partySize;

    const totalGroupUSD = Math.round(baseDailyPerPerson * tripDurationDays * partySize + addOnTotal);
    const perPersonUSD = Math.round(totalGroupUSD / partySize);
    const depositUSD = Math.round(totalGroupUSD * 0.15);

    return { totalGroupUSD, perPersonUSD, depositUSD };
  };

  const { totalGroupUSD, perPersonUSD, depositUSD } = calculateEstimates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = submitDraft();
    setSubmittedRequest(newReq);
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E4DD] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Tailored Himalayan Expeditions</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1F1D] tracking-tight">
                Plan Your Custom Private Trek
              </h1>
              <p className="text-sm text-[#5F6B66] max-w-2xl mt-1.5 leading-relaxed">
                Design your bespoke itinerary, choose your comfort tier and support crew, and receive binding proposals from licensed Nepali operators backed by our 15% escrow guarantee.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/trail-profiler"
                className="px-3.5 py-2 rounded-xl bg-white border border-[#1E4B8F]/30 text-[#1E4B8F] hover:bg-[#EFF3FA] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Compass className="w-4 h-4" />
                <span>Open Trail Profiler</span>
              </Link>
              <button
                type="button"
                onClick={() => setWelfareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#1B7A5A]/30 text-[#1B7A5A] hover:bg-[#1B7A5A]/10 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Porter Welfare Charter</span>
              </button>
            </div>
          </div>

          {submittedRequest ? (
            /* Submission Confirmation Screen */
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-[#1B7A5A]/30 shadow-md space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#1B7A5A]/10 text-[#1B7A5A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1B7A5A] bg-[#1B7A5A]/10 px-3 py-1 rounded-full">
                  Custom Request Dispatched
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1F1D]">
                  Request #{submittedRequest.id} Received!
                </h2>
                <p className="text-sm text-[#5F6B66] max-w-lg mx-auto">
                  Your custom expedition brief has been matched with verified local operators in Nepal specializing in {submittedRequest.region}.
                </p>
              </div>

              {/* Summary Box */}
              <div className="bg-[#FBF8F3] rounded-xl p-5 border border-[#E8E4DD] text-left grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#5F6B66] block">Trek / Region</span>
                  <span className="font-bold text-[#1A1F1D] text-sm block mt-0.5">
                    {submittedRequest.targetTrek}
                  </span>
                </div>
                <div>
                  <span className="text-[#5F6B66] block">Group &amp; Pacing</span>
                  <span className="font-bold text-[#1A1F1D] text-sm block mt-0.5">
                    {submittedRequest.partySize} Trekkers • {submittedRequest.tripDurationDays} Days
                  </span>
                </div>
                <div>
                  <span className="text-[#5F6B66] block">Estimated Total ({currency})</span>
                  <span className="font-bold text-[#1E4B8F] text-sm block mt-0.5">
                    {formatPrice(submittedRequest.estimatedTotalUSD)}
                  </span>
                  <span className="text-[10px] text-[#5F6B66]">
                    15% deposit: {formatPrice(submittedRequest.estimatedDepositUSD)}
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-4 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 text-left flex items-start gap-3">
                <Info className="w-5 h-5 text-[#1E4B8F] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1E4B8F] space-y-1">
                  <p className="font-bold">What happens next?</p>
                  <p className="text-[#5F6B66]">
                    Licensed agencies will review your route requirements, check guide availability, and submit binding quotes within 12–24 hours directly to your Messages dashboard.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link to="/messages">
                  <Button className="bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold px-6 py-2.5">
                    View Inquiries in Messages →
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setSubmittedRequest(null)}
                  className="text-xs font-bold border-[#E8E4DD]"
                >
                  Create Another Request
                </Button>
              </div>
            </div>
          ) : (
            /* Interactive Multi-Step Builder */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Step Builder */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step Indicators */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8E4DD] shadow-2xs flex items-center justify-between overflow-x-auto">
                  {[
                    { num: 1, label: 'Massif & Trek' },
                    { num: 2, label: 'Party & Dates' },
                    { num: 3, label: 'Lodging & Crew' },
                    { num: 4, label: 'Safety & Add-ons' },
                    { num: 5, label: 'Review & Submit' },
                  ].map((s) => {
                    const isDone = step > s.num;
                    const isCurrent = step === s.num;
                    return (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => setStep(s.num)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                          isCurrent
                            ? 'bg-[#1E4B8F] text-white'
                            : isDone
                            ? 'text-[#1B7A5A] hover:bg-[#1B7A5A]/10'
                            : 'text-[#5F6B66] hover:bg-[#F5F2EC]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            isCurrent
                              ? 'bg-white text-[#1E4B8F]'
                              : isDone
                              ? 'bg-[#1B7A5A] text-white'
                              : 'bg-[#E8E4DD] text-[#5F6B66]'
                          }`}
                        >
                          {isDone ? '✓' : s.num}
                        </span>
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* STEP 1: Massif & Target Trek */}
                {step === 1 && (
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-6 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-[#1A1F1D]">
                        1. Select Destination Massif &amp; Trek Route
                      </h2>
                      <p className="text-xs text-[#5F6B66] mt-0.5">
                        Which Himalayan mountain range and primary valley are you planning to explore?
                      </p>
                    </div>

                    {/* Region Selector Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { key: 'Everest', name: 'Everest / Khumbu', badge: 'High Altitude & Sherpa' },
                          { key: 'Annapurna', name: 'Annapurna Massif', badge: 'Diverse & Historic Passes' },
                          { key: 'Manaslu', name: 'Manaslu Circuit', badge: 'Restricted Remote Wilds' },
                          { key: 'Langtang', name: 'Langtang Valley', badge: 'Glacial Valley & Tamang' },
                          { key: 'Mustang', name: 'Upper Mustang', badge: 'Forbidden Tibetan Kingdom' },
                          { key: 'Wilderness', name: 'Dolpo / Kanchenjunga', badge: 'Deep Wilderness Expedition' },
                        ] as const
                      ).map((reg) => (
                        <button
                          key={reg.key}
                          type="button"
                          onClick={() => {
                            setRegion(reg.key);
                            if (reg.key === 'Everest') setTargetTrek('Everest Base Camp & Kala Patthar');
                            if (reg.key === 'Annapurna') setTargetTrek('Annapurna Circuit & Thorong La');
                            if (reg.key === 'Manaslu') setTargetTrek('Manaslu Circuit & Larkya La');
                            if (reg.key === 'Langtang') setTargetTrek('Langtang Valley & Kyanjin Ri');
                            if (reg.key === 'Mustang') setTargetTrek('Upper Mustang Walled City of Lo Manthang');
                            if (reg.key === 'Wilderness') setTargetTrek('Kanchenjunga Circuit Expedition');
                          }}
                          className={`p-4 rounded-xl border text-left transition-all relative ${
                            region === reg.key
                              ? 'border-[#1E4B8F] bg-[#EFF3FA] ring-2 ring-[#1E4B8F]/20'
                              : 'border-[#E8E4DD] bg-[#FBF8F3] hover:bg-white'
                          }`}
                        >
                          <Mountain className={`w-5 h-5 mb-2 ${region === reg.key ? 'text-[#1E4B8F]' : 'text-[#5F6B66]'}`} />
                          <h3 className="text-sm font-bold text-[#1A1F1D]">{reg.name}</h3>
                          <span className="text-[10px] text-[#5F6B66] block mt-0.5">{reg.badge}</span>
                          {region === reg.key && (
                            <CheckCircle2 className="w-4 h-4 text-[#1E4B8F] absolute top-3 right-3" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Specific Trek Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                        Trek Title / Target Route
                      </label>
                      <input
                        type="text"
                        value={targetTrek}
                        onChange={(e) => setTargetTrek(e.target.value)}
                        placeholder="e.g. Everest Base Camp & Gokyo Lakes via Cho La Pass"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DD] bg-white text-xs text-[#1A1F1D] focus:outline-none focus:ring-2 focus:ring-[#1E4B8F]"
                      />
                    </div>

                    {/* Route Pacing Strategy */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                        Acclimatization &amp; Pacing Profile
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: 'Classic Standard',
                            title: 'Classic Standard Pacing',
                            desc: 'Standard rest halts at Namche & Dingboche (or Manang). Proven safety baseline.',
                          },
                          {
                            id: 'Conservative (Extra Acclimatization)',
                            title: 'Conservative (High Acclimatization)',
                            desc: 'Includes 1–2 extra acclimatization buffer days. Best for beginners or families.',
                          },
                          {
                            id: 'High Pass Circuit',
                            title: 'High Passes Alpine Challenge',
                            desc: 'Crossing Cho La, Renjo La, or Thorong La with dedicated climbing Sherpa support.',
                          },
                          {
                            id: 'Expedited Alpine',
                            title: 'Expedited & Private Helicopter Return',
                            desc: 'Fast trek up, chartered helicopter flight back from high camp to Kathmandu.',
                          },
                        ].map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setRoutePacing(p.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              routePacing === p.id
                                ? 'border-[#1E4B8F] bg-[#EFF3FA]'
                                : 'border-[#E8E4DD] bg-white hover:bg-[#FBF8F3]'
                            }`}
                          >
                            <span className="text-xs font-bold text-[#1A1F1D] block">{p.title}</span>
                            <p className="text-[11px] text-[#5F6B66] mt-1">{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold px-6"
                      >
                        <span>Next: Party &amp; Dates</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Party Size & Dates */}
                {step === 2 && (
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-6 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-[#1A1F1D]">
                        2. Group Composition &amp; Expedition Dates
                      </h2>
                      <p className="text-xs text-[#5F6B66] mt-0.5">
                        Private trips can be customized for solo travelers, couples, or private alpine clubs.
                      </p>
                    </div>

                    {/* Party Size Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                        Party Size (Number of Trekkers): <span className="text-[#1E4B8F] font-black">{partySize}</span>
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {[1, 2, 3, 4, 5, 6, 8, 12].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setPartySize(num)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                              partySize === num
                                ? 'bg-[#1E4B8F] text-white border-[#1E4B8F]'
                                : 'bg-[#FBF8F3] text-[#1A1F1D] border-[#E8E4DD] hover:bg-[#E8E4DD]'
                            }`}
                          >
                            {num} {num === 1 ? 'Solo' : 'Pax'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trip Duration Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                          Expedition Duration
                        </label>
                        <span className="text-xs font-bold text-[#1E4B8F]">
                          {tripDurationDays} Days
                        </span>
                      </div>
                      <input
                        type="range"
                        min="7"
                        max="24"
                        value={tripDurationDays}
                        onChange={(e) => setTripDurationDays(Number(e.target.value))}
                        className="w-full accent-[#1E4B8F]"
                      />
                      <div className="flex justify-between text-[10px] text-[#5F6B66]">
                        <span>7 Days (Express)</span>
                        <span>14 Days (Standard Classic)</span>
                        <span>24 Days (Extended Circuit)</span>
                      </div>
                    </div>

                    {/* Departure Month */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                        Preferred Departure Window
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { label: 'Oct 2026 (Prime Autumn)', season: 'Clear skies' },
                          { label: 'Nov 2026 (Late Autumn)', season: 'Crisp & quiet' },
                          { label: 'Mar 2027 (Early Spring)', season: 'Wildflowers' },
                          { label: 'Apr 2027 (Prime Spring)', season: 'Rhododendrons' },
                          { label: 'May 2027 (Pre-Monsoon)', season: 'Summit season' },
                          { label: 'Dec 2026 (Winter Alpine)', season: 'Snow vistas' },
                          { label: 'Sep 2026 (Post-Monsoon)', season: 'Lush greenery' },
                          { label: 'Flexible / Other', season: 'On inquiry' },
                        ].map((d) => (
                          <button
                            key={d.label}
                            type="button"
                            onClick={() => setDepartureMonth(d.label)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              departureMonth === d.label
                                ? 'border-[#1E4B8F] bg-[#EFF3FA]'
                                : 'border-[#E8E4DD] bg-white hover:bg-[#FBF8F3]'
                            }`}
                          >
                            <span className="text-xs font-bold text-[#1A1F1D] block">{d.label}</span>
                            <span className="text-[10px] text-[#5F6B66] block">{d.season}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold border-[#E8E4DD]"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold px-6"
                      >
                        <span>Next: Lodging &amp; Crew</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Accommodation Tier & Support Crew */}
                {step === 3 && (
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-6 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-[#1A1F1D]">
                        3. Accommodation Tier &amp; Mountain Crew
                      </h2>
                      <p className="text-xs text-[#5F6B66] mt-0.5">
                        Tailor the comfort level of your mountain lodges and the expertise of your certified Nepali guide and porter team.
                      </p>
                    </div>

                    {/* Accommodation Tier */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                        Lodge Comfort Tier
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          {
                            id: 'standard_teahouse' as const,
                            title: 'Authentic Teahouses',
                            priceBadge: 'Standard ($)',
                            desc: 'Cozy traditional family lodges. Shared bathroom facilities, common heated dining hall.',
                          },
                          {
                            id: 'comfort_lodges' as const,
                            title: 'Comfort En-Suite Lodges',
                            priceBadge: '+$45/day',
                            desc: 'Private attached bathroom, guaranteed hot showers, and electric heating blankets where available.',
                          },
                          {
                            id: 'luxury_mountain_lodges' as const,
                            title: 'Luxury Lodges (Yeti / Summit)',
                            priceBadge: '+$135/day',
                            desc: 'Premium alpine sanctuaries with en-suite bathrooms, king beds, gourmet cuisine, and panoramic lounges.',
                          },
                        ].map((tier) => (
                          <div
                            key={tier.id}
                            onClick={() => setAccommodationTier(tier.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                              accommodationTier === tier.id
                                ? 'border-[#1E4B8F] bg-[#EFF3FA] ring-2 ring-[#1E4B8F]/20'
                                : 'border-[#E8E4DD] bg-white hover:bg-[#FBF8F3]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-[#1A1F1D]">{tier.title}</span>
                              <span className="text-[10px] font-bold text-[#1E4B8F] bg-white px-2 py-0.5 rounded-full border border-[#1E4B8F]/20">
                                {tier.priceBadge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5F6B66] leading-relaxed">{tier.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Guide Qualification Tier */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                        Lead Guide Specialization
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          {
                            id: 'certified_english' as const,
                            title: 'Certified English Guide',
                            desc: 'Government licensed by Nepal Tourism Board with Wilderness First Aid certification.',
                          },
                          {
                            id: 'senior_sherpa' as const,
                            title: 'Senior IFMGA / Climbing Sherpa',
                            desc: 'High-altitude mountaineer with 8,000m summit experience and advanced crevasse rescue skills.',
                          },
                          {
                            id: 'multilingual_guide' as const,
                            title: 'Multilingual Specialist',
                            desc: 'Fluent French, German, or Spanish speaking certified trekking guide.',
                          },
                        ].map((g) => (
                          <div
                            key={g.id}
                            onClick={() => setGuideTier(g.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              guideTier === g.id
                                ? 'border-[#1E4B8F] bg-[#EFF3FA]'
                                : 'border-[#E8E4DD] bg-white hover:bg-[#FBF8F3]'
                            }`}
                          >
                            <span className="text-xs font-bold text-[#1A1F1D] block">{g.title}</span>
                            <p className="text-[11px] text-[#5F6B66] mt-1">{g.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Porter Ratio */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#1A1F1D] uppercase tracking-wide">
                          Porter Assistance &amp; Ethical Weight Ratio
                        </label>
                        <button
                          type="button"
                          onClick={() => setWelfareModalOpen(true)}
                          className="text-[11px] text-[#1B7A5A] hover:underline font-bold flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>IPPG Rules</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: '1_porter_2_trekkers' as const,
                            title: '1 Porter for 2 Trekkers (Standard)',
                            desc: 'Each trekker packs up to 10–12 kg into the duffel bag (strictly within 20–25 kg total porter limit).',
                          },
                          {
                            id: '1_porter_1_trekker' as const,
                            title: 'Dedicated 1:1 Porter (Private Duffel)',
                            desc: 'Personal dedicated porter carrying up to 15 kg for photographers or gear-heavy trekkers.',
                          },
                        ].map((pr) => (
                          <div
                            key={pr.id}
                            onClick={() => setPorterRatio(pr.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              porterRatio === pr.id
                                ? 'border-[#1E4B8F] bg-[#EFF3FA]'
                                : 'border-[#E8E4DD] bg-white hover:bg-[#FBF8F3]'
                            }`}
                          >
                            <span className="text-xs font-bold text-[#1A1F1D] block">{pr.title}</span>
                            <p className="text-[11px] text-[#5F6B66] mt-1">{pr.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold border-[#E8E4DD]"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(4)}
                        className="bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold px-6"
                      >
                        <span>Next: Safety &amp; Add-ons</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Safety & Add-ons */}
                {step === 4 && (
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-6 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-[#1A1F1D]">
                        4. High-Altitude Safety Logistics &amp; Upgrades
                      </h2>
                      <p className="text-xs text-[#5F6B66] mt-0.5">
                        Equip your expedition with medical-grade oxygen, satellite comms, or private helicopter extraction.
                      </p>
                    </div>

                    {/* Add-ons Checklist */}
                    <div className="space-y-3">
                      {[
                        {
                          checked: helicopterDescent,
                          onChange: setHelicopterDescent,
                          title: 'Private Helicopter Return Flight (e.g. Gorak Shep → Lukla)',
                          desc: 'Saves 3 days of downhill descent strain. Fly directly out of the high alpine valley with breathtaking aerial views.',
                          price: '+$1,100 / group',
                          icon: Plane,
                        },
                        {
                          checked: oxygenCylinderSafetyKit,
                          onChange: setOxygenCylinderSafetyKit,
                          title: 'Dedicated Medical Oxygen Cylinder & Pulse Oximeter Kit',
                          desc: 'Carried with your crew throughout the trek for immediate emergency treatment if severe AMS develops.',
                          price: '+$180 / group',
                          icon: Sparkles,
                        },
                        {
                          checked: satelliteCommunicator,
                          onChange: setSatelliteCommunicator,
                          title: 'Garmin inReach Satellite SOS Communicator',
                          desc: 'Allows real-time GPS family tracking and satellite texting anywhere on the mountain with zero cellular reception.',
                          price: '+$120 / group',
                          icon: Radio,
                        },
                        {
                          checked: gearRentalPackage,
                          onChange: setGearRentalPackage,
                          title: 'Thamel Down Gear Rental Package (-20°C Bag & Down Parka)',
                          desc: 'Sanitized high-grade expedition sleeping bag and 800-fill down jacket ready in Kathmandu.',
                          price: `+$75 / person ($${75 * partySize})`,
                          icon: Briefcase,
                        },
                        {
                          checked: kathmanduHeritageDay,
                          onChange: setKathmanduHeritageDay,
                          title: 'Kathmandu UNESCO Heritage Day Tour with Private Car & Guide',
                          desc: 'Explore Pashupatinath, Boudhanath Stupa, and Swayambhunath Monkey Temple with a historian.',
                          price: `+$120 / person ($${120 * partySize})`,
                          icon: Compass,
                        },
                        {
                          checked: porterTipFund,
                          onChange: setPorterTipFund,
                          title: 'Pre-Funded Ethical Porter & Guide Tipping Bonus',
                          desc: 'Disbursed directly to your crew at the celebratory farewell dinner, meeting union standards.',
                          price: `+$50 / person ($${50 * partySize})`,
                          icon: HeartHandshake,
                        },
                      ].map((addon, idx) => {
                        const Icon = addon.icon;
                        return (
                          <label
                            key={idx}
                            className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                              addon.checked
                                ? 'border-[#1E4B8F] bg-[#EFF3FA]'
                                : 'border-[#E8E4DD] bg-white hover:bg-[#FBF8F3]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={addon.checked}
                              onChange={(e) => addon.onChange(e.target.checked)}
                              className="w-4 h-4 rounded text-[#1E4B8F] accent-[#1E4B8F] mt-1 shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#1A1F1D] flex items-center gap-1.5">
                                  <Icon className="w-3.5 h-3.5 text-[#1E4B8F]" />
                                  <span>{addon.title}</span>
                                </span>
                                <span className="text-[11px] font-bold text-[#1E4B8F] whitespace-nowrap">
                                  {addon.price}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#5F6B66] mt-0.5 leading-relaxed">
                                {addon.desc}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(3)}
                        className="text-xs font-bold border-[#E8E4DD]"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(5)}
                        className="bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold px-6"
                      >
                        <span>Next: Review &amp; Submit</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Traveler Info & Submit */}
                {step === 5 && (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-6 animate-in fade-in"
                  >
                    <div>
                      <h2 className="text-lg font-serif font-bold text-[#1A1F1D]">
                        5. Traveler Contact &amp; Final Expedition Brief
                      </h2>
                      <p className="text-xs text-[#5F6B66] mt-0.5">
                        Please provide your details so licensed Nepali operators can review your request and send formal proposals.
                      </p>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1A1F1D]">Lead Traveler Full Name *</label>
                        <input
                          type="text"
                          required
                          value={travelerName}
                          onChange={(e) => setTravelerName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] text-xs text-[#1A1F1D] focus:ring-2 focus:ring-[#1E4B8F]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1A1F1D]">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={travelerEmail}
                          onChange={(e) => setTravelerEmail(e.target.value)}
                          placeholder="e.g. sarah.j@example.com"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] text-xs text-[#1A1F1D] focus:ring-2 focus:ring-[#1E4B8F]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1A1F1D]">Phone / WhatsApp Number</label>
                        <input
                          type="text"
                          value={travelerPhone}
                          onChange={(e) => setTravelerPhone(e.target.value)}
                          placeholder="+1 415 555 0199"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] text-xs text-[#1A1F1D] focus:ring-2 focus:ring-[#1E4B8F]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1A1F1D]">Country of Residence</label>
                        <input
                          type="text"
                          value={travelerCountry}
                          onChange={(e) => setTravelerCountry(e.target.value)}
                          placeholder="e.g. United States"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] text-xs text-[#1A1F1D] focus:ring-2 focus:ring-[#1E4B8F]"
                        />
                      </div>
                    </div>

                    {/* Special Requests textarea */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1A1F1D]">
                        Special Route Requests, Dietary Restrictions or Medical Notes
                      </label>
                      <textarea
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="e.g., We have one vegetarian trekker. Interested in visiting Khumjung Hillary School. Would like private room requests where available."
                        className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] text-xs text-[#1A1F1D] focus:ring-2 focus:ring-[#1E4B8F]"
                      />
                    </div>

                    {/* Matched Operators Preview */}
                    <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-2">
                      <span className="text-xs font-bold text-[#1A1F1D] block">
                        Matched Licensed Nepali Agencies in {region}:
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        {VERIFIED_AGENCIES.slice(0, 3).map((ag) => (
                          <div key={ag.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E8E4DD]">
                            <Building2 className="w-3.5 h-3.5 text-[#1E4B8F]" />
                            <span className="text-xs font-semibold text-[#1A1F1D]">{ag.name}</span>
                            <span className="text-[10px] text-[#1B7A5A] font-bold">★ {ag.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(4)}
                        className="text-xs font-bold border-[#E8E4DD]"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold px-8 shadow-xs"
                      >
                        <Send className="w-4 h-4 mr-1.5" />
                        <span>Submit Custom Expedition Brief</span>
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Col: Sticky Live Cost Estimator */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-sm sticky top-24 space-y-5">
                  <div className="border-b border-[#E8E4DD] pb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] block">
                      Live Estimate ({currency})
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1A1F1D] mt-0.5">
                      Expedition Cost Summary
                    </h3>
                  </div>

                  {/* Pricing Overview */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#5F6B66]">Estimated per person</span>
                      <span className="text-lg font-bold text-[#1A1F1D]">
                        {formatPrice(perPersonUSD)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-[#E8E4DD] pt-2">
                      <span className="text-xs font-bold text-[#1A1F1D]">Total Group Cost</span>
                      <span className="text-2xl font-serif font-bold text-[#1E4B8F]">
                        {formatPrice(totalGroupUSD)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#1E4B8F]" />
                        <span className="text-xs font-bold text-[#1E4B8F]">
                          15% Escrow Deposit
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#1E4B8F]">
                        {formatPrice(depositUSD)}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions Checklist */}
                  <div className="space-y-2 pt-2 border-t border-[#E8E4DD] text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6B66] block">
                      Included in this custom quote:
                    </span>
                    <ul className="space-y-1.5 text-[#5F6B66]">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1B7A5A] shrink-0" />
                        <span>All Nepal Gov National Park &amp; TIMS permits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1B7A5A] shrink-0" />
                        <span>Licensed guide &amp; insured porter crew</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1B7A5A] shrink-0" />
                        <span>All teahouse / lodge nights ({tripDurationDays}d)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1B7A5A] shrink-0" />
                        <span>100% Escrow deposit payment security</span>
                      </li>
                      {helicopterDescent && (
                        <li className="flex items-center gap-2 text-[#1E4B8F] font-semibold">
                          <Plane className="w-3.5 h-3.5 shrink-0" />
                          <span>Private helicopter descent included</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Trust Badge */}
                  <div className="p-3 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] flex items-center gap-2 text-[11px] text-[#5F6B66]">
                    <ShieldCheck className="w-4 h-4 text-[#1B7A5A] shrink-0" />
                    <span>Quotes are binding and valid for 7 days upon receipt.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PorterWelfareModal
        isOpen={welfareModalOpen}
        onClose={() => setWelfareModalOpen(false)}
      />
    </CustomerLayout>
  );
};
