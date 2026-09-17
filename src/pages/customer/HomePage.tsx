import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Calendar as CalendarIcon,
  Users,
  Compass,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Star,
  Mountain,
  Waves,
  Trees,
  Landmark,
  Compass as CompassIcon,
  HelpCircle,
  ChevronDown,
  Globe2,
  CheckCircle2,
  Leaf,
  Sun,
  Snowflake,
  CloudRain,
} from 'lucide-react';
import { RoleLandingGuard } from '@/components/auth/RoleLandingGuard';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { ReviewScoreChip } from '@/components/ui/ReviewScoreChip';
import { LoadingSkeleton } from '@/components/ui/States';
import { supabase } from '@/lib/supabaseClient';
import { getOptimizedImageUrl } from '@/lib/images';
import { PORTAL_URLS, isAll } from '@/lib/portal';
import type { Listing, Agency } from '@/lib/types';
import { ALL_OTA_LISTINGS, VERIFIED_AGENCIES } from '@/data/otaMarketplaceData';

// Diverse Hero Slides across all Nepal activity types
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    tag: 'Trekking & Expeditions',
    title: 'Nepal Adventures, Direct from Local Operators',
    subtitle: 'From iconic Himalayan treks and jungle safaris to whitewater rapids and cultural walks—book directly with verified Nepali agencies.',
  },
  {
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56',
    tag: 'Wildlife & Safari',
    title: 'Subtropical Safaris & Rare Wildlife',
    subtitle: 'Track wild one-horned rhinoceros and royal Bengal tigers with certified indigenous Tharu naturalists in Chitwan & Bardia.',
  },
  {
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed',
    tag: 'Whitewater & Watersports',
    title: 'Himalayan River Rafting & Canyoning',
    subtitle: 'Navigate thunderous snowmelt rapids on the Trishuli and Sun Koshi with IRF-certified river expedition guides.',
  },
  {
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
    tag: 'Scenic & Heritage',
    title: 'Sacred Valleys & Ancient Monasteries',
    subtitle: 'Immerse in centuries of Buddhist and Hindu heritage across the Kathmandu Valley, Pokhara, and remote mountain gompas.',
  },
];

// 4 Minimal Activity Type Categories
const ACTIVITY_CATEGORIES = [
  {
    id: 'trekking',
    title: 'Trekking & Climbing',
    count: 'Everest, Annapurna & Manaslu',
    icon: Mountain,
    categoryQuery: 'Trekking',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
  },
  {
    id: 'safari',
    title: 'Jungle Safaris',
    count: 'Chitwan & Bardia National Parks',
    icon: Trees,
    categoryQuery: 'Safari',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  },
  {
    id: 'rafting',
    title: 'Whitewater Rafting',
    count: 'Trishuli & Sun Koshi Rivers',
    icon: Waves,
    categoryQuery: 'Rafting',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed',
  },
  {
    id: 'cultural',
    title: 'Heritage & Culture',
    count: 'Kathmandu, Pokhara & Lumbini',
    icon: Landmark,
    categoryQuery: 'Cultural',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
  },
];

