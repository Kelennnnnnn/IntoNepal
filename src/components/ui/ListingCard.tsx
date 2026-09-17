import React from 'react';
import { Heart, MapPin, Clock, ShieldCheck, Check } from 'lucide-react';
import { ReviewScoreChip } from './ReviewScoreChip';
import { LevelBadge, DifficultyLevel } from './LevelBadge';
import { CategoryBadge } from './CategoryBadge';
import { Category } from '@/lib/types';

export interface ListingCardData {
  id: string;
  title: string;
  category: Category | string;
  location: string;
  duration?: string;
  durationDays?: number;
  price: number;
  difficulty?: DifficultyLevel;
  rating?: number | null;
  reviewCount?: number | null;
  imageUrl: string;
  verifiedAgency?: boolean;
  agencyName?: string;
  freeCancellation?: boolean;
  spotsRemaining?: number | null;
  featured?: boolean;
}

export interface ListingCardProps {
  listing: ListingCardData;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string, e: React.MouseEvent) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isWishlisted = false,
  onWishlistToggle,
  onClick,
  className = '',
}) => {
  const {
    id,
    title,
    category,
    location,
    duration,
    durationDays,
    price,
    difficulty,
    rating,
    reviewCount,
    imageUrl,
    verifiedAgency = true,
    agencyName,
    freeCancellation = true,
    spotsRemaining,
    featured,
  } = listing;

  const displayDuration = duration || (durationDays ? `${durationDays} days` : 'Multi-day');
  const showUrgency = spotsRemaining !== null && spotsRemaining !== undefined && spotsRemaining <= 5 && spotsRemaining > 0;

  return (
    <article
      onClick={() => onClick?.(id)}
      className={`group relative flex flex-col bg-[#FFFFFF] rounded-lg border border-[#E8E4DD] text-[#1A1F1D] overflow-hidden select-none cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md hover:border-[#D9D3C9] ${className}`.trim()}
      tabIndex={0}
      role="article"
      aria-label={`${title}, ${displayDuration} in ${location}, from $${price} per person`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(id);
        }
      }}
    >
      {/* Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FBF8F3]">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top-left Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10">
          <CategoryBadge category={category} size="sm" />
          {featured && (
            <span className="bg-[#D97706] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-none">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(id, e);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF]/90 text-[#5F6B66] border border-[#E8E4DD] transition-colors hover:text-[#C8362E] hover:bg-[#FFFFFF] active:scale-95"
          aria-label={isWishlisted ? 'Remove from saved wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? 'fill-[#C8362E] text-[#C8362E]' : 'fill-none'
            }`}
          />
        </button>

        {/* Bottom Banner inside Image: Urgency or Agency */}
        {showUrgency ? (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#C8362E] text-white">
              Only {spotsRemaining} spots left!
            </span>
          </div>
        ) : null}
      </div>

      {/* Card Content - High Information Density */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4 gap-2.5">
        {/* Meta Line: Location, Duration, Difficulty */}
        <div className="flex items-center justify-between text-xs text-[#5F6B66] gap-2">
          <span className="inline-flex items-center gap-1 truncate font-medium">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8E9994]" />
            <span className="truncate">{location}</span>
          </span>
          <span className="inline-flex items-center gap-1 shrink-0 font-medium">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#8E9994]" />
            <span>{displayDuration}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1F1D] leading-snug line-clamp-2 group-hover:text-[#D97706] transition-colors">
          {title}
        </h3>

        {/* Agency + Difficulty Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {difficulty && <LevelBadge difficulty={difficulty} />}
          {verifiedAgency && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B7A5A] bg-[#EDF6F2] px-1.5 py-0.5 rounded border border-[#1B7A5A]/30">
              <ShieldCheck className="h-3 w-3" />
              Verified Agency
            </span>
          )}
          {agencyName && (
            <span className="text-[11px] text-[#5F6B66] truncate max-w-[140px]">
              by {agencyName}
            </span>
          )}
        </div>

        {/* Value Perks */}
        {freeCancellation && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#1B7A5A]">
            <Check className="h-3 w-3 text-[#1B7A5A] shrink-0" />
            <span>Free cancellation available</span>
          </div>
        )}

        {/* Bottom Pricing & Review Score Row (Divider) */}
        <div className="mt-auto pt-3 border-t border-[#E8E4DD] flex items-end justify-between gap-2">
          {/* Review Score Chip */}
          <div className="flex items-center gap-2">
            <ReviewScoreChip rating={rating} reviewCount={reviewCount} size="sm" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-[#1A1F1D]">
                {rating && rating >= 4.8
                  ? 'Exceptional'
                  : rating && rating >= 4.5
                  ? 'Superb'
                  : rating && rating >= 4.0
                  ? 'Very Good'
                  : rating && rating >= 3.0
                  ? 'Good'
                  : 'New'}
              </span>
              <span className="text-[10px] text-[#8E9994]">
                {reviewCount && reviewCount > 0
                  ? `${reviewCount} reviews`
                  : 'Verified reviews'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-right">
            <span className="block text-[10px] uppercase font-semibold text-[#8E9994] tracking-wider">
              From
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#D97706] leading-none">
                ${price.toLocaleString()}
              </span>
            </div>
            <span className="block text-[10px] text-[#5F6B66]">per person</span>
          </div>
        </div>
      </div>
    </article>
  );
};

ListingCard.displayName = 'ListingCard';
