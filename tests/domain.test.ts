/**
 * Into Nepal — Phase 1 Domain Model & Commercial Rule Verification Suite
 */

import {
  calculateAuthoritativePriceBreakdown,
  createMoney,
  DEFAULT_PLATFORM_FEE_RATE,
} from '../src/domain/money';

import {
  canTransitionBooking,
  canTransitionPayment,
  canTransitionSettlement,
  assertValidBookingTransition,
} from '../src/domain/stateMachines';

import {
  createBookingQuote,
  validateQuoteExpiration,
} from '../src/domain/quote';

import {
  PaymentService,
  NICAsiaSimulatorProvider,
} from '../src/domain/payment/provider';

import {
  checkSettlementEligibility,
  calculateSettlementEligibilityDate,
  BookingFinancialSnapshot,
} from '../src/domain/settlement';

import {
  createLedgerEntry,
  summarizeLedgerEntries,
} from '../src/domain/ledger';

import {
  hasAgencyPermission,
  hasPlatformPermission,
} from '../src/domain/roles';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runDomainVerification() {
  console.log('--- 1. Testing 15% Into Nepal Fee / 85% Agency Balance Commercial Split ---');
  {
    // A $100 tour for 2 guests = $200 total product value
    const breakdown = calculateAuthoritativePriceBreakdown(100, 2, 'USD');
    assert(breakdown.totalProductValue.amount === 200, 'Total product value must be $200.00');
    assert(breakdown.platformFeeRate === 0.15, 'Platform fee rate must be 0.15 (15%)');
    assert(breakdown.platformFeeAmount.amount === 30, 'Platform fee must be $30.00 (15% of $200)');
    assert(breakdown.agencyBalanceRate === 0.85, 'Agency balance rate must be 0.85 (85%)');
    assert(breakdown.agencyBalanceAmount.amount === 170, 'Agency balance must be $170.00 (85% of $200)');
    assert(breakdown.payNowAmount.amount === 30, 'Pay now amount must equal 15% reservation fee ($30.00)');
    assert(breakdown.payLaterAmount.amount === 170, 'Pay later amount must equal 85% remaining balance ($170.00)');
  }

  console.log('--- 2. Testing Quote Generation & Expiration ---');
  {
    const quote = createBookingQuote({
      listingId: 'list-123',
      departureId: 'dep-456',
      agencyId: 'agency-789',
      travelerId: 'traveler-001',
      participantCount: 3,
      unitPriceAmount: 150,
      currency: 'USD',
      validityMinutes: 15,
    });

    assert(quote.totalProductValue.amount === 450, 'Total quote product value is $450 (3 * $150)');
    assert(quote.platformFeeAmount.amount === 67.5, '15% platform reservation fee is $67.50');
    assert(quote.agencyBalanceAmount.amount === 382.5, '85% agency balance is $382.50');
    
    const freshCheck = validateQuoteExpiration(quote);
    assert(freshCheck.isValid, 'Freshly generated quote is valid');

    const expiredQuote = {
      ...quote,
      expiresAt: new Date(Date.now() - 60000).toISOString(),
    };
    const expiredCheck = validateQuoteExpiration(expiredQuote);
    assert(!expiredCheck.isValid, 'Expired quote is flagged as invalid');
  }

  console.log('--- 3. Testing Domain State Transitions ---');
  {
    assert(canTransitionBooking('PENDING_PAYMENT', 'CONFIRMED'), 'PENDING_PAYMENT -> CONFIRMED is valid');
    assert(!canTransitionBooking('CANCELLED', 'CONFIRMED'), 'CANCELLED -> CONFIRMED is forbidden');
    assert(canTransitionPayment('PENDING', 'PAID'), 'Payment PENDING -> PAID is valid');
    assert(!canTransitionPayment('REFUNDED', 'PAID'), 'Payment REFUNDED -> PAID is forbidden');
    assert(canTransitionSettlement('PENDING', 'ELIGIBLE'), 'Settlement PENDING -> ELIGIBLE is valid');
    assert(!canTransitionSettlement('NOT_APPLICABLE', 'ELIGIBLE'), 'Settlement NOT_APPLICABLE -> ELIGIBLE is forbidden');
  }

  console.log('--- 4. Testing Dummy / Sandbox NIC ASIA Simulator Provider ---');
  {
    const provider = new NICAsiaSimulatorProvider();
    const service = new PaymentService(provider);

    const quote = createBookingQuote({
      listingId: 'list-ebc',
      departureId: 'dep-spring',
      agencyId: 'agency-sherpa',
      travelerId: 'traveler-alex',
      participantCount: 1,
      unitPriceAmount: 1200,
      currency: 'USD',
    });

    // 15% reservation fee is $180
    assert(quote.platformFeeAmount.amount === 180, '15% of $1,200 is $180');

    const initResult = await service.initiateReservationPayment({
      quote,
      travelerName: 'Alex Mercer',
      travelerEmail: 'alex@example.com',
      returnUrl: 'https://intonepal.com/checkout/callback',
      cancelUrl: 'https://intonepal.com/checkout/cancel',
    });

    assert(initResult.success, 'Simulated payment initiation succeeded');
    assert(Boolean(initResult.providerReference), 'Provider reference was returned');
    assert(initResult.provider === 'NIC_ASIA_SIMULATOR', 'Provider is NIC_ASIA_SIMULATOR');

    // Verify payment with matching quote
    const verification = await service.verifyReservationPayment({
      providerReference: initResult.providerReference,
      expectedQuote: quote,
    });

    assert(verification.isConfirmed, 'Server verified simulated payment against quote');
    assert(verification.verification.status === 'PAID', 'Status is PAID');
    assert(verification.verification.amount.amount === 180, 'Verified amount matches exact 15% reservation fee');
  }

  console.log('--- 5. Testing 14-Day Settlement Engine Rules ---');
  {
    const tourCompletedDate = '2026-06-01T12:00:00Z';
    const eligibilityDate = calculateSettlementEligibilityDate(tourCompletedDate, 14);
    assert(eligibilityDate.toISOString().startsWith('2026-06-15'), 'June 1 tour completes hold on June 15');

    const validSnapshot: BookingFinancialSnapshot = {
      bookingId: 'bkg-101',
      agencyId: 'agency-pokhara',
      bookingStatus: 'COMPLETED',
      paymentStatus: 'PAID',
      balanceMethod: 'INTO_NEPAL_PLATFORM',
      balanceStatus: 'COLLECTED_BY_PLATFORM',
      totalProductValue: createMoney(1000, 'USD'),
      platformFeeAmount: createMoney(150, 'USD'),
      agencyBalanceAmount: createMoney(850, 'USD'),
      platformCollectedFunds: createMoney(850, 'USD'),
      tripDate: '2026-05-20',
      completedAt: '2026-06-01T12:00:00Z',
      hasActiveDispute: false,
      hasActiveRefund: false,
      hasAdministrativeHold: false,
      isAgencyApproved: true,
      isPayoutAccountVerified: true,
      areDocumentsValid: true,
    };

    // Evaluate before 14 days have passed (June 5)
    const earlyCheck = checkSettlementEligibility(validSnapshot, new Date('2026-06-05T00:00:00Z'));
    assert(!earlyCheck.isEligible, 'Settlement ineligible before 14 days have passed');
    assert(earlyCheck.daysRemaining === 11, '11 days remaining on June 5');

    // Evaluate after 14 days have passed (June 16)
    const matureCheck = checkSettlementEligibility(validSnapshot, new Date('2026-06-16T00:00:00Z'));
    assert(matureCheck.isEligible, 'Settlement eligible after 14 days');
    assert(matureCheck.payableAmount.amount === 850, 'Eligible payable amount is 85% ($850)');

    // Direct to agency bypass check
    const directAgencySnapshot: BookingFinancialSnapshot = {
      ...validSnapshot,
      balanceMethod: 'DIRECT_TO_AGENCY',
      balanceStatus: 'CONFIRMED_BY_AGENCY',
      platformCollectedFunds: createMoney(0, 'USD'),
    };
    const directCheck = checkSettlementEligibility(directAgencySnapshot, new Date('2026-06-16T00:00:00Z'));
    assert(directCheck.status === 'NOT_APPLICABLE', 'Settlement is NOT_APPLICABLE when balance is collected direct to agency');
  }

  console.log('--- 6. Testing Immutable Ledger Calculations ---');
  {
    const entries = [
      createLedgerEntry({
        entryType: 'PRODUCT_VALUE',
        amount: 500,
        referenceId: 'bkg-1',
        description: 'Gross product value',
      }),
      createLedgerEntry({
        entryType: 'INTO_NEPAL_REVENUE',
        amount: 75,
        referenceId: 'bkg-1',
        description: '15% Into Nepal platform fee',
      }),
      createLedgerEntry({
        entryType: 'AGENCY_FUNDS_COLLECTED',
        amount: 425,
        referenceId: 'bkg-1',
        description: '85% Agency balance collected into platform escrow',
      }),
      createLedgerEntry({
        entryType: 'PAYOUT_DISBURSEMENT',
        amount: 425,
        referenceId: 'pay-1',
        description: 'Disbursed to agency wire account',
      }),
    ];

    const summary = summarizeLedgerEntries(entries, 'USD');
    assert(summary.platformRevenueTotal.amount === 75, 'Platform revenue is $75.00');
    assert(summary.agencyFundsCollectedTotal.amount === 425, 'Agency funds collected is $425.00');
    assert(summary.agencyDisbursementsTotal.amount === 425, 'Disbursements total $425.00');
    assert(summary.currentAgencyPayable.amount === 0, 'Current payable is $0.00 after disbursement');
  }

  console.log('--- 7. Testing Multi-User Agency Roles & Permissions ---');
  {
    assert(hasAgencyPermission('AGENCY_OWNER', 'agency:manage_bank_details'), 'Agency Owner can manage bank details');
    assert(!hasAgencyPermission('AGENCY_MANAGER', 'agency:manage_bank_details'), 'Agency Manager CANNOT manage bank details');
    assert(hasAgencyPermission('AGENCY_MANAGER', 'agency:create_listings'), 'Agency Manager can create listings');
    assert(!hasAgencyPermission('AGENCY_STAFF', 'agency:create_listings'), 'Agency Staff CANNOT create listings');
    assert(hasAgencyPermission('AGENCY_STAFF', 'agency:view_bookings'), 'Agency Staff can view bookings');
    assert(hasPlatformPermission('FINANCE', 'admin:process_settlement'), 'Finance role can process settlement');
    assert(!hasPlatformPermission('TRAVELER', 'admin:view_all_bookings'), 'Traveler cannot view all bookings');
  }

  console.log('\n🎉 ALL PHASE 1 DOMAIN ARCHITECTURE TESTS PASSED SUCCESSFULLY!');
}

runDomainVerification().catch((err) => {
  console.error('Fatal error running domain verification:', err);
  process.exit(1);
});
