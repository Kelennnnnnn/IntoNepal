import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Building2,
  CreditCard,
  Lock,
  Mountain,
  TrendingUp,
  Sparkles,
  Activity,
  Compass,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { ReviewScoreChip } from '@/components/ui/ReviewScoreChip';
import { ALL_OTA_LISTINGS, VERIFIED_AGENCIES } from '@/data/otaMarketplaceData';
import { createBookingQuote } from '@/domain/quote';
import { BalancePaymentMethod, createMoney } from '@/domain/money';
import { useCurrencyStore } from '@/stores/currencyStore';

export const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice, currency } = useCurrencyStore();

  // Find listing from OTA marketplace dataset
  const activity = useMemo(() => {
    return ALL_OTA_LISTINGS.find((item) => item.id === id) || ALL_OTA_LISTINGS[0];
  }, [id]);

  // Find matching agency profile
  const agency = useMemo(() => {
    return (
      VERIFIED_AGENCIES.find((a) => a.name === activity.agencyName) ||
      VERIFIED_AGENCIES[0]
    );
  }, [activity]);

  const [selectedDate, setSelectedDate] = useState<string>(
    activity.nextDate || activity.availableDates[0] || '2026-10-15'
  );
  const [guests, setGuests] = useState<number>(2);
  const [balanceMethod, setBalanceMethod] = useState<BalancePaymentMethod>('DIRECT_TO_AGENCY');
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions' | 'agency'>('overview');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Elevation Profile Analysis
  const elevationData = useMemo(() => {
    const rawPoints = activity.itinerary.map((d) => {
      const match = d.altitude.match(/([\d,]+)\s*m/i);
      const num = match ? parseInt(match[1].replace(/,/g, ''), 10) : 1400;
      const isRest =
        d.title.toLowerCase().includes('acclimatization') ||
        d.title.toLowerCase().includes('rest') ||
        d.highlights.toLowerCase().includes('acclimatization');
      return {
        day: d.day,
        title: d.title,
        altitudeStr: d.altitude,
        altitudeNum: isNaN(num) ? 1400 : num,
        isRest,
        accommodation: d.accommodation,
      };
    });

    const altitudes = rawPoints.map((p) => p.altitudeNum);
    const maxAlt = altitudes.length > 0 ? Math.max(...altitudes) : 3000;
    const minAlt = altitudes.length > 0 ? Math.min(...altitudes) : 1000;
    const acclimDays = rawPoints.filter((p) => p.isRest).length;

    return {
      points: rawPoints,
      maxAlt,
      minAlt,
      acclimDays,
    };
  }, [activity.itinerary]);

  // Generate Authoritative Commercial Quote (15% / 85%)
  const quote = useMemo(() => {
    return createBookingQuote({
      listingId: activity.id,
      departureId: `dep-${selectedDate}`,
      agencyId: agency.id,
      travelerId: 'traveler-guest',
      participantCount: guests,
      unitPriceAmount: activity.price,
      remainingBalanceMethod: balanceMethod,
    });
  }, [activity, agency, guests, selectedDate, balanceMethod]);

  const handleProceedToCheckout = () => {
    // Store active quote in session storage so checkout picks it up
    try {
      sessionStorage.setItem('active_ota_quote', JSON.stringify({
        quote,
        activityTitle: activity.title,
        activityImage: activity.image,
        activityCategory: activity.category,
        agencyName: activity.agencyName,
        agencyLicense: activity.agencyLicense,
        agencyPhone: activity.agencyPhone,
        agencyEmail: activity.agencyEmail,
      }));
    } catch (e) {
      console.warn('Session storage error:', e);
    }

    navigate('/booking/payment');
  };

  return (
    <CustomerLayout>
      {/* Top Breadcrumbs & Meta */}
      <div className="bg-[#FBF8F3] border-b border-[#E8E4DD] py-3 text-xs text-[#5F6B66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#1A1F1D]">Home</Link>
            <span>/</span>
            <Link to="/activities" className="hover:text-[#1A1F1D]">Experiences</Link>
            <span>/</span>
            <span className="text-[#1A1F1D] font-medium truncate max-w-[280px] sm:max-w-md">
              {activity.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-[#5F6B66] hover:text-[#C8362E] transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-[#5F6B66] hover:text-[#1A1F1D] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Operating Agency Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#1E4B8F]/10 text-[#1E4B8F] rounded">
              {activity.category}
            </span>
            <LevelBadge difficulty={activity.difficulty} />
            <span className="text-xs text-[#5F6B66] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
              {activity.location}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight leading-snug mb-3">
            {activity.title}
          </h1>

          {/* Operating Agency Trust Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <ReviewScoreChip rating={activity.rating} reviewCount={activity.reviewCount} />
            </div>
            <span className="text-[#E8E4DD]">•</span>
            <div className="flex items-center gap-2 bg-[#FBF8F3] px-3 py-1.5 rounded-md border border-[#E8E4DD]">
              <Building2 className="w-4 h-4 text-[#1E4B8F]" />
              <span className="text-[#5F6B66]">Operated by:</span>
              <Link
                to={`/agency/profile/${agency.id}`}
                className="font-bold text-[#1A1F1D] hover:text-[#1E4B8F] hover:underline"
              >
                {activity.agencyName}
              </Link>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B7A5A] bg-[#1B7A5A]/10 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                NTB Lic #{activity.agencyLicense}
              </span>
            </div>
          </div>
        </div>

        {/* Media Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 rounded-xl overflow-hidden shadow-sm">
          <div className="lg:col-span-2 h-[340px] sm:h-[440px] bg-[#1A1F1D] relative">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              {activity.badges.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#1A1F1D]/80 backdrop-blur-sm text-white rounded border border-white/20"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-4 h-[440px]">
            {activity.gallery.slice(0, 2).map((img, i) => (
              <div key={i} className="h-full bg-[#1A1F1D] overflow-hidden">
                <img
                  src={img}
                  alt={`${activity.title} gallery ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Key Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#D97706]" />
            <div>
              <p className="text-[11px] text-[#5F6B66] uppercase font-bold">Duration</p>
              <p className="text-sm font-bold text-[#1A1F1D]">{activity.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#1E4B8F]" />
            <div>
              <p className="text-[11px] text-[#5F6B66] uppercase font-bold">Group Size</p>
              <p className="text-sm font-bold text-[#1A1F1D]">{activity.groupSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#1B7A5A]" />
            <div>
              <p className="text-[11px] text-[#5F6B66] uppercase font-bold">Max Altitude</p>
              <p className="text-sm font-bold text-[#1A1F1D]">{activity.maxAltitude}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#C8362E]" />
            <div>
              <p className="text-[11px] text-[#5F6B66] uppercase font-bold">Best Season</p>
              <p className="text-sm font-bold text-[#1A1F1D]">{activity.bestSeasons}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Details Left, OTA Quote Engine Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Columns (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Custom Expedition Callout Banner */}
            <div className="p-4 rounded-xl bg-[#FEF4E7] border border-[#D97706]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tailor This Expedition</span>
                </div>
                <p className="text-xs text-[#1A1F1D]">
                  Need a private departure, helicopter return, or custom lodge tier for your group?
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/trail-profiler"
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E4DD] text-xs font-bold text-[#1E4B8F] hover:bg-[#F5F2EC] flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Elevation Profile</span>
                </Link>
                <Link
                  to={`/plan-custom-trek?trek=${encodeURIComponent(activity.title)}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <span>Build Custom Trip →</span>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#E8E4DD] flex gap-6 text-sm font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                    : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('itinerary')}
                className={`pb-3 transition-colors ${
                  activeTab === 'itinerary'
                    ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                    : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                }`}
              >
                Day-by-Day Itinerary ({activity.itinerary.length} Days)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inclusions')}
                className={`pb-3 transition-colors ${
                  activeTab === 'inclusions'
                    ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                    : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                }`}
              >
                Inclusions & Gear
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('agency')}
                className={`pb-3 transition-colors ${
                  activeTab === 'agency'
                    ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                    : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                }`}
              >
                Verified Operator
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1F1D] mb-3">
                    Experience Description
                  </h3>
                  <p className="text-sm sm:text-base text-[#303834] leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                {activity.altitudeNotice && (
                  <div className="p-4 rounded-lg bg-[#FEF4E7] border border-[#F6B26B]/50 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase text-[#D97706] tracking-wider">
                        Altitude & Safety Briefing
                      </h4>
                      <p className="text-xs text-[#5F6B66] mt-1">
                        {activity.altitudeNotice}
                      </p>
                    </div>
                  </div>
                )}

                {/* OTA Trust Highlights */}
                <div className="p-5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#1A1F1D]">
                    Book with Confidence on Into Nepal
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5F6B66]">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B7A5A] shrink-0 mt-0.5" />
                      <span><strong>15% Flexible Deposit:</strong> Pay only 15% today to lock departure spots.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B7A5A] shrink-0 mt-0.5" />
                      <span><strong>85% Direct or Escrow:</strong> Pay remaining balance to agency on arrival or hold in platform escrow.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B7A5A] shrink-0 mt-0.5" />
                      <span><strong>Vetted Operators:</strong> Verified Nepal Tourism Board license & certified guides.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B7A5A] shrink-0 mt-0.5" />
                      <span><strong>Free Rebooking:</strong> Date changes permitted up to 14 days prior to departure.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Itinerary */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1F1D] mb-1">
                    Detailed Itinerary & Elevation Profile
                  </h3>
                  <p className="text-xs text-[#5F6B66]">
                    Curated and operated directly by {activity.agencyName}. Daily altitudes and walking times are based on certified alpine pacing.
                  </p>
                </div>

                {/* Elevation Profile Visualizer Card */}
                {elevationData.points.length > 1 && (
                  <div className="bg-[#FFFFFF] border border-[#E8E4DD] rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E4DD] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1E4B8F]/10 text-[#1E4B8F] flex items-center justify-center">
                          <Mountain className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1F1D]">
                            Route Elevation & Acclimatization Curve
                          </h4>
                          <p className="text-[11px] text-[#5F6B66]">
                            Click any day node on the graph to inspect that day's schedule.
                          </p>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <div className="flex items-center gap-1 text-[#1E4B8F] bg-[#1E4B8F]/10 px-2.5 py-1 rounded-lg">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Max: {elevationData.maxAlt.toLocaleString()}m</span>
                        </div>
                        {elevationData.acclimDays > 0 && (
                          <div className="flex items-center gap-1 text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded-lg">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{elevationData.acclimDays} Acclimatization Stops</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive SVG Chart */}
                    <div className="w-full overflow-x-auto pb-1">
                      <div className="min-w-[620px]">
                        <svg viewBox="0 0 700 190" className="w-full h-44 overflow-visible font-sans">
                          <defs>
                            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1E4B8F" stopOpacity="0.35" />
                              <stop offset="70%" stopColor="#1E4B8F" stopOpacity="0.08" />
                              <stop offset="100%" stopColor="#1E4B8F" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Guide Lines */}
                          {[5000, 3500, 2000].map((alt) => {
                            if (alt > elevationData.maxAlt + 300) return null;
                            const y =
                              25 +
                              (1 - (alt - elevationData.minAlt) / Math.max(1, elevationData.maxAlt - elevationData.minAlt)) * 125;
                            if (y < 20 || y > 155) return null;
                            return (
                              <g key={alt}>
                                <line
                                  x1={45}
                                  y1={y}
                                  x2={685}
                                  y2={y}
                                  stroke="#E8E4DD"
                                  strokeDasharray="4 4"
                                  strokeWidth="1"
                                />
                                <text
                                  x={40}
                                  y={y + 3}
                                  textAnchor="end"
                                  fontSize="9"
                                  fill="#5F6B66"
                                  fontWeight="600"
                                >
                                  {alt}m
                                </text>
                              </g>
                            );
                          })}

                          {/* Calculate Points */}
                          {(() => {
                            const pts = elevationData.points;
                            const count = pts.length;
                            const left = 55;
                            const width = 625;
                            const coords = pts.map((p, i) => {
                              const x = left + (i / Math.max(1, count - 1)) * width;
                              const ratio = (p.altitudeNum - elevationData.minAlt) / Math.max(1, elevationData.maxAlt - elevationData.minAlt);
                              const y = 25 + (1 - ratio) * 120;
                              return { ...p, x, y };
                            });

                            const lineD = coords.reduce((acc, c, i) => {
                              return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                            }, '');

                            const lastC = coords[coords.length - 1];
                            const firstC = coords[0];
                            const areaD = `${lineD} L ${lastC.x} 150 L ${firstC.x} 150 Z`;

                            return (
                              <>
                                {/* Filled Area */}
                                <path d={areaD} fill="url(#elevationGrad)" />
                                {/* Route Line */}
                                <path
                                  d={lineD}
                                  fill="none"
                                  stroke="#1E4B8F"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Interactive Day Nodes */}
                                {coords.map((c) => {
                                  const isSelected = expandedDay === c.day;
                                  const isHovered = hoveredDay === c.day;
                                  const isMax = c.altitudeNum === elevationData.maxAlt;

                                  return (
                                    <g
                                      key={c.day}
                                      className="cursor-pointer group"
                                      onClick={() => setExpandedDay(isSelected ? null : c.day)}
                                      onMouseEnter={() => setHoveredDay(c.day)}
                                      onMouseLeave={() => setHoveredDay(null)}
                                    >
                                      {/* Click Target */}
                                      <circle cx={c.x} cy={c.y} r={14} fill="transparent" />

                                      {/* Highlight ring for active or max */}
                                      {(isSelected || isHovered || isMax) && (
                                        <circle
                                          cx={c.x}
                                          cy={c.y}
                                          r={c.isRest ? 9 : 8}
                                          fill={c.isRest ? '#FEF3C7' : '#DBEAFE'}
                                          opacity="0.8"
                                        />
                                      )}

                                      {/* Node Dot */}
                                      <circle
                                        cx={c.x}
                                        cy={c.y}
                                        r={isSelected || isHovered ? 5 : 3.5}
                                        fill={c.isRest ? '#D97706' : '#1E4B8F'}
                                        stroke="#FFFFFF"
                                        strokeWidth="1.5"
                                      />

                                      {/* X-axis Day Label */}
                                      <text
                                        x={c.x}
                                        y={166}
                                        textAnchor="middle"
                                        fontSize="9"
                                        fontWeight={isSelected || isHovered ? '700' : '500'}
                                        fill={isSelected || isHovered ? '#1E4B8F' : '#5F6B66'}
                                      >
                                        D{c.day}
                                      </text>

                                      {/* Floating tooltip on hover or select */}
                                      {(isSelected || isHovered) && (
                                        <g>
                                          <rect
                                            x={c.x - 45}
                                            y={c.y - 32}
                                            width={90}
                                            height={20}
                                            rx={4}
                                            fill="#1A1F1D"
                                          />
                                          <text
                                            x={c.x}
                                            y={c.y - 18}
                                            textAnchor="middle"
                                            fontSize="9"
                                            fill="#FFFFFF"
                                            fontWeight="600"
                                          >
                                            {c.altitudeStr}
                                          </text>
                                        </g>
                                      )}
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-[#5F6B66] border-t border-[#E8E4DD] pt-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1E4B8F]" />
                          <span>Trek / Alpine Stage</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                          <span>Acclimatization / Rest Stop</span>
                        </span>
                      </div>
                      <span className="font-medium text-[#1B7A5A]">
                        ✓ All routes monitored for AMS safety thresholds
                      </span>
                    </div>

                    {/* Expedition Preparation & High-Altitude Safety Link */}
                    <div className="mt-3 p-3.5 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#1E4B8F] text-white shrink-0">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1E4B8F]">
                            High Altitude &amp; Expedition Safety Hub
                          </h4>
                          <p className="text-[11px] text-[#5F6B66]">
                            Check Lake Louise AMS screener, 6,000m helicopter insurance mandates, and gear checklist.
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/safety"
                        className="px-3 py-1.5 rounded-lg bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold whitespace-nowrap transition-colors shadow-2xs"
                      >
                        Safety &amp; Permits Hub →
                      </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {activity.itinerary.map((day) => {
                    const isExpanded = expandedDay === day.day;
                    return (
                      <div
                        key={day.day}
                        className="rounded-lg border border-[#E8E4DD] bg-[#FFFFFF] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FBF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#1E4B8F]/10 text-[#1E4B8F] text-xs font-bold flex items-center justify-center shrink-0">
                              D{day.day}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-[#1A1F1D]">
                                Day {day.day}: {day.title}
                              </h4>
                              <p className="text-xs text-[#5F6B66]">
                                {day.altitude} • {day.walkingHours}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#5F6B66]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#5F6B66]" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-[#E8E4DD]/60 bg-[#FBF8F3]/50 text-xs text-[#303834] space-y-2">
                            <p><strong>Key Highlights:</strong> {day.highlights}</p>
                            <p><strong>Overnight Stay:</strong> {day.accommodation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Inclusions */}
            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[#F4F9F6] border border-[#1B7A5A]/20 space-y-3">
                  <h4 className="text-sm font-bold text-[#1B7A5A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    What Is Included
                  </h4>
                  <ul className="space-y-2 text-xs text-[#303834]">
                    {activity.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#1B7A5A] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-[#FDF5F5] border border-[#C8362E]/20 space-y-3">
                  <h4 className="text-sm font-bold text-[#C8362E] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    What Is Excluded
                  </h4>
                  <ul className="space-y-2 text-xs text-[#303834]">
                    {activity.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#C8362E] font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Agency Profile */}
            {activeTab === 'agency' && (
              <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E8E4DD] space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#FBF8F3] border border-[#E8E4DD] overflow-hidden shrink-0">
                    <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1A1F1D]">
                      {agency.name}
                    </h4>
                    <p className="text-xs text-[#5F6B66]">{agency.tagline}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="font-semibold text-[#1B7A5A] bg-[#1B7A5A]/10 px-2 py-0.5 rounded border border-[#1B7A5A]/30">
                        Government License: {agency.licenseNumber}
                      </span>
                      <span className="text-[#5F6B66]">TAAN Reg: {agency.taanMemberNumber}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
                  {agency.about}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E8E4DD] text-xs">
                  <div>
                    <span className="text-[#5F6B66] block">Location:</span>
                    <strong className="text-[#1A1F1D]">{agency.primaryLocation}</strong>
                  </div>
                  <div>
                    <span className="text-[#5F6B66] block">Licensed Guides:</span>
                    <strong className="text-[#1A1F1D]">{agency.licensedGuideCount} Certified</strong>
                  </div>
                  <div>
                    <span className="text-[#5F6B66] block">Operating Since:</span>
                    <strong className="text-[#1A1F1D]">{agency.yearEstablished}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/agency/profile/${agency.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4B8F] hover:underline"
                  >
                    <span>View agency portfolio & verified credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Authoritative OTA Booking & Quote Console (4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-20 bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] shadow-lg p-5 sm:p-6 space-y-6">
              {/* Header Price Pill */}
              <div className="flex items-baseline justify-between border-b border-[#E8E4DD] pb-4">
                <div>
                  <span className="text-xs text-[#5F6B66] uppercase font-bold tracking-wider block">
                    Product Price (100%)
                  </span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1A1F1D]">
                      {formatPrice(activity.price)}
                    </span>
                    <span className="text-xs text-[#5F6B66]">/ person</span>
                    {currency !== 'USD' && (
                      <span className="text-[11px] text-[#5F6B66] font-medium">
                        (${activity.price} USD)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-bold bg-[#EFF3FA] text-[#1E4B8F] rounded-full border border-[#1E4B8F]/20">
                    Pay 15% Today to Lock
                  </span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* Departure Date Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5F6B66] mb-1.5 flex items-center justify-between">
                    <span>Guaranteed Departure Date</span>
                    <span className="text-[10px] text-[#1B7A5A] font-semibold">Instant Confirmation</span>
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-semibold text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                  >
                    {activity.availableDates.map((d) => (
                      <option key={d} value={d}>
                        {d} • Guaranteed Departure ({activity.spotsLeft} spots remaining)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5F6B66] mb-1.5">
                    Travelers / Participants
                  </label>
                  <div className="flex items-center justify-between p-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3]">
                    <span className="text-xs font-semibold text-[#1A1F1D] px-2">
                      {guests} {guests === 1 ? 'Adult Guest' : 'Adult Guests'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                        className="w-7 h-7 rounded bg-white border border-[#E8E4DD] text-[#1A1F1D] font-bold text-xs hover:bg-[#E8E4DD] disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(12, g + 1))}
                        disabled={guests >= 12}
                        className="w-7 h-7 rounded bg-white border border-[#E8E4DD] text-[#1A1F1D] font-bold text-xs hover:bg-[#E8E4DD] disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remaining 85% Balance Payment Method Option */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5F6B66] mb-1.5">
                    Remaining 85% Balance Terms
                  </label>
                  <div className="space-y-2">
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        balanceMethod === 'DIRECT_TO_AGENCY'
                          ? 'border-[#1E4B8F] bg-[#EFF3FA]/50'
                          : 'border-[#E8E4DD] hover:bg-[#FBF8F3]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="balanceMethod"
                        value="DIRECT_TO_AGENCY"
                        checked={balanceMethod === 'DIRECT_TO_AGENCY'}
                        onChange={() => setBalanceMethod('DIRECT_TO_AGENCY')}
                        className="mt-0.5 text-[#1E4B8F]"
                      />
                      <div>
                        <strong className="block text-[#1A1F1D]">Direct to Agency on Arrival</strong>
                        <span className="text-[11px] text-[#5F6B66]">
                          Pay cash (USD/EUR/NPR) or local credit card to the operating agency at their Kathmandu/Pokhara office before departure.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        balanceMethod === 'INTO_NEPAL_PLATFORM'
                          ? 'border-[#1E4B8F] bg-[#EFF3FA]/50'
                          : 'border-[#E8E4DD] hover:bg-[#FBF8F3]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="balanceMethod"
                        value="INTO_NEPAL_PLATFORM"
                        checked={balanceMethod === 'INTO_NEPAL_PLATFORM'}
                        onChange={() => setBalanceMethod('INTO_NEPAL_PLATFORM')}
                        className="mt-0.5 text-[#1E4B8F]"
                      />
                      <div>
                        <strong className="block text-[#1A1F1D]">Into Nepal Platform Escrow</strong>
                        <span className="text-[11px] text-[#5F6B66]">
                          Pre-pay the full balance to Into Nepal; funds are held in escrow and released to the agency 14 days after tour completion.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Authoritative Financial Breakdown Box */}
              <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-2.5 text-xs">
                <div className="flex justify-between text-[#5F6B66]">
                  <span>Total Tour Value (${activity.price} × {guests})</span>
                  <span className="font-semibold text-[#1A1F1D]">
                    {formatPrice(quote.totalProductValue.amount)}
                    <span className="text-[10px] text-[#5F6B66] ml-1">
                      (${quote.totalProductValue.amount.toFixed(2)})
                    </span>
                  </span>
                </div>

                <div className="border-t border-[#E8E4DD] pt-2 flex justify-between text-[#1E4B8F] font-bold">
                  <div className="flex items-center gap-1">
                    <span>Pay Today (15% Reservation Fee)</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1B7A5A]" />
                  </div>
                  <span className="text-sm">
                    {formatPrice(quote.platformFeeAmount.amount)}
                    <span className="text-[10px] font-normal text-[#1E4B8F] ml-1">
                      (${quote.platformFeeAmount.amount.toFixed(2)})
                    </span>
                  </span>
                </div>

                <div className="flex justify-between text-[#5F6B66] text-[11px]">
                  <span>Remaining 85% to Agency</span>
                  <span className="font-semibold text-[#1A1F1D]">
                    {formatPrice(quote.agencyBalanceAmount.amount)}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-6 text-sm font-bold bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>
                  Reserve Spot for {formatPrice(quote.platformFeeAmount.amount)} (${quote.platformFeeAmount.amount.toFixed(2)} USD)
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center space-y-1 text-[11px] text-[#5F6B66]">
                <p className="flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#1B7A5A]" />
                  <span>Sandbox NIC ASIA Gateway Simulator ready</span>
                </p>
                <p>Guaranteed spot lock with instant travel voucher.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
