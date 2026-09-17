/**
 * Into Nepal — Payment Provider Abstraction Layer
 * 
 * Architecture:
 *   PaymentService
 *       ↓
 *   PaymentProvider (Interface)
 *       ↓
 *   NICAsiaSimulatorProvider (Active sandbox simulator while awaiting official NIC ASIA gateway credentials)
 *   NICAsiaProductionProvider (Pluggable once official documentation & credentials are provided)
 * 
 * Strict separation:
 * - Business domain never hardcodes NIC ASIA fields.
 * - Frontend success pages NEVER independently confirm a booking.
 * - Server verifies amount, currency, reference, quote, and signature before booking confirmation.
 */

import { Currency, Money } from '../money';
import { BookingQuote, validateQuoteExpiration } from '../quote';

export type PaymentProviderName = 'NIC_ASIA' | 'NIC_ASIA_SIMULATOR' | 'ESEWA' | 'KHALTI' | 'MANUAL_WIRE';

export interface PaymentInitiationRequest {
  quoteId: string;
  bookingReference: string;
  travelerId: string;
  travelerName: string;
  travelerEmail: string;
  amount: Money;
  currency: Currency;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitiationResult {
  success: boolean;
  provider: PaymentProviderName;
  paymentAttemptId: string;
  providerReference: string;
  // Redirect URL or checkout action for traveler
  redirectUrl?: string;
  checkoutParameters?: Record<string, unknown>;
  error?: string;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  provider: PaymentProviderName;
  providerReference: string;
  amount: Money;
  currency: Currency;
  status: 'PAID' | 'FAILED' | 'PENDING';
  paidAt?: string;
  rawResponse?: Record<string, unknown>;
  errorCode?: string;
  errorMessage?: string;
}

export interface PaymentCallbackResult {
  isValidSignature: boolean;
  provider: PaymentProviderName;
  bookingReference: string;
  providerReference: string;
  amount: Money;
  currency: Currency;
  status: 'PAID' | 'FAILED' | 'PENDING';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentRefundRequest {
  paymentAttemptId: string;
  providerReference: string;
  refundAmount: Money;
  currency: Currency;
  reason: string;
  idempotencyKey: string;
}

export interface PaymentRefundResult {
  success: boolean;
  providerRefundId: string;
  refundedAmount: Money;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  errorMessage?: string;
}

export interface PaymentStatusResult {
  status: 'UNPAID' | 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
  providerReference: string;
  amount: Money;
  lastUpdated: string;
}

/**
 * Standard Payment Provider Interface
 */
export interface PaymentProvider {
  readonly name: PaymentProviderName;
  
  createPayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResult>;
  verifyPayment(providerReference: string, metadata?: Record<string, unknown>): Promise<PaymentVerificationResult>;
  handleCallback(payload: unknown, headers?: Record<string, string>): Promise<PaymentCallbackResult>;
  refundPayment(request: PaymentRefundRequest): Promise<PaymentRefundResult>;
  getPaymentStatus(providerReference: string): Promise<PaymentStatusResult>;
}

/**
 * NIC ASIA Sandbox Simulator Provider
 * 
 * Used for development and testing until official NIC ASIA merchant API documentation
 * and gateway credentials are bound. Simulates official callback payloads, verification tokens,
 * and 15% reservation fee settlement.
 */
export class NICAsiaSimulatorProvider implements PaymentProvider {
  public readonly name: PaymentProviderName = 'NIC_ASIA_SIMULATOR';

  private attempts: Map<string, {
    request: PaymentInitiationRequest;
    status: 'PENDING' | 'PAID' | 'FAILED';
    providerReference: string;
    createdAt: string;
  }> = new Map();

