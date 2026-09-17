import React from 'react';
import type { RouteManifestItem } from './types';

export const partnerRoutes: RouteManifestItem[] = [
  {
    path: '/',
    scope: 'partner',
    redirectTo: '/agency',
    title: 'Partner Portal | Into Nepal',
  },
  // Public
  {
    path: '/agency',
    scope: 'partner',
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.PartnerLandingPage }))
    ),
    title: 'Partner With Into Nepal | Agency Portal',
  },
  {
    path: '/agency/login',
    scope: 'partner',
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.PartnerLoginPage }))
    ),
    title: 'Agency Login | Into Nepal Partner',
  },
  // Roles: ["user", "agency"]
  {
    path: '/agency/onboarding',
    scope: 'partner',
    roles: ['user', 'agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({
        default: m.AgencyOnboardingPage,
      }))
    ),
    title: 'Agency Onboarding | Into Nepal',
  },
  {
    path: '/agency/onboarding/status',
    scope: 'partner',
    roles: ['user', 'agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({
        default: m.AgencyOnboardingStatusPage,
      }))
    ),
    title: 'Application Status | Into Nepal',
  },
  // Roles: ["agency"]
  {
    path: '/agency/dashboard',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencyDashboardPage }))
    ),
    title: 'Agency Dashboard | Into Nepal',
  },
  {
    path: '/agency/listings',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencyListingsPage }))
    ),
    title: 'Manage Listings | Into Nepal',
  },
  {
    path: '/agency/listings/new',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({
        default: m.AgencyNewListingPage,
      }))
    ),
    title: 'Create New Trek Listing | Into Nepal',
  },
  {
    path: '/agency/listings/:id/edit',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({
        default: m.AgencyEditListingPage,
      }))
    ),
    title: 'Edit Trek Listing | Into Nepal',
  },
  {
    path: '/agency/bookings',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencyBookingsPage }))
    ),
    title: 'Trek Bookings | Into Nepal',
  },
  {
    path: '/agency/availability',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({
        default: m.AgencyAvailabilityPage,
      }))
    ),
    title: 'Availability Calendar | Into Nepal',
  },
  {
    path: '/agency/earnings',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencyEarningsPage }))
    ),
    title: 'Earnings & Payouts | Into Nepal',
  },
  {
    path: '/agency/messages',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencyMessagesPage }))
    ),
    title: 'Client Conversations | Into Nepal',
  },
  {
    path: '/agency/analytics',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencyAnalyticsPage }))
    ),
    title: 'Performance Analytics | Into Nepal',
  },
  {
    path: '/agency/settings',
    scope: 'partner',
    roles: ['agency'],
    component: React.lazy(() =>
      import('../pages/partner').then((m) => ({ default: m.AgencySettingsPage }))
    ),
    title: 'Agency Settings & Bank Account | Into Nepal',
  },
];
