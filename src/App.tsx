import React, { useEffect, Suspense, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PORTAL } from './lib/portal';
import { routesForPortal, type RouteManifestItem } from './routes/manifest';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleLandingGuard } from './components/auth/RoleLandingGuard';
import { useAuthStore } from './stores/authStore';
import { NotFoundPage } from './pages/shared/NotFoundPage';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { Sentry } from './lib/sentry';

function SentryFallback({ error, resetError }: { error: any; resetError: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBF8F3] text-center">
      <div className="max-w-md w-full bg-white border border-[#E8E4DD] rounded-xl p-8 shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mb-2 block">
          Application Error
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1A1F1D] mb-2">
          Something went wrong
        </h2>
        <p className="text-xs text-[#5F6B66] mb-6 leading-relaxed">
          An unexpected error was caught and dispatched to monitoring. You can attempt to restore your session or reload the page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => resetError()}
            className="px-4 py-2 bg-[#D97706] text-white text-xs font-semibold rounded hover:bg-[#B45309] transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-[#F3EFEA] text-[#1A1F1D] text-xs font-semibold rounded hover:bg-[#EAE4DC] transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RouteWrapper({ route }: { route: RouteManifestItem }) {
  useEffect(() => {
    if (route.title) {
      document.title = route.title;
    }
  }, [route.title]);

  const Component = route.component;
  if (!Component) {
    return null;
  }

  // Mount RoleLandingGuard on customer home to handle Google OAuth re-routing
  if (route.path === '/' && (route.scope === 'customer' || route.scope === 'shared')) {
    return (
      <RoleLandingGuard>
        <Component />
      </RoleLandingGuard>
    );
  }

  return <Component />;
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => {
      unsubscribe();
    };
  }, [initializeAuth]);

  // 🔴 Render routes ONLY from routesForPortal(PORTAL).
  // No route may be declared anywhere else.
  const activeRoutes = useMemo(() => routesForPortal(PORTAL), []);

  return (
    <Sentry.ErrorBoundary fallback={SentryFallback}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF8F3]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#D97706] animate-spin" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6B66]">
                    Loading Into Nepal...
                  </p>
                </div>
              </div>
            }
          >
            <Routes>
              {activeRoutes.map((route) => {
                // 1. Redirect routes (e.g. "/" -> "/agency" on partner portal)
                if (route.redirectTo) {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<Navigate to={route.redirectTo} replace />}
                    />
                  );
                }

                // 2. Role-gated protected routes
                if (route.roles && route.roles.length > 0) {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRoute roles={route.roles}>
                          <RouteWrapper route={route} />
                        </ProtectedRoute>
                      }
                    />
                  );
                }

                // 3. Standard public routes
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<RouteWrapper route={route} />}
                  />
                );
              })}

              {/* 🔴 Unknown paths render a 404, never a redirect loop */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}
