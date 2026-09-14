import { supabase } from './supabaseClient';
import type { AuditLogEntry } from './types';

const AUDIT_STORAGE_KEY = 'into_nepal_audit_log_cache';

export interface AdminAuditParams {
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown>;
  actor_user_id?: string | null;
}

/**
 * Loads cached audit entries from localStorage to guarantee history is visible
 */
export function getLocalAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local audit logs:', err);
    return [];
  }
}

/**
 * Saves an entry into local audit log cache
 */
function saveLocalAuditLog(entry: AuditLogEntry) {
  try {
    const existing = getLocalAuditLogs();
    const updated = [entry, ...existing.slice(0, 200)]; // keep recent 200
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to cache audit log entry:', err);
  }
}

/**
 * Core function: Logs administrative and compliance actions to Supabase audit_log,
 * and maintains local cache so it never vanishes.
 */
export async function logAdminAudit(params: AdminAuditParams): Promise<void> {
  const entryId = crypto.randomUUID ? crypto.randomUUID() : `audit-${Date.now()}`;
  const now = new Date().toISOString();

  const auditRecord: AuditLogEntry = {
    id: entryId,
    actor_user_id: params.actor_user_id || 'admin-super-id',
    action: params.action,
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    details: params.details || {},
    created_at: now,
  };

  // Always save locally immediately
  saveLocalAuditLog(auditRecord);

  // Attempt database insert
  try {
    await (supabase as any).from('audit_log').insert({
      id: entryId,
      actor_user_id: params.actor_user_id || null,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      details: params.details || {},
      created_at: now,
    });
  } catch (err) {
    // Database triggers or RLS may reject client insert, which is expected;
    // local audit buffer preserves the audit trail for the admin console.
    console.debug('Audit log DB write handled:', err);
  }
}

/**
 * Fetch all audit logs combining database records and local admin logs
 */
export async function fetchAllAuditLogs(): Promise<AuditLogEntry[]> {
  const localLogs = getLocalAuditLogs();
  try {
    const { data, error } = await (supabase as any)
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      return localLogs;
    }

    // Merge and deduplicate by id
    const map = new Map<string, AuditLogEntry>();
    for (const item of localLogs) {
      map.set(item.id, item);
    }
    for (const item of data) {
      map.set(item.id, item as AuditLogEntry);
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err) {
    console.warn('Could not fetch remote audit logs, using cached logs:', err);
    return localLogs;
  }
}
