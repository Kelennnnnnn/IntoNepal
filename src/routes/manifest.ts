import React from 'react';
import type { Portal } from '../lib/portal';
import type { Role } from '../lib/types';

export type RouteScope = 'shared' | 'customer' | 'partner' | 'admin';

export interface RouteManifestItem {
  path: string;
  scope: RouteScope;
  component?: React.LazyExoticComponent<React.ComponentType<any>>;
  roles?: Role[];
  title: string;
  redirectTo?: string;
}

export const routeManifest: RouteManifestItem[] = [
  // =========================================================================
  // SHARED ROUTES (Mounted in customer, partner, and admin builds)
  // =========================================================================
  {
    path: '/forgot-password',
    scope: 'shared',
    component: React.lazy(() =>
      import('../pages/shared').then((m) => ({ default: m.ForgotPasswordPage }))
    ),
    title: 'Forgot Password | Into Nepal',
  },
  {
    path: '/reset-password',
    scope: 'shared',
    component: React.lazy(() =>
      import('../pages/shared').then((m) => ({ default: m.ResetPasswordPage }))
    ),
    title: 'Reset Password | Into Nepal',
  },
  {
    path: '/verify-email',
    scope: 'shared',
    component: React.lazy(() =>
      import('../pages/shared').then((m) => ({ default: m.VerifyEmailPage }))
    ),
    title: 'Verify Email | Into Nepal',
  },
  {
    path: '/terms',
    scope: 'shared',
    component: React.lazy(() =>
      import('../pages/shared').then((m) => ({ default: m.TermsPage }))
    ),
    title: 'Terms of Service | Into Nepal',
  },
  {
    path: '/privacy',
    scope: 'shared',
    component: React.lazy(() =>
      import('../pages/shared').then((m) => ({ default: m.PrivacyPage }))
    ),
    title: 'Privacy Policy | Into Nepal',
  },
  {
    path: '/cookies',
    scope: 'shared',
    component: React.lazy(() =>
      import('../pages/shared').then((m) => ({ default: m.CookiesPage }))
    ),
    title: 'Cookie Policy | Into Nepal',
  },
  {
    path: '/design-system',
    scope: 'shared',
    component: React.lazy(() =>
      import('../components/DesignSystemShowcase').then((m) => ({
        default: m.DesignSystemShowcase,
      }))
    ),
    title: 'Design System Showcase | Into Nepal',
  },

  // =========================================================================
  // CUSTOMER ROUTES (www.intonepal.com)
  // =========================================================================
  // Public
  {
    path: '/',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.HomePage }))
    ),
    title: 'Into Nepal | Authentic Himalayan Treks & Expeditions',
  },
  {
    path: '/activities',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.ActivitiesPage }))
    ),
    title: 'Browse Treks & Activities | Into Nepal',
  },
  {
    path: '/activities/:id',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.ActivityDetailPage }))
    ),
    title: 'Activity Details | Into Nepal',
  },
  {
    path: '/agency/profile/:agencyId',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.AgencyProfilePage }))
    ),
    title: 'Agency Profile | Into Nepal',
  },
  {
    path: '/about',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.AboutPage }))
    ),
    title: 'About Us | Into Nepal',
  },
  {
    path: '/contact',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.ContactPage }))
    ),
    title: 'Contact Us | Into Nepal',
  },
  {
    path: '/faq',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.FaqPage }))
    ),
    title: 'Frequently Asked Questions | Into Nepal',
  },
  {
    path: '/cancellation',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.CancellationPage }))
    ),
    title: 'Cancellation Policy | Into Nepal',
  },
  {
    path: '/login',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.CustomerLoginPage }))
    ),
    title: 'Log In | Into Nepal',
  },
  // Authenticated Traveler (roles: ["user"])
  {
    path: '/account',
    scope: 'customer',
    roles: ['user'],
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.AccountPage }))
    ),
    title: 'My Account | Into Nepal',
  },
  {
    path: '/my-bookings',
    scope: 'customer',
    roles: ['user'],
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.MyBookingsPage }))
    ),
    title: 'My Bookings | Into Nepal',
  },
  {
    path: '/wishlist',
    scope: 'customer',
    roles: ['user'],
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.WishlistPage }))
    ),
    title: 'Wishlist | Into Nepal',
  },
  {
    path: '/messages',
    scope: 'customer',
    roles: ['user'],
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.MessagesPage }))
    ),
    title: 'Traveler Messages | Into Nepal',
  },
  {
    path: '/booking/payment',
    scope: 'customer',
    roles: ['user'],
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.BookingPaymentPage }))
    ),
    title: 'Secure Checkout | Into Nepal',
  },
  {
    path: '/booking/confirmation',
    scope: 'customer',
    roles: ['user'],
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({
        default: m.BookingConfirmationPage,
      }))
    ),
    title: 'Booking Confirmed | Into Nepal',
  },

  // =========================================================================
  // PARTNER ROUTES (partner.intonepal.com)
  // =========================================================================
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

  // =========================================================================
  // ADMIN ROUTES (admin.intonepal.com)
  // =========================================================================
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

/**
 * Filter routes for the active portal build.
 * In 'all' mode (local dev), mounts customer, partner, and admin routes while
 * preserving '/' for customer Home.
 */
export function routesForPortal(portal: Portal): RouteManifestItem[] {
  if (portal === 'all') {
    return routeManifest.filter(
      (route) =>
        route.scope === 'shared' ||
        route.scope === 'customer' ||
        (route.scope === 'partner' && route.path !== '/') ||
        (route.scope === 'admin' && route.path !== '/')
    );
  }

  return routeManifest.filter(
    (route) => route.scope === portal || route.scope === 'shared'
  );
}
