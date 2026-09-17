/**
 * Into Nepal — State Machines & Transition Graphs
 * 
 * Separate Booking, Payment, Settlement, and Refund states.
 * Rejects invalid transitions to enforce strict domain invariants.
 */

// 1. BOOKING STATUS
export type BookingStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAYMENT_PROCESSING'
  | 'CONFIRMED'
  | 'CANCEL_REQUESTED'
  | 'CANCELLED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'DISPUTED'
  | 'EXPIRED';

// Valid transitions for BookingStatus
const VALID_BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PENDING_PAYMENT', 'CANCELLED', 'EXPIRED'],
  PENDING_PAYMENT: ['PAYMENT_PROCESSING', 'CONFIRMED', 'EXPIRED', 'CANCELLED'],
  PAYMENT_PROCESSING: ['CONFIRMED', 'PENDING_PAYMENT', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCEL_REQUESTED', 'CANCELLED', 'DISPUTED', 'NO_SHOW'],
  CANCEL_REQUESTED: ['CANCELLED', 'CONFIRMED'],
  CANCELLED: [], // Terminal
  IN_PROGRESS: ['COMPLETED', 'DISPUTED', 'NO_SHOW'],
  COMPLETED: ['DISPUTED'], // Can be disputed post-trip
  NO_SHOW: ['DISPUTED'],
  DISPUTED: ['COMPLETED', 'CANCELLED', 'NO_SHOW'],
  EXPIRED: [], // Terminal
};

export function canTransitionBooking(from: BookingStatus, to: BookingStatus): boolean {
  if (from === to) return true;
  return VALID_BOOKING_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidBookingTransition(from: BookingStatus, to: BookingStatus): void {
  if (!canTransitionBooking(from, to)) {
    throw new Error(`Invalid booking transition from ${from} to ${to}`);
  }
}

// 2. PAYMENT STATUS (for the 15% platform reservation fee or balance payment attempts)
export type PaymentStatus =
  | 'UNPAID'
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'FAILED'
  | 'EXPIRED'
  | 'DISPUTED';

const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  UNPAID: ['PENDING', 'PROCESSING', 'FAILED', 'EXPIRED'],
  PENDING: ['PROCESSING', 'PAID', 'FAILED', 'EXPIRED'],
  PROCESSING: ['PAID', 'FAILED', 'PENDING'],
  PAID: ['PARTIALLY_REFUNDED', 'REFUNDED', 'DISPUTED'],
  PARTIALLY_REFUNDED: ['REFUNDED', 'DISPUTED'],
  REFUNDED: [], // Terminal
  FAILED: ['PENDING'], // Allowed to retry with new attempt
  EXPIRED: [], // Terminal
  DISPUTED: ['PAID', 'REFUNDED'],
};

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return true;
  return VALID_PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidPaymentTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!canTransitionPayment(from, to)) {
    throw new Error(`Invalid payment transition from ${from} to ${to}`);
  }
}

// 3. SETTLEMENT STATUS (for agency 85% funds held by platform)
export type SettlementStatus =
  | 'NOT_APPLICABLE'  // Used when balance was paid DIRECT_TO_AGENCY
  | 'NOT_ELIGIBLE'    // Trip not yet completed or within 14-day hold window
  | 'PENDING'         // Awaiting post-trip 14-day clearance
  | 'ON_HOLD'         // Paused due to dispute, KYC issue, or investigation
  | 'ELIGIBLE'        // Completed + 14 days passed + checks passed
  | 'PROCESSING'      // Included in active payout batch
  | 'PAID'            // Successfully transferred to agency bank account
  | 'FAILED'          // Wire/disbursement failed
  | 'REVERSED';       // Clawed back or canceled

const VALID_SETTLEMENT_TRANSITIONS: Record<SettlementStatus, SettlementStatus[]> = {
  NOT_APPLICABLE: [],
  NOT_ELIGIBLE: ['PENDING', 'NOT_APPLICABLE'],
  PENDING: ['ELIGIBLE', 'ON_HOLD', 'NOT_APPLICABLE'],
  ON_HOLD: ['PENDING', 'ELIGIBLE', 'REVERSED'],
  ELIGIBLE: ['PROCESSING', 'ON_HOLD'],
  PROCESSING: ['PAID', 'FAILED'],
  PAID: ['REVERSED'],
  FAILED: ['ELIGIBLE', 'ON_HOLD'], // Can re-try from eligible
  REVERSED: [],
};

export function canTransitionSettlement(from: SettlementStatus, to: SettlementStatus): boolean {
  if (from === to) return true;
  return VALID_SETTLEMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidSettlementTransition(from: SettlementStatus, to: SettlementStatus): void {
  if (!canTransitionSettlement(from, to)) {
    throw new Error(`Invalid settlement transition from ${from} to ${to}`);
  }
}

// 4. REFUND STATUS
export type RefundStatus =
  | 'NONE'
  | 'REQUESTED'
  | 'PROCESSING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'FAILED'
  | 'REVERSED';

const VALID_REFUND_TRANSITIONS: Record<RefundStatus, RefundStatus[]> = {
  NONE: ['REQUESTED'],
  REQUESTED: ['PROCESSING', 'FAILED', 'NONE'],
  PROCESSING: ['PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED'],
  PARTIALLY_REFUNDED: ['REFUNDED', 'FAILED'],
  REFUNDED: ['REVERSED'],
  FAILED: ['REQUESTED'],
  REVERSED: [],
};

export function canTransitionRefund(from: RefundStatus, to: RefundStatus): boolean {
  if (from === to) return true;
  return VALID_REFUND_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidRefundTransition(from: RefundStatus, to: RefundStatus): void {
  if (!canTransitionRefund(from, to)) {
    throw new Error(`Invalid refund transition from ${from} to ${to}`);
  }
}
