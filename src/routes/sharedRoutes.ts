import React from 'react';
import type { RouteManifestItem } from './types';

export const sharedRoutes: RouteManifestItem[] = [
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
];
