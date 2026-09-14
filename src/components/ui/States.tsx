import React from 'react';
import { Button } from './button';

/* =========================================================================
   LoadingSkeleton
   Matte finish: solid line tone with gentle pulse, NO harsh glow/gradients.
   ========================================================================= */
export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle' | 'card';
  width?: string | number;
  height?: string | number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...rest
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-md',
    circle: 'h-10 w-10 rounded-full shrink-0',
    card: 'h-44 w-full rounded-lg border border-[#E8E4DD]',
  }[variant];

  const inlineStyles: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`animate-pulse bg-[#E8E4DD]/75 select-none ${variantClasses} ${className}`.trim()}
      style={inlineStyles}
      aria-hidden="true"
      {...rest}
    />
  );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';

/* =========================================================================
   EmptyState
   Clean typography, centered layout, optional icon & action.
   ========================================================================= */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`bg-[#FFFFFF] border border-[#E8E4DD] rounded-lg p-8 sm:p-12 text-center max-w-lg mx-auto shadow-none ${className}`.trim()}
      {...rest}
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FBF8F3] border border-[#E8E4DD] text-[#5F6B66] mb-4">
          {icon}
        </div>
      )}

      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1F1D] mb-2 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-[#5F6B66] max-w-sm mx-auto mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && onAction && (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="secondary" size="md" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

/* =========================================================================
   ErrorState
   Matte error banner or card with clear guidance & retry support.
   ========================================================================= */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
  retryText = 'Retry',
  className = '',
  ...rest
}) => {
  return (
    <div
      role="alert"
      className={`bg-[#FDF0EF] border border-[#C8362E]/30 rounded-lg p-6 sm:p-8 text-center max-w-lg mx-auto shadow-none ${className}`.trim()}
      {...rest}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#C8362E]/40 text-[#C8362E] mb-3">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h4 className="text-base font-bold text-[#1A1F1D] mb-1.5 font-serif">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-[#5F6B66] mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
};

ErrorState.displayName = 'ErrorState';
