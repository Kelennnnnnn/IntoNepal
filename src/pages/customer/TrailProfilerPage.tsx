import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  TrendingUp,
  Activity,
  Droplets,
  Wifi,
  Sparkles,
  ShowerHead,
  BatteryCharging,
  Stethoscope,
  Plane,
  AlertTriangle,
  Compass,
  ArrowRight,
  Printer,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { TRAIL_PROFILES, TrailWaypoint } from '@/data/trailProfilerData';
import { PorterWelfareModal } from '@/components/welfare/PorterWelfareModal';

export const TrailProfilerPage: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('ebc-kala-patthar');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [hoveredWaypoint, setHoveredWaypoint] = useState<TrailWaypoint | null>(null);
  const [welfareModalOpen, setWelfareModalOpen] = useState<boolean>(false);

  const activeRoute =
    TRAIL_PROFILES.find((r) => r.id === selectedRouteId) || TRAIL_PROFILES[0];
  const currentWaypoint =
    hoveredWaypoint ||
    activeRoute.waypoints.find((w) => w.day === activeDay) ||
    activeRoute.waypoints[0];

  // SVG Chart Dimensions
  const chartWidth = 900;
  const chartHeight = 280;
  const paddingX = 50;
  const paddingY = 40;
  const maxAlt = 6000;
  const minAlt = 1000;

  const getX = (index: number) => {
    const total = activeRoute.waypoints.length;
    return paddingX + (index / (total - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (altitude: number) => {
    const clamped = Math.max(minAlt, Math.min(maxAlt, altitude));
    const normalized = (clamped - minAlt) / (maxAlt - minAlt);
    return chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
  };

  // Generate SVG path for elevation curve
  const points = activeRoute.waypoints.map((w, i) => `${getX(i)},${getY(w.altitude)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M ${getX(0)},${chartHeight - paddingY} L ${points.join(' L ')} L ${getX(
    activeRoute.waypoints.length - 1
  )},${chartHeight - paddingY} Z`;

  const getZoneBadgeColor = (zone: TrailWaypoint['zone']) => {
    switch (zone) {
      case 'extreme':
        return 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30';
      case 'high':
        return 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30';
      case 'caution':
        return 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30';
      case 'safe':
      default:
        return 'bg-[#1B7A5A]/10 text-[#1B7A5A] border-[#1B7A5A]/30';
    }
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E4DD] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E4B8F] mb-1.5">
                <Mountain className="w-4 h-4" />
                <span>Expedition Telemetry &amp; Topography</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1F1D] tracking-tight">
                Interactive Elevation Profiler &amp; Trail Radar
              </h1>
              <p className="text-sm text-[#5F6B66] max-w-2xl mt-1.5 leading-relaxed">
                Inspect day-by-day altitude progression, effective oxygen saturation levels, mandatory acclimatization rest halts, and teahouse infrastructure before setting foot on the trail.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setWelfareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#1B7A5A]/30 text-[#1B7A5A] hover:bg-[#1B7A5A]/10 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Porter &amp; Guide Welfare</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E4DD] text-[#1A1F1D] hover:bg-[#F5F2EC] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-4 h-4 text-[#5F6B66]" />
                <span>Print Briefing</span>
              </button>
              <Link
                to={`/plan-custom-trek?trek=${encodeURIComponent(activeRoute.name)}`}
                className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Customize This Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Route Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TRAIL_PROFILES.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    setActiveDay(1);
                    setHoveredWaypoint(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#1E4B8F] text-white border-[#1E4B8F] shadow-xs'
                      : 'bg-white text-[#5F6B66] border-[#E8E4DD] hover:bg-[#F5F2EC]'
                  }`}
                >
                  <Mountain className="w-3.5 h-3.5" />
                  <span>{route.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#E8E4DD] text-[#5F6B66]'
                    }`}
                  >
                    {route.durationDays}d
                  </span>
                </button>
              );
            })}
          </div>

          {/* Route Key Metrics Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E4DD] shadow-xs grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center sm:text-left">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Highest Point</span>
              <span className="text-base sm:text-lg font-bold text-[#1E4B8F]">
                {activeRoute.maxAltitudeM.toLocaleString()} m
              </span>
              <span className="text-[11px] text-[#5F6B66] block truncate">
                {activeRoute.highestPointName}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Total Distance</span>
              <span className="text-base sm:text-lg font-bold text-[#1A1F1D]">
                ~{activeRoute.totalDistanceKm} km
              </span>
              <span className="text-[11px] text-[#5F6B66] block">
                {activeRoute.durationDays} Expedition Days
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Total Elevation Gain</span>
              <span className="text-base sm:text-lg font-bold text-[#1B7A5A]">
                +{activeRoute.totalAscentM.toLocaleString()} m
              </span>
              <span className="text-[11px] text-[#5F6B66] block">Cumulative Ascent</span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Grade &amp; Pacing</span>
              <span className="text-base sm:text-lg font-bold text-[#D97706]">
                {activeRoute.difficulty}
              </span>
              <span className="text-[11px] text-[#5F6B66] block">Mandatory Guide</span>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Acclimatization Halts</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeRoute.mandatoryRestDays.map((halt, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-[#EFF3FA] text-[#1E4B8F] px-2 py-0.5 rounded-md border border-[#1E4B8F]/20"
                  >
                    ✓ {halt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Elevation SVG Profile */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1A1F1D] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1E4B8F]" />
                  <span>Altitude Profile Curve (Lukla / Trailhead to Summit &amp; Descent)</span>
                </h3>
                <p className="text-xs text-[#5F6B66]">
                  Click or hover any waypoint dot along the elevation profile to view teahouses, walking distance, and oxygen density.
                </p>
              </div>

              {/* Altitude Zone Legend */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1 text-[#1B7A5A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B7A5A]"></span> &lt;2,500m (Foothills)
                </span>
                <span className="flex items-center gap-1 text-[#D97706]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> 2,500-4,000m (High Alt)
                </span>
                <span className="flex items-center gap-1 text-[#DC2626]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span> &gt;5,000m (Hypoxia Zone)
                </span>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="relative overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-64 select-none"
              >
                <defs>
                  <linearGradient id="elevationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E4B8F" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#D97706" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#1B7A5A" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal Altitude Guide Lines */}
                {[5000, 4000, 3000, 2000].map((alt) => {
                  const y = getY(alt);
                  return (
                    <g key={alt}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#E8E4DD"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#9DA8A3"
                        fontWeight="600"
                      >
                        {alt}m
                      </text>
                    </g>
                  );
                })}

                {/* Safe Acclimatization Threshold Line at 3,500m */}
                <line
                  x1={paddingX}
                  y1={getY(3500)}
                  x2={chartWidth - paddingX}
                  y2={getY(3500)}
                  stroke="#D97706"
                  strokeWidth="1.2"
                  strokeDasharray="6 3"
                />
                <text
                  x={chartWidth - paddingX}
                  y={getY(3500) - 5}
                  textAnchor="end"
                  fontSize="9"
                  fill="#D97706"
                  fontWeight="bold"
                >
                  3,500m High Altitude Threshold
                </text>

                {/* Area Under Curve */}
                <path d={areaPath} fill="url(#elevationGrad)" />

                {/* Elevation Stroke Curve */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#1E4B8F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Waypoint Dots */}
                {activeRoute.waypoints.map((w, idx) => {
                  const cx = getX(idx);
                  const cy = getY(w.altitude);
                  const isCurrent = currentWaypoint.day === w.day;

                  let dotColor = '#1B7A5A';
                  if (w.altitude >= 5000) dotColor = '#DC2626';
                  else if (w.altitude >= 3500) dotColor = '#D97706';
                  else if (w.altitude >= 2500) dotColor = '#B45309';

                  return (
                    <g
                      key={w.day}
                      className="cursor-pointer transition-transform duration-150"
                      onClick={() => setActiveDay(w.day)}
                      onMouseEnter={() => setHoveredWaypoint(w)}
                      onMouseLeave={() => setHoveredWaypoint(null)}
                    >
                      {/* Pulsing ring on selected dot */}
                      {isCurrent && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="12"
                          fill={dotColor}
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isCurrent ? '7' : '5'}
                        fill={dotColor}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      {/* Day Label on X Axis */}
                      <text
                        x={cx}
                        y={chartHeight - 12}
                        textAnchor="middle"
                        fontSize="10"
                        fill={isCurrent ? '#1E4B8F' : '#5F6B66'}
                        fontWeight={isCurrent ? 'bold' : 'normal'}
                      >
                        D{w.day}
                      </text>
                      {/* Altitude Label Above Peak Points */}
                      {(w.altitude >= 5000 || w.day === 1 || isCurrent) && (
                        <text
                          x={cx}
                          y={cy - 12}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#1A1F1D"
                          fontWeight="bold"
                        >
                          {w.altitude}m
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Day Selector Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none">
              {activeRoute.waypoints.map((w) => {
                const isActive = w.day === currentWaypoint.day;
                return (
                  <button
                    key={w.day}
                    onClick={() => {
                      setActiveDay(w.day);
                      setHoveredWaypoint(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 border ${
                      isActive
                        ? 'bg-[#1E4B8F] text-white border-[#1E4B8F]'
                        : 'bg-[#FBF8F3] text-[#5F6B66] border-[#E8E4DD] hover:bg-[#E8E4DD]'
                    }`}
                  >
                    <span>Day {w.day}</span>
                    <span className="text-[10px] opacity-80">{w.altitude}m</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Waypoint Detail Inspector */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E4DD] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E8E4DD] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1E4B8F] text-white">
                    Day {currentWaypoint.day} Milestone
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getZoneBadgeColor(
                      currentWaypoint.zone
                    )}`}
                  >
                    {currentWaypoint.zone.toUpperCase()} ALTITUDE
                  </span>
                  {currentWaypoint.evacuationHelipad && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1B7A5A] bg-[#1B7A5A]/10 px-2 py-0.5 rounded-md border border-[#1B7A5A]/20">
                      <Plane className="w-3 h-3" />
                      <span>Helipad Active</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1F1D]">
                  {currentWaypoint.name}
                </h2>
                <p className="text-xs text-[#5F6B66]">{currentWaypoint.terrain}</p>
              </div>

              <div className="flex items-center gap-4 bg-[#FBF8F3] p-3.5 rounded-xl border border-[#E8E4DD] shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">Altitude</span>
                  <span className="text-xl font-bold text-[#1E4B8F]">
                    {currentWaypoint.altitude.toLocaleString()} m
                  </span>
                </div>
                <div className="w-px h-8 bg-[#E8E4DD]" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">Oxygen Saturation</span>
                  <span className="text-xl font-bold text-[#D97706]">
                    {currentWaypoint.oxygenLevelPercent}%
                  </span>
                  <span className="text-[9px] text-[#5F6B66] block">of sea level</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">Walking Time</span>
                <span className="text-sm font-bold text-[#1A1F1D] mt-0.5 block">
                  {currentWaypoint.walkingHours}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">Distance</span>
                <span className="text-sm font-bold text-[#1A1F1D] mt-0.5 block">
                  {currentWaypoint.distanceKm} km
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">Day Elevation</span>
                <span className="text-sm font-bold text-[#1B7A5A] mt-0.5 block">
                  +{currentWaypoint.elevationGainM}m / -{currentWaypoint.elevationLossM}m
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">Hydration Scheme</span>
                <span className="text-sm font-bold text-[#1E4B8F] mt-0.5 block truncate">
                  {currentWaypoint.waterStation}
                </span>
              </div>
            </div>

            {/* Highlight & Medical Acclimatization Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FEF4E7] border border-[#D97706]/25 space-y-1.5">
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Trail Scenic Highlight</span>
                </span>
                <p className="text-xs text-[#1A1F1D] leading-relaxed">
                  {currentWaypoint.highlight}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/25 space-y-1.5">
                <span className="text-xs font-bold text-[#1E4B8F] uppercase tracking-wide flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  <span>Medical &amp; Acclimatization Protocol</span>
                </span>
                <p className="text-xs text-[#1A1F1D] leading-relaxed">
                  {currentWaypoint.acclimatizationTip ||
                    'Maintain rhythmic nasal breathing, consume at least 3.5 liters of fluid, and check resting pulse.'}
                </p>
              </div>
            </div>

            {/* Teahouse Amenities Available */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#5F6B66] uppercase tracking-wider block mb-2.5">
                Teahouse Infrastructure at this Waypoint
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    currentWaypoint.teahouseAmenities.hotShower
                      ? 'bg-white border-[#1B7A5A]/30 text-[#1B7A5A]'
                      : 'bg-[#F5F2EC] border-[#E8E4DD] text-[#9DA8A3]'
                  }`}
                >
                  <ShowerHead className="w-4 h-4" />
                  <span>Hot Gas Shower {currentWaypoint.teahouseAmenities.hotShower ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    currentWaypoint.teahouseAmenities.wifi
                      ? 'bg-white border-[#1B7A5A]/30 text-[#1B7A5A]'
                      : 'bg-[#F5F2EC] border-[#E8E4DD] text-[#9DA8A3]'
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  <span>EverestLink / Wi-Fi {currentWaypoint.teahouseAmenities.wifi ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    currentWaypoint.teahouseAmenities.solarCharging
                      ? 'bg-white border-[#1B7A5A]/30 text-[#1B7A5A]'
                      : 'bg-[#F5F2EC] border-[#E8E4DD] text-[#9DA8A3]'
                  }`}
                >
                  <BatteryCharging className="w-4 h-4" />
                  <span>Solar Device Power {currentWaypoint.teahouseAmenities.solarCharging ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    currentWaypoint.teahouseAmenities.bakery
                      ? 'bg-white border-[#1B7A5A]/30 text-[#1B7A5A]'
                      : 'bg-[#F5F2EC] border-[#E8E4DD] text-[#9DA8A3]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Fresh Bakery {currentWaypoint.teahouseAmenities.bakery ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    currentWaypoint.teahouseAmenities.medicalClinic
                      ? 'bg-white border-[#1E4B8F]/30 text-[#1E4B8F]'
                      : 'bg-[#F5F2EC] border-[#E8E4DD] text-[#9DA8A3]'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>HRA Clinic {currentWaypoint.teahouseAmenities.medicalClinic ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PorterWelfareModal
        isOpen={welfareModalOpen}
        onClose={() => setWelfareModalOpen(false)}
      />
    </CustomerLayout>
  );
};
