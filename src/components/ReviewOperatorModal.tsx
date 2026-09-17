import React, { useState } from 'react';
import {
  Star,
  X,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OTABookingRecord } from '@/data/otaMarketplaceData';
import { saveReview, DetailedTravelerReview } from '@/data/reviewsAndDisputesData';
import { toast } from 'sonner';

interface ReviewOperatorModalProps {
  booking: OTABookingRecord;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewOperatorModal: React.FC<ReviewOperatorModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [guideRating, setGuideRating] = useState<number>(5);
  const [porterRating, setPorterRating] = useState<number>(5);
  const [safetyRating, setSafetyRating] = useState<number>(5);
  const [recommend, setRecommend] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please share a few sentences about your Himalayan experience.');
      return;
    }

    setSubmitting(true);
    try {
      const newReview: DetailedTravelerReview = {
        id: `rev-${Date.now()}`,
        traveler_id: booking.travelerId,
        traveler_name: booking.travelerName,
        listing_id: booking.listingId,
        listing_title: booking.listingTitle,
        agency_id: booking.agencyId,
        agency_name: booking.agencyName,
        booking_id: booking.id,
        rating: overallRating,
        guide_rating: guideRating,
        porter_welfare_rating: porterRating,
        safety_rating: safetyRating,
        recommend,
        comment: comment.trim(),
        photos: [booking.listingImage],
        hidden: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        trek_completed_date: booking.departureDate,
      };

      saveReview(newReview);
      setSubmitted(true);
      toast.success('Thank you! Your verified review has been published.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Failed to submit review: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1A1F1D] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97706]">
              Verified Traveler Review
            </span>
            <h3 className="font-serif text-lg font-bold">Rate Your Himalayan Operator</h3>
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
            <h4 className="font-serif text-xl font-bold text-[#1A1F1D]">Review Submitted!</h4>
            <p className="text-xs text-[#5F6B66] max-w-sm mx-auto leading-relaxed">
              Your feedback reinforces ethical operations, fair porter wages, and authentic mountain stewardship across Nepal.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold"
            >
              Back to My Bookings
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
            {/* Tour & Agency Header Info */}
            <div className="p-3.5 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1A1F1D] shrink-0">
                <img
                  src={booking.listingImage}
                  alt={booking.listingTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-[#1A1F1D] truncate">{booking.listingTitle}</h4>
                <div className="flex items-center gap-1.5 text-[#5F6B66] text-[11px] mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1E4B8F]" />
                  <span className="truncate">{booking.agencyName}</span>
                </div>
              </div>
            </div>

            {/* Overall Star Rating */}
            <div className="space-y-1.5 text-center p-3 rounded-xl bg-[#EFF3FA]/50 border border-[#1E4B8F]/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1F1D] block">
                Overall Experience Rating
              </span>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= overallRating
                          ? 'fill-[#D97706] text-[#D97706]'
                          : 'text-[#E8E4DD]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#1E4B8F]">
                {overallRating === 5
                  ? '5.0 — Outstanding / Highly Recommended'
                  : overallRating === 4
                  ? '4.0 — Very Good'
                  : overallRating === 3
                  ? '3.0 — Satisfactory'
                  : `${overallRating}.0 — Needs Improvement`}
              </span>
            </div>

            {/* Sub-ratings specific to Nepal trekking */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1A1F1D] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#1E4B8F]" />
                  Guide Expertise & High-Altitude Safety
                </span>
                <select
                  value={guideRating}
                  onChange={(e) => setGuideRating(Number(e.target.value))}
                  className="p-1 rounded border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-bold"
                >
                  <option value={5}>5 ★ - Flawless</option>
                  <option value={4}>4 ★ - Strong</option>
                  <option value={3}>3 ★ - Adequate</option>
                  <option value={2}>2 ★ - Disappointing</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1A1F1D] flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#1B7A5A]" />
                  Ethical Porter Welfare & Equipment
                </span>
                <select
                  value={porterRating}
                  onChange={(e) => setPorterRating(Number(e.target.value))}
                  className="p-1 rounded border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-bold"
                >
                  <option value={5}>5 ★ - Ethical & Warm Gear</option>
                  <option value={4}>4 ★ - Good Conditions</option>
                  <option value={3}>3 ★ - Standard</option>
                  <option value={2}>2 ★ - Inadequate</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1A1F1D] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                  Route Briefing & Altitude Acclimatization
                </span>
                <select
                  value={safetyRating}
                  onChange={(e) => setSafetyRating(Number(e.target.value))}
                  className="p-1 rounded border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-bold"
                >
                  <option value={5}>5 ★ - Proactive Care</option>
                  <option value={4}>4 ★ - Monitored Daily</option>
                  <option value={3}>3 ★ - Standard Pace</option>
                </select>
              </div>
            </div>

            {/* Written Review */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1F1D] block">
                Your Review & Mountain Story *
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the pacing, teahouse arrangements, food quality, and views? What advice would you give future trekkers?"
                className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] focus:border-[#1E4B8F] outline-none text-xs leading-relaxed"
                required
              />
            </div>

            {/* Recommend Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={recommend}
                onChange={(e) => setRecommend(e.target.checked)}
                className="rounded border-[#E8E4DD] text-[#1E4B8F]"
              />
              <span className="font-semibold text-[#1A1F1D]">
                I recommend {booking.agencyName} to other adventure travelers.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E4DD]">
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold"
              >
                {submitting ? 'Submitting...' : 'Post Verified Review'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
