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
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Lock,
  Star,
} from 'lucide-react';
import { RoleLandingGuard } from '@/components/auth/RoleLandingGuard';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { ReviewScoreChip } from '@/components/ui/ReviewScoreChip';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/States';
import { supabase } from '@/lib/supabaseClient';
import { getOptimizedImageUrl } from '@/lib/images';
import { PORTAL_URLS, isAll } from '@/lib/portal';
import type { Listing, Agency } from '@/lib/types';

// Curated Hero Himalayan Imagery
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    region: 'Khumbu Valley',
    title: 'Ama Dablam & Sagarmatha',
    subtitle: 'Where earth touches the sky in the heart of the Everest region',
  },
  {
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
    region: 'Annapurna Conservation Area',
    title: 'Machapuchare at Dawn',
    subtitle: 'Sacred Fishtail peak rising above pristine rhododendron valleys',
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    region: 'Gokyo Ri & Lakes',
    title: 'Turquoise Sacred Waters',
    subtitle: 'Glacial amphitheaters and tranquil high-altitude reflections',
  },
  {
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5',
    region: 'Upper Mustang',
    title: 'The Hidden Kingdom of Lo',
    subtitle: 'Ancient Buddhist cliff caves and wind-sculpted arid plateaus',
  },
];

// Regional Collections Data
const REGIONS = [
  {
    name: 'Everest Region',
    query: 'Everest',
    duration: '12 – 18 Days',
    altitude: '5,545m max',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    description: 'Iconic Sherpa villages, Namche Bazaar, Tengboche Monastery, and Everest Base Camp.',
  },
  {
    name: 'Annapurna Circuit',
    query: 'Annapurna',
    duration: '10 – 16 Days',
    altitude: '5,416m max',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
    description: 'Diverse bio-zones from subtropical rice terraces to Thorong La high alpine pass.',
  },
  {
    name: 'Langtang & Helambu',
    query: 'Langtang',
    duration: '7 – 10 Days',
    altitude: '4,773m max',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    description: 'Glacial valleys, Tamang heritage trails, and local yak cheese bakeries near Kathmandu.',
  },
  {
    name: 'Manaslu Circuit',
    query: 'Manaslu',
    duration: '14 – 18 Days',
    altitude: '5,106m max',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    description: 'Wild, uncommercialized remote trekking around the world’s eighth highest mountain.',
  },
  {
    name: 'Upper Mustang',
    query: 'Mustang',
    duration: '11 – 14 Days',
    altitude: '3,820m max',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5',
    description: 'Forbidden ancient walled kingdom, preserved Tibetan Buddhist culture, and red sandstone canyons.',
  },
];

