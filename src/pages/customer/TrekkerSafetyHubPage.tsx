import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import {
  ShieldAlert,
  Compass,
  FileText,
  Backpack,
  CloudSun,
  Activity,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Info,
  Calendar,
  Layers,
  Thermometer,
  Wind,
  Eye,
  CheckSquare,
  Square,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Save,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  ALTITUDE_TIERS,
  LAKE_LOUISE_SURVEY,
  PERMIT_RULES,
  GEAR_CHECKLIST,
  MOUNTAIN_WEATHER_STATIONS,
  getStoredInsurancePolicy,
  saveStoredInsurancePolicy,
  getStoredPackedGearIds,
  toggleStoredPackedGearId,
  type SavedInsurancePolicy,
} from '../../data/trekkerSafetyData';
import { useCurrencyStore } from '../../stores/currencyStore';
import { toast } from 'sonner';

export const TrekkerSafetyHubPage: React.FC = () => {
  const { currency, formatPrice } = useCurrencyStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'altitude' | 'insurance' | 'permits' | 'gear' | 'weather'
  >('altitude');

  // Altitude Section State
  const [selectedAltitudeTier, setSelectedAltitudeTier] = useState<number>(3500);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({
    ll_headache: 0,
    ll_gi: 0,
    ll_fatigue: 0,
    ll_dizziness: 0,
    ll_functional: 0,
  });

  // Insurance Policy Form State
  const [insurancePolicy, setInsurancePolicy] = useState<SavedInsurancePolicy>({
    providerName: '',
    policyNumber: '',
    emergencyPhone: '',
    maxAltitudeCoverageMeters: 6000,
    hasHelicopterEvacuation: true,
    hasDirectBillingGuarantee: true,
    savedAt: '',
  });
  const [insuranceSavedNotice, setInsuranceSavedNotice] = useState(false);

  // Permits Section State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('everest_khumbu');
  const [travelerCount, setTravelerCount] = useState<number>(2);

  // Gear Section State
  const [gearSeason, setGearSeason] = useState<'spring' | 'autumn' | 'winter' | 'monsoon'>('autumn');
  const [packedGearIds, setPackedGearIds] = useState<string[]>([]);
  const [gearFilterCategory, setGearFilterCategory] = useState<string>('all');

  // Load stored insurance & packed gear
  useEffect(() => {
    const saved = getStoredInsurancePolicy();
    if (saved) {
      setInsurancePolicy(saved);
      setInsuranceSavedNotice(true);
    }
    setPackedGearIds(getStoredPackedGearIds());

    const handleGearUpdate = (e: any) => {
      setPackedGearIds(e.detail || getStoredPackedGearIds());
    };
    window.addEventListener('into_nepal_packed_gear_updated', handleGearUpdate);
    return () => window.removeEventListener('into_nepal_packed_gear_updated', handleGearUpdate);
  }, []);

  // Calculate Lake Louise AMS Score
  const amsScore = useMemo(() => {
    return Object.values(surveyAnswers).reduce((acc, curr) => acc + curr, 0);
  }, [surveyAnswers]);

  const amsDiagnosis = useMemo(() => {
    const headache = surveyAnswers['ll_headache'] || 0;
    if (headache === 0 && amsScore <= 2) {
      return {
        level: 'Normal / Acclimatizing Well',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badge: 'NORMAL',
        description: 'You are adapting comfortably to the current elevation. Continue your planned ascent at a slow, steady pace.',
        action: 'Maintain hydration (3-4L per day), avoid alcohol, and keep a slow conversational pace ("bistari, bistari").',
      };
    }
    if (headache >= 1 && amsScore >= 3 && amsScore <= 5) {
      return {
        level: 'Mild Acute Mountain Sickness (AMS)',
        color: 'bg-amber-50 text-amber-800 border-amber-300',
        badge: 'MILD AMS',
        description: 'Classic early altitude symptoms. Your body is signaling that it needs more time to synthesize red blood cells.',
        action: 'DO NOT ASCEND HIGHER. Rest at this altitude for 24 hours. Hydrate with electrolyte soup/fluids. Consider Diamox 125mg BID. If symptoms worsen, descend immediately.',
      };
    }
    return {
      level: 'Severe AMS / High Altitude Warning (HAPE/HACE Alert)',
      color: 'bg-red-50 text-red-800 border-red-300',
      badge: 'CRITICAL ALERT',
      description: 'Dangerous altitude reaction with severe neurological or physical impairment.',
      action: 'IMMEDIATE DESCENT MANDATORY (minimum 500m–1,000m). Inform your Sherpa lead guide right away. Administer supplemental oxygen and initiate emergency helicopter evacuation if ataxia or coughing occurs.',
    };
  }, [amsScore, surveyAnswers]);

  // Handle Save Insurance
  const handleSaveInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insurancePolicy.providerName.trim() || !insurancePolicy.policyNumber.trim()) {
      toast.error('Please provide your insurance company name and policy number.');
      return;
    }
    const record: SavedInsurancePolicy = {
      ...insurancePolicy,
      savedAt: new Date().toISOString(),
    };
    saveStoredInsurancePolicy(record);
    setInsurancePolicy(record);
    setInsuranceSavedNotice(true);
    toast.success('Insurance policy verified and saved to your trekker profile!');
  };

  // Filtered Gear Items
  const filteredGear = useMemo(() => {
    return GEAR_CHECKLIST.filter((item) => {
      const matchSeason = item.seasons.includes(gearSeason);
      const matchCat = gearFilterCategory === 'all' || item.category === gearFilterCategory;
      return matchSeason && matchCat;
    });
  }, [gearSeason, gearFilterCategory]);

  const packedCount = useMemo(() => {
    return filteredGear.filter((item) => packedGearIds.includes(item.id)).length;
  }, [filteredGear, packedGearIds]);

  const handleToggleGear = (id: string) => {
    const updated = toggleStoredPackedGearId(id);
    setPackedGearIds(updated);
  };

  const handleResetChecklist = () => {
    localStorage.removeItem('into_nepal_packed_gear_ids');
    setPackedGearIds([]);
    toast.info('Gear checklist reset.');
  };

  const currentPermitRule = useMemo(() => {
    return PERMIT_RULES.find((r) => r.regionId === selectedRegionId) || PERMIT_RULES[0];
  }, [selectedRegionId]);

  const calculatedPermitTotalUsd = useMemo(() => {
    const basePerPerson = currentPermitRule.permits.reduce((acc, p) => acc + p.costUsdBase, 0);
    return basePerPerson * travelerCount;
  }, [currentPermitRule, travelerCount]);

  return (
    <CustomerLayout>
      {/* HERO SECTION */}
      <div className="relative bg-[#1A1F1D] text-white py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            Official Himalayan Safety & Expedition Hub
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white mb-4">
            Trekker Safety, Altitude Protocols & Permits Hub
          </h1>
          <p className="text-[#A4B3AC] text-sm sm:text-base max-w-3xl leading-relaxed">
            Everything you need for a responsible, secure Himalayan expedition: verified Lake Louise AMS diagnostic protocols, mandatory 6,000m helicopter evacuation rules, official conservation permit calculators, and live trail weather radars.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 flex items-center justify-center text-[#F59E0B]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#A4B3AC] block text-[10px] uppercase font-bold">Elevation Rule</span>
                <span className="font-semibold text-white">Max 500m/Day &gt; 3,000m</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1E4B8F]/30 flex items-center justify-center text-[#60A5FA]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#A4B3AC] block text-[10px] uppercase font-bold">Rescue Mandate</span>
                <span className="font-semibold text-white">6,000m Helicopter Cover</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#A4B3AC] block text-[10px] uppercase font-bold">Permit Status</span>
                <span className="font-semibold text-white">NTB &amp; TAAN Synchronized</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#A4B3AC] block text-[10px] uppercase font-bold">Porter Welfare</span>
                <span className="font-semibold text-white">Max 15kg / Fair Wage Capped</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY TAB NAVIGATION */}
      <div className="sticky top-0 z-30 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-[#E8E4DD] px-4 sm:px-6 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('altitude')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'altitude'
                ? 'bg-[#1E4B8F] text-white shadow-xs'
                : 'text-[#5F6B66] hover:bg-[#E8E4DD]/60 hover:text-[#1A1F1D]'
            }`}
          >
            <Activity className="w-4 h-4" />
            Altitude &amp; AMS Screener
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('insurance')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'insurance'
                ? 'bg-[#1E4B8F] text-white shadow-xs'
                : 'text-[#5F6B66] hover:bg-[#E8E4DD]/60 hover:text-[#1A1F1D]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Helicopter Insurance &amp; SOS
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permits')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'permits'
                ? 'bg-[#1E4B8F] text-white shadow-xs'
                : 'text-[#5F6B66] hover:bg-[#E8E4DD]/60 hover:text-[#1A1F1D]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Permits &amp; Fee Calculator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gear')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'gear'
                ? 'bg-[#1E4B8F] text-white shadow-xs'
                : 'text-[#5F6B66] hover:bg-[#E8E4DD]/60 hover:text-[#1A1F1D]'
            }`}
          >
            <Backpack className="w-4 h-4" />
            Gear &amp; Rental Checklist
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'weather'
                ? 'bg-[#1E4B8F] text-white shadow-xs'
                : 'text-[#5F6B66] hover:bg-[#E8E4DD]/60 hover:text-[#1A1F1D]'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            Live Weather Radar
          </button>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================================================================== */}
        {/* TAB 1: ALTITUDE SAFETY & LAKE LOUISE AMS SCREENER */}
        {/* ==================================================================== */}
        {activeTab === 'altitude' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Intro Alert */}
            <div className="p-5 rounded-2xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#1E4B8F] text-white shrink-0 mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E4B8F] text-sm">
                  The Golden Rule of High Altitude Trekking
                </h3>
                <p className="text-xs text-[#5F6B66] mt-1 leading-relaxed">
                  Never ascend with symptoms of Acute Mountain Sickness (AMS). Acclimatization is a biological process that cannot be rushed by fitness or willpower. Monitor your daily ascent rates, maintain hydration, and use the Lake Louise Clinical Score below to assess symptoms objectively.
                </p>
              </div>
            </div>

            {/* Altitude Tiers Interactive Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">
                    Elevation Zones &amp; Physiological Oxygen Depletion
                  </h3>
                  <p className="text-xs text-[#5F6B66]">
                    Select an altitude band to review physiological changes, key waypoints, and ascent speed caps.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ALTITUDE_TIERS.map((tier) => {
                  const isSelected = selectedAltitudeTier === tier.altitudeMeters;
                  return (
                    <button
                      key={tier.altitudeMeters}
                      type="button"
                      onClick={() => setSelectedAltitudeTier(tier.altitudeMeters)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#1E4B8F] ring-2 ring-[#1E4B8F]/20 shadow-sm'
                          : 'bg-[#FBF8F3] border-[#E8E4DD] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-black text-lg text-[#1A1F1D]">
                          {tier.altitudeMeters.toLocaleString()}m
                        </span>
                        <span className="text-[11px] font-bold text-[#D97706]">
                          {tier.oxygenPercentage}% O₂
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5F6B66] block">
                        {tier.altitudeFeet.toLocaleString()} ft
                      </span>
                      <div className="mt-2 pt-2 border-t border-[#E8E4DD] text-[10px] font-semibold text-[#1E4B8F]">
                        Max +{tier.dailyAscentMaxMeters}m / 24 hrs
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Tier Details Box */}
              {(() => {
                const tier = ALTITUDE_TIERS.find((t) => t.altitudeMeters === selectedAltitudeTier) || ALTITUDE_TIERS[1];
                return (
                  <div className="mt-4 p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8E4DD]">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1E4B8F]/10 text-[#1E4B8F] text-xs font-bold">
                          Elevation Tier: {tier.altitudeMeters}m ({tier.altitudeFeet} ft)
                        </span>
                        <span className="text-xs text-[#5F6B66]">
                          Effective Sea-Level Oxygen: <strong>{tier.oxygenPercentage}%</strong>
                        </span>
                      </div>
                      <span className="text-xs text-[#D97706] font-semibold">
                        Strict Sleep Ascent Ceiling: +{tier.dailyAscentMaxMeters}m per day
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#1A1F1D] block mb-1">
                        Representative Trekking Waypoints:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.keyWaypoints.map((wp, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#FBF8F3] border border-[#E8E4DD] text-[11px] font-medium text-[#1A1F1D]"
                          >
                            {wp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#1B7A5A] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Acclimatization Protocol Mandates:
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#5F6B66]">
                          {tier.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#1B7A5A] font-bold">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Red Flag Symptoms at This Altitude:
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#5F6B66]">
                          {tier.symptomsToWatch.map((sym, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#DC2626] font-bold">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Interactive Lake Louise Clinical Scoring System */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E4DD]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">
                      Lake Louise Acute Mountain Sickness (AMS) Clinical Screener
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E4B8F]/10 text-[#1E4B8F]">
                      2018 Consensus Consensus
                    </span>
                  </div>
                  <p className="text-xs text-[#5F6B66] mt-0.5">
                    Rate current physical sensations to calculate your objective diagnostic AMS score.
                  </p>
                </div>

                {/* Live Score Display */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">
                      Total AMS Score
                    </span>
                    <span className="font-mono text-2xl font-black text-[#1A1F1D]">
                      {amsScore} <span className="text-xs text-[#5F6B66] font-normal">/ 15</span>
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${amsDiagnosis.color}`}>
                    {amsDiagnosis.badge}
                  </span>
                </div>
              </div>

              {/* Diagnosis Callout Banner */}
              <div className={`p-4 rounded-xl border ${amsDiagnosis.color} space-y-1.5`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Info className="w-4 h-4" />
                  <span>Clinical Evaluation: {amsDiagnosis.level}</span>
                </div>
                <p className="text-xs leading-relaxed">{amsDiagnosis.description}</p>
                <div className="pt-2 border-t border-current/20 text-xs font-semibold">
                  <strong>Recommended Protocol:</strong> {amsDiagnosis.action}
                </div>
              </div>

              {/* Survey Questions */}
              <div className="space-y-5">
                {LAKE_LOUISE_SURVEY.map((q) => {
                  const currentVal = surveyAnswers[q.id] || 0;
                  return (
                    <div key={q.id} className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-[#1A1F1D]">
                          {q.title}
                        </span>
                        <span className="text-[11px] text-[#5F6B66] font-mono">
                          Selected: {currentVal} pts
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {q.options.map((opt) => {
                          const isOptSelected = currentVal === opt.points;
                          return (
                            <button
                              key={opt.points}
                              type="button"
                              onClick={() =>
                                setSurveyAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt.points,
                                }))
                              }
                              className={`p-2.5 rounded-lg text-left border transition-all text-xs cursor-pointer ${
                                isOptSelected
                                  ? 'bg-[#EFF3FA] border-[#1E4B8F] text-[#1E4B8F] font-semibold ring-1 ring-[#1E4B8F]'
                                  : 'bg-[#FBF8F3] border-[#E8E4DD] text-[#5F6B66] hover:bg-white'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold">{opt.label}</span>
                                <span className="font-mono text-[10px]">+{opt.points}</span>
                              </div>
                              <p className="text-[10px] leading-tight text-[#5F6B66]">
                                {opt.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset Survey Button */}
              <div className="flex justify-end pt-2 border-t border-[#E8E4DD]">
                <button
                  type="button"
                  onClick={() =>
                    setSurveyAnswers({
                      ll_headache: 0,
                      ll_gi: 0,
                      ll_fatigue: 0,
                      ll_dizziness: 0,
                      ll_functional: 0,
                    })
                  }
                  className="px-3 py-1.5 text-xs text-[#5F6B66] hover:text-[#1A1F1D] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Screener
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: HELICOPTER INSURANCE & SOS EMERGENCY DIRECTORY */}
        {/* ==================================================================== */}
        {activeTab === 'insurance' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Critical Insurance Mandate Notice */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs text-amber-900">
                <h3 className="font-bold text-sm text-amber-950">
                  Mandatory 6,000m Helicopter Evacuation Policy Requirement
                </h3>
                <p className="leading-relaxed">
                  90% of standard international travel insurance policies strictly cap mountaineering coverage at 3,000m (9,842 ft). Because treks like Everest Base Camp (5,364m), Thorong La Pass (5,416m), and Gokyo Ri (5,357m) far exceed this, you MUST have an altitude rider covering search, medical treatment, and helicopter evacuation up to <strong>6,000 meters</strong> with direct billing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form: Verify & Store Insurance Policy */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E8E4DD] shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DD]">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                      Trekker Insurance Verification Tool
                    </h3>
                    <p className="text-xs text-[#5F6B66]">
                      Store your policy details so your operating Sherpa agency can verify coverage with Kathmandu rescue towers.
                    </p>
                  </div>
                  {insuranceSavedNotice && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified on Profile
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveInsurance} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#1A1F1D] mb-1">
                        Insurance Provider Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. World Nomads / Ripcord / Global Rescue"
                        value={insurancePolicy.providerName}
                        onChange={(e) =>
                          setInsurancePolicy({ ...insurancePolicy, providerName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E4B8F]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1A1F1D] mb-1">
                        Policy / Certificate Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. WN-89210-NEP"
                        value={insurancePolicy.policyNumber}
                        onChange={(e) =>
                          setInsurancePolicy({ ...insurancePolicy, policyNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E4B8F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#1A1F1D] mb-1">
                        24/7 International Emergency Assistance Hotline *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +1 800 455 1234 or +44 203 123 4567"
                        value={insurancePolicy.emergencyPhone}
                        onChange={(e) =>
                          setInsurancePolicy({ ...insurancePolicy, emergencyPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E4B8F]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1A1F1D] mb-1">
                        Maximum Insured Altitude Ceiling (Meters)
                      </label>
                      <select
                        value={insurancePolicy.maxAltitudeCoverageMeters}
                        onChange={(e) =>
                          setInsurancePolicy({
                            ...insurancePolicy,
                            maxAltitudeCoverageMeters: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E4B8F]"
                      >
                        <option value={6000}>6,000 Meters (~19,685 ft) — Valid for all standard &amp; pass treks</option>
                        <option value={7000}>7,000 Meters (~22,965 ft) — Valid for trekking peaks (Mera/Island)</option>
                        <option value={3000}>3,000 Meters (WARNING: Inadequate for high treks)</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-[#1A1F1D]">
                      <input
                        type="checkbox"
                        checked={insurancePolicy.hasHelicopterEvacuation}
                        onChange={(e) =>
                          setInsurancePolicy({
                            ...insurancePolicy,
                            hasHelicopterEvacuation: e.target.checked,
                          })
                        }
                        className="rounded border-[#E8E4DD] text-[#1E4B8F] focus:ring-[#1E4B8F]"
                      />
                      <span>Confirmed: Policy explicitly includes emergency helicopter search and rescue.</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#1A1F1D]">
                      <input
                        type="checkbox"
                        checked={insurancePolicy.hasDirectBillingGuarantee}
                        onChange={(e) =>
                          setInsurancePolicy({
                            ...insurancePolicy,
                            hasDirectBillingGuarantee: e.target.checked,
                          })
                        }
                        className="rounded border-[#E8E4DD] text-[#1E4B8F] focus:ring-[#1E4B8F]"
                      />
                      <span>Direct Billing / Cashless Rescue Guarantee with Kathmandu dispatchers.</span>
                    </label>
                  </div>

                  {/* Warning if under 6000m */}
                  {insurancePolicy.maxAltitudeCoverageMeters < 5000 && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>
                        Altitude coverage below 5,000m will NOT cover high passes or base camp treks. Please contact your insurer to upgrade.
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Save &amp; Verify Policy
                    </button>
                  </div>
                </form>
              </div>

              {/* Emergency Mountain SOS Dispatch Directory */}
              <div className="bg-white p-6 rounded-2xl border border-[#E8E4DD] shadow-sm space-y-4">
                <div className="pb-3 border-b border-[#E8E4DD]">
                  <div className="flex items-center gap-2 text-[#DC2626]">
                    <PhoneCall className="w-4 h-4" />
                    <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                      Emergency SOS Contacts
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#5F6B66] mt-0.5">
                    Official 24/7 mountain rescue coordination hotlines in Nepal.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                    <span className="font-bold text-[#1A1F1D] block">
                      Himalayan Rescue Association (HRA)
                    </span>
                    <span className="text-[11px] text-[#5F6B66] block">
                      Operates high altitude clinics at Pheriche (4,240m) and Manang (3,519m)
                    </span>
                    <a
                      href="tel:+97714440292"
                      className="mt-1 font-mono font-bold text-[#1E4B8F] hover:underline block"
                    >
                      +977 1 4440292 / +977 1 4440293
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                    <span className="font-bold text-[#1A1F1D] block">
                      Nepal Tourist Police Mountain Rescue
                    </span>
                    <span className="text-[11px] text-[#5F6B66] block">
                      Bhrikutimandap Headquarters, Kathmandu
                    </span>
                    <a
                      href="tel:1144"
                      className="mt-1 font-mono font-bold text-[#1E4B8F] hover:underline block"
                    >
                      Toll Free: 1144 or +977 1 4247041
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                    <span className="font-bold text-[#1A1F1D] block">
                      Into Nepal Operations Emergency Line
                    </span>
                    <span className="text-[11px] text-[#5F6B66] block">
                      24/7 Traveler &amp; Agency Incident Escalation Desk
                    </span>
                    <a
                      href="tel:+97714421890"
                      className="mt-1 font-mono font-bold text-[#D97706] hover:underline block"
                    >
                      +977 1 4421890 / +977 9801234567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: OFFICIAL PERMITS & CONSERVATION FEE CALCULATOR */}
        {/* ==================================================================== */}
        {activeTab === 'permits' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 2023 Mandatory Guide Mandate Banner */}
            <div className="p-5 rounded-2xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#1E4B8F] text-white shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs text-[#1A1F1D]">
                <h3 className="font-bold text-sm text-[#1E4B8F]">
                  Official 2023 Nepal Tourism Board (NTB) Licensed Guide Mandate
                </h3>
                <p className="text-[#5F6B66] leading-relaxed">
                  As of April 1, 2023, independent solo foreign trekking without a government-certified Nepali guide is restricted across all National Parks and Conservation Areas (Annapurna, Langtang, Manaslu, Mustang, Kanchenjunga). All agencies featured on Into Nepal provide licensed, insured guides adhering to fair porter welfare standards.
                </p>
              </div>
            </div>

            {/* Region Selector & Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Region Selector Pills */}
                <div>
                  <label className="block text-xs font-bold text-[#5F6B66] uppercase tracking-wider mb-2">
                    Select Trekking Territory
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PERMIT_RULES.map((rule) => {
                      const isSelected = selectedRegionId === rule.regionId;
                      return (
                        <button
                          key={rule.regionId}
                          type="button"
                          onClick={() => setSelectedRegionId(rule.regionId)}
                          className={`p-3 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#1E4B8F] ring-2 ring-[#1E4B8F]/20 text-[#1E4B8F] font-bold shadow-xs'
                              : 'bg-[#FBF8F3] border-[#E8E4DD] text-[#5F6B66] hover:bg-white'
                          }`}
                        >
                          <div className="truncate font-semibold">{rule.regionName}</div>
                          <span className="text-[10px] text-[#5F6B66] block mt-0.5">
                            {rule.requiresRestrictedPermit ? 'Restricted Area (RAP)' : 'Conservation Permits'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Region Detailed Breakdown */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E4DD]">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">
                        {currentPermitRule.regionName}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentPermitRule.majorTreks.map((trek, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#FBF8F3] border border-[#E8E4DD] text-[10px] text-[#5F6B66]"
                          >
                            {trek}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          currentPermitRule.mandatoryGuide
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {currentPermitRule.mandatoryGuide ? 'Mandatory Guide Region' : 'Autonomous Zone'}
                      </span>
                    </div>
                  </div>

                  {/* Required Permits List */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#1A1F1D] block">
                      Mandatory Entry Permits &amp; Checkpoints:
                    </span>
                    {currentPermitRule.permits.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-2 text-xs"
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-[#1A1F1D]">{p.name}</span>
                          <span className="font-mono font-bold text-[#1E4B8F]">
                            {formatPrice(p.costUsdBase)} (NPR {p.costNpr.toLocaleString()})
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5F6B66]">
                          <strong>Issuing Authority:</strong> {p.issuingAuthority}
                        </div>
                        <div className="text-[11px] text-[#5F6B66]">
                          <strong>Duration:</strong> {p.durationNotes}
                        </div>
                        <div className="pt-2 border-t border-[#E8E4DD] flex flex-wrap gap-1">
                          <span className="text-[10px] font-semibold text-[#1A1F1D]">Required:</span>
                          {p.documentsRequired.map((doc, docIdx) => (
                            <span
                              key={docIdx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-white border border-[#E8E4DD] text-[#5F6B66]"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Special Regulations */}
                  <div className="pt-3 border-t border-[#E8E4DD] space-y-1.5">
                    <span className="text-xs font-bold text-[#1A1F1D] block">
                      Special Field Regulations:
                    </span>
                    <ul className="space-y-1 text-xs text-[#5F6B66]">
                      {currentPermitRule.specialRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#D97706] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Group Cost Calculator Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E8E4DD] shadow-sm space-y-5 h-fit">
                <div className="pb-3 border-b border-[#E8E4DD]">
                  <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                    Permits Cost Estimator
                  </h3>
                  <p className="text-[11px] text-[#5F6B66] mt-0.5">
                    Calculates total government fee disbursement for your trekking party.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1A1F1D] mb-1">
                      Number of Trekkers in Party:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={16}
                        value={travelerCount}
                        onChange={(e) => setTravelerCount(Math.max(1, Number(e.target.value)))}
                        className="w-24 px-3 py-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-center font-bold text-sm text-[#1A1F1D]"
                      />
                      <span className="text-xs text-[#5F6B66]">
                        {travelerCount === 1 ? 'Solo Trekker' : `${travelerCount} Trekkers`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-2">
                    <div className="flex justify-between text-[#5F6B66]">
                      <span>Base Permits ({travelerCount} pax)</span>
                      <span className="font-mono font-bold text-[#1A1F1D]">
                        {formatPrice(calculatedPermitTotalUsd)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#5F6B66] text-[11px]">
                      <span>Local Currency Equivalent</span>
                      <span className="font-mono">
                        NPR {(calculatedPermitTotalUsd * 134.5).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#E8E4DD] flex justify-between text-xs font-bold text-[#1E4B8F]">
                      <span>Estimated Fee Total</span>
                      <span className="font-mono text-sm">
                        {formatPrice(calculatedPermitTotalUsd)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5F6B66] leading-relaxed">
                    All Into Nepal registered tour packages already itemize and process your permits in advance through licensed Sherpa agencies.
                  </p>

                  <Link
                    to="/activities"
                    className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Browse {currentPermitRule.regionName} Treks</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: DYNAMIC PACKING & THAMEL RENTAL CHECKLIST */}
        {/* ==================================================================== */}
        {activeTab === 'gear' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header with Season Selector & Progress Bar */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E4DD]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">
                    Dynamic Expedition Packing &amp; Rental Checklist
                  </h3>
                  <p className="text-xs text-[#5F6B66] mt-0.5">
                    Tailored to Nepal’s high-altitude teahouse trails. Items can be checked off and saved directly on your device.
                  </p>
                </div>

                {/* Season Buttons */}
                <div className="flex items-center gap-1.5 bg-[#FBF8F3] p-1 rounded-xl border border-[#E8E4DD]">
                  {(['autumn', 'spring', 'winter', 'monsoon'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setGearSeason(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        gearSeason === s
                          ? 'bg-[#1E4B8F] text-white shadow-2xs'
                          : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#1A1F1D]">
                    Packed Progress: {packedCount} of {filteredGear.length} Items Ready
                  </span>
                  <span className="text-[#1E4B8F] font-mono font-bold">
                    {Math.round((packedCount / (filteredGear.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#E8E4DD] overflow-hidden">
                  <div
                    className="h-full bg-[#1E4B8F] transition-all duration-300 rounded-full"
                    style={{
                      width: `${(packedCount / (filteredGear.length || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'clothing_layers', label: 'Layering & Clothing' },
                    { id: 'footwear', label: 'Boots & Traction' },
                    { id: 'sleep_pack', label: 'Sleep & Pack' },
                    { id: 'health_water', label: 'Health & Water' },
                    { id: 'electronics', label: 'Electronics' },
                    { id: 'documents', label: 'Documents & Cash' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGearFilterCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                        gearFilterCategory === cat.id
                          ? 'bg-[#1E4B8F] text-white border-[#1E4B8F]'
                          : 'bg-[#FBF8F3] text-[#5F6B66] border-[#E8E4DD] hover:bg-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleResetChecklist}
                  className="text-xs text-[#5F6B66] hover:text-[#DC2626] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Packed State
                </button>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGear.map((item) => {
                const isPacked = packedGearIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleGear(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      isPacked
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-white border-[#E8E4DD] hover:border-[#1E4B8F]/40'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-[#1E4B8F]">
                      {isPacked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-[#5F6B66]" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isPacked ? 'line-through text-[#5F6B66]' : 'text-[#1A1F1D]'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.importance === 'mandatory' && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700">
                            Required
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#5F6B66] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-[#E8E4DD]/60 flex items-center justify-between text-[10px] text-[#5F6B66]">
                        <span>Elevation: &gt;{item.minAltitudeMeters}m</span>
                        {item.rentalEstimateDailyUsd && (
                          <span className="font-semibold text-[#1E4B8F]">
                            Thamel Rental: ~{formatPrice(item.rentalEstimateDailyUsd)}/day
                          </span>
                        )}
                        {!item.rentalEstimateDailyUsd && item.purchaseEstimateUsd && (
                          <span className="font-semibold text-[#5F6B66]">
                            Est. Purchase: ~{formatPrice(item.purchaseEstimateUsd)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Thamel & Pokhara Rental Pricing Guide Card */}
            <div className="p-5 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-3">
              <div className="flex items-center gap-2 text-[#D97706]">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-bold text-xs text-[#1A1F1D] uppercase tracking-wider">
                  Save Money: Thamel &amp; Pokhara Gear Rental Guide
                </h4>
              </div>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                You do not need to purchase an expensive $400 USD expedition sleeping bag or down jacket for a single trek. Reputable gear shops in Thamel (Kathmandu) and Lakeside (Pokhara) rent sanitized, high-fill goose down equipment for <strong>$1.50 to $2.00 USD per day</strong> with a standard deposit or passport photocopy.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: LIVE MOUNTAIN WEATHER RADAR & TRAIL TELEMETRY */}
        {/* ==================================================================== */}
        {activeTab === 'weather' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-[#D97706]" />
                  <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">
                    Himalayan Mountain Weather &amp; Pass Status Radar
                  </h3>
                </div>
                <p className="text-xs text-[#5F6B66] mt-0.5">
                  Ground telemetry and guide reports across Everest, Annapurna, Langtang, and Manaslu pass crossings.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Ground Telemetry Active
              </div>
            </div>

            {/* Weather Station Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOUNTAIN_WEATHER_STATIONS.map((station) => (
                <div
                  key={station.id}
                  className="bg-white p-5 rounded-2xl border border-[#E8E4DD] shadow-sm space-y-4 hover:border-[#1E4B8F]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] block">
                        {station.region.toUpperCase()} REGION
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1A1F1D]">
                        {station.name}
                      </h4>
                      <span className="text-xs text-[#5F6B66]">
                        {station.altitudeMeters.toLocaleString()}m ({station.altitudeFeet.toLocaleString()} ft)
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        station.status === 'optimal'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {station.status === 'optimal' ? 'Optimal Window' : 'Caution / Cold'}
                    </span>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#5F6B66] block">Day / Night</span>
                      <span className="font-mono font-bold text-[#1A1F1D]">
                        {station.currentTempDayC}°C / {station.currentTempNightC}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B66] block">Wind Gale</span>
                      <span className="font-mono font-bold text-[#1A1F1D]">
                        {station.windSpeedKmh} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B66] block">Visibility</span>
                      <span className="font-mono font-bold text-[#1A1F1D]">
                        {station.visibilityKm} km
                      </span>
                    </div>
                  </div>

                  {/* Conditions & Advisory */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6B66]">Weather Condition:</span>
                      <span className="font-semibold text-[#1A1F1D]">{station.condition}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#5F6B66]">Trail Ground Status:</span>
                      <span className="font-semibold text-[#1B7A5A]">{station.trailStatus}</span>
                    </div>

                    {station.flightStatus && (
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                        <strong>Flight Dispatch:</strong> {station.flightStatus}
                      </div>
                    )}

                    <p className="text-[11px] text-[#5F6B66] italic pt-1 border-t border-[#E8E4DD]/60">
                      &quot;{station.advisory}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
