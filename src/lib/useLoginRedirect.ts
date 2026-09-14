import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { PORTAL, isPartner } from './portal';
import { crossPortalUrl } from './redirects';
import type { AuthUser } from './types';

/**
 * Unified login redirect hook used across all login entry points.
 * 
 * Rules:
 * 1. A role belonging to another subdomain is always SENT there, never rejected.
 * 2. An admin role is sent to the admin portal or /admin.
 * 3. An agency role is sent to the partner portal or /agency/dashboard.
 * 4. At agency login, a "user" role is routed by application state:
 *    Query agency_applications for their user_id; if a row exists go to
 *    /agency/onboarding/status, otherwise /agency/onboarding.
 * 5. At traveler login, a "user" role is routed to their intended path or "/".
 */
export function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePostLogin = async (
    user: AuthUser,
    explicitContext?: 'customer' | 'partner' | 'admin'
  ) => {
    // 1. Admin Role
    if (user.role === 'admin') {
      const crossUrl = crossPortalUrl('admin');
      if (crossUrl) {
        window.location.href = crossUrl;
        return;
      }
      navigate('/admin', { replace: true });
      return;
    }

    // 2. Agency Role
    if (user.role === 'agency') {
      const crossUrl = crossPortalUrl('agency');
      if (crossUrl) {
        window.location.href = crossUrl;
        return;
      }
      navigate('/agency/dashboard', { replace: true });
      return;
    }

    // 3. User (Traveler) Role
    const isAgencyLoginContext =
      explicitContext === 'partner' ||
      isPartner ||
      location.pathname.startsWith('/agency');

    if (isAgencyLoginContext) {
      try {
        const { data, error } = await supabase
          .from('agency_applications')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          navigate('/agency/onboarding/status', { replace: true });
          return;
        }
      } catch (err) {
        console.warn('Error checking agency_applications:', err);
      }

      navigate('/agency/onboarding', { replace: true });
      return;
    }

    // Standard Customer Login
    const crossUrl = crossPortalUrl('user');
    if (crossUrl) {
      window.location.href = crossUrl;
      return;
    }

    const attemptedPath = (location.state as any)?.from?.pathname;
    if (
      attemptedPath &&
      attemptedPath !== '/login' &&
      attemptedPath !== '/agency/login' &&
      attemptedPath !== '/admin/login'
    ) {
      navigate(attemptedPath, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return { handlePostLogin };
}
