import React from 'react';
import {
  Compass,
  Footprints,
  Landmark,
  Trees,
  Waves,
  Mountain,
  HeartPulse,
  Camera,
} from 'lucide-react';
import { Category } from '@/lib/types';

export interface CategoryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: Category | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; style: string }
> = {
  trekking: {
    label: 'Trekking',
    icon: Footprints,
    style: 'bg-[#EFF3FA] text-[#1E4B8F] border-[#1E4B8F]/25',
  },
  adventure: {
    label: 'Adventure',
    icon: Compass,
    style: 'bg-[#FEF4E7] text-[#B45309] border-[#D97706]/30',
  },
  cultural: {
    label: 'Cultural',
    icon: Landmark,
    style: 'bg-[#FBF8F3] text-[#78350F] border-[#D9D3C9]',
  },
  wildlife: {
    label: 'Wildlife',
    icon: Trees,
    style: 'bg-[#EDF6F2] text-[#1B7A5A] border-[#1B7A5A]/30',
  },
  rafting: {
    label: 'Rafting',
    icon: Waves,
    style: 'bg-[#EFF3FA] text-[#0369A1] border-[#0284C7]/30',
  },
  mountaineering: {
    label: 'Mountaineering',
    icon: Mountain,
    style: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
  },
  wellness: {
    label: 'Wellness',
    icon: HeartPulse,
    style: 'bg-[#FAF5FF] text-[#7E22CE] border-[#D8B4FE]/40',
  },
  photography: {
    label: 'Photography',
    icon: Camera,
    style: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  className = '',
  ...rest
}) => {
  const normalized = (category || 'trekking').toLowerCase().trim();
  const config = CATEGORY_CONFIG[normalized] || {
    label: category || 'General',
    icon: Compass,
    style: 'bg-[#FBF8F3] text-[#1A1F1D] border-[#E8E4DD]',
  };

  const IconComponent = config.icon;
  const sizeClass =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1'
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded border whitespace-nowrap select-none ${config.style} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

CategoryBadge.displayName = 'CategoryBadge';
