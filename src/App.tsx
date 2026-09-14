import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Database,
  CheckCircle2,
  AlertCircle,
  Key,
  RefreshCw,
  Compass,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Lock,
  Layers,
  Sparkles,
  DollarSign,
  ChevronRight,
  FileCode2,
  Server,
  Copy,
  Check,
  ExternalLink,
  Code,
  Search,
  Filter,
  Mountain,
  HeartPulse,
  Building,
  CheckCircle,
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  getRuntimeCommissionRate,
  supabaseUrl,
  setCustomSupabaseCredentials,
  resetSupabaseCredentials,
} from './lib/supabaseClient';
import { COMPLETE_SUPABASE_SETUP_SQL } from './data/setupSql';
import { COMPREHENSIVE_TREKS, type TrekListing } from './data/treksData';
import { TrekDetailModal } from './components/TrekDetailModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { TrekPrepGuideModal } from './components/TrekPrepGuideModal';
import { AgencyRegisterModal } from './components/AgencyRegisterModal';

const TABLES_OVERVIEW = [
  { name: 'agency_applications', rows: 'Verified agencies, licensing credentials, documents' },
  { name: 'listings', rows: 'Treks and tours, duration_days (generated), categories' },
  { name: 'availability', rows: 'Date departures, spots_total, spots_remaining, blocked' },
  { name: 'bookings', rows: 'NUMERIC money amounts, commission split, statuses' },
  { name: 'reviews', rows: 'Traveler reviews uniquely tied 1:1 to bookings' },
  { name: 'payouts', rows: 'Agency earnings, disbursement ledger, Stripe Connect' },
  { name: 'agency_bank_details', rows: 'Bank routing, account_number_secret_id (Vault)' },
  { name: 'conversations', rows: 'Traveler-agency chat channels' },
  { name: 'messages', rows: 'Real-time messages with read status' },
  { name: 'wishlists', rows: 'Traveler saved trips' },
  { name: 'notification_preferences', rows: 'User alert and communication preferences' },
  { name: 'contact_submissions', rows: 'Platform customer inquiries' },
  { name: 'audit_log', rows: 'Immutable trigger-written financial audit trail' },
  { name: 'platform_settings', rows: 'Runtime commission rate (15%), kill-switches' },
  { name: 'webhook_events', rows: 'Stripe webhook idempotency ledger' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'supabase_status' | 'schema'>('marketplace');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'unconfigured' | 'error'>('checking');
  const [statusMessage, setStatusMessage] = useState<string>('Checking Supabase connection...');
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [isTestingRpc, setIsTestingRpc] = useState<boolean>(false);
  const [rpcResult, setRpcResult] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlPreview, setShowSqlPreview] = useState<boolean>(false);
  const [editingCreds, setEditingCreds] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>(supabaseUrl);
  const [customKeyInput, setCustomKeyInput] = useState<string>('');

  // Modals & High-Value Feature States
  const [selectedTrekModal, setSelectedTrekModal] = useState<TrekListing | null>(null);
  const [showPrepGuide, setShowPrepGuide] = useState<boolean>(false);
  const [showAgencyRegister, setShowAgencyRegister] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    trek: TrekListing;
    travelerName: string;
    travelerEmail: string;
    travelerPhone: string;
    selectedDate: string;
    guests: number;
    totalEstimatedAmount: number;
  } | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filteredTreks = useMemo(() => {
    return COMPREHENSIVE_TREKS.filter((trek) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        trek.title.toLowerCase().includes(q) ||
        trek.location.toLowerCase().includes(q) ||
        trek.agencyName.toLowerCase().includes(q) ||
        trek.badges.some((b) => b.toLowerCase().includes(q));

      const matchesRegion = selectedRegion === 'All' || trek.region === selectedRegion;
      const matchesCategory = selectedCategory === 'All' || trek.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || trek.difficulty === selectedDifficulty;

      return matchesSearch && matchesRegion && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedRegion, selectedCategory, selectedDifficulty]);

  const isMissingTables = statusMessage.includes('platform_settings') || statusMessage.includes('schema cache');

  const handleCopySql = () => {
    navigator.clipboard.writeText(COMPLETE_SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3500);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim() || !customKeyInput.trim()) return;
    setCustomSupabaseCredentials(customUrlInput.trim(), customKeyInput.trim());
  };

  // Test Supabase connection
  const checkConnection = async () => {
    setConnectionStatus('checking');
    setStatusMessage('Checking Supabase credentials and querying database...');

    if (!isSupabaseConfigured) {
      setConnectionStatus('unconfigured');
      setStatusMessage('Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not configured yet.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('key, value')
        .limit(5);

      if (error) {
        setConnectionStatus('error');
        setStatusMessage(`PostgREST error: ${error.message} (Code: ${error.code || 'None'}${error.details ? ` - ${error.details}` : ''}${error.hint ? ` | Hint: ${error.hint}` : ''})`);
      } else {
        setConnectionStatus('connected');
        setStatusMessage(`Successfully connected! Queried ${data?.length || 0} platform settings rows from Supabase.`);
        const rate = await getRuntimeCommissionRate();
        setCommissionRate(rate);
      }
    } catch (err: unknown) {
      setConnectionStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Connection attempt failed: ${msg}`);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Test RPC concurrency
  const handleTestRpc = async () => {
    setIsTestingRpc(true);
    setRpcResult(null);
    try {
      if (!isSupabaseConfigured) {
        setRpcResult('Simulation: claim_availability_spots(fake_id, 2) succeeded. To test with real database, configure Supabase credentials.');
      } else {
        const { error } = await (supabase as any).rpc('claim_availability_spots', {
          p_availability_id: '00000000-0000-0000-0000-000000000000',
          p_guests: 1,
        });
        if (error && error.message.includes('not found')) {
          setRpcResult(`RPC Verified! Function exists on PostgreSQL. (Failed on dummy ID as expected: ${error.message})`);
        } else if (error) {
          setRpcResult(`RPC response: ${error.message}`);
        } else {
          setRpcResult('RPC executed cleanly on Supabase!');
        }
      }
    } catch (e: unknown) {
      setRpcResult(`Error calling RPC: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsTestingRpc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17222E] flex flex-col font-sans">
      {/* Top Banner: Supabase Backend Status */}
      <aside
        aria-label="Supabase status notification"
        className={`border-b text-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 ${
          connectionStatus === 'connected'
            ? 'bg-[#1B7A5A]/10 border-[#1B7A5A]/30 text-[#1B7A5A]'
            : isMissingTables
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : connectionStatus === 'unconfigured'
            ? 'bg-[#FBF8F3] border-[#ECEFF3] text-[#5A6B7C]'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {connectionStatus === 'connected' ? (
            <CheckCircle2 className="w-4 h-4 text-[#1B7A5A] shrink-0" />
          ) : isMissingTables ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#E8890C] shrink-0" />
          )}
          <span className="font-semibold">
            {connectionStatus === 'connected'
              ? 'Supabase Backend Connected'
              : isMissingTables
              ? 'Supabase API Connected (Tables Need Initializing)'
              : 'Supabase Backend Setup Required'}
          </span>
          <span className="hidden sm:inline text-[#5A6B7C]">|</span>
          <span className="truncate max-w-xl text-xs">
            {isMissingTables
              ? "Your Supabase credentials are valid! Paste the database setup SQL into Supabase SQL Editor to complete setup."
              : statusMessage}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isMissingTables && (
            <button
              onClick={handleCopySql}
              className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy Setup SQL'}</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('supabase_status')}
            className="font-medium underline hover:text-[#17222E] flex items-center gap-1 cursor-pointer text-xs"
          >
            <Key className="w-3 h-3" />
            <span>Connection Settings</span>
          </button>
          <button
            onClick={checkConnection}
            className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
            title="Recheck Connection"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Header */}
      <header className="border-b border-[#ECEFF3] bg-[#FFFFFF] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1E4B8F] rounded flex items-center justify-center text-white font-serif font-bold text-xl shadow-xs">
              IN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#17222E]">
                  Into Nepal
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#1B7A5A]/10 text-[#1B7A5A] border border-[#1B7A5A]/20">
                  Verified Only
                </span>
              </div>
              <p className="text-[11px] text-[#5A6B7C] hidden sm:block">
                Two-sided marketplace for licensed Nepali operators
              </p>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'marketplace'
                  ? 'bg-[#1E4B8F] text-white'
                  : 'text-[#5A6B7C] hover:text-[#17222E] hover:bg-[#FBF8F3]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Traveler Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'schema'
                  ? 'bg-[#1E4B8F] text-white'
                  : 'text-[#5A6B7C] hover:text-[#17222E] hover:bg-[#FBF8F3]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>15 Postgres Tables</span>
            </button>
            <button
              onClick={() => setActiveTab('supabase_status')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'supabase_status'
                  ? 'bg-[#1E4B8F] text-white'
                  : 'text-[#5A6B7C] hover:text-[#17222E] hover:bg-[#FBF8F3]'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Backend Connection</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <div>
            {/* Trust & Guarantee Subheader */}
            <section className="bg-[#FBF8F3] border-b border-[#ECEFF3] py-6 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[#1B7A5A]/10 text-[#1B7A5A] border border-[#1B7A5A]/20">
                      Zero Upfront Payment • Pay in Kathmandu
                    </span>
                    <span className="text-xs text-[#5A6B7C] hidden sm:inline">• Direct to Licensed Operators</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17222E] tracking-tight">
                    Himalayan Expeditions & Treks in Nepal
                  </h1>
                  <p className="text-[#5A6B7C] text-xs sm:text-sm mt-1 max-w-2xl">
                    Discover verified high-altitude treks, cultural heritage journeys, and wildlife safaris. Explore detailed day-by-day itineraries, elevation profiles, and reserve dates directly with licensed Nepali Sherpa agencies.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowPrepGuide(true)}
                    className="bg-white border border-[#CBD5E1] hover:border-[#1E4B8F] text-[#17222E] px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-red-600" />
                    <span>Altitude & Safety Guide</span>
                  </button>
                  <button
                    onClick={() => setShowAgencyRegister(true)}
                    className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Building className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Join as Local Agency</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Search and Filters Strip */}
            <div className="bg-white border-b border-[#ECEFF3] px-4 sm:px-6 py-4 sticky top-16 z-20 shadow-xs">
              <div className="max-w-7xl mx-auto space-y-3">
                {/* Search input + Dropdowns */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#5A6B7C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search treks by peak, valley, or agency (e.g. Everest, Thorong, Mardi, Pokhara)..."
                      className="w-full pl-9 pr-4 py-2 border border-[#CBD5E1] rounded text-xs focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-white border border-[#CBD5E1] rounded px-3 py-2 text-xs font-medium text-[#17222E] focus:ring-1 focus:ring-[#1E4B8F] outline-none cursor-pointer w-full sm:w-auto"
                    >
                      <option value="All">All Activities</option>
                      <option value="Trekking">Trekking</option>
                      <option value="Adventure">High Passes / Adventure</option>
                      <option value="Cultural">Cultural & Heritage</option>
                      <option value="Wildlife">Jungle & Wildlife</option>
                    </select>

                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="bg-white border border-[#CBD5E1] rounded px-3 py-2 text-xs font-medium text-[#17222E] focus:ring-1 focus:ring-[#1E4B8F] outline-none cursor-pointer w-full sm:w-auto"
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                    </select>
                  </div>
                </div>

                {/* Region Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[#5A6B7C] font-semibold flex items-center gap-1 mr-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#1E4B8F]" />
                    Region:
                  </span>
                  {['All', 'Everest', 'Annapurna', 'Langtang', 'Mustang', 'Terai / Wildlife'].map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        selectedRegion === region
                          ? 'bg-[#1E4B8F] text-white'
                          : 'bg-[#FBF8F3] text-[#5A6B7C] hover:bg-gray-100 border border-[#ECEFF3]'
                      }`}
                    >
                      {region === 'All' ? 'All Nepal' : region}
                    </button>
                  ))}
                  {(searchQuery || selectedRegion !== 'All' || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedRegion('All');
                        setSelectedCategory('All');
                        setSelectedDifficulty('All');
                      }}
                      className="text-xs text-[#E8890C] hover:underline font-semibold ml-2 cursor-pointer shrink-0"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Information-DENSE Listings (Booking.com style) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#17222E]">
                    Available Expeditions ({filteredTreks.length})
                  </h2>
                  <p className="text-xs text-[#5A6B7C] mt-0.5">
                    Click any trip to explore full day-by-day itineraries, elevation maps, and reserve spots with zero payment upfront.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#5A6B7C]">
                  <span className="flex items-center gap-1 text-[#1B7A5A] font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Govt Licensed Operators Only</span>
                  </span>
                </div>
              </div>

              {/* Information-Dense Cards Grid */}
              {filteredTreks.length === 0 ? (
                <div className="border border-[#ECEFF3] rounded-lg p-12 text-center bg-white space-y-3">
                  <Mountain className="w-10 h-10 text-gray-400 mx-auto" />
                  <h3 className="font-bold font-serif text-lg text-[#17222E]">No treks match your search filters</h3>
                  <p className="text-xs text-[#5A6B7C] max-w-md mx-auto">
                    Try clearing your search terms or picking another region such as Everest or Annapurna.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('All');
                      setSelectedCategory('All');
                      setSelectedDifficulty('All');
                    }}
                    className="bg-[#1E4B8F] text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                  >
                    Show All Departures
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTreks.map((listing) => (
                    <article
                      key={listing.id}
                      className="border border-[#ECEFF3] rounded-lg bg-white hover:border-[#1E4B8F]/50 transition-all p-4 flex flex-col md:flex-row gap-5 shadow-2xs hover:shadow-sm"
                    >
                      {/* Image Column */}
                      <div
                        onClick={() => setSelectedTrekModal(listing)}
                        className="w-full md:w-64 h-52 md:h-auto shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-pointer group"
                      >
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {/* Category tag */}
                        <span
                          className="absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-xs"
                          style={{ backgroundColor: listing.categoryColor }}
                        >
                          {listing.category}
                        </span>
                        <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                          {listing.region}
                        </div>
                      </div>

                      {/* Middle Column: Details & Itinerary */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs text-[#5A6B7C] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#1E4B8F]" />
                              {listing.location}
                            </span>
                            <span className="text-[#ECEFF3]">•</span>
                            <span className="text-xs font-medium text-[#1E4B8F] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#1B7A5A]" />
                              {listing.agencyName}
                            </span>
                            <span className="text-[10px] bg-gray-100 text-[#5A6B7C] px-1.5 py-0.5 rounded font-mono">
                              {listing.agencyLicense}
                            </span>
                          </div>

                          <h3
                            onClick={() => setSelectedTrekModal(listing)}
                            className="font-serif text-lg font-bold text-[#17222E] leading-snug hover:text-[#1E4B8F] cursor-pointer transition-colors"
                          >
                            {listing.title}
                          </h3>

                          <p className="text-xs text-[#5A6B7C] line-clamp-2 mt-1.5 leading-relaxed">
                            {listing.description}
                          </p>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {listing.badges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-medium bg-[#FBF8F3] text-[#5A6B7C] border border-[#ECEFF3] px-2 py-0.5 rounded"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Specs bar */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#5A6B7C] mt-3 pt-3 border-t border-[#ECEFF3]">
                          <span className="flex items-center gap-1 font-medium text-[#17222E]">
                            <Calendar className="w-3.5 h-3.5 text-[#1E4B8F]" />
                            {listing.duration}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-[#17222E]">
                            <Mountain className="w-3.5 h-3.5 text-[#C8362E]" />
                            {listing.maxAltitude}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-[#17222E]">
                            <Compass className="w-3.5 h-3.5 text-[#E8890C]" />
                            {listing.difficulty}
                          </span>
                          <span>•</span>
                          <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                            {listing.spotsLeft} spots on {listing.nextDate}
                          </span>
                        </div>
                      </div>

                      {/* Right Column: Reviews & Price (Booking.com style) */}
                      <div className="w-full md:w-56 shrink-0 md:border-l md:border-[#ECEFF3] md:pl-5 flex flex-col justify-between pt-3 md:pt-0 border-t md:border-t-0 border-[#ECEFF3]">
                        <div className="flex items-start justify-between md:justify-end gap-2">
                          <div className="text-left md:text-right">
                            <span className="text-xs font-bold text-[#17222E] block">Exceptional</span>
                            <span className="text-[11px] text-[#5A6B7C] block">
                              {listing.reviewCount} verified reviews
                            </span>
                          </div>
                          <div className="bg-[#1E4B8F] text-white font-bold text-xs px-2 py-1 rounded flex items-center gap-0.5 shadow-2xs">
                            <Star className="w-3 h-3 fill-current text-yellow-300" />
                            <span>{listing.rating}</span>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 text-left md:text-right">
                          <span className="text-[11px] text-[#5A6B7C] block">All-Inclusive from</span>
                          <div className="font-serif font-bold text-2xl text-[#E8890C] leading-none my-1">
                            ${listing.price.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-[#1B7A5A] font-semibold bg-emerald-50 px-2 py-0.5 rounded inline-block">
                            No upfront payment needed
                          </span>

                          <div className="space-y-1.5 mt-3">
                            <button
                              onClick={() => setSelectedTrekModal(listing)}
                              className="w-full bg-[#E8890C] hover:bg-[#d07a0a] text-white font-semibold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <span>View Itinerary & Reserve</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'supabase_status' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="border border-[#ECEFF3] rounded p-6 bg-white mb-6">
              <div className="flex items-center justify-between border-b border-[#ECEFF3] pb-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#17222E] flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#1E4B8F]" />
                    Supabase Integration Status
                  </h2>
                  <p className="text-xs text-[#5A6B7C] mt-1">
                    Connect your project to your live PostgreSQL Supabase database
                  </p>
                </div>

                <button
                  onClick={checkConnection}
                  className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Connection</span>
                </button>
              </div>

              {/* Active Project Endpoint Card */}
              <div className="bg-[#FBF8F3] border border-[#ECEFF3] rounded p-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#5A6B7C] block font-medium">Target Supabase Project Endpoint:</span>
                  <span className="font-mono text-[#17222E] font-semibold text-xs break-all">{supabaseUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCreds(!editingCreds)}
                    className="text-[#1E4B8F] hover:underline font-medium cursor-pointer"
                  >
                    {editingCreds ? 'Cancel' : 'Change Project Credentials'}
                  </button>
                </div>
              </div>

              {editingCreds && (
                <form onSubmit={handleSaveCredentials} className="bg-white border border-[#CBD5E1] rounded-lg p-4 mb-5 text-xs shadow-sm">
                  <h4 className="font-bold text-[#17222E] mb-2 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#1E4B8F]" />
                    <span>Set Custom Supabase Project</span>
                  </h4>
                  <div className="space-y-3 mb-3">
                    <div>
                      <label className="block text-[#5A6B7C] font-medium mb-1">Project URL (e.g. https://xxxx.supabase.co)</label>
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://cnrajashdiemnezxuxbl.supabase.co"
                        className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 font-mono text-xs focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A6B7C] font-medium mb-1">Anon / Public API Key</label>
                      <input
                        type="password"
                        value={customKeyInput}
                        onChange={(e) => setCustomKeyInput(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 font-mono text-xs focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-3 py-1.5 rounded font-semibold cursor-pointer"
                    >
                      Save & Reconnect
                    </button>
                    <button
                      type="button"
                      onClick={resetSupabaseCredentials}
                      className="border border-[#CBD5E1] hover:bg-gray-50 text-[#5A6B7C] px-3 py-1.5 rounded cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  </div>
                </form>
              )}

              {/* Payment / Stripe Deferral Banner */}
              <div className="border border-emerald-200 bg-emerald-50/70 rounded-lg p-4 mb-5 flex items-start gap-3 text-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">
                    Stripe / Online Checkout Bypassed (Trip Functionality Prioritized)
                  </h4>
                  <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                    As requested, payment gateways and Stripe Connect have been set aside. Travelers can explore full day-by-day itineraries, packing guides, and reserve departures with zero payment upfront. All bookings are confirmed directly with licensed Nepali operators with arrival payment in Kathmandu.
                  </p>
                </div>
              </div>

              {/* Status Box */}
              <div
                className={`p-4 rounded border mb-6 ${
                  connectionStatus === 'connected'
                    ? 'bg-[#1B7A5A]/5 border-[#1B7A5A]/30 text-[#1B7A5A]'
                    : isMissingTables
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : connectionStatus === 'unconfigured'
                    ? 'bg-[#FBF8F3] border-[#ECEFF3] text-[#5A6B7C]'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {connectionStatus === 'connected' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#1B7A5A] shrink-0 mt-0.5" />
                    ) : isMissingTables ? (
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-[#E8890C] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="text-sm font-bold capitalize">
                        {isMissingTables
                          ? 'Supabase API Connected (Tables Need Initializing)'
                          : `Status: ${connectionStatus}`}
                      </h3>
                      <p className="text-xs mt-1 leading-relaxed">
                        {isMissingTables
                          ? "We reached your Supabase project successfully, but the database tables have not been created yet or schema cache needs to reload. Follow the quick steps below to set them up in Supabase SQL Editor."
                          : statusMessage}
                      </p>
                      {connectionStatus === 'error' && (
                        <div className="mt-2 text-[11px] font-mono bg-white/80 p-2 rounded border border-amber-200 text-amber-900 break-all">
                          {statusMessage}
                        </div>
                      )}
                    </div>
                  </div>
                  {isMissingTables && (
                    <button
                      onClick={handleCopySql}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-3 py-1.5 rounded text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Setup SQL'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1-Click Database Setup Box */}
              <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-5 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/70 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                      <Code className="w-4 h-4 text-amber-700" />
                      All-in-One Database Setup Script (15 Tables, RPCs & RLS)
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Includes agency verification, trip listings, concurrency locks, audit logs, and default platform settings.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySql}
                      className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy All-In-One SQL'}</span>
                    </button>
                    <button
                      onClick={() => setShowSqlPreview(!showSqlPreview)}
                      className="border border-[#CBD5E1] bg-white hover:bg-gray-50 text-[#17222E] px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
                    >
                      {showSqlPreview ? 'Hide SQL' : 'View SQL'}
                    </button>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#1E4B8F] hover:underline flex items-center gap-1 font-medium px-2"
                    >
                      <span>Supabase Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">Step 1: Copy Script</span>
                    <p className="text-[#5A6B7C]">
                      Click <strong>Copy All-In-One SQL</strong> above to copy the entire migration script.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">Step 2: Paste in Supabase</span>
                    <p className="text-[#5A6B7C]">
                      In Supabase Dashboard, click <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, paste and hit <strong>Run</strong>.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">Step 3: Test Connection</span>
                    <p className="text-[#5A6B7C]">
                      Click <strong>Test Connection</strong> above to verify table creation and reload cache.
                    </p>
                  </div>
                </div>

                {showSqlPreview && (
                  <div className="mt-4 pt-3 border-t border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-[#5A6B7C]">SQL Preview (/supabase/setup_into_nepal.sql):</span>
                      <button
                        onClick={handleCopySql}
                        className="text-xs text-[#1E4B8F] hover:underline flex items-center gap-1 font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy snippet</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-[#17222E] text-emerald-400 rounded text-[11px] font-mono max-h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-emerald-900">
                      {COMPLETE_SUPABASE_SETUP_SQL}
                    </pre>
                  </div>
                )}
              </div>

              {/* Step by step connection instructions */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#17222E]">How to connect your Supabase project:</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-[#ECEFF3] rounded p-4 bg-[#FBF8F3]">
                    <span className="text-xs font-bold text-[#1E4B8F] block mb-1">Step 1</span>
                    <h4 className="font-semibold text-xs text-[#17222E] mb-2">Get API Credentials</h4>
                    <p className="text-xs text-[#5A6B7C]">
                      Open your project at <strong>supabase.com</strong> &gt; <strong>Project Settings</strong> &gt; <strong>API</strong>.
                      Copy <strong>Project URL</strong> and <strong>anon public key</strong>.
                    </p>
                  </div>

                  <div className="border border-[#ECEFF3] rounded p-4 bg-[#FBF8F3]">
                    <span className="text-xs font-bold text-[#1E4B8F] block mb-1">Step 2</span>
                    <h4 className="font-semibold text-xs text-[#17222E] mb-2">Set Environment Variables</h4>
                    <p className="text-xs text-[#5A6B7C]">
                      In your local <code className="font-mono text-[11px]">.env</code> or AI Studio Secrets, declare:
                      <br />
                      <code className="text-[10px] font-mono text-[#1E4B8F] block mt-1">
                        VITE_SUPABASE_URL=...
                        <br />
                        VITE_SUPABASE_ANON_KEY=...
                      </code>
                    </p>
                  </div>

                  <div className="border border-[#ECEFF3] rounded p-4 bg-[#FBF8F3]">
                    <span className="text-xs font-bold text-[#1E4B8F] block mb-1">Step 3</span>
                    <h4 className="font-semibold text-xs text-[#17222E] mb-2">Push Migrations</h4>
                    <p className="text-xs text-[#5A6B7C]">
                      Run <code className="font-mono text-[11px]">supabase db push</code> or execute files in <code className="font-mono text-[11px]">/supabase/migrations/</code> in SQL Editor.
                    </p>
                  </div>
                </div>

                {/* RPC Concurrency Test Tool */}
                <div className="mt-6 pt-6 border-t border-[#ECEFF3]">
                  <h3 className="font-bold text-sm text-[#17222E] mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#1E4B8F]" />
                    Test Availability Concurrency RPC
                  </h3>
                  <p className="text-xs text-[#5A6B7C] mb-4">
                    Verify that <code className="font-mono text-[11px]">claim_availability_spots(p_availability_id, p_guests)</code> is deployed and accessible via Supabase RPC.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTestRpc}
                      disabled={isTestingRpc}
                      className="bg-[#1E4B8F] hover:bg-[#183d73] text-white text-xs font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isTestingRpc ? 'Executing RPC...' : 'Test claim_availability_spots()'}
                    </button>
                  </div>

                  {rpcResult && (
                    <div className="mt-3 p-3 bg-gray-50 border border-[#ECEFF3] rounded text-xs font-mono text-[#17222E]">
                      {rpcResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="border border-[#ECEFF3] rounded bg-white p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#17222E] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#1E4B8F]" />
                    All 15 Database Tables
                  </h2>
                  <p className="text-xs text-[#5A6B7C] mt-1">
                    Row Level Security (RLS) active on every table, keyed to auth.uid()
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#1B7A5A]/10 text-[#1B7A5A] border border-[#1B7A5A]/20">
                  Strict NUMERIC Financials
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {TABLES_OVERVIEW.map((table, idx) => (
                  <div
                    key={table.name}
                    className="p-3 border border-[#ECEFF3] rounded bg-[#FBF8F3] flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded bg-[#1E4B8F]/10 text-[#1E4B8F] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <code className="font-mono text-xs font-bold text-[#17222E] block">
                        {table.name}
                      </code>
                      <p className="text-[11px] text-[#5A6B7C] mt-0.5">{table.rows}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ECEFF3] bg-[#FBF8F3] py-6 px-4 sm:px-6 text-xs text-[#5A6B7C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#17222E]">Into Nepal</span>
            <span>•</span>
            <span>15% Commission Marketplace for Licensed Nepali Travel Agencies</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#1B7A5A]">
              <ShieldCheck className="w-3.5 h-3.5" />
              RLS Enabled
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#1E4B8F]">
              <Lock className="w-3.5 h-3.5" />
              Vault Bank Secrets
            </span>
          </div>
        </div>
      </footer>

      {/* Trek Detail Modal */}
      {selectedTrekModal && (
        <TrekDetailModal
          trek={selectedTrekModal}
          onClose={() => setSelectedTrekModal(null)}
          onBookingSuccess={(bookingId, details) => {
            const currentTrek = selectedTrekModal;
            setSelectedTrekModal(null);
            setConfirmedBooking({
              bookingId,
              trek: currentTrek,
              travelerName: details.travelerName,
              travelerEmail: details.travelerEmail,
              travelerPhone: details.travelerPhone,
              selectedDate: details.selectedDate,
              guests: details.guests,
              totalEstimatedAmount: details.totalAmount,
            });
          }}
        />
      )}

      {/* Booking Confirmation Voucher Modal */}
      {confirmedBooking && (
        <BookingConfirmationModal
          bookingId={confirmedBooking.bookingId}
          trek={confirmedBooking.trek}
          travelerName={confirmedBooking.travelerName}
          travelerEmail={confirmedBooking.travelerEmail}
          travelerPhone={confirmedBooking.travelerPhone}
          selectedDate={confirmedBooking.selectedDate}
          guests={confirmedBooking.guests}
          totalEstimatedAmount={confirmedBooking.totalEstimatedAmount}
          onClose={() => setConfirmedBooking(null)}
        />
      )}

      {/* Trek Preparation & Altitude Guide */}
      {showPrepGuide && (
        <TrekPrepGuideModal onClose={() => setShowPrepGuide(false)} />
      )}

      {/* Agency Registration Modal */}
      {showAgencyRegister && (
        <AgencyRegisterModal onClose={() => setShowAgencyRegister(false)} />
      )}
    </div>
  );
}
