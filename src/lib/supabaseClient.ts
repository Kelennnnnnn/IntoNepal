import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Default to user's active Supabase project
const DEFAULT_SUPABASE_URL = 'https://cnrajashdiemnezxuxbl.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucmFqYXNoZGllbW5lenh1eGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTk2NjgsImV4cCI6MjEwNDg5NTY2OH0.iJgKTDe4JN5WwJAdCU9_kVORi10dKEu_MnLquEgl__Q';

export function getActiveSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('supabase_project_url');
    if (custom) return custom;
  }
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  // If envUrl is set and is NOT the old deleted project or placeholder, use it
  if (envUrl && !envUrl.includes('piowwxrbluaxtppouqvf') && !envUrl.includes('your-project-id')) {
    return envUrl;
  }
  return DEFAULT_SUPABASE_URL;
}

export function getActiveSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('supabase_project_anon_key');
    if (custom) return custom;
  }
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envKey && envUrl && !envUrl.includes('piowwxrbluaxtppouqvf') && !envKey.includes('your-supabase-anon-key')) {
    return envKey;
  }
  return DEFAULT_SUPABASE_ANON_KEY;
}

export const supabaseUrl: string = getActiveSupabaseUrl();
export const supabaseAnonKey: string = getActiveSupabaseAnonKey();

// Save custom credentials if configured via UI
export function setCustomSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_project_url', url.trim());
    localStorage.setItem('supabase_project_anon_key', key.trim());
    window.location.reload();
  }
}

export function resetSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_project_url');
    localStorage.removeItem('supabase_project_anon_key');
    window.location.reload();
  }
}

// Check if configured
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-key'
);

/**
 * Single instance of the typed Supabase client
 */
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Helper to get the platform commission rate from platform_settings
 */
export async function getRuntimeCommissionRate(): Promise<number> {
  if (!isSupabaseConfigured) return 15; // default fallback
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'commission_rate')
      .maybeSingle();

    if (error || !data) return 15;
    const val = (data as any)?.value;
    return typeof val === 'number' ? val : Number(val) || 15;
  } catch {
    return 15;
  }
}

/**
 * Atomic spot reservation using the concurrency RPC created in migration 007
 */
export async function claimAvailabilitySpots(availabilityId: string, guests: number): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: simulating atomic spot reservation.');
    return true;
  }

  const { data, error } = await (supabase as any).rpc('claim_availability_spots', {
    p_availability_id: availabilityId,
    p_guests: guests,
  });

  if (error) {
    console.error('Failed to claim spots:', error.message);
    return false;
  }

  return Boolean(data);
}

/**
 * Atomic spot release using the concurrency RPC created in migration 007
 */
export async function releaseAvailabilitySpots(availabilityId: string, guests: number): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await (supabase as any).rpc('release_availability_spots', {
    p_availability_id: availabilityId,
    p_guests: guests,
  });

  if (error) {
    console.error('Failed to release spots:', error.message);
  }
}
