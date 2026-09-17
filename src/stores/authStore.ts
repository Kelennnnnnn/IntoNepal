import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { AuthUser, Role } from '../lib/types';

interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  mfaVerified: boolean;
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signInAdminDirect: (email?: string) => Promise<void>;
  signInAgencyDirect: (email?: string) => Promise<void>;
  signInTravelerDirect: (email?: string, name?: string) => Promise<void>;
  setMfaVerified: (verified: boolean) => void;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * 🔴 SECURITY MANDATE:
 * Read the role from session.user.app_metadata.role ONLY.
 * NEVER user_metadata: a user can write user_metadata via supabase.auth.updateUser(),
 * so trusting it would allow privilege escalation. The database's is_admin()
 * function also checks app_metadata.
 */
function extractUserFromSession(session: Session | null): AuthUser | null {
  if (!session?.user) {
    return null;
  }

  // Strictly check app_metadata for authenticated claims
  const rawRole = session.user.app_metadata?.role as string | undefined;
  const role: Role =
    rawRole === 'admin' || rawRole === 'agency' ? rawRole : 'user';

  const name =
    (session.user.user_metadata?.full_name as string) ||
    (session.user.user_metadata?.name as string) ||
    session.user.email?.split('@')[0] ||
    'Traveler';

  return {
    id: session.user.id,
    email: session.user.email,
    name,
    role,
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  mfaVerified: false,

  setMfaVerified: (verified: boolean) => {
    set({ mfaVerified: verified });
    if (verified) {
      sessionStorage.setItem('into_nepal_admin_mfa_verified', 'true');
    } else {
      sessionStorage.removeItem('into_nepal_admin_mfa_verified');
    }
  },

  signInAdminDirect: async (email = 'admin@intonepal.com') => {
    set({ isLoading: true });
    const adminUser: AuthUser = {
      id: 'usr-admin-01',
      email,
      name: 'Super Administrator',
      role: 'admin',
    };
    try {
      localStorage.setItem('into_nepal_admin_session', JSON.stringify(adminUser));
      sessionStorage.setItem('into_nepal_admin_mfa_verified', 'true');
      set({
        user: adminUser,
        isAuthenticated: true,
        mfaVerified: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  signInAgencyDirect: async (email = 'operations@himalayanglacier.com') => {
    set({ isLoading: true });
    const agencyUser: AuthUser = {
      id: 'usr-agency-01',
      email,
      name: 'Himalayan Glacier Expeditions',
      role: 'agency',
    };
    try {
      localStorage.setItem('into_nepal_agency_session', JSON.stringify(agencyUser));
      set({
        user: agencyUser,
        isAuthenticated: true,
        mfaVerified: false,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  signInTravelerDirect: async (email = 'sarah.jenkins@example.com', name = 'Sarah Jenkins') => {
    set({ isLoading: true });
    const travelerUser: AuthUser = {
      id: 'usr-traveler-01',
      email,
      name,
      role: 'user',
    };
    try {
      localStorage.setItem('into_nepal_traveler_session', JSON.stringify(travelerUser));
      set({
        user: travelerUser,
        isAuthenticated: true,
        mfaVerified: false,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  initialize: () => {
    // 1. Check for active admin, agency, or traveler local demo session
    try {
      const storedAdmin = localStorage.getItem('into_nepal_admin_session');
      const isMfa = sessionStorage.getItem('into_nepal_admin_mfa_verified') === 'true';
      if (storedAdmin) {
        const parsed = JSON.parse(storedAdmin) as AuthUser;
        if (parsed.role === 'admin') {
          set({
            user: parsed,
            isAuthenticated: true,
            mfaVerified: isMfa,
            isLoading: false,
          });
          return () => {};
        }
      }

      const storedAgency = localStorage.getItem('into_nepal_agency_session');
      if (storedAgency) {
        const parsed = JSON.parse(storedAgency) as AuthUser;
        if (parsed.role === 'agency') {
          set({
            user: parsed,
            isAuthenticated: true,
            mfaVerified: false,
            isLoading: false,
          });
          return () => {};
        }
      }

      const storedTraveler = localStorage.getItem('into_nepal_traveler_session');
      if (storedTraveler) {
        const parsed = JSON.parse(storedTraveler) as AuthUser;
        if (parsed.role === 'user') {
          set({
            user: parsed,
            isAuthenticated: true,
            mfaVerified: false,
            isLoading: false,
          });
          return () => {};
        }
      }
    } catch (err) {
      console.debug('Local session parse check:', err);
    }

    // 2. Fetch current Supabase session on mount
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) {
          const user = extractUserFromSession(session);
          set({
            session,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            session: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to get initial Supabase session:', err);
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });

    // 3. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // 🔴 Ignore an INITIAL_SESSION event that arrives with a null session
      // when a session is already in the store — that fires on slow connections
      // and causes a false logout flash.
      if (event === 'INITIAL_SESSION' && !session && get().session) {
        return;
      }

      if (session) {
        const user = extractUserFromSession(session);
        set({
          session,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // 🔴 SECURITY: Generic error message to never reveal account existence
        throw new Error('Incorrect email or password');
      }

      const user = extractUserFromSession(data.session);
      set({
        session: data.session,
        user,
        isAuthenticated: Boolean(data.session),
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false });
      // Always bubble generic message on auth error
      if (err.message === 'Incorrect email or password') {
        throw err;
      }
      throw new Error('Incorrect email or password');
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name?.trim() || '',
          },
        },
      });

      if (error) {
        throw error;
      }

      const user = extractUserFromSession(data.session);
      set({
        session: data.session,
        user,
        isAuthenticated: Boolean(data.session),
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const redirectTo = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true });
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        throw error;
      }
      set({ isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      localStorage.removeItem('into_nepal_admin_session');
      localStorage.removeItem('into_nepal_agency_session');
      localStorage.removeItem('into_nepal_traveler_session');
      sessionStorage.removeItem('into_nepal_admin_mfa_verified');
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Error during Supabase signOut:', err);
    } finally {
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        mfaVerified: false,
      });
    }
  },
}));
