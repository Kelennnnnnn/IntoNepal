/**
 * Into Nepal — Money & Currency Domain Model
 * 
 * Strict financial architecture:
 * - Eliminates floating-point calculation errors by using integer minor units or controlled decimal math.
 * - Explicitly separates the 15% Into Nepal platform booking fee from the 85% agency product balance.
 * - Explicitly models financial entry types for the immutable ledger.
 */

export type Currency = 'NPR' | 'USD';

export const SUPPORTED_CURRENCIES: Currency[] = ['USD', 'NPR'];

export const DEFAULT_PLATFORM_FEE_RATE = 0.15; // 15% mandatory Into Nepal reservation fee
export const DEFAULT_AGENCY_BALANCE_RATE = 0.85; // 85% remaining agency balance

export type BalancePaymentMethod = 'DIRECT_TO_AGENCY' | 'INTO_NEPAL_PLATFORM';

export type BalancePaymentStatus =
  | 'PENDING'
  | 'REPORTED_PAID'
  | 'CONFIRMED_BY_AGENCY'
  | 'COLLECTED_BY_PLATFORM'
  | 'WAIVED';

/**
 * Immutable ledger entry classifications as specified in Section 8 & 9.
 */
export type LedgerEntryType =
  | 'PRODUCT_VALUE'           // Gross agency product value ($100)
  | 'INTO_NEPAL_REVENUE'       // Mandatory 15% booking/reservation fee ($15)
  | 'AGENCY_FUNDS_COLLECTED'   // 85% collected by Into Nepal on agency's behalf ($85)
  | 'AGENCY_PAYABLE'           // Net amount owed to agency ($85)
  | 'REFUND_PLATFORM_FEE'      // Compensating refund of platform fee
  | 'REFUND_AGENCY_FUNDS'      // Compensating refund of agency funds
  | 'PAYOUT_DISBURSEMENT'      // Money transferred to agency bank account
  | 'ADJUSTMENT';              // Audited administrative balance adjustment

export interface Money {
  amount: number;       // Decimal format (e.g. 15.00)
  minorUnits: number;   // Integer minor units in cents / paisa (e.g. 1500)
  currency: Currency;
}

export function createMoney(amount: number, currency: Currency = 'USD'): Money {
  // Round to 2 decimal places to avoid IEEE 754 floating point imprecision
  const roundedAmount = Math.round(amount * 100) / 100;
  const minorUnits = Math.round(roundedAmount * 100);
  return {
    amount: roundedAmount,
    minorUnits,
    currency,
  };
}

export interface AuthoritativePriceBreakdown {
  currency: Currency;
  unitPrice: Money;
  guestCount: number;
  
  // Total trip product value owned by agency (e.g. $100 * guests)
  totalProductValue: Money;
  
  // Platform booking/reservation fee (15%) - Into Nepal Revenue
  platformFeeRate: number;
  platformFeeAmount: Money;
  
  // Remaining agency balance (85%) - Agency's money
  agencyBalanceRate: number;
  agencyBalanceAmount: Money;
  
  // Amount due now at checkout to confirm reservation (equal to platformFeeAmount)
  payNowAmount: Money;
  
  // Amount due later (equal to agencyBalanceAmount)
  payLaterAmount: Money;
}

/**
 * Server-authoritative price breakdown calculation.
 * The agency owns the product price. Into Nepal takes a mandatory 15% reservation fee.
 */
export function calculateAuthoritativePriceBreakdown(
  unitPriceAmount: number,
  guestCount: number,
  currency: Currency = 'USD',
  customFeeRate: number = DEFAULT_PLATFORM_FEE_RATE
): AuthoritativePriceBreakdown {
  if (unitPriceAmount <= 0) {
    throw new Error('Product price must be greater than zero');
  }
  if (guestCount <= 0 || !Number.isInteger(guestCount)) {
    throw new Error('Guest count must be a positive integer');
  }
  if (customFeeRate < 0 || customFeeRate > 1) {
    throw new Error('Platform fee rate must be between 0 and 1');
  }

  const unitPrice = createMoney(unitPriceAmount, currency);
  const totalProductAmount = Math.round(unitPriceAmount * guestCount * 100) / 100;
  const totalProductValue = createMoney(totalProductAmount, currency);

  // Calculate 15% reservation fee
  const feeRate = customFeeRate;
  const platformFeeAmountNum = Math.round(totalProductAmount * feeRate * 100) / 100;
  const platformFeeAmount = createMoney(platformFeeAmountNum, currency);

  // Calculate 85% remaining agency balance
  const balanceRate = 1 - feeRate;
  const agencyBalanceAmountNum = Math.round((totalProductAmount - platformFeeAmountNum) * 100) / 100;
  const agencyBalanceAmount = createMoney(agencyBalanceAmountNum, currency);

  return {
    currency,
    unitPrice,
    guestCount,
    totalProductValue,
    platformFeeRate: feeRate,
    platformFeeAmount,
    agencyBalanceRate: balanceRate,
    agencyBalanceAmount,
    payNowAmount: platformFeeAmount,
    payLaterAmount: agencyBalanceAmount,
  };
}
