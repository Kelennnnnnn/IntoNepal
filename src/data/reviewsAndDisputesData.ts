/**
 * Into Nepal — Reviews & Dispute Mediation Engine
 * 
 * Manages post-trek verified traveler reviews (including guide and porter welfare ratings)
 * and escrow cancellation/dispute mediation between travelers, operating agencies, and platform admins.
 */

import { Review } from '@/lib/types';

export interface DetailedTravelerReview extends Review {
  listing_title?: string;
  agency_name?: string;
  guide_rating?: number;
  porter_welfare_rating?: number;
  safety_rating?: number;
  recommend?: boolean;
  trek_completed_date?: string;
}

export interface DisputeMediation {
  id: string;
  bookingId: string;
  bookingReference: string;
  travelerId: string;
  travelerName: string;
  travelerEmail: string;
  agencyId: string;
  agencyName: string;
  listingTitle: string;
  reason: 'RESCHEDULE' | 'ALTITUDE_MEDICAL' | 'FLIGHT_CANCELLATION' | 'OPERATOR_DISPUTE' | 'REFUND_REQUEST';
  description: string;
  preferredOutcome: string;
  status: 'OPEN' | 'IN_MEDIATION' | 'RESOLVED' | 'REFUND_APPROVED';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

const STORAGE_KEY_REVIEWS = 'into_nepal_verified_reviews';
const STORAGE_KEY_DISPUTES = 'into_nepal_dispute_cases';

const INITIAL_REVIEWS: DetailedTravelerReview[] = [
  {
    id: 'rev-001',
    traveler_id: 'traveler-sarah',
    traveler_name: 'Sarah Jenkins (USA)',
    listing_id: 'ebc-classic-14',
    listing_title: 'Everest Base Camp & Kala Patthar High-Altitude Trek',
    agency_id: 'agency-sherpa-journeys',
    agency_name: 'Sherpa Mountain Journeys Pvt. Ltd.',
    booking_id: 'ota-mock-001',
    rating: 5,
    guide_rating: 5,
    porter_welfare_rating: 5,
    safety_rating: 5,
    recommend: true,
    comment:
      'Incredible 14 days to Everest Base Camp. Lead guide Pasang Sherpa kept our blood oxygen levels monitored every single evening. The porters were equipped with proper mountaineering boots and warm jackets. Truly ethical Himalayan travel.',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa'],
    hidden: false,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    trek_completed_date: '2026-08-28',
  },
  {
    id: 'rev-002',
    traveler_id: 'traveler-david',
    traveler_name: 'David Van Der Bilt (Netherlands)',
    listing_id: 'annapurna-circuit-16',
    listing_title: 'Annapurna Circuit & Thorong La Pass High Trek',
    agency_id: 'agency-annapurna-ecotrek',
    agency_name: 'Annapurna Eco-Wilderness Treks',
    booking_id: 'ota-mock-002',
    rating: 4.8,
    guide_rating: 5,
    porter_welfare_rating: 4.9,
    safety_rating: 4.8,
    recommend: true,
    comment:
      'Crossing Thorong La (5,416m) at sunrise was the peak experience of my life. Our agency was punctual, teahouse reservations in Manang were warm and clean, and the 15% deposit booking through Into Nepal gave us full peace of mind.',
    photos: ['https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b'],
    hidden: false,
    created_at: new Date(Date.now() - 86400000 * 19).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 19).toISOString(),
    trek_completed_date: '2026-08-20',
  },
];

const INITIAL_DISPUTES: DisputeMediation[] = [
  {
    id: 'disp-001',
    bookingId: 'ota-mock-003',
    bookingReference: 'INTO-2026-9214',
    travelerId: 'traveler-guest-02',
    travelerName: 'Elena Rostova',
    travelerEmail: 'elena.rostova@example.com',
    agencyId: 'agency-himalayan-ascent',
    agencyName: 'Himalayan Ascent Treks & Expeditions',
    listingTitle: 'Langtang Valley & Gosaikunda Sacred Lakes Trek',
    reason: 'FLIGHT_CANCELLATION',
    description: 'Lukla weather forced a 3-day flight diversion from Kathmandu. Requesting to reschedule the start date by 72 hours without penalty.',
    preferredOutcome: 'Date Reschedule to 2026-11-05',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    adminNotes: 'Contacted operator regarding permit extension with NTB.',
  },
];

export function getStoredReviews(): DetailedTravelerReview[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveReview(review: DetailedTravelerReview): DetailedTravelerReview {
  const current = getStoredReviews();
  const updated = [review, ...current.filter((r) => r.id !== review.id)];
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('into_nepal_review_created', { detail: review }));
  } catch (e) {
    console.error('Failed to save review to storage', e);
  }
  return review;
}

export function getStoredDisputes(): DisputeMediation[] {
  if (typeof window === 'undefined') return INITIAL_DISPUTES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISPUTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DISPUTES, JSON.stringify(INITIAL_DISPUTES));
      return INITIAL_DISPUTES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DISPUTES;
  }
}

export function saveDispute(dispute: DisputeMediation): DisputeMediation {
  const current = getStoredDisputes();
  const updated = [dispute, ...current.filter((d) => d.id !== dispute.id)];
  try {
    localStorage.setItem(STORAGE_KEY_DISPUTES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('into_nepal_dispute_updated', { detail: dispute }));
  } catch (e) {
    console.error('Failed to save dispute to storage', e);
  }
  return dispute;
}

export function updateDisputeStatus(
  id: string,
  status: DisputeMediation['status'],
  adminNotes?: string
): DisputeMediation | null {
  const current = getStoredDisputes();
  const found = current.find((d) => d.id === id);
  if (!found) return null;

  const updated: DisputeMediation = {
    ...found,
    status,
    adminNotes: adminNotes ?? found.adminNotes,
    updatedAt: new Date().toISOString(),
  };

  saveDispute(updated);
  return updated;
}
