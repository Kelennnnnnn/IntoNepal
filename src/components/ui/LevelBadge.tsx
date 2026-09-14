import React from 'react';

export type DifficultyLevel =
  | 'Easy'
  | 'Moderate'
  | 'Challenging'
  | 'Difficult'
  | 'Expert'
  | string;

export interface LevelBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  difficulty: DifficultyLevel;
  showDifficultyName?: boolean;
}

const DIFFICULTY_MAP: Record<string, number> = {
  easy: 1,
  moderate: 3,
  challenging: 5,
  difficult: 6,
  expert: 7,
};

/**
 * LevelBadge: Maps trek/tour difficulty to standardized level numbers:
 * Easy -> 1
 * Moderate -> 3
 * Challenging -> 5
 * Difficult -> 6
 * Expert -> 7
 */
export const LevelBadge: React.FC<LevelBadgeProps> = ({
  difficulty,
  showDifficultyName = true,
  className = '',
  ...rest
}) => {
  const normalizedKey = difficulty ? difficulty.trim().toLowerCase() : 'easy';
  const levelNumber = DIFFICULTY_MAP[normalizedKey] ?? 1;

  // Format canonical name
  const canonicalName =
    normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);

  // Subtle contextual tone based on level difficulty
  const levelStyles: Record<number, string> = {
    1: 'bg-[#EDF6F2] text-[#1B7A5A] border-[#1B7A5A]/30', // Green tint
    3: 'bg-[#EFF3FA] text-[#1E4B8F] border-[#1E4B8F]/30', // Blue tint
    5: 'bg-[#FEF4E7] text-[#B45309] border-[#D97706]/35', // Amber tint
    6: 'bg-[#FDF0EF] text-[#C8362E] border-[#C8362E]/30', // Red tint
    7: 'bg-[#1A1F1D] text-white border-[#1A1F1D]',       // Ink dark
  };

  const currentStyle = levelStyles[levelNumber] || levelStyles[1];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded border whitespace-nowrap select-none ${currentStyle} ${className}`.trim()}
      {...rest}
    >
      <span className="font-bold">Level {levelNumber}</span>
      {showDifficultyName && (
        <>
          <span className="opacity-40" aria-hidden="true">•</span>
          <span className="font-medium">{canonicalName}</span>
        </>
      )}
    </span>
  );
};

LevelBadge.displayName = 'LevelBadge';
