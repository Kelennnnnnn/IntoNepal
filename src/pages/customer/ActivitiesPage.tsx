import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { ReviewScoreChip } from '@/components/ui/ReviewScoreChip';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/States';
import { supabase } from '@/lib/supabaseClient';
import { getOptimizedImageUrl } from '@/lib/images';
import type { Listing, Agency } from '@/lib/types';

const PAGE_SIZE = 9;

// Preset Options
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'trekking', label: 'Trekking' },
  { value: 'climbing', label: 'Peak Climbing' },
  { value: 'tour', label: 'Cultural Tours' },
  { value: 'safari', label: 'Jungle Safari' },
  { value: 'cultural', label: 'Heritage Walks' },
  { value: 'adventure', label: 'Alpine Adventure' },
  { value: 'wellness', label: 'Yoga & Wellness' },
];

const LOCATIONS = [
  'Everest',
  'Annapurna',
  'Langtang',
  'Manaslu',
  'Mustang',
  'Kathmandu',
  'Pokhara',
  'Chitwan',
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy (Level 1–2)' },
  { value: 'moderate', label: 'Moderate (Level 3–4)' },
  { value: 'challenging', label: 'Challenging (Level 5)' },
  { value: 'strenuous', label: 'Strenuous (Level 6)' },
  { value: 'extreme', label: 'Extreme (Level 7)' },
];

const DURATION_RANGES = [
  { label: 'Any Duration', min: undefined, max: undefined },
  { label: '1 – 5 Days', min: 1, max: 5 },
  { label: '6 – 10 Days', min: 6, max: 10 },
  { label: '11 – 15 Days', min: 11, max: 15 },
  { label: '16+ Days', min: 16, max: undefined },
];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'duration_asc', label: 'Duration: Shortest' },
  { value: 'duration_desc', label: 'Duration: Longest' },
];

interface FetchListingsResult {
  listings: (Listing & { agency?: Agency | null })[];
  totalCount: number;
}

