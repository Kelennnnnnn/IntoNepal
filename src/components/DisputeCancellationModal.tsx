import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OTABookingRecord } from '@/data/otaMarketplaceData';
import { saveDispute, DisputeMediation } from '@/data/reviewsAndDisputesData';
import { toast } from 'sonner';

interface DisputeCancellationModalProps {
  booking: OTABookingRecord;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DisputeCancellationModal: React.FC<DisputeCancellationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<DisputeMediation['reason']>('FLIGHT_CANCELLATION');
  const [description, setDescription] = useState<string>('');
  const [preferredOutcome, setPreferredOutcome] = useState<string>('Reschedule departure date without penalty');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [createdCaseId, setCreatedCaseId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please describe the situation so our mediation team can coordinate with the agency.');
      return;
    }

    setSubmitting(true);
    try {
      const caseId = `disp-${Date.now().toString().slice(-6)}`;
      const newDispute: DisputeMediation = {
        id: caseId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        travelerId: booking.travelerId,
        travelerName: booking.travelerName,
        travelerEmail: booking.travelerEmail,
        agencyId: booking.agencyId,
        agencyName: booking.agencyName,
        listingTitle: booking.listingTitle,
        reason,
        description: description.trim(),
        preferredOutcome: preferredOutcome.trim(),
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: 'Case automatically registered in Into Nepal Mediation Console.',
      };

      saveDispute(newDispute);
      setCreatedCaseId(caseId);
      setSubmitted(true);
      toast.success('Dispute / Reschedule request submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Failed to register request: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1A1F1D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97706]">
                Escrow & Mediation Service
              </span>
              <h3 className="font-serif text-lg font-bold">Request Reschedule or Cancellation</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9DA8A3] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#1A1F1D]">
              Case #{createdCaseId.toUpperCase()} Opened
            </h4>
            <p className="text-xs text-[#5F6B66] max-w-sm mx-auto leading-relaxed">
              Your request has been routed to <strong>{booking.agencyName}</strong> and the Into Nepal Trust & Safety team. Under the platform policy, remaining balances are safeguarded until mediation concludes.
            </p>
            <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E8E4DD] text-xs text-left space-y-1">
              <div className="flex justify-between text-[#5F6B66]">
                <span>Booking Reference:</span>
                <strong className="text-[#1A1F1D] font-mono">{booking.bookingReference}</strong>
              </div>
              <div className="flex justify-between text-[#5F6B66]">
                <span>Expected Response Window:</span>
                <strong className="text-[#059669]">Within 24 Hours</strong>
              </div>
            </div>
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
            {/* Context Summary */}
            <div className="p-3.5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">
                  Subject Booking
                </span>
                <p className="font-serif font-bold text-sm text-[#1A1F1D]">{booking.listingTitle}</p>
                <p className="text-[11px] text-[#5F6B66] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-[#D97706]" />
                  <span>Departure: {booking.departureDate}</span>
                  <span>•</span>
                  <span>Ref: {booking.bookingReference}</span>
                </p>
              </div>
              <span className="text-xs font-bold text-[#1E4B8F] bg-[#EFF3FA] px-2.5 py-1 rounded">
                ${booking.platformFeeAmount.toFixed(2)} Paid
              </span>
            </div>

            {/* Reason Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1F1D] block">
                Primary Cause / Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as DisputeMediation['reason'])}
                className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-semibold text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
              >
                <option value="FLIGHT_CANCELLATION">
                  Lukla / Pokhara Mountain Flight Weather Diversion
                </option>
                <option value="RESCHEDULE">
                  Traveler Schedule / Visa / International Connection Delay
                </option>
                <option value="ALTITUDE_MEDICAL">
                  Medical / Acute Mountain Sickness (AMS) / Fitness Concern
                </option>
                <option value="OPERATOR_DISPUTE">
                  Service Dispute with Operating Agency
                </option>
                <option value="REFUND_REQUEST">
                  Trip Cancellation & Deposit Refund Request
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1F1D] block">
                Circumstances & Details *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the timing, flight numbers, or medical advice so the agency can adjust permits and teahouse arrangements..."
                className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] focus:border-[#1E4B8F] outline-none text-xs leading-relaxed"
                required
              />
            </div>

            {/* Preferred Outcome */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1F1D] block">
                Preferred Resolution *
              </label>
              <input
                type="text"
                value={preferredOutcome}
                onChange={(e) => setPreferredOutcome(e.target.value)}
                placeholder="e.g., Postpone start by 48 hours, switch to Annapurna route, or refund 15% deposit"
                className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] focus:border-[#1E4B8F] outline-none text-xs"
                required
              />
            </div>

            {/* Escrow Policy Notice */}
            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-start gap-2 text-[11px] text-[#065F46] leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#059669] mt-0.5" />
              <span>
                <strong>Into Nepal Escrow Guarantee:</strong> Because 85% of your tour balance is either held in platform escrow or due directly upon arrival, your financial exposure is strictly protected while our local liaison facilitates mediation.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E4DD]">
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#1E4B8F] hover:bg-[#15386C] text-white font-bold"
              >
                {submitting ? 'Submitting...' : 'Submit Mediation Request'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
