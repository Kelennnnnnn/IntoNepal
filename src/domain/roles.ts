/**
 * Into Nepal — Role & Authorization Domain Architecture
 * 
 * Rules (Section 28 & 29):
 * - Roles are securely controlled server-side.
 * - Client-side role claims or user_metadata are strictly untrusted.
 * - Multi-user agency support: multiple staff can belong to one agency.
 */

export type PlatformRole =
  | 'TRAVELER'
  | 'AGENCY_USER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'SUPPORT'
  | 'FINANCE';

export type AgencyRole =
  | 'AGENCY_OWNER'
  | 'AGENCY_MANAGER'
  | 'AGENCY_STAFF';

export interface AgencyUserMembership {
  id: string;
  agencyId: string;
  userId: string;
  role: AgencyRole;
  isActive: boolean;
  invitedBy?: string;
  createdAt: string;
}

export type Permission =
  // Agency permissions
  | 'agency:manage_profile'
  | 'agency:manage_bank_details'
  | 'agency:manage_staff'
  | 'agency:create_listings'
  | 'agency:edit_listings'
  | 'agency:manage_departures'
  | 'agency:view_bookings'
  | 'agency:respond_reviews'
  | 'agency:send_messages'
  | 'agency:view_earnings'
  | 'agency:request_payout'
  // Admin permissions
  | 'admin:verify_agency'
  | 'admin:moderate_listings'
  | 'admin:view_all_bookings'
  | 'admin:process_settlement'
  | 'admin:execute_payout'
  | 'admin:adjust_ledger'
  | 'admin:manage_users'
  | 'admin:view_audit_logs';

const AGENCY_ROLE_PERMISSIONS: Record<AgencyRole, Permission[]> = {
  AGENCY_OWNER: [
    'agency:manage_profile',
    'agency:manage_bank_details',
    'agency:manage_staff',
    'agency:create_listings',
    'agency:edit_listings',
    'agency:manage_departures',
    'agency:view_bookings',
    'agency:respond_reviews',
    'agency:send_messages',
    'agency:view_earnings',
    'agency:request_payout',
  ],
  AGENCY_MANAGER: [
    'agency:create_listings',
    'agency:edit_listings',
    'agency:manage_departures',
    'agency:view_bookings',
    'agency:respond_reviews',
    'agency:send_messages',
    'agency:view_earnings',
  ],
  AGENCY_STAFF: [
    'agency:view_bookings',
    'agency:send_messages',
  ],
};

const PLATFORM_ROLE_PERMISSIONS: Record<PlatformRole, Permission[]> = {
  TRAVELER: [],
  AGENCY_USER: [], // Evaluated via AgencyRole
  ADMIN: [
    'admin:verify_agency',
    'admin:moderate_listings',
    'admin:view_all_bookings',
    'admin:view_audit_logs',
  ],
  SUPPORT: [
    'admin:view_all_bookings',
    'admin:view_audit_logs',
  ],
  FINANCE: [
    'admin:view_all_bookings',
    'admin:process_settlement',
    'admin:execute_payout',
    'admin:adjust_ledger',
    'admin:view_audit_logs',
  ],
  SUPER_ADMIN: [
    'admin:verify_agency',
    'admin:moderate_listings',
    'admin:view_all_bookings',
    'admin:process_settlement',
    'admin:execute_payout',
    'admin:adjust_ledger',
    'admin:manage_users',
    'admin:view_audit_logs',
  ],
};

export function hasAgencyPermission(role: AgencyRole, permission: Permission): boolean {
  return AGENCY_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasPlatformPermission(role: PlatformRole, permission: Permission): boolean {
  return PLATFORM_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
