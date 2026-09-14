import { PORTAL, PORTAL_URLS, type Portal } from './portal';
import type { Role } from './types';

/**
 * Returns the default home path for a specific role
 */
export function homeForRole(role: Role): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'agency':
      return '/agency/dashboard';
    case 'user':
    default:
      return '/';
  }
}

/**
 * Maps a user role to its designated subdomain portal
 */
export function portalForRole(role: Role): Exclude<Portal, 'all'> {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'agency':
      return 'partner';
    case 'user':
    default:
      return 'customer';
  }
}

/**
 * Returns the appropriate login page path for a portal
 */
export function loginPathForPortal(portal: Portal = PORTAL): string {
  switch (portal) {
    case 'admin':
      return '/admin/login';
    case 'partner':
      return '/agency/login';
    default:
      return '/login';
  }
}

/**
 * Returns the absolute URL of the role's portal if different from the current portal,
 * or null if the user is already on the correct portal (or running in "all" dev mode).
 */
export function crossPortalUrl(role: Role): string | null {
  if (PORTAL === 'all') {
    return null;
  }

  const targetPortal = portalForRole(role);
  if (targetPortal === PORTAL) {
    return null;
  }

  const baseUrl = PORTAL_URLS[targetPortal];
  if (!baseUrl) {
    return null;
  }

  const targetPath = homeForRole(role);
  // Ensure baseUrl does not end with trailing slash if targetPath starts with slash
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `${cleanBase}${targetPath}`;
}

/**
 * Resolves whether post-login should perform an internal navigate or external redirect
 */
export function resolvePostLogin(
  role: Role
): { type: 'external'; url: string } | { type: 'internal'; path: string } {
  const externalUrl = crossPortalUrl(role);
  if (externalUrl) {
    return { type: 'external', url: externalUrl };
  }

  return { type: 'internal', path: homeForRole(role) };
}
