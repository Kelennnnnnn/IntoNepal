import React from 'react';
import { CustomerHeader } from './CustomerHeader';
import { CustomerFooter } from './CustomerFooter';
import { DevPortalBanner } from '../common/DevPortalBanner';

export interface CustomerLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-[#1A1F1D] font-sans antialiased selection:bg-[#FEF4E7] selection:text-[#B45309]">
      <DevPortalBanner />
      <CustomerHeader />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      {!hideFooter && <CustomerFooter />}
    </div>
  );
};
