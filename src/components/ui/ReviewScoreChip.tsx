import React from 'react';

export interface ReviewScoreChipProps extends React.HTMLAttributes<HTMLDivElement> {
  rating?: number | null;
  reviewCount?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ReviewScoreChip: Solid blue box with the score, inspired by Booking.com.
 * Renders "New" when rating is null, undefined, or review_count is 0.
 * Matte finish: solid fill (#1E4B8F), NO glow, NO gradient.
 */
export const ReviewScoreChip: React.FC<ReviewScoreChipProps> = ({
  rating,
  reviewCount,
  size = 'md',
  className = '',
  ...rest
}) => {
  const isNew =
    rating === null ||
    rating === undefined ||
    isNaN(rating) ||
    reviewCount === 0 ||
    reviewCount === null ||
    reviewCount === undefined;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded min-w-[24px] h-5',
    md: 'text-sm px-2 py-1 rounded-md min-w-[32px] h-7 font-bold',
    lg: 'text-base px-2.5 py-1.5 rounded-md min-w-[40px] h-9 font-bold',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center bg-[#1E4B8F] text-white select-none whitespace-nowrap font-bold tracking-tight shadow-none ${sizeClasses} ${className}`.trim()}
      aria-label={isNew || rating == null ? 'New listing' : `Review score: ${Number(rating).toFixed(1)}`}
      {...rest}
    >
      {isNew || rating == null ? 'New' : Number(rating).toFixed(1)}
    </div>
  );
};

ReviewScoreChip.displayName = 'ReviewScoreChip';
