/**
 * Client-Side Rate Limiter for Into Nepal
 * Protects login, signup, and contact submission endpoints against brute force and automated floods.
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // e.g. 60,000 for 1 minute
}

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
}

const STORAGE_PREFIX = 'in_rl_';

function getAttempts(key: string, windowMs: number): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return [];
    const timestamps: number[] = JSON.parse(raw);
    const now = Date.now();
    const valid = timestamps.filter((t) => now - t < windowMs);
    return valid;
  } catch {
    return [];
  }
}

function saveAttempts(key: string, timestamps: number[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(timestamps));
  } catch {
    // Gracefully handle storage quota or private browsing
  }
}

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const attempts = getAttempts(key, config.windowMs);
  const now = Date.now();

  if (attempts.length >= config.maxAttempts) {
    const oldestAttempt = attempts[0];
    const timePassed = now - oldestAttempt;
    const retryAfterMs = Math.max(0, config.windowMs - timePassed);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - attempts.length,
    retryAfterSeconds: 0,
  };
}

export function recordAttempt(key: string, config: RateLimitConfig): RateLimitResult {
  const attempts = getAttempts(key, config.windowMs);
  const now = Date.now();
  attempts.push(now);
  saveAttempts(key, attempts);

  return checkRateLimit(key, config);
}

export function resetRateLimit(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {}
}

// Preset configurations
export const RATE_LIMITS = {
  LOGIN: { maxAttempts: 5, windowMs: 60 * 1000 },       // 5 attempts per 60s
  SIGNUP: { maxAttempts: 5, windowMs: 60 * 1000 },      // 5 attempts per 60s
  CONTACT: { maxAttempts: 3, windowMs: 5 * 60 * 1000 }, // 3 attempts per 5m
} as const;

export function checkLoginRateLimit(identifier: string): RateLimitResult {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  return checkRateLimit(`login_${cleanId}`, RATE_LIMITS.LOGIN);
}

export function recordLoginAttempt(identifier: string): RateLimitResult {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  return recordAttempt(`login_${cleanId}`, RATE_LIMITS.LOGIN);
}

export function resetLoginRateLimit(identifier: string): void {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  resetRateLimit(`login_${cleanId}`);
}

export function checkSignupRateLimit(identifier: string): RateLimitResult {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  return checkRateLimit(`signup_${cleanId}`, RATE_LIMITS.SIGNUP);
}

export function recordSignupAttempt(identifier: string): RateLimitResult {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  return recordAttempt(`signup_${cleanId}`, RATE_LIMITS.SIGNUP);
}

export function resetSignupRateLimit(identifier: string): void {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  resetRateLimit(`signup_${cleanId}`);
}

export function checkContactRateLimit(identifier: string): RateLimitResult {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  return checkRateLimit(`contact_${cleanId}`, RATE_LIMITS.CONTACT);
}

export function recordContactAttempt(identifier: string): RateLimitResult {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  return recordAttempt(`contact_${cleanId}`, RATE_LIMITS.CONTACT);
}

export function resetContactRateLimit(identifier: string): void {
  const cleanId = (identifier || 'anonymous').toLowerCase().trim();
  resetRateLimit(`contact_${cleanId}`);
}
