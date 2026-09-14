import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { crossPortalUrl, homeForRole, loginPathForPortal } from '../../lib/redirects';
import type { Role } from '../../lib/types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  roles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
}) => {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // 🔴 While isLoading → spinner. NEVER redirect while loading, or a refresh
  // on a protected page bounces the user to login before their session rehydrates.
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FBF8F3] px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#D97706] animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6B66]">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to loginPathForPortal(), remembering attempted path
  if (!isAuthenticated || !user) {
    const loginPath = loginPathForPortal();
    return (
      <Navigate
        to={loginPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role authorization if roles constraint is defined
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    const crossUrl = crossPortalUrl(user.role);
    if (crossUrl) {
      // User belongs to another portal subdomain: redirect externally
      window.location.href = crossUrl;
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FBF8F3] px-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#D97706] animate-spin" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6B66]">
              Redirecting to your portal...
            </p>
          </div>
        </div>
      );
    }

    // Role does not match, but within current portal: redirect to their role home
    return <Navigate to={homeForRole(user.role)} replace />;
  }

  return <>{children}</>;
};
