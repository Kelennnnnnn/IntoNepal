/**
 * Into Nepal — Immutable Financial Ledger Domain Model
 * 
 * Rules (Section 9):
 * - The ledger is an append-only, immutable financial source of truth.
 * - Reconstructs financial state across travelers, agencies, and the platform.
 * - NEVER overwrites historical financial records or edits paid amounts.
 * - Reversals and refunds are recorded as compensating ledger entries.
 */

import { Currency, Money, LedgerEntryType, createMoney } from './money';

export interface LedgerEntry {
  id: string;
  entryType: LedgerEntryType;
  bookingId?: string;
  agencyId?: string;
  travelerId?: string;
  paymentAttemptId?: string;
  payoutId?: string;
  
  // Debit / Credit amounts
  amount: Money;
  currency: Currency;
  
  // Reference for auditability
  referenceId: string;
  description: string;
  createdAt: string;
  
  // Cryptographic or sequential audit hash
  entryHash?: string;
}

export interface AccountLedgerSummary {
  currency: Currency;
  
  // Into Nepal Platform Revenue (from 15% booking fees)
  platformRevenueTotal: Money;
  
  // Agency Funds Collected by Platform (85% balance paid through Into Nepal)
  agencyFundsCollectedTotal: Money;
  
  // Agency Funds Disbursed / Paid out
  agencyDisbursementsTotal: Money;
  
  // Current Net Agency Payable (Collected - Disbursed - Refunds)
  currentAgencyPayable: Money;
  
  // Total Gross Product Value booked
  grossProductValueTotal: Money;
  
  // Total Refunds Issued
  totalRefundsIssued: Money;
}

/**
 * Creates an append-only ledger entry.
 */
export function createLedgerEntry(params: {
  id?: string;
  entryType: LedgerEntryType;
  bookingId?: string;
  agencyId?: string;
  travelerId?: string;
  amount: number;
  currency?: Currency;
  referenceId: string;
  description: string;
}): LedgerEntry {
  const currency = params.currency || 'USD';
  const moneyAmount = createMoney(params.amount, currency);

  return {
    id: params.id || `ledg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    entryType: params.entryType,
    bookingId: params.bookingId,
    agencyId: params.agencyId,
    travelerId: params.travelerId,
    amount: moneyAmount,
    currency,
    referenceId: params.referenceId,
    description: params.description,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Reconstructs accurate financial balances from immutable ledger entries.
 */
export function summarizeLedgerEntries(
  entries: LedgerEntry[],
  currency: Currency = 'USD'
): AccountLedgerSummary {
  let platformRevenueMinor = 0;
  let agencyCollectedMinor = 0;
  let disbursementsMinor = 0;
  let grossProductMinor = 0;
  let refundsMinor = 0;

  for (const entry of entries) {
    if (entry.currency !== currency) continue;

    switch (entry.entryType) {
      case 'INTO_NEPAL_REVENUE':
        platformRevenueMinor += entry.amount.minorUnits;
        break;
      case 'AGENCY_FUNDS_COLLECTED':
        agencyCollectedMinor += entry.amount.minorUnits;
        break;
      case 'PAYOUT_DISBURSEMENT':
        disbursementsMinor += entry.amount.minorUnits;
        break;
      case 'PRODUCT_VALUE':
        grossProductMinor += entry.amount.minorUnits;
        break;
      case 'REFUND_PLATFORM_FEE':
        platformRevenueMinor -= entry.amount.minorUnits;
        refundsMinor += entry.amount.minorUnits;
        break;
      case 'REFUND_AGENCY_FUNDS':
        agencyCollectedMinor -= entry.amount.minorUnits;
        refundsMinor += entry.amount.minorUnits;
        break;
      case 'AGENCY_PAYABLE':
      case 'ADJUSTMENT':
        // Informational or adjusted in specific accounts
        break;
    }
  }

  const currentPayableMinor = Math.max(0, agencyCollectedMinor - disbursementsMinor);

  return {
    currency,
    platformRevenueTotal: {
      amount: platformRevenueMinor / 100,
      minorUnits: platformRevenueMinor,
      currency,
    },
    agencyFundsCollectedTotal: {
      amount: agencyCollectedMinor / 100,
      minorUnits: agencyCollectedMinor,
      currency,
    },
    agencyDisbursementsTotal: {
      amount: disbursementsMinor / 100,
      minorUnits: disbursementsMinor,
      currency,
    },
    currentAgencyPayable: {
      amount: currentPayableMinor / 100,
      minorUnits: currentPayableMinor,
      currency,
    },
    grossProductValueTotal: {
      amount: grossProductMinor / 100,
      minorUnits: grossProductMinor,
      currency,
    },
    totalRefundsIssued: {
      amount: refundsMinor / 100,
      minorUnits: refundsMinor,
      currency,
    },
  };
}