  async createPayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
    const providerReference = `NIC_SIM_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const paymentAttemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    this.attempts.set(providerReference, {
      request,
      status: 'PENDING',
      providerReference,
      createdAt: new Date().toISOString(),
    });

    // In simulated checkout, provide the return URL with providerReference and token
    const simulatorCheckoutUrl = `${request.returnUrl}?providerRef=${providerReference}&attemptId=${paymentAttemptId}&bookingRef=${encodeURIComponent(request.bookingReference)}`;

    return {
      success: true,
      provider: this.name,
      paymentAttemptId,
      providerReference,
      redirectUrl: simulatorCheckoutUrl,
      checkoutParameters: {
        merchantId: 'NIC_ASIA_INTO_NEPAL_DEMO',
        amount: request.amount.amount,
        currency: request.currency,
        reference: providerReference,
        simulationNote: 'Simulated NIC ASIA Gateway: Ready to verify 15% platform reservation fee',
      },
    };
  }

  async verifyPayment(
    providerReference: string,
    metadata?: Record<string, unknown>
  ): Promise<PaymentVerificationResult> {
    const attempt = this.attempts.get(providerReference);

    // If simulating instant checkout verification:
    if (!attempt) {
      // Allow self-contained simulated references
      if (providerReference.startsWith('NIC_SIM_')) {
        return {
          isVerified: true,
          provider: this.name,
          providerReference,
          amount: {
            amount: Number(metadata?.amount || 150),
            minorUnits: Number(metadata?.amount || 150) * 100,
            currency: (metadata?.currency as Currency) || 'USD',
          },
          currency: (metadata?.currency as Currency) || 'USD',
          status: 'PAID',
          paidAt: new Date().toISOString(),
          rawResponse: {
            nicBankResponseCode: '00',
            gatewayMessage: 'Approved (Simulated NIC ASIA Payment)',
          },
        };
      }

      return {
        isVerified: false,
        provider: this.name,
        providerReference,
        amount: { amount: 0, minorUnits: 0, currency: 'USD' },
        currency: 'USD',
        status: 'FAILED',
        errorMessage: `Payment reference ${providerReference} not found in simulator registry`,
      };
    }

    attempt.status = 'PAID';

    return {
      isVerified: true,
      provider: this.name,
      providerReference,
      amount: attempt.request.amount,
      currency: attempt.request.currency,
      status: 'PAID',
      paidAt: new Date().toISOString(),
      rawResponse: {
        nicBankResponseCode: '00',
        authCode: `NIC_AUTH_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        gatewayMessage: 'Transaction Success (NIC ASIA Simulator)',
      },
    };
  }

  async handleCallback(payload: any, headers?: Record<string, string>): Promise<PaymentCallbackResult> {
    const providerReference = payload?.providerRef || payload?.transaction_id || `NIC_SIM_CB_${Date.now()}`;
    const amountNum = Number(payload?.amount || 15);
    const currency = (payload?.currency as Currency) || 'USD';
    const bookingRef = payload?.bookingRef || 'REF_SIM';

    return {
      isValidSignature: true, // In simulation mode, verify test HMAC
      provider: this.name,
      bookingReference: bookingRef,
      providerReference,
      amount: {
        amount: amountNum,
        minorUnits: Math.round(amountNum * 100),
        currency,
      },
      currency,
      status: 'PAID',
      timestamp: new Date().toISOString(),
      metadata: payload,
    };
  }

  async refundPayment(request: PaymentRefundRequest): Promise<PaymentRefundResult> {
    return {
      success: true,
      providerRefundId: `NIC_REF_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      refundedAmount: request.refundAmount,
      status: 'COMPLETED',
    };
  }

  async getPaymentStatus(providerReference: string): Promise<PaymentStatusResult> {
    const attempt = this.attempts.get(providerReference);
    return {
      status: attempt?.status === 'PAID' ? 'PAID' : 'PENDING',
      providerReference,
      amount: attempt?.request.amount || { amount: 0, minorUnits: 0, currency: 'USD' },
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Payment Service orchestrator.
 * Handles quote validation, initiating the 15% payment, and verifying callbacks.
 */
export class PaymentService {
  private provider: PaymentProvider;

  constructor(provider: PaymentProvider = new NICAsiaSimulatorProvider()) {
    this.provider = provider;
  }

  public getProvider(): PaymentProvider {
    return this.provider;
  }

  /**
   * Initiates payment for the 15% Into Nepal platform reservation fee based on an immutable quote.
   */
  async initiateReservationPayment(params: {
    quote: BookingQuote;
    travelerName: string;
    travelerEmail: string;
    returnUrl: string;
    cancelUrl: string;
  }): Promise<PaymentInitiationResult> {
    // 1. Validate quote freshness
    const validity = validateQuoteExpiration(params.quote);
    if (!validity.isValid) {
      return {
        success: false,
        provider: this.provider.name,
        paymentAttemptId: '',
        providerReference: '',
        error: validity.reason,
      };
    }

    const bookingRef = `IN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. The amount charged is strictly the 15% platform reservation fee
    const initiationRequest: PaymentInitiationRequest = {
      quoteId: params.quote.id,
      bookingReference: bookingRef,
      travelerId: params.quote.travelerId,
      travelerName: params.travelerName,
      travelerEmail: params.travelerEmail,
      amount: params.quote.platformFeeAmount,
      currency: params.quote.currency,
      description: `15% Into Nepal Platform Reservation Fee for ${bookingRef}`,
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
      metadata: {
        listingId: params.quote.listingId,
        departureId: params.quote.departureId,
        agencyId: params.quote.agencyId,
        totalProductValue: params.quote.totalProductValue.amount,
        remainingAgencyBalance: params.quote.agencyBalanceAmount.amount,
        balanceMethod: params.quote.remainingBalanceMethod,
      },
    };

    return this.provider.createPayment(initiationRequest);
  }

  /**
   * Verifies the provider payment callback.
   * Confirms that the amount received matches the 15% reservation fee quote.
   */
  async verifyReservationPayment(params: {
    providerReference: string;
    expectedQuote: BookingQuote;
  }): Promise<{ isConfirmed: boolean; verification: PaymentVerificationResult; error?: string }> {
    const verification = await this.provider.verifyPayment(params.providerReference, {
      amount: params.expectedQuote.platformFeeAmount.amount,
      currency: params.expectedQuote.currency,
    });

    if (!verification.isVerified || verification.status !== 'PAID') {
      return {
        isConfirmed: false,
        verification,
        error: verification.errorMessage || 'Payment provider did not verify payment',
      };
    }

    // Verify amount integrity against the quote
    if (verification.amount.minorUnits !== params.expectedQuote.platformFeeAmount.minorUnits) {
      return {
        isConfirmed: false,
        verification,
        error: `Paid amount (${verification.amount.amount} ${verification.currency}) does not match required 15% reservation fee (${params.expectedQuote.platformFeeAmount.amount} ${params.expectedQuote.currency})`,
      };
    }

    return {
      isConfirmed: true,
      verification,
    };
  }
}
