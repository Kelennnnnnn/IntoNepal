import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Info,
  RefreshCw,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { PaymentService, NICAsiaSimulatorProvider } from '@/domain/payment/provider';
import { saveStoredBooking, OTABookingRecord } from '@/data/otaMarketplaceData';
import { useAuthStore } from '@/stores/authStore';

export const BookingPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Traveler Details Form
  const [travelerName, setTravelerName] = useState<string>(user?.name || '');
  const [travelerEmail, setTravelerEmail] = useState<string>(user?.email || '');
  const [travelerPhone, setTravelerPhone] = useState<string>('+1 415 555 0199');
  const [nationality, setNationality] = useState<string>('United States');
  const [passportNumber, setPassportNumber] = useState<string>('US-78945612');
  const [dietaryPreferences, setDietaryPreferences] = useState<string>('Standard / Vegetarian friendly');
  const [emergencyContact, setEmergencyContact] = useState<string>('Sarah Jenkins (+1 415 555 0122)');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Payment Simulator State
  const [paymentTab, setPaymentTab] = useState<'card' | 'mobank' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('active_ota_quote');
      if (stored) {
        setCheckoutData(JSON.parse(stored));
      } else {
        // Fallback default quote for testing
        setCheckoutData({
          quote: {
            id: 'quote-fallback-001',
            listingId: 'ebc-classic-14',
            departureId: 'dep-2026-10-15',
            agencyId: 'agency-sherpa-journeys',
            travelerId: 'traveler-guest',
            participantCount: 2,
            currency: 'USD',
            unitPrice: { amount: 1399, minorUnits: 139900, currency: 'USD' },
            totalProductValue: { amount: 2798, minorUnits: 279800, currency: 'USD' },
            platformFeeRate: 0.15,
            platformFeeAmount: { amount: 419.70, minorUnits: 41970, currency: 'USD' },
            agencyBalanceRate: 0.85,
            agencyBalanceAmount: { amount: 2378.30, minorUnits: 237830, currency: 'USD' },
            remainingBalanceMethod: 'DIRECT_TO_AGENCY',
            cancellationPolicySnapshot: 'Standard Trekking Policy',
            balancePaymentTermsSnapshot: 'Direct to agency on arrival',
            pricingVersion: 1,
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
            createdAt: new Date().toISOString(),
          },
          activityTitle: 'Everest Base Camp & Kala Patthar High-Altitude Trek',
          activityImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
          activityCategory: 'Trekking',
          agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
          agencyLicense: 'NTB-LIC-2041/068',
          agencyPhone: '+977 1 4701889',
          agencyEmail: 'namaste@sherpajourneys.com.np',
        });
      }
    } catch (e) {
      console.warn('Error reading quote:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading || !checkoutData) {
    return (
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#1E4B8F] mx-auto mb-4" />
          <p className="text-sm text-[#5F6B66]">Preparing secure checkout session...</p>
        </div>
      </CustomerLayout>
    );
  }

  const { quote, activityTitle, activityImage, activityCategory, agencyName, agencyLicense, agencyPhone, agencyEmail } = checkoutData;
  const payNow = quote.platformFeeAmount?.amount ?? quote.breakdown?.payNowAmount?.amount ?? 419.70;
  const payLater = quote.agencyBalanceAmount?.amount ?? quote.breakdown?.payLaterAmount?.amount ?? 2378.30;
  const totalValue = quote.totalProductValue?.amount ?? quote.breakdown?.totalProductValue?.amount ?? 2798;

  // Execute Simulated Payment using PaymentService & NICAsiaSimulatorProvider
  const handleSimulatePayment = async (shouldFail = false) => {
    if (!travelerName.trim() || !travelerEmail.trim()) {
      setSimulationError('Please provide lead traveler name and email.');
      return;
    }

    if (!termsAccepted) {
      setSimulationError('Please confirm the 15% reservation fee terms to proceed.');
      return;
    }

    setIsProcessing(true);
    setSimulationError(null);

    try {
      if (shouldFail) {
        await new Promise((res) => setTimeout(res, 800));
        throw new Error('Simulated Bank Gateway Error: Transaction declined by card issuer (Test failure path verified).');
      }

      // 1. Instantiate PaymentService with Simulator
      const paymentService = new PaymentService(new NICAsiaSimulatorProvider());

      // 2. Initiate Payment
      const paymentInit = await paymentService.initiateReservationPayment({
        quote,
        travelerEmail,
        travelerName,
        returnUrl: `${window.location.origin}/booking/confirmation`,
        cancelUrl: `${window.location.origin}/booking/payment`,
      });

      if (!paymentInit.success) {
        throw new Error(paymentInit.error || 'Failed to initiate payment');
      }

      // 3. Verify Server-Side Against Authoritative Quote
      const verification = await paymentService.verifyReservationPayment({
        providerReference: paymentInit.providerReference,
        expectedQuote: quote,
      });

      if (!verification.isConfirmed) {
        throw new Error(`Verification failed: ${verification.error || 'Status not verified'}`);
      }

      // 4. Generate Confirmed Booking Record
      const bookingRef = `IN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: OTABookingRecord = {
        id: `bkg-${Date.now()}`,
        bookingReference: bookingRef,
        quoteId: quote.id || quote.quoteId,
        listingId: quote.listingId,
        listingTitle: activityTitle,
        listingImage: activityImage,
        category: activityCategory,
        agencyId: quote.agencyId,
        agencyName,
        agencyLicense,
        agencyPhone,
        agencyEmail,
        departureDate: quote.departureId ? quote.departureId.replace('dep-', '') : '2026-10-15',
        guestCount: quote.participantCount || quote.guestCount || 2,
        currency: 'USD',
        unitPrice: totalValue / (quote.participantCount || quote.guestCount || 2),
        totalProductValue: totalValue,
        platformFeeRate: 0.15,
        platformFeeAmount: payNow,
        platformFeeStatus: 'PAID',
        platformPaymentReference: paymentInit.providerReference,
        platformPaidAt: new Date().toISOString(),
        agencyBalanceRate: 0.85,
        agencyBalanceAmount: payLater,
        remainingBalanceMethod: quote.remainingBalanceMethod || 'DIRECT_TO_AGENCY',
        agencyBalanceStatus:
          quote.remainingBalanceMethod === 'INTO_NEPAL_PLATFORM'
            ? 'HELD_IN_PLATFORM_ESCROW'
            : 'DUE_ON_ARRIVAL',
        travelerId: user?.id || 'traveler-guest',
        travelerName,
        travelerEmail,
        travelerPhone,
        nationality,
        passportNumber,
        dietaryPreferences,
        emergencyContactName: emergencyContact,
        bookingStatus: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
      };

      // 5. Persist to shared store
      saveStoredBooking(newBooking);

      // 6. Navigate to confirmation voucher
      navigate(`/booking/confirmation?ref=${bookingRef}`);
    } catch (err: any) {
      console.error('Checkout simulation error:', err);
      setSimulationError(err.message || 'Payment simulation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CustomerLayout>
      {/* Top Banner */}
      <div className="bg-[#1A1F1D] text-white py-4 border-b border-[#303834]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/activities/${quote.listingId}`}
              className="text-xs text-[#9DA8A3] hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Tour</span>
            </Link>
            <span className="text-[#5F6B66]">|</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B7A5A]">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded border border-[#D97706]/30">
            DUMMY ENGINE: NIC ASIA SANDBOX ACTIVE
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Traveler Information & Payment Simulator (7-8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Step 1: Traveler Details */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E4DD] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B8F]">
                    Step 1 of 2
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#1A1F1D]">
                    Lead Traveler & Participant Details
                  </h2>
                </div>
                <Users className="w-5 h-5 text-[#5F6B66]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    Full Legal Name (as on Passport) *
                  </label>
                  <input
                    type="text"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    Email Address (for Booking Voucher) *
                  </label>
                  <input
                    type="email"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    Passport / ID Document Number
                  </label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    Emergency Contact (Name & Phone)
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#1A1F1D] mb-1">
                    Dietary Requirements or Special Requests
                  </label>
                  <input
                    type="text"
                    value={dietaryPreferences}
                    onChange={(e) => setDietaryPreferences(e.target.value)}
                    placeholder="Vegetarian, vegan, nut allergy, airport pickup required..."
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: NIC ASIA Payment Gateway Simulator */}
            <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#1E4B8F]/30 shadow-md p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DD] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B7A5A]">
                    Step 2 of 2
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#1A1F1D]">
                    Pay 15% Platform Reservation Fee: ${payNow.toFixed(2)}
                  </h2>
                </div>
                <div className="flex items-center gap-2 bg-[#F4F9F6] border border-[#1B7A5A]/30 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B7A5A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NIC ASIA Sandbox Simulator</span>
                </div>
              </div>

              {/* Commercial Clarity Notice */}
              <div className="p-4 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 text-xs text-[#303834] space-y-1">
                <p className="font-bold text-[#1E4B8F] flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Commercial Model Disclosure:
                </p>
                <p>
                  You are paying the <strong>15% Into Nepal platform reservation fee (${payNow.toFixed(2)})</strong> today to lock your guaranteed departure with {agencyName}.
                </p>
                <p className="text-[#5F6B66]">
                  The remaining <strong>85% balance (${payLater.toFixed(2)})</strong> belongs to the operating agency and is payable {quote.remainingBalanceMethod === 'DIRECT_TO_AGENCY' ? 'directly to the agency upon your arrival in Nepal' : 'via Into Nepal platform escrow'}.
                </p>
              </div>

              {/* Gateway Channel Tabs */}
              <div className="flex border-b border-[#E8E4DD] gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`pb-2.5 flex items-center gap-1.5 transition-colors ${
                    paymentTab === 'card'
                      ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                      : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Visa / Mastercard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('mobank')}
                  className={`pb-2.5 flex items-center gap-1.5 transition-colors ${
                    paymentTab === 'mobank'
                      ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                      : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>NIC ASIA MoBank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('wallet')}
                  className={`pb-2.5 flex items-center gap-1.5 transition-colors ${
                    paymentTab === 'wallet'
                      ? 'border-b-2 border-[#1E4B8F] text-[#1E4B8F]'
                      : 'text-[#5F6B66] hover:text-[#1A1F1D]'
                  }`}
                >
                  <span>eSewa / Khalti Partner</span>
                </button>
              </div>

              {/* Simulated Card Form */}
              {paymentTab === 'card' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1F1D]">NIC ASIA Virtual Terminal (Sandbox)</span>
                      <span className="text-[11px] font-mono text-[#1E4B8F]">TEST CARD PRE-FILLED</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#5F6B66] uppercase font-bold mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="4111 •••• •••• 1111 (NIC ASIA Test Visa)"
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-white font-mono text-[#1A1F1D]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#5F6B66] uppercase font-bold mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="12 / 28"
                          className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-white font-mono text-[#1A1F1D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#5F6B66] uppercase font-bold mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="888"
                          className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-white font-mono text-[#1A1F1D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentTab === 'mobank' && (
                <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] text-xs space-y-2 text-[#5F6B66]">
                  <p className="font-bold text-[#1A1F1D]">NIC ASIA MoBank Direct Link</p>
                  <p>In sandbox simulation mode, clicking below verifies the NPR equivalent of ${payNow.toFixed(2)} directly through the simulated NIC ASIA core banking API.</p>
                </div>
              )}

              {paymentTab === 'wallet' && (
                <div className="p-4 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] text-xs space-y-2 text-[#5F6B66]">
                  <p className="font-bold text-[#1A1F1D]">Local Nepali Digital Wallets</p>
                  <p>In sandbox simulation mode, transaction routes through NIC ASIA clearing switch to eSewa / Khalti.</p>
                </div>
              )}

              {/* Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-[#5F6B66] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I confirm my booking details and understand that <strong>${payNow.toFixed(2)}</strong> is paid to Into Nepal as the 15% platform reservation fee, and <strong>${payLater.toFixed(2)}</strong> will be paid to {agencyName} under the agreed balance terms.
                  </span>
                </label>
              </div>

              {simulationError && (
                <div className="p-3.5 rounded-lg bg-[#FDF5F5] border border-[#C8362E]/30 text-xs text-[#C8362E] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{simulationError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => handleSimulatePayment(false)}
                  disabled={isProcessing}
                  className="w-full py-6 text-sm font-bold bg-[#1B7A5A] hover:bg-[#146045] text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying with NIC ASIA Sandbox...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Simulate 15% Payment (${payNow.toFixed(2)})</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSimulatePayment(true)}
                  disabled={isProcessing}
                  className="w-full py-6 text-xs font-semibold text-[#5F6B66] border-[#E8E4DD] hover:bg-[#FDF5F5] hover:text-[#C8362E] rounded-xl"
                >
                  Simulate Bank Failure (Test Error Recovery)
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar (4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-20 bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] shadow-lg p-5 sm:p-6 space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#1A1F1D] border-b border-[#E8E4DD] pb-3">
                Booking Summary
              </h3>

              {/* Item Card */}
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#1A1F1D] overflow-hidden shrink-0">
                  <img
                    src={activityImage}
                    alt={activityTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1E4B8F]/10 text-[#1E4B8F] rounded">
                    {activityCategory}
                  </span>
                  <h4 className="font-bold text-[#1A1F1D] line-clamp-2 leading-snug">
                    {activityTitle}
                  </h4>
                  <p className="text-[11px] text-[#5F6B66] flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#1E4B8F]" />
                    {agencyName}
                  </p>
                </div>
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#FBF8F3] border border-[#E8E4DD] text-xs">
                <div>
                  <span className="text-[10px] text-[#5F6B66] uppercase block font-bold">Departure</span>
                  <strong className="text-[#1A1F1D]">{quote.departureDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#5F6B66] uppercase block font-bold">Travelers</span>
                  <strong className="text-[#1A1F1D]">{quote.guestCount} Guests</strong>
                </div>
              </div>

              {/* Detailed Financial Calculation */}
              <div className="space-y-2.5 text-xs pt-2">
                <div className="flex justify-between text-[#5F6B66]">
                  <span>Total Tour Product Value</span>
                  <span className="font-semibold text-[#1A1F1D]">
                    ${totalValue.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#5F6B66]">
                  <span>15% Platform Reservation Fee</span>
                  <span className="font-semibold text-[#1A1F1D]">
                    ${payNow.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#5F6B66]">
                  <span>85% Remaining Agency Balance</span>
                  <span className="font-semibold text-[#1A1F1D]">
                    ${payLater.toFixed(2)}
                  </span>
                </div>

                <div className="border-t-2 border-[#E8E4DD] pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-[#1B7A5A] block">
                      DUE TODAY TO CONFIRM
                    </span>
                    <span className="text-[11px] text-[#5F6B66]">
                      15% Into Nepal Fee
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#1B7A5A]">
                    ${payNow.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#FBF8F3] border border-[#E8E4DD] text-[11px] text-[#5F6B66] space-y-1">
                  <div className="flex justify-between font-bold text-[#1A1F1D]">
                    <span>Remaining Balance:</span>
                    <span>${payLater.toFixed(2)}</span>
                  </div>
                  <p>
                    Terms: {quote.remainingBalanceMethod === 'DIRECT_TO_AGENCY'
                      ? 'Pay direct to agency on arrival in Kathmandu/Pokhara'
                      : 'Held by Into Nepal platform escrow until 14 days post-tour'}
                  </p>
                </div>
              </div>

              {/* Trust Features */}
              <div className="pt-3 border-t border-[#E8E4DD] space-y-2 text-[11px] text-[#5F6B66]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A5A]" />
                  <span>Verified Agency NTB Lic #{agencyLicense}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A5A]" />
                  <span>Instant Booking Voucher & QR Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A5A]" />
                  <span>Direct WhatsApp Agency Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
