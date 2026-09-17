import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Award } from 'lucide-react';

export interface TrustBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'escrow' | 'reviews' | 'commission';
  size?: 'sm' | 'md';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  variant = 'verified',
  size = 'md',
  className = '',
  ...rest
}) => {
  const configs = {
    verified: {
      label: 'Verified Agency',
      icon: ShieldCheck,
      style: 'bg-[#EDF6F2] text-[#1B7A5A] border-[#1B7A5A]/30',
    },
    escrow: {
      label: 'Secure Escrow Payment',
      icon: Lock,
      style: 'bg-[#EFF3FA] text-[#1E4B8F] border-[#1E4B8F]/30',
    },
    reviews: {
      label: 'Verified Booking Reviews',
      icon: Award,
      style: 'bg-[#FEF4E7] text-[#B45309] border-[#D97706]/35',
    },
    commission: {
      label: '15% Fair Commission',
      icon: CheckCircle2,
      style: 'bg-[#FBF8F3] text-[#1A1F1D] border-[#E8E4DD]',
    },
  }[variant];

  const Icon = configs.icon;
  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-1.5 py-0.5 gap-1'
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded border whitespace-nowrap select-none ${configs.style} ${sizeClasses} ${className}`.trim()}
      {...rest}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{configs.label}</span>
    </span>
  );
};

TrustBadge.displayName = 'TrustBadge';
