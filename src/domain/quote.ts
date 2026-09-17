/**
 * Into Nepal — Booking Quote Engine Domain Model
 * 
 * Quotes are server-generated, immutable pricing snapshots.
 * A traveler cannot receive a confirmed reservation without a valid, non-expired quote.
 * 
 * Default Quote Expiry: 15 minutes (900,000 ms)
 */

import {
  Currency,
  Money,
  BalancePaymentMethod,
  calculateAuthoritativePriceBreakdown,
  DEFAULT_PLATFORM_FEE_RATE,
} from './money';

export interface BookingQuote {
  id: string;
  listingId: string;
  departureId: string;
  agencyId: string;
  travelerId: string;
  participantCount: number;
  
  currency: Currency;
  
  // Authoritative prices
  unitPrice: Money;
  totalProductValue: Money;       // 100% agency product value
  platformFeeRate: number;        // 0.15 (15%)
  platformFeeAmount: Money;       // 15% reservation fee (Pay Now to confirm)
  agencyBalanceRate: number;      // 0.85 (85%)
  agencyBalanceAmount: Money;     // 85% remaining balance (Pay Later)
  
  // Balance collection mode selected for this quote
  remainingBalanceMethod: BalancePaymentMethod;
  
  // Snapshotted legal/commercial terms
  cancellationPolicySnapshot: string;
  balancePaymentTermsSnapshot: string;
  pricingVersion: number;
  
  // Concurrency & Validity
  expiresAt: string;              // ISO timestamp (e.g. 15 minutes from creation)
  createdAt: string;              // ISO timestamp
}

export const DEFAULT_QUOTE_EXPIRY_MINUTES = 15;

export interface CreateQuoteParams {
  id?: string;
  listingId: string;
  departureId: string;
  agencyId: string;
  travelerId: string;
  participantCount: number;
  unitPriceAmount: number;
  currency?: Currency;
  remainingBalanceMethod?: BalancePaymentMethod;
  cancellationPolicySnapshot?: string;
  balancePaymentTermsSnapshot?: string;
  pricingVersion?: number;
  validityMinutes?: number;
}

/**
 * Creates an authoritative, immutable BookingQuote.
 */
export function createBookingQuote(params: CreateQuoteParams): BookingQuote {
  const currency = params.currency || 'USD';
  const validityMinutes = params.validityMinutes || DEFAULT_QUOTE_EXPIRY_MINUTES;
  
  const breakdown = calculateAuthoritativePriceBreakdown(
    params.unitPriceAmount,
    params.participantCount,
    currency,
    DEFAULT_PLATFORM_FEE_RATE
  );

  const now = new Date();
  const expiresAtDate = new Date(now.getTime() + validityMinutes * 60 * 1000);

  const defaultCancellationPolicy =
    'Standard Trekking Policy: Free cancellation up to 14 days before departure for agency balance. ' +
    'The 15% Into Nepal platform reservation fee secures administrative placement and is subject to platform booking terms.';

  const defaultBalanceTerms =
    params.remainingBalanceMethod === 'INTO_NEPAL_PLATFORM'
      ? 'Remaining 85% balance to be paid via Into Nepal at least 7 days before departure. Held in escrow until 14 days post-tour.'
      : 'Remaining 85% balance payable directly to the agency upon arrival in Kathmandu / Pokhara in cash or approved local transfer.';

  return {
    id: params.id || `quote_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    listingId: params.listingId,
    departureId: params.departureId,
    agencyId: params.agencyId,
    travelerId: params.travelerId,
    participantCount: params.participantCount,
    currency,
    unitPrice: breakdown.unitPrice,
    totalProductValue: breakdown.totalProductValue,
    platformFeeRate: breakdown.platformFeeRate,
    platformFeeAmount: breakdown.platformFeeAmount,
    agencyBalanceRate: breakdown.agencyBalanceRate,
    agencyBalanceAmount: breakdown.agencyBalanceAmount,
    remainingBalanceMethod: params.remainingBalanceMethod || 'DIRECT_TO_AGENCY',
    cancellationPolicySnapshot: params.cancellationPolicySnapshot || defaultCancellationPolicy,
    balancePaymentTermsSnapshot: params.balancePaymentTermsSnapshot || defaultBalanceTerms,
    pricingVersion: params.pricingVersion || 1,
    expiresAt: expiresAtDate.toISOString(),
    createdAt: now.toISOString(),
  };
}

/**
 * Validates that a quote is currently valid and unexpired.
 */
export function validateQuoteExpiration(quote: BookingQuote): { isValid: boolean; reason?: string } {
  const expires = new Date(quote.expiresAt).getTime();
  const now = Date.now();
  if (now > expires) {
    return {
      isValid: false,
      reason: `Quote has expired at ${quote.expiresAt}. Please request a fresh quote to reflect current pricing and inventory.`,
    };
  }
  return { isValid: true };
}
