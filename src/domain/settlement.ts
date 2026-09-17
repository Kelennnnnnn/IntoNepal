/**
 * Into Nepal — 14-Day Post-Completion Settlement Engine Domain Rules
 * 
 * Rules (Section 5 & 17):
 * - If remaining 85% is collected through Into Nepal:
 *   Do NOT immediately release it to the agency.
 *   Eligible for agency settlement 14 days after the tour/activity is completed.
 *   Example: Tour completion 1 June -> Settlement eligibility 15 June.
 * 
 * Subject to:
 * - booking completed
 * - payment settled
 * - no active refund
 * - no active dispute
 * - no chargeback
 * - no administrative hold
 * - agency verified
 * - agency payout account verified
 * - required documents valid
 * - reconciliation successful
 */

import { Money } from './money';
import { SettlementStatus } from './stateMachines';

export interface BookingFinancialSnapshot {
  bookingId: string;
  agencyId: string;
  bookingStatus: string;
  paymentStatus: string;
  balanceMethod: 'DIRECT_TO_AGENCY' | 'INTO_NEPAL_PLATFORM';
  balanceStatus: string;
  
  // Amounts
  totalProductValue: Money;
  platformFeeAmount: Money;      // 15%
  agencyBalanceAmount: Money;    // 85%
  platformCollectedFunds: Money; // 85% if paid through Into Nepal
  
  // Timestamps
  tripDate: string;
  completedAt?: string | null;
  
  // Risk & Compliance Flags
  hasActiveDispute: boolean;
  hasActiveRefund: boolean;
  hasAdministrativeHold: boolean;
  
  // Agency Compliance
  isAgencyApproved: boolean;
  isPayoutAccountVerified: boolean;
  areDocumentsValid: boolean;
}

export interface SettlementEligibilityResult {
  status: SettlementStatus;
  isEligible: boolean;
  eligibilityDate?: string;
  daysRemaining?: number;
  payableAmount: Money;
  ineligibilityReasons: string[];
}

export const SETTLEMENT_HOLD_DAYS = 14;

/**
 * Calculates the exact settlement eligibility date from the trip completion date.
 */
export function calculateSettlementEligibilityDate(
  completedAtIso: string,
  holdDays: number = SETTLEMENT_HOLD_DAYS
): Date {
  const completedDate = new Date(completedAtIso);
  const eligibilityTimestamp = completedDate.getTime() + holdDays * 24 * 60 * 60 * 1000;
  return new Date(eligibilityTimestamp);
}

/**
 * Evaluates whether agency funds held by the platform for a booking are eligible for payout.
 */
export function checkSettlementEligibility(
  snapshot: BookingFinancialSnapshot,
  currentDate: Date = new Date(),
  holdDays: number = SETTLEMENT_HOLD_DAYS
): SettlementEligibilityResult {
  const reasons: string[] = [];

  // 1. Direct to agency check
  if (snapshot.balanceMethod === 'DIRECT_TO_AGENCY') {
    return {
      status: 'NOT_APPLICABLE',
      isEligible: false,
      payableAmount: { amount: 0, minorUnits: 0, currency: snapshot.totalProductValue.currency },
      ineligibilityReasons: ['Balance collected directly by agency. Into Nepal holds zero agency funds.'],
    };
  }

  // 2. Booking completion check
  if (snapshot.bookingStatus !== 'COMPLETED' || !snapshot.completedAt) {
    reasons.push('Trip has not yet concluded with verified completion status.');
  }

  // 3. Payment settled check
  if (snapshot.paymentStatus !== 'PAID') {
    reasons.push('Reservation fee is not marked as fully settled.');
  }

  // 4. Platform balance collection check
  if (snapshot.balanceStatus !== 'COLLECTED_BY_PLATFORM') {
    reasons.push('Remaining 85% balance has not yet been collected through Into Nepal escrow.');
  }

  // 5. Dispute / Refund / Administrative Hold checks
  if (snapshot.hasActiveDispute) {
    reasons.push('Booking is subject to an active dispute or traveler claim.');
  }
  if (snapshot.hasActiveRefund) {
    reasons.push('An active refund request is pending review or processing.');
  }
  if (snapshot.hasAdministrativeHold) {
    reasons.push('An administrative compliance hold is active on this booking or agency.');
  }

  // 6. Agency compliance checks
  if (!snapshot.isAgencyApproved) {
    reasons.push('Agency verification status is not APPROVED.');
  }
  if (!snapshot.isPayoutAccountVerified) {
    reasons.push('Agency bank payout account has not been verified for wire transfers.');
  }
  if (!snapshot.areDocumentsValid) {
    reasons.push('One or more required agency regulatory documents have expired or require re-submission.');
  }

  // 7. 14-day hold period check
  let eligibilityDateStr: string | undefined;
  let daysRemaining = 0;

  if (snapshot.completedAt) {
    const eligibilityDate = calculateSettlementEligibilityDate(snapshot.completedAt, holdDays);
    eligibilityDateStr = eligibilityDate.toISOString();
    
    const diffMs = eligibilityDate.getTime() - currentDate.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    if (currentDate.getTime() < eligibilityDate.getTime()) {
      reasons.push(`14-day post-completion security window active (${daysRemaining} days remaining until ${eligibilityDate.toLocaleDateString()}).`);
    }
  }

  const isEligible = reasons.length === 0;

  let status: SettlementStatus;
  if (snapshot.hasAdministrativeHold || snapshot.hasActiveDispute) {
    status = 'ON_HOLD';
  } else if (isEligible) {
    status = 'ELIGIBLE';
  } else if (snapshot.bookingStatus === 'COMPLETED') {
    status = 'PENDING';
  } else {
    status = 'NOT_ELIGIBLE';
  }

  return {
    status,
    isEligible,
    eligibilityDate: eligibilityDateStr,
    daysRemaining,
    payableAmount: isEligible ? snapshot.platformCollectedFunds : { amount: 0, minorUnits: 0, currency: snapshot.totalProductValue.currency },
    ineligibilityReasons: reasons,
  };
}