// Activity filter tabs for the live catalog
const FILTER_TABS = [
  { label: 'All Activities', key: 'ALL' },
  { label: 'Trekking', key: 'TREKKING' },
  { label: 'Mountaineering', key: 'MOUNTAINEERING' },
  { label: 'Wildlife & Safari', key: 'SAFARI' },
  { label: 'Whitewater Rafting', key: 'RAFTING' },
  { label: 'Cultural & Heritage', key: 'CULTURAL' },
  { label: 'Adventure Flights', key: 'ADVENTURE' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Slideshow
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);

  // Active filter tab
  const [activeTab, setActiveTab] = useState('ALL');

  // FAQ open item
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (date.trim()) params.set('date', date.trim());
    if (guests > 1) params.set('guests', guests.toString());
    navigate(`/activities?${params.toString()}`);
  };

  // Fetch listings from Supabase or fallback to OTA marketplace items
  const { data: listingsData, isLoading: isLoadingListings } = useQuery({
    queryKey: ['home-all-activities'],
    queryFn: async (): Promise<(Listing & { agency?: Agency | null })[]> => {
      const { data, error } = await supabase
        .from('listings')
        .select(
          'id, agency_id, title, description, category, location, price, duration, duration_days, difficulty, images, rating, review_count, featured, status'
        )
        .eq('status', 'published')
        .order('rating', { ascending: false })
        .limit(12);

      if (error || !data || data.length === 0) return [];
      return data as any[];
    },
  });

  const partnerPortalUrl = isAll ? '/agency' : PORTAL_URLS.partner;

  // Normalized catalog items covering all activity categories
  const allExperiences = (listingsData && listingsData.length > 0
    ? listingsData.map((l) => ({
        id: l.id,
        title: l.title,
        category: l.category || 'Trekking',
        duration: l.duration || `${l.duration_days} Days`,
        difficulty: l.difficulty,
        rating: l.rating ?? 4.9,
        reviewCount: l.review_count ?? 28,
        price: Number(l.price),
        image: (l.images && l.images[0]) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
        location: l.location || 'Nepal',
        agencyName: l.agency?.company_name || 'Verified Nepali Operator',
      }))
    : ALL_OTA_LISTINGS.map((l) => ({
        id: l.id,
        title: l.title,
        category: l.category,
        duration: l.duration,
        difficulty: l.difficulty,
        rating: l.rating,
        reviewCount: l.reviewCount,
        price: l.price,
        image: l.image,
        location: l.location,
        agencyName: l.agencyName,
      }))
  );

  // Filter items according to user selection
  const filteredExperiences = activeTab === 'ALL'
    ? allExperiences
    : allExperiences.filter((item) => {
        const cat = item.category.toUpperCase();
        if (activeTab === 'TREKKING') return cat.includes('TREK') || cat.includes('HIKE');
        if (activeTab === 'MOUNTAINEERING') return cat.includes('MOUNTAIN') || cat.includes('CLIMB') || cat.includes('PEAK');
        if (activeTab === 'SAFARI') return cat.includes('SAFARI') || cat.includes('WILDLIFE');
        if (activeTab === 'RAFTING') return cat.includes('RAFT') || cat.includes('WATER');
        if (activeTab === 'CULTURAL') return cat.includes('CULTUR') || cat.includes('HERITAGE') || cat.includes('PILGRIM');
        if (activeTab === 'ADVENTURE') return cat.includes('ADVENTURE') || cat.includes('HELI') || cat.includes('FLIGHT') || cat.includes('GLID');
        return true;
      });

  return (
    <CustomerLayout>
      <RoleLandingGuard />

      {/* 1. MINIMAL HERO WITH DIVERSE ACTIVITIES & SEAMLESS SEARCH */}
      <section className="relative w-full min-h-[580px] lg:min-h-[640px] bg-[#141817] flex flex-col justify-between overflow-hidden">
        {/* Background Slideshow */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } transform transition-transform duration-7000`}
            aria-hidden={idx !== currentSlide}
          >
            <img
              src={getOptimizedImageUrl(slide.image, 1200)}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141817] via-[#141817]/65 to-[#141817]/40" />
          </div>
        ))}

        {/* Hero Center Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 text-center text-white flex-1 flex flex-col justify-center">
          {/* Subtle Activity Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 mb-5 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{HERO_SLIDES[currentSlide].tag}</span>
            <span className="opacity-40">•</span>
            <span>Nepal Tourism Board Verified</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 max-w-4xl mx-auto leading-[1.12]">
            {HERO_SLIDES[currentSlide].title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-[#E2DDD5] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>

          {/* Clean Integrated Search Bar */}
          <div className="w-full max-w-3xl mx-auto mb-6">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-left"
            >
              {/* Activity / Destination Input */}
              <div className="sm:col-span-6 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#FBF8F3] hover:bg-[#F4EFE8] focus-within:bg-white transition-all">
                <Compass className="w-4 h-4 text-[#D97706] shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="home-search-query"
                    className="block text-[9px] font-bold uppercase tracking-wider text-[#5F6B66]"
                  >
                    Activity or Destination
                  </label>
                  <input
                    id="home-search-query"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Everest, Chitwan Safari, Rafting..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1A1F1D] placeholder:text-[#8E9994] outline-none truncate"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="sm:col-span-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#FBF8F3] hover:bg-[#F4EFE8] focus-within:bg-white transition-all">
                <CalendarIcon className="w-4 h-4 text-[#1E4B8F] shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="home-search-date"
                    className="block text-[9px] font-bold uppercase tracking-wider text-[#5F6B66]"
                  >
                    Departure
                  </label>
                  <input
                    id="home-search-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#1A1F1D] outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  block
                  className="h-11 text-xs sm:text-sm font-bold bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Activities</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Filter Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/80">
            <span className="font-semibold text-white/60">Trending:</span>
            {['Everest Base Camp', 'Chitwan Safari', 'Trishuli Rafting', 'Annapurna Circuit', 'Pokhara Tours'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setQuery(name);
                  navigate(`/activities?search=${encodeURIComponent(name)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="relative z-10 pb-5 flex items-center justify-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all rounded-full ${
                idx === currentSlide ? 'w-7 bg-[#D97706]' : 'w-2 bg-white/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. FOUR CORE ACTIVITY PILLARS (MINIMAL & COMPACT) */}
      <section className="py-12 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ACTIVITY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/activities?category=${encodeURIComponent(cat.categoryQuery)}`}
                  className="group relative rounded-2xl border border-[#E8E4DD] bg-[#FBF8F3] hover:border-[#1E4B8F]/40 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DD] flex items-center justify-center text-[#1E4B8F] group-hover:bg-[#1E4B8F] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5F6B66] group-hover:text-[#D97706] group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A1F1D] group-hover:text-[#1E4B8F] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-[#5F6B66] mt-0.5 truncate">
                      {cat.count}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CURATED EXPERIENCES (CLEAN, MINIMAL CARDS FOR ALL ACTIVITIES) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-1">
              Verified Local Bookings
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
              Explore Experiences in Nepal
            </h2>
          </div>

          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E4B8F] hover:text-[#D97706] transition-colors group"
          >
            <span>View all ({allExperiences.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Activity Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#1A1F1D] text-white'
                  : 'bg-white text-[#5F6B66] border border-[#E8E4DD] hover:bg-[#FBF8F3] hover:text-[#1A1F1D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listing Grid */}
        {isLoadingListings ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white border border-[#E8E4DD] rounded-2xl p-4 space-y-3"
              >
                <LoadingSkeleton variant="rect" height="180px" />
                <LoadingSkeleton variant="text" width="50%" />
                <LoadingSkeleton variant="text" height="20px" width="85%" />
                <LoadingSkeleton variant="text" width="40%" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((item) => (
              <Link
                key={item.id}
                to={`/activities/${item.id}`}
                className="group flex flex-col bg-white rounded-2xl border border-[#E8E4DD] hover:border-[#1E4B8F]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-52 w-full bg-[#1A1F1D] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badges: Category & Duration */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#1A1F1D]/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <ReviewScoreChip
                      rating={item.rating}
                      reviewCount={item.reviewCount}
                      size="sm"
                    />
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#1A1F1D]/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#D97706]" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5F6B66] font-medium mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#1A1F1D] group-hover:text-[#1E4B8F] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Clean Footer: Agency & Price */}
                  <div className="pt-3 border-t border-[#E8E4DD] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 max-w-[60%]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1B7A5A] shrink-0" />
                      <span className="text-xs text-[#5F6B66] truncate font-medium">
                        {item.agencyName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#5F6B66] block uppercase tracking-wider">
                        From
                      </span>
                      <span className="font-serif font-black text-lg text-[#1A1F1D]">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. DISCOVER NEPAL: FOUR SEASONS & LIVING HERITAGE SPOTLIGHT */}
      <section className="py-16 sm:py-20 bg-[#FBF8F3] border-t border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E4DD] text-xs font-bold text-[#D97706]">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Into Nepal Travel Intelligence</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight">
                The World’s Greatest Altitudinal & Cultural Wonder
              </h2>
              <p className="text-sm sm:text-base text-[#5F6B66] leading-relaxed">
                From tropical Sal forests where wild tigers roam to the windswept 8,848m crest of Mount Everest. Learn why Nepal is a 12-month travel destination with distinct seasonal marvels.
              </p>
            </div>

            <Link to="/intonepal" className="shrink-0 self-start lg:self-center">
              <Button
                variant="primary"
                size="md"
                className="font-bold text-xs bg-[#1A1F1D] hover:bg-[#2C3531] text-white rounded-xl px-5 flex items-center gap-2"
              >
                <span>Read 'Into Nepal' Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* 4 Season Interactive Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 flex flex-col justify-between hover:border-[#16A34A] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full">
                    Mar – May
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-1">
                  Spring (Basanta)
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Wild blooming rhododendrons, warming temperatures, high alpine climbing expeditions, and clear mountain passes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#16A34A]">
                Best for: EBC, Island Peak, Bardia Tigers
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 flex flex-col justify-between hover:border-[#0284C7] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0284C7] bg-[#F0F9FF] px-2 py-0.5 rounded-full">
                    Jun – Aug
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-1">
                  Monsoon & Rain-Shadow
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Emerald terraced hillsides, high-volume whitewater river rafting, and sunny arid trekking in Upper Mustang and Dolpo.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#0284C7]">
                Best for: Upper Mustang, Sun Koshi, Valley Tours
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 flex flex-col justify-between hover:border-[#D97706] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF4E7] px-2 py-0.5 rounded-full">
                    Sep – Nov
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-1">
                  Autumn (Peak Season)
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Crystalline visibility across all 8,000m peaks, dry trails, warm sunny days, and the grand festive celebration of Dashain & Tihar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#D97706]">
                Best for: Annapurna, EBC, Paragliding, Heli
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 flex flex-col justify-between hover:border-[#475569] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center">
                    <Snowflake className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                    Dec – Feb
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-1">
                  Winter Sunshine
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Crisp skies, crowd-free teahouse trails, prime rhino & tiger tracking in subtropical lowlands, and Tibetan Buddhist Lhosar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#475569]">
                Best for: Chitwan Safari, Poon Hill, Lumbini
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-[#1A1F1D] text-white rounded-2xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-black text-[#D97706]">8 / 14</div>
              <div className="text-xs text-[#E2DDD5] mt-1">World’s 8,000m+ Peaks</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-black text-[#1B7A5A]">60m – 8,848m</div>
              <div className="text-xs text-[#E2DDD5] mt-1">Extreme Altitudinal Span</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-black text-[#1E4B8F]">125+</div>
              <div className="text-xs text-[#E2DDD5] mt-1">Indigenous Ethnicities</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-black text-[#C8362E]">850+</div>
              <div className="text-xs text-[#E2DDD5] mt-1">Recorded Bird Species</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE DIRECT LOCAL ADVANTAGE (3 MINIMAL VALUE PILLARS) */}
      <section className="py-14 bg-white border-y border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
              Why Book Through Into Nepal
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1.5">
              Direct connection with licensed operators across all Nepal adventure sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD]">
              <div className="w-9 h-9 rounded-lg bg-[#EDF6F2] text-[#1B7A5A] flex items-center justify-center font-bold text-sm mb-3">
                ✓
              </div>
              <h3 className="font-bold text-sm text-[#1A1F1D] mb-1">
                100% Government Verified
              </h3>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                Every operator is audited for active Nepal Tourism Board licensing, local company registration, and safety protocols.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD]">
              <div className="w-9 h-9 rounded-lg bg-[#EFF3FA] text-[#1E4B8F] flex items-center justify-center font-bold text-sm mb-3">
                ✓
              </div>
              <h3 className="font-bold text-sm text-[#1A1F1D] mb-1">
                Direct Operator Rates
              </h3>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                Pay true local prices with zero foreign aggregator markups. Your travel money directly supports the guides and crew.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD]">
              <div className="w-9 h-9 rounded-lg bg-[#FEF4E7] text-[#D97706] flex items-center justify-center font-bold text-sm mb-3">
                ✓
              </div>
              <h3 className="font-bold text-sm text-[#1A1F1D] mb-1">
                Protected Bookings
              </h3>
              <p className="text-xs text-[#5F6B66] leading-relaxed">
                Guaranteed departure dates, transparent cancellation policies, and direct communication with your expedition lead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ESSENTIAL TRAVEL INTELLIGENCE & FAQ */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F] block mb-1">
              Travel Intelligence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
              Frequently Asked Questions About Nepal Travel
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-2">
              Everything you need to know before booking your Himalayan adventure.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'When is the best time of year to visit Nepal?',
                a: 'Autumn (October to November) is the golden peak season with crystal-clear skies, mild temperatures, and incredible mountain visibility. Spring (March to May) is famous for blooming rhododendrons, warm weather, and high-altitude peak climbs. Winter (December to February) is ideal for crowd-free lower hill treks and subtropical wildlife safaris in Chitwan. Summer/Monsoon (June to August) is perfect for rain-shadow trekking in Upper Mustang and thrilling whitewater river rafting.',
              },
              {
                q: 'Do I need technical mountaineering experience to trek in Nepal?',
                a: 'Most classic treks—including Everest Base Camp, Annapurna Circuit, Mardi Himal, and Langtang—are hiking journeys that require good cardiovascular fitness and stamina, but zero technical mountaineering skills or rope work. Only designated trekking peaks such as Island Peak (6,189m) or Mera Peak require crampons and fixed rope ascension, for which verified operators provide full hands-on glacier training at Base Camp.',
              },
              {
                q: 'Are trekking permits and park fees included in the booking?',
                a: 'Yes. All verified operator packages listed on Into Nepal specify their inclusions. Standard packages include required National Park permits (e.g., Sagarmatha, Annapurna ACAP, Langtang), Trekkers’ Information Management System (TIMS) cards, and local government municipality taxes. Restricted area permits (such as Upper Mustang or Manaslu) are arranged directly in advance by your licensed operator.',
              },
              {
                q: 'How does the direct booking model benefit travelers and local operators?',
                a: 'Foreign travel agencies often mark up Nepal tour packages by 30% to 50% while outsourcing the actual guiding on the ground to Nepali companies. By booking directly through Into Nepal, you receive authentic local pricing, personalized trip customization, and guaranteed direct compensation to local Sherpa guides, porters, and family-owned lodges.',
              },
              {
                q: 'What is the booking reservation and payment policy?',
                a: 'You secure your guaranteed dates and verified local guide with a modest 15% booking reservation deposit through our secure escrow platform. The remaining 85% balance is settled directly with your verified agency upon your arrival in Kathmandu or Pokhara, giving you flexibility and peace of mind.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8E4DD] bg-[#FBF8F3] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#1A1F1D] hover:text-[#1E4B8F] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5F6B66] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1E4B8F]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#5F6B66] leading-relaxed border-t border-[#E8E4DD]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/intonepal"
              className="text-xs font-bold text-[#D97706] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Explore full seasonal & cultural guide on Into Nepal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. MINIMAL AGENCY PARTNER STRIP (HIGH VALUE FOR OPERATORS, NO CLUTTER) */}
      <section className="bg-[#1A1F1D] text-white py-12 sm:py-14 border-t border-[#2F3833]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#D97706]" />
                <span>For Licensed Tour & Activity Operators</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                List your treks, safaris, rafting, and tours on Into Nepal
              </h3>
              <p className="text-xs sm:text-sm text-[#D9D3C9]">
                Connect with global adventurers directly. Zero upfront setup fees, automated inquiries, and verified partner credibility.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={
                  isAll
                    ? '/agency/onboarding'
                    : `${PORTAL_URLS.partner}/agency/onboarding`
                }
              >
                <Button
                  variant="primary"
                  size="md"
                  className="font-bold text-xs bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl px-5"
                >
                  Register Agency
                </Button>
              </a>
              <a href={partnerPortalUrl}>
                <Button
                  variant="outline"
                  size="md"
                  className="font-bold text-xs bg-transparent text-white border-white/30 hover:bg-white/10 rounded-xl px-5"
                >
                  Operator Login
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
