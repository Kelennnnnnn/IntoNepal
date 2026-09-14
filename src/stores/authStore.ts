import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { AuthUser, Role } from '../lib/types';

interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
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

  initialize: () => {
    // 1. Fetch current session on mount
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

    // 2. Subscribe to auth state changes
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
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Error during Supabase signOut:', err);
    } finally {
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
