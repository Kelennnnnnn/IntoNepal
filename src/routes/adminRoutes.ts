import React from 'react';
import type { RouteManifestItem } from './types';

export const adminRoutes: RouteManifestItem[] = [
  {
    path: '/',
    scope: 'admin',
    redirectTo: '/admin',
    title: 'Admin Portal | Into Nepal',
  },
  // Public
  {
    path: '/admin/login',
    scope: 'admin',
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminLoginPage }))
    ),
    title: 'Admin Sign In | Into Nepal',
  },
  // Roles: ["admin"]
  {
    path: '/admin/mfa-setup',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminMfaSetupPage }))
    ),
    title: 'Admin MFA Setup | Into Nepal',
  },
  {
    path: '/admin/mfa-verify',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminMfaVerifyPage }))
    ),
    title: 'Admin 2FA Verification | Into Nepal',
  },
  {
    path: '/admin',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminDashboardPage }))
    ),
    title: 'Super Admin Overview | Into Nepal',
  },
  {
    path: '/admin/agencies',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminAgenciesPage }))
    ),
    title: 'Agency Verification Queue | Into Nepal',
  },
  {
    path: '/admin/listings',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminListingsPage }))
    ),
    title: 'All Platform Listings | Into Nepal',
  },
  {
    path: '/admin/users',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminUsersPage }))
    ),
    title: 'User Management & Roles | Into Nepal',
  },
  {
    path: '/admin/bookings',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminBookingsPage }))
    ),
    title: 'Global Bookings | Into Nepal',
  },
  {
    path: '/admin/payments',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminPaymentsPage }))
    ),
    title: 'Escrow & Payout Releases | Into Nepal',
  },
  {
    path: '/admin/reviews',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminReviewsPage }))
    ),
    title: 'Review Moderation | Into Nepal',
  },
  {
    path: '/admin/audit',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminAuditPage }))
    ),
    title: 'Security Audit Log | Into Nepal',
  },
  {
    path: '/admin/settings',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({ default: m.AdminSettingsPage }))
    ),
    title: 'Platform Commission & Settings | Into Nepal',
  },
  {
    path: '/admin/contact-submissions',
    scope: 'admin',
    roles: ['admin'],
    component: React.lazy(() =>
      import('../pages/admin').then((m) => ({
        default: m.AdminContactSubmissionsPage,
      }))
    ),
    title: 'Support Inquiries | Into Nepal',
  },
];
