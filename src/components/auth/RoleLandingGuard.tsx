import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { crossPortalUrl, homeForRole } from '../../lib/redirects';

interface RoleLandingGuardProps {
  children?: React.ReactNode;
}

/**
 * Mounted on the customer Home page.
 * Google OAuth always redirects to "/" because the identity provider
 * does not know the user's role. An agency or admin signing in with Google
 * will land on the traveler homepage without this guard.
 *
 * This guard ensures non-traveler roles are immediately re-routed to their
 * respective portal dashboards.
 */
export const RoleLandingGuard: React.FC<RoleLandingGuardProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔴 Guard on isLoading first
    if (isLoading) {
      return;
    }

    if (isAuthenticated && user && user.role !== 'user') {
      const crossUrl = crossPortalUrl(user.role);
      if (crossUrl) {
        window.location.href = crossUrl;
      } else {
        navigate(homeForRole(user.role), { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && user && user.role !== 'user') {
    return null;
  }

  return <>{children}</>;
};