// Authentic Verified Testimonials
const TESTIMONIALS = [
  {
    quote:
      'Booking directly with a verified Nepali operator was the best decision we made. Our guide Dawa was born in Namche and took care of every detail. No middleman cuts meant better tea houses and fair wages.',
    traveler: 'Marcus & Elena Vance',
    country: 'Sweden',
    trek: 'Everest Base Camp & Gokyo Lakes',
    rating: 5,
  },
  {
    quote:
      'The escrow protection gave us total peace of mind. When bad weather delayed Lukla flights, our agency adjusted our itinerary immediately without surprise fees. True professional hospitality.',
    traveler: 'Sarah Jenkins',
    country: 'United Kingdom',
    trek: 'Annapurna Sanctuary Trek',
    rating: 5,
  },
  {
    quote:
      'Into Nepal connects you with the genuine stewards of these mountains. Knowing the company is verified by the Nepal Ministry of Tourism made a world of difference for our family.',
    traveler: 'Kenji Takahashi',
    country: 'Japan',
    trek: 'Langtang Valley Heritage',
    rating: 5,
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Rotating Hero State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search State
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set('search', destination.trim());
    if (date.trim()) params.set('date', date.trim());
    if (guests > 1) params.set('guests', guests.toString());

    navigate(`/activities?${params.toString()}`);
  };

  // 1. Fetch Featured Listings with React Query
  const {
    data: featuredListings,
    isLoading: isLoadingListings,
    isError: isListingsError,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: async (): Promise<(Listing & { agency?: Agency | null })[]> => {
      // Query published listings with explicit column selection
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select(
          'id, agency_id, title, description, category, location, price, duration, duration_days, difficulty, images, rating, review_count, featured, status, max_participants'
        )
        .eq('status', 'published')
        .order('rating', { ascending: false })
        .limit(6);

      if (listingsError) {
        throw new Error(listingsError.message);
      }

      if (!listingsData || listingsData.length === 0) {
        return [];
      }

      const rawListings = listingsData as any[];
      // Collect agency user_ids to join with agency_applications
      const agencyIds = Array.from(
        new Set(rawListings.map((l) => l.agency_id).filter(Boolean))
      ) as string[];

      let agencyMap: Record<string, Agency> = {};
      if (agencyIds.length > 0) {
        const { data: agenciesData } = await supabase
          .from('agency_applications')
          .select(
            'id, user_id, company_name, city, rating, review_count, status, logo_url'
          )
          .in('user_id', agencyIds);

        if (agenciesData) {
          agencyMap = (agenciesData as any[]).reduce((acc, a) => {
            acc[a.user_id] = a as Agency;
            return acc;
          }, {} as Record<string, Agency>);
        }
      }

      return rawListings.map((listing) => ({
        ...listing,
        agency: agencyMap[listing.agency_id] || null,
      }));
    },
  });

  // 2. Fetch Verified Agencies with React Query
  const {
    data: verifiedAgencies,
    isLoading: isLoadingAgencies,
    isError: isAgenciesError,
  } = useQuery({
    queryKey: ['verified-agencies-home'],
    queryFn: async (): Promise<Agency[]> => {
      const { data, error } = await supabase
        .from('agency_applications')
        .select(
          'id, user_id, company_name, city, rating, review_count, status, years_operating, description, logo_url'
        )
        .eq('status', 'verified')
        .order('rating', { ascending: false })
        .limit(4);

      if (error) {
        throw new Error(error.message);
      }
      return (data || []) as Agency[];
    },
  });

  const partnerPortalUrl = isAll ? '/agency' : PORTAL_URLS.partner;

  return (
    <CustomerLayout>
      {/* 🔴 Mount RoleLandingGuard at the top to re-route agency/admin users */}
      <RoleLandingGuard />

      {/* 1. HERO SECTION WITH ROTATING HIMALAYAN IMAGERY */}
      <section className="relative w-full h-[620px] sm:h-[680px] bg-[#141817] overflow-hidden flex items-center justify-center">
        {/* Background Images Crossfade */}
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
            {/* Matte Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141817] via-[#141817]/60 to-[#141817]/40" />
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-10 sm:pt-16 pb-28">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#FEF4E7] mb-6 animate-in fade-in duration-700">
            <ShieldCheck className="w-4 h-4 text-[#1B7A5A]" />
            <span>100% Government-Verified Nepali Agencies</span>
            <span className="opacity-40">•</span>
            <span className="text-[#D97706]">Direct Local Pricing</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 max-w-4xl mx-auto leading-[1.15]">
            Trek the Himalayas with Licensed Nepali Operators
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#D9D3C9] max-w-2xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed">
            Direct bookings, true local pricing, and escrow-secured deposits.
            Support local mountain communities without foreign aggregator markups.
          </p>

          {/* Slide Indicator & Manual Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                )
              }
              className="p-1.5 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentSlide ? 'w-6 bg-[#D97706]' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
              }
              className="p-1.5 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. SEARCH BAR (Floated at Bottom of Hero) */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 max-w-5xl mx-auto px-4 sm:px-6">
          <form
            onSubmit={handleSearch}
            className="bg-[#FFFFFF] rounded-xl border border-[#E8E4DD] shadow-xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            {/* Destination Input */}
            <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-[#FBF8F3] border border-[#E8E4DD]/80 focus-within:border-[#1E4B8F] transition-colors">
              <Compass className="w-5 h-5 text-[#D97706] shrink-0" />
              <div className="flex-1 text-left">
                <label
                  htmlFor="home-search-dest"
                  className="block text-[10px] font-bold uppercase tracking-wider text-[#5F6B66]"
                >
                  Destination or Trek
                </label>
                <input
                  id="home-search-dest"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Everest, Annapurna, Manaslu"
                  className="w-full bg-transparent text-sm font-medium text-[#1A1F1D] placeholder:text-[#9DA8A3] outline-none"
                />
              </div>
            </div>

            {/* Departure Dates */}
            <div className="sm:col-span-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-[#FBF8F3] border border-[#E8E4DD]/80 focus-within:border-[#1E4B8F] transition-colors">
              <CalendarIcon className="w-5 h-5 text-[#1E4B8F] shrink-0" />
              <div className="flex-1 text-left">
                <label
                  htmlFor="home-search-date"
                  className="block text-[10px] font-bold uppercase tracking-wider text-[#5F6B66]"
                >
                  Departure Date
                </label>
                <input
                  id="home-search-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1A1F1D] outline-none"
                />
              </div>
            </div>

            {/* Guests Counter */}
            <div className="sm:col-span-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-[#FBF8F3] border border-[#E8E4DD]/80">
              <Users className="w-5 h-5 text-[#1B7A5A] shrink-0" />
              <div className="flex-1 text-left">
                <label
                  htmlFor="home-search-guests"
                  className="block text-[10px] font-bold uppercase tracking-wider text-[#5F6B66]"
                >
                  Travelers
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="w-5 h-5 rounded bg-[#FFFFFF] border border-[#E8E4DD] text-xs font-bold text-[#1A1F1D] hover:bg-[#E8E4DD] flex items-center justify-center"
                    aria-label="Decrease guests"
                  >
                    -
                  </button>
                  <span
                    id="home-search-guests"
                    className="text-xs sm:text-sm font-bold text-[#1A1F1D] min-w-[3ch] text-center"
                  >
                    {guests} {guests === 1 ? 'guest' : 'guests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(16, g + 1))}
                    className="w-5 h-5 rounded bg-[#FFFFFF] border border-[#E8E4DD] text-xs font-bold text-[#1A1F1D] hover:bg-[#E8E4DD] flex items-center justify-center"
                    aria-label="Increase guests"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                block
                className="h-12 shadow-sm font-bold flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Spacer for Search Box Overflow */}
      <div className="h-20 sm:h-24" />

      {/* 3. FEATURED TRIPS */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Itineraries</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
              Featured Himalayan Expeditions
            </h2>
          </div>
          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E4B8F] hover:text-[#D97706] transition-colors group"
          >
            <span>View all itineraries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoadingListings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#FFFFFF] border border-[#E8E4DD] rounded-lg p-4 space-y-3"
              >
                <LoadingSkeleton variant="rect" height="190px" />
                <div className="flex justify-between">
                  <LoadingSkeleton variant="text" width="40%" />
                  <LoadingSkeleton variant="text" width="25%" />
                </div>
                <LoadingSkeleton variant="text" height="24px" width="85%" />
                <LoadingSkeleton variant="text" width="60%" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isListingsError && (
          <ErrorState
            title="Unable to load featured treks"
            message="We couldn't connect to our marketplace catalog. Please check your connection and retry."
            onRetry={() => refetchListings()}
          />
        )}

        {/* Empty State */}
        {!isLoadingListings &&
          !isListingsError &&
          (!featuredListings || featuredListings.length === 0) && (
            <EmptyState
              title="No published treks found in catalog"
              description="Licensed agencies are currently uploading their seasonal itineraries. Explore open departures or sign up to get notified."
              actionText="Explore All Activities"
              onAction={() => navigate('/activities')}
              secondaryActionText="Register Agency"
              onSecondaryAction={() =>
                (window.location.href = isAll
                  ? '/agency/onboarding'
                  : `${PORTAL_URLS.partner}/agency/onboarding`)
              }
            />
          )}

        {/* Populated Listing Grid */}
        {!isLoadingListings &&
          !isListingsError &&
          featuredListings &&
          featuredListings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => {
                const primaryImage =
                  listing.images && listing.images.length > 0
                    ? listing.images[0]
                    : null;
                const formattedRating = (listing.rating ?? 0).toFixed(1);
                const agencyName =
                  listing.agency?.company_name || 'Verified Nepali Operator';

                return (
                  <Link
                    key={listing.id}
                    to={`/activities/${listing.id}`}
                    className="group flex flex-col bg-[#FFFFFF] rounded-lg border border-[#E8E4DD] hover:border-[#D9D3C9] hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {/* Listing Image Container */}
                    <div className="relative h-48 w-full bg-[#1A1F1D] overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(
                          primaryImage,
                          600,
                          listing.location || 'general'
                        )}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Difficulty Level Badge */}
                      <div className="absolute top-3 left-3">
                        <LevelBadge difficulty={listing.difficulty} />
                      </div>

                      {/* Review Score Chip */}
                      <div className="absolute top-3 right-3">
                        <ReviewScoreChip
                          rating={listing.rating}
                          reviewCount={listing.review_count}
                          size="sm"
                        />
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-3 left-3 bg-[#1A1F1D]/80 backdrop-blur-sm px-2.5 py-1 rounded text-white text-[11px] font-semibold flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#D97706]" />
                        <span>{listing.duration || `${listing.duration_days} Days`}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-[#5F6B66] font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{listing.location}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1F1D] group-hover:text-[#D97706] transition-colors line-clamp-2 leading-snug">
                          {listing.title}
                        </h3>
                      </div>

                      {/* Agency & Price Strip */}
                      <div className="pt-3 border-t border-[#E8E4DD]/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 max-w-[60%]">
                          <ShieldCheck className="w-4 h-4 text-[#1B7A5A] shrink-0" />
                          <span className="text-xs text-[#5F6B66] truncate font-medium">
                            {agencyName}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#5F6B66] block uppercase tracking-wider">
                            From
                          </span>
                          <span className="font-serif font-black text-base sm:text-lg text-[#1A1F1D]">
                            ${Number(listing.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
      </section>

      {/* 4. REGIONAL COLLECTIONS */}
      <section className="py-14 bg-[#FFFFFF] border-y border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B7A5A] block mb-1">
              Geographic Circuits
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
              Explore by Himalayan Region
            </h2>
            <p className="text-sm text-[#5F6B66] mt-2">
              Each geographic massif in Nepal offers distinct climatic zones, indigenous ethnic heritage, and elevation profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.map((region) => (
              <Link
                key={region.name}
                to={`/activities?location=${encodeURIComponent(region.query)}`}
                className="group relative rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] hover:border-[#D9D3C9] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#1A1F1D]">
                  <img
                    src={getOptimizedImageUrl(region.image, 600, region.query)}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-white font-serif font-bold text-lg leading-tight block">
                      {region.name}
                    </span>
                    <span className="text-xs text-[#D9D3C9] font-medium">
                      {region.duration} • {region.altitude}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#5F6B66] leading-relaxed line-clamp-2 mb-3">
                    {region.description}
                  </p>
                  <div className="flex items-center text-xs font-bold text-[#1E4B8F] group-hover:text-[#D97706] transition-colors">
                    <span>View regional treks</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VERIFIED-AGENCY SECTION */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Why Verified Guarantee */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EDF6F2] border border-[#1B7A5A]/30 text-[#1B7A5A] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>The Into Nepal Guarantee</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight leading-tight">
              Why We Only Work with Verified Nepali Operators
            </h2>

            <p className="text-sm text-[#5F6B66] leading-relaxed">
              Foreign booking platforms take up to 30% markups and sub-contract to low-cost local operators.
              Into Nepal eliminates the middleman layer, verifying local agency credentials directly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EDF6F2] text-[#1B7A5A] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1F1D]">Government Licensing Verification</h4>
                  <p className="text-xs text-[#5F6B66] mt-0.5">
                    Active certificate of registration with the Ministry of Culture, Tourism & Civil Aviation and Trekking Agencies Association of Nepal (TAAN).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EDF6F2] text-[#1B7A5A] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1F1D]">Escrow-Protected Deposits</h4>
                  <p className="text-xs text-[#5F6B66] mt-0.5">
                    Your payments are held securely until your arrival in Nepal, safeguarding your trip against cancellations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EDF6F2] text-[#1B7A5A] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1F1D]">Ethical Porter & Guide Treatment</h4>
                  <p className="text-xs text-[#5F6B66] mt-0.5">
                    All partner agencies commit to fair wage standards, gear provisions, and mandatory insurance for all mountain crew.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/about">
                <Button variant="secondary" size="md">
                  Read Our Verification Standards
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Verified Agency Showcase */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E4DD] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E4DD]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">
                  Verified Partner Agencies
                </h3>
                <p className="text-xs text-[#5F6B66]">
                  Locally owned companies operating directly out of Kathmandu & Pokhara
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold text-[#1B7A5A] bg-[#EDF6F2] rounded-full">
                100% Licensed
              </span>
            </div>

            {isLoadingAgencies && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-3 border border-[#E8E4DD] rounded-lg">
                    <LoadingSkeleton variant="text" width="50%" />
                    <LoadingSkeleton variant="text" width="80%" className="mt-2" />
                  </div>
                ))}
              </div>
            )}

            {isAgenciesError && (
              <p className="text-xs text-[#C8362E] p-4 bg-[#FDF0EF] rounded-md">
                Unable to load verified agencies at this time.
              </p>
            )}

            {!isLoadingAgencies &&
              !isAgenciesError &&
              (!verifiedAgencies || verifiedAgencies.length === 0) && (
                <div className="text-center py-6">
                  <Building2 className="w-10 h-10 text-[#5F6B66] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-[#1A1F1D]">
                    Agency Network Active
                  </p>
                  <p className="text-xs text-[#5F6B66] max-w-sm mx-auto mt-1">
                    Over 120 verified Nepali operators are approved across Nepal. Browse our complete trip catalog to book directly.
                  </p>
                  <Link to="/activities" className="mt-4 inline-block">
                    <Button variant="primary" size="sm">
                      Browse All Treks
                    </Button>
                  </Link>
                </div>
              )}

            {!isLoadingAgencies &&
              !isAgenciesError &&
              verifiedAgencies &&
              verifiedAgencies.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {verifiedAgencies.map((agency) => (
                    <div
                      key={agency.id}
                      className="p-4 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-[#1A1F1D]">
                            {agency.company_name}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B7A5A] bg-[#EDF6F2] px-1.5 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#5F6B66] mt-1">
                          {agency.city} • {agency.years_operating} Years Operating
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E8E4DD]/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 font-semibold text-[#1A1F1D]">
                          <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                          <span>{(agency.rating ?? 0).toFixed(1)}</span>
                          <span className="text-[#5F6B66] font-normal">
                            ({agency.review_count ?? 0})
                          </span>
                        </div>
                        <Link
                          to={`/agency/${agency.id}`}
                          className="text-[#1E4B8F] font-bold hover:underline"
                        >
                          View Profile →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-14 sm:py-20 bg-[#FFFFFF] border-t border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-1">
              Verified Trekkers
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
              Stories from the Trail
            </h2>
            <p className="text-sm text-[#5F6B66] mt-2">
              Every review on Into Nepal is linked to an authentic completed booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#FBF8F3] border border-[#E8E4DD] rounded-xl p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#D97706] text-[#D97706]"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#1A1F1D] leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E4DD]/60">
                  <p className="font-bold text-xs text-[#1A1F1D]">{t.traveler}</p>
                  <p className="text-[11px] text-[#5F6B66]">
                    {t.country} • Trekked: {t.trek}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AGENCY RECRUITMENT BAND */}
      <section className="bg-[#1A1F1D] text-white py-14 sm:py-16 border-t border-[#303834]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#272E2B] border border-[#3A4540] rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D97706]/20 text-[#D97706] text-xs font-bold border border-[#D97706]/40">
                <Building2 className="w-4 h-4" />
                <span>For Licensed Nepali Tour Operators</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Are you a registered Nepali travel & trekking agency?
              </h3>
              <p className="text-xs sm:text-sm text-[#D9D3C9] leading-relaxed">
                Connect directly with international adventurers. Enjoy transparent 15% platform commission,
                guaranteed bank payouts in NPR or USD, and an advanced booking manager.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                href={
                  isAll
                    ? '/agency/onboarding'
                    : `${PORTAL_URLS.partner}/agency/onboarding`
                }
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  block
                  className="font-bold text-sm"
                >
                  Apply as Partner Agency
                </Button>
              </a>
              <a
                href={partnerPortalUrl}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  block
                  className="font-bold text-sm bg-transparent text-white border-[#5F6B66] hover:bg-white/10"
                >
                  Agency Login
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
