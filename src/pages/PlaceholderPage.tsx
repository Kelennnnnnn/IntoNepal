import React from 'react';

export function createPlaceholderPage(pageName: string, portalScope?: string) {
  const PlaceholderComponent: React.FC = () => {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="border border-[#E8E4DD] bg-[#FFFFFF] rounded-lg p-6 max-w-md w-full shadow-none">
          {portalScope && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mb-1.5 block">
              {portalScope}
            </span>
          )}
          <h1 className="font-serif text-2xl font-bold text-[#1A1F1D]">{pageName}</h1>
          <p className="text-xs text-[#5F6B66] mt-2">
            Placeholder component for <code className="bg-[#FBF8F3] px-1.5 py-0.5 rounded border border-[#E8E4DD] text-[#1A1F1D] font-mono">{pageName}</code>
          </p>
        </div>
      </div>
    );
  };
  PlaceholderComponent.displayName = pageName;
  return PlaceholderComponent;
}
