import React from 'react';
import type { RouteManifestItem } from './types';

export const customerRoutes: RouteManifestItem[] = [
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
    path: '/intonepal',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.IntoNepalPage }))
    ),
    title: 'Why Nepal & Seasonal Guide | Into Nepal',
  },
  {
    path: '/into-nepal',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.IntoNepalPage }))
    ),
    title: 'Why Nepal & Seasonal Guide | Into Nepal',
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
    path: '/support',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.ContactPage }))
    ),
    title: 'Support & Assistance | Into Nepal',
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
    path: '/safety',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.TrekkerSafetyHubPage }))
    ),
    title: 'Trekker Safety, Altitude & Permits Hub | Into Nepal',
  },
  {
    path: '/trail-profiler',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.TrailProfilerPage }))
    ),
    title: 'Trail Elevation Profiler & Radar | Into Nepal',
  },
  {
    path: '/elevation-profiler',
    scope: 'customer',
    redirectTo: '/trail-profiler',
    title: 'Elevation Profiler | Into Nepal',
  },
  {
    path: '/plan-custom-trek',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.CustomItineraryPlannerPage }))
    ),
    title: 'Custom Trek Planner & Escrow Quotes | Into Nepal',
  },
  {
    path: '/custom-trek',
    scope: 'customer',
    redirectTo: '/plan-custom-trek',
    title: 'Custom Trek Planner | Into Nepal',
  },
  {
    path: '/preparation',
    scope: 'customer',
    redirectTo: '/safety',
    title: 'Trekker Preparation | Into Nepal',
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
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({ default: m.BookingPaymentPage }))
    ),
    title: 'Secure Checkout | Into Nepal',
  },
  {
    path: '/booking/confirmation',
    scope: 'customer',
    component: React.lazy(() =>
      import('../pages/customer').then((m) => ({
        default: m.BookingConfirmationPage,
      }))
    ),
    title: 'Booking Confirmed | Into Nepal',
  },
];