export const ActivitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL parameters
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedLocation = searchParams.get('location') || '';
  const selectedDifficulty = searchParams.get('difficulty') || '';
  const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined;
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined;
  const minDuration = searchParams.get('min_duration') ? Number(searchParams.get('min_duration')) : undefined;
  const maxDuration = searchParams.get('max_duration') ? Number(searchParams.get('max_duration')) : undefined;
  const sortBy = searchParams.get('sort') || 'recommended';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  // Local state for search input typing before submit
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Helper to update URL params
  const updateParams = (updates: Record<string, string | null | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'all') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    // Reset to page 1 unless we are specifically updating the page
    if (!('page' in updates)) {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: localSearch.trim() });
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSearchParams(new URLSearchParams());
  };

  // Active filters count for badges
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory && selectedCategory !== 'all') count++;
    if (selectedLocation) count++;
    if (selectedDifficulty) count++;
    if (minPrice !== undefined || maxPrice !== undefined) count++;
    if (minDuration !== undefined || maxDuration !== undefined) count++;
    return count;
  }, [
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedDifficulty,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
  ]);

  // SERVER-SIDE SUPABASE QUERY VIA REACT QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<FetchListingsResult>({
    queryKey: [
      'activities-list',
      searchQuery,
      selectedCategory,
      selectedLocation,
      selectedDifficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      sortBy,
      page,
    ],
    queryFn: async () => {
      // 1. Base query with explicit column selection and count
      let query = supabase
        .from('listings')
        .select(
          'id, agency_id, title, category, location, price, duration, duration_days, difficulty, images, rating, review_count, featured, max_participants, status',
          { count: 'exact' }
        )
        .eq('status', 'published');

      // 2. Server-side text search (title & location)
      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery.trim()}%,location.ilike.%${searchQuery.trim()}%`
        );
      }

      // 3. Category Filter
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      // 4. Location Filter
      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      // 5. Difficulty Filter
      if (selectedDifficulty) {
        query = query.eq('difficulty', selectedDifficulty);
      }

      // 6. Price Range Filter
      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }

      // 7. Duration Days Filter
      if (minDuration !== undefined) {
        query = query.gte('duration_days', minDuration);
      }
      if (maxDuration !== undefined) {
        query = query.lte('duration_days', maxDuration);
      }

      // 8. Sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating_desc':
          query = query.order('rating', { ascending: false });
          break;
        case 'duration_asc':
          query = query.order('duration_days', { ascending: true, nullsFirst: false });
          break;
        case 'duration_desc':
          query = query.order('duration_days', { ascending: false, nullsFirst: false });
          break;
        case 'recommended':
        default:
          query = query
            .order('featured', { ascending: false })
            .order('rating', { ascending: false });
          break;
      }

      // 9. Server-side Pagination
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data: listingsData, count, error: queryError } = await query;

      if (queryError) {
        throw new Error(queryError.message);
      }

      const listings = (listingsData as any[]) || [];
      const totalCount = count ?? 0;

      // 10. Fetch Agencies in batch for the retrieved listings
      if (listings.length === 0) {
        return { listings: [], totalCount: 0 };
      }

      const agencyIds = Array.from(
        new Set(listings.map((l) => l.agency_id).filter(Boolean))
      ) as string[];

      let agencyMap: Record<string, Agency> = {};
      if (agencyIds.length > 0) {
        const { data: agenciesData } = await supabase
          .from('agency_applications')
          .select('id, user_id, company_name, city, rating, review_count, status, logo_url')
          .in('user_id', agencyIds);

        if (agenciesData) {
          agencyMap = (agenciesData as any[]).reduce((acc, a) => {
            acc[a.user_id] = a as Agency;
            return acc;
          }, {} as Record<string, Agency>);
        }
      }

      const hydratedListings = listings.map((l) => ({
        ...l,
        agency: agencyMap[l.agency_id] || null,
      }));

      return { listings: hydratedListings, totalCount };
    },
  });

  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE));

  return (
    <CustomerLayout>
      {/* Header Search & Breadcrumbs */}
      <div className="bg-[#FFFFFF] border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#5F6B66] mb-1">
                <Link to="/" className="hover:text-[#1A1F1D] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#1A1F1D] font-semibold">Trekking & Expeditions</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D] tracking-tight">
                Himalayan Treks & Expeditions
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
                {isLoading ? (
                  'Searching verified itineraries...'
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-bold text-[#1A1F1D]">
                      {data?.totalCount ?? 0}
                    </span>{' '}
                    itineraries from licensed Nepali tour operators
                  </>
                )}
              </p>
            </div>

            {/* Top Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#5F6B66] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search peak, valley, or trek..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg text-xs sm:text-sm text-[#1A1F1D] placeholder:text-[#9DA8A3] focus:outline-none focus:border-[#1E4B8F] transition-colors"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      updateParams({ search: null });
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9DA8A3] hover:text-[#1A1F1D]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Button type="submit" variant="primary" size="sm" className="h-9 font-bold px-3 shrink-0">
                Search
              </Button>
            </form>
          </div>

          {/* HORIZONTAL CHIP RAIL (Visible on mobile & tablet <900px, and quick filters) */}
          <div className="mt-4 pt-4 border-t border-[#E8E4DD]/60 flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Filter Sheet Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1A1F1D] bg-[#1A1F1D] text-white text-xs font-bold"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#D97706] text-[10px] text-white flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Quick Region Chips */}
              <button
                type="button"
                onClick={() => updateParams({ location: null })}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                  !selectedLocation
                    ? 'bg-[#1E4B8F] text-white'
                    : 'bg-[#FBF8F3] border border-[#E8E4DD] text-[#5F6B66] hover:bg-[#E8E4DD]/40'
                }`}
              >
                All Regions
              </button>
              {LOCATIONS.slice(0, 5).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() =>
                    updateParams({
                      location: selectedLocation === loc ? null : loc,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                    selectedLocation === loc
                      ? 'bg-[#1E4B8F] text-white'
                      : 'bg-[#FBF8F3] border border-[#E8E4DD] text-[#5F6B66] hover:bg-[#E8E4DD]/40'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#5F6B66] hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  aria-label="Sort activities by"
                  className="appearance-none bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-[#1A1F1D] focus:outline-none focus:border-[#1E4B8F] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#5F6B66] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters Pill Bar */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#5F6B66] text-[11px] uppercase font-bold tracking-wider">
                Active filters:
              </span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF3FA] text-[#1E4B8F] font-medium border border-[#1E4B8F]/20">
                  Search: "{searchQuery}"
                  <button onClick={() => updateParams({ search: null })}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedCategory && selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF3FA] text-[#1E4B8F] font-medium border border-[#1E4B8F]/20">
                  Category: {selectedCategory}
                  <button onClick={() => updateParams({ category: null })}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedLocation && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF3FA] text-[#1E4B8F] font-medium border border-[#1E4B8F]/20">
                  Location: {selectedLocation}
                  <button onClick={() => updateParams({ location: null })}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedDifficulty && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF3FA] text-[#1E4B8F] font-medium border border-[#1E4B8F]/20">
                  Difficulty: {selectedDifficulty}
                  <button onClick={() => updateParams({ difficulty: null })}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {(minPrice !== undefined || maxPrice !== undefined) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF3FA] text-[#1E4B8F] font-medium border border-[#1E4B8F]/20">
                  Price: ${minPrice ?? 0} – {maxPrice ? `$${maxPrice}` : 'Any'}
                  <button onClick={() => updateParams({ min_price: null, max_price: null })}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {(minDuration !== undefined || maxDuration !== undefined) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF3FA] text-[#1E4B8F] font-medium border border-[#1E4B8F]/20">
                  Duration: {minDuration ?? 1} – {maxDuration ? `${maxDuration}d` : '16+d'}
                  <button
                    onClick={() => updateParams({ min_duration: null, max_duration: null })}
                  >
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#C8362E] hover:underline flex items-center gap-1 ml-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Body Content with Filter Sidebar at >=900px (lg:) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR (Visible at >=900px / lg) */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#FFFFFF] rounded-xl border border-[#E8E4DD] p-5 shadow-sm space-y-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D97706]" />
                <h2 className="font-serif font-bold text-base text-[#1A1F1D]">Filter Itineraries</h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#C8362E] hover:underline font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* 1. Category Filter */}
            <div>
              <label
                htmlFor="sidebar-category-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2"
              >
                Activity Type
              </label>
              <select
                id="sidebar-category-select"
                value={selectedCategory}
                onChange={(e) => updateParams({ category: e.target.value })}
                className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1F1D] focus:outline-none focus:border-[#1E4B8F]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Destination Region */}
            <div>
              <label
                htmlFor="sidebar-region-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2"
              >
                Region
              </label>
              <select
                id="sidebar-region-select"
                value={selectedLocation}
                onChange={(e) => updateParams({ location: e.target.value || null })}
                className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1F1D] focus:outline-none focus:border-[#1E4B8F]"
              >
                <option value="">All Regions</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Difficulty */}
            <div>
              <label
                htmlFor="sidebar-difficulty-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2"
              >
                Difficulty Grade
              </label>
              <select
                id="sidebar-difficulty-select"
                value={selectedDifficulty}
                onChange={(e) => updateParams({ difficulty: e.target.value || null })}
                className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1F1D] focus:outline-none focus:border-[#1E4B8F]"
              >
                <option value="">Any Difficulty</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Duration Days */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2">
                Trip Duration
              </label>
              <div className="space-y-1.5">
                {DURATION_RANGES.map((r, idx) => {
                  const isChecked =
                    minDuration === r.min && maxDuration === r.max;
                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[#5F6B66] hover:text-[#1A1F1D] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="duration_range"
                        checked={isChecked}
                        onChange={() =>
                          updateParams({
                            min_duration: r.min !== undefined ? r.min.toString() : null,
                            max_duration: r.max !== undefined ? r.max.toString() : null,
                          })
                        }
                        className="text-[#1E4B8F] focus:ring-[#1E4B8F]"
                      />
                      <span>{r.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Price Range ($ USD) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2">
                Price Range (USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#5F6B66] block">Min ($)</span>
                  <input
                    type="number"
                    value={minPrice ?? ''}
                    placeholder="0"
                    onChange={(e) =>
                      updateParams({
                        min_price: e.target.value ? e.target.value : null,
                      })
                    }
                    className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-md px-2.5 py-1.5 text-xs text-[#1A1F1D] outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#5F6B66] block">Max ($)</span>
                  <input
                    type="number"
                    value={maxPrice ?? ''}
                    placeholder="5000"
                    onChange={(e) =>
                      updateParams({
                        max_price: e.target.value ? e.target.value : null,
                      })
                    }
                    className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-md px-2.5 py-1.5 text-xs text-[#1A1F1D] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="p-3 bg-[#EDF6F2] rounded-lg border border-[#1B7A5A]/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#1B7A5A] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Nepal Pricing</span>
              </div>
              <p className="text-[11px] text-[#5F6B66]">
                All prices are set directly by authorized local tour operators.
              </p>
            </div>
          </aside>

          {/* LISTINGS RESULTS CONTAINER (9 cols on lg, 12 on mobile) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-[#FFFFFF] border border-[#E8E4DD] rounded-lg p-4 space-y-3"
                  >
                    <LoadingSkeleton variant="rect" height="180px" />
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
            {isError && (
              <ErrorState
                title="Search query failed"
                message={error instanceof Error ? error.message : 'Could not query the database.'}
                onRetry={() => refetch()}
              />
            )}

            {/* Empty State */}
            {!isLoading && !isError && (!data?.listings || data.listings.length === 0) && (
              <EmptyState
                title="No treks match your current filters"
                description="Try expanding your search criteria, selecting a different region, or clearing some filters."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

            {/* Populated Listing Cards */}
            {!isLoading && !isError && data?.listings && data.listings.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.listings.map((listing) => {
                    const primaryImage =
                      listing.images && listing.images.length > 0
                        ? listing.images[0]
                        : null;
                    const agencyName =
                      listing.agency?.company_name || 'Verified Nepali Operator';

                    return (
                      <Link
                        key={listing.id}
                        to={`/activities/${listing.id}`}
                        className="group flex flex-col bg-[#FFFFFF] rounded-lg border border-[#E8E4DD] hover:border-[#D9D3C9] hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        {/* Listing Image */}
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

                          {/* Duration */}
                          <div className="absolute bottom-3 left-3 bg-[#1A1F1D]/80 backdrop-blur-sm px-2.5 py-1 rounded text-white text-[11px] font-semibold flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#D97706]" />
                            <span>{listing.duration || `${listing.duration_days} Days`}</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-[#5F6B66] font-medium mb-1">
                              <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                              <span>{listing.location}</span>
                            </div>

                            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1F1D] group-hover:text-[#D97706] transition-colors line-clamp-2 leading-snug">
                              {listing.title}
                            </h3>
                          </div>

                          {/* Bottom Row */}
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

                {/* SERVER-SIDE PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-[#E8E4DD] flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => updateParams({ page: (page - 1).toString() })}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>

                    <div className="text-xs text-[#5F6B66] font-medium">
                      Page <span className="font-bold text-[#1A1F1D]">{page}</span> of{' '}
                      <span className="font-bold text-[#1A1F1D]">{totalPages}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => updateParams({ page: (page + 1).toString() })}
                      className="flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER (<900px) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md text-[#5F6B66] hover:text-[#1A1F1D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              {/* Category */}
              <div>
                <label
                  htmlFor="mobile-category-select"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2"
                >
                  Activity Type
                </label>
                <select
                  id="mobile-category-select"
                  value={selectedCategory}
                  onChange={(e) => updateParams({ category: e.target.value })}
                  className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1F1D]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label
                  htmlFor="mobile-region-select"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2"
                >
                  Region
                </label>
                <select
                  id="mobile-region-select"
                  value={selectedLocation}
                  onChange={(e) => updateParams({ location: e.target.value || null })}
                  className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1F1D]"
                >
                  <option value="">All Regions</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label
                  htmlFor="mobile-difficulty-select"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2"
                >
                  Difficulty
                </label>
                <select
                  id="mobile-difficulty-select"
                  value={selectedDifficulty}
                  onChange={(e) => updateParams({ difficulty: e.target.value || null })}
                  className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1F1D]"
                >
                  <option value="">Any Difficulty</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1F1D] mb-2">
                  Trip Duration
                </label>
                <div className="space-y-2">
                  {DURATION_RANGES.map((r, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 text-xs text-[#5F6B66]"
                    >
                      <input
                        type="radio"
                        name="mobile_duration"
                        checked={minDuration === r.min && maxDuration === r.max}
                        onChange={() =>
                          updateParams({
                            min_duration: r.min !== undefined ? r.min.toString() : null,
                            max_duration: r.max !== undefined ? r.max.toString() : null,
                          })
                        }
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E4DD] flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                block
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                block
                onClick={() => setMobileFilterOpen(false)}
              >
                View Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};
