import type { Portal } from '../lib/portal';
import type { RouteManifestItem, RouteScope } from './types';
import { sharedRoutes } from '@/routes/sharedRoutes';
import { customerRoutes } from '@/routes/customerRoutes';
import { partnerRoutes } from '@/routes/partnerRoutes';
import { adminRoutes } from '@/routes/adminRoutes';

export type { RouteManifestItem, RouteScope };
export { sharedRoutes, customerRoutes, partnerRoutes, adminRoutes };

export const routeManifest: RouteManifestItem[] = [
  ...sharedRoutes,
  ...customerRoutes,
  ...partnerRoutes,
  ...adminRoutes,
];

/**
 * Filter routes for the active portal build.
 * In 'all' mode (local dev), mounts customer, partner, and admin routes while
 * preserving '/' for customer Home.
 */
export function routesForPortal(portal: Portal): RouteManifestItem[] {
  if (portal === 'customer') {
    return [...sharedRoutes, ...customerRoutes];
  }
  if (portal === 'partner') {
    return [...sharedRoutes, ...partnerRoutes];
  }
  if (portal === 'admin') {
    return [...sharedRoutes, ...adminRoutes];
  }

  // 'all' mode (local dev)
  return [
    ...sharedRoutes,
    ...customerRoutes,
    ...partnerRoutes.filter((r) => r.path !== '/'),
    ...adminRoutes.filter((r) => r.path !== '/'),
  ];
}
