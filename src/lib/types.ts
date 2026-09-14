export type Role = 'user' | 'agency' | 'admin';

export type Difficulty =
  | 'Easy'
  | 'Moderate'
  | 'Challenging'
  | 'Difficult'
  | 'Expert';

export type Category =
  | 'Trekking'
  | 'Adventure'
  | 'Cultural'
  | 'Wildlife'
  | 'Rafting'
  | 'Mountaineering'
  | 'Wellness'
  | 'Photography';

export type AgencyStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type ListingStatus = 'draft' | 'published' | 'hidden';
export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PayoutMethod = 'stripe' | 'manual';
export type ContactStatus = 'new' | 'read' | 'replied';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role: Role;
}

export interface Agency {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  address: string;
  city: string;
  contact_person: string;
  phone: string;
  email: string;
  website: string | null;
  description: string | null;
  years_operating: number;
  license_doc_url: string | null;
  registration_doc_url: string | null;
  insurance_doc_url: string | null;
  status: AgencyStatus;
  rejection_reason: string | null;
  stripe_account_id: string | null;
  logo_url: string | null;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export type AgencyApplication = Agency;

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude?: number;
  distance_km?: number;
  hiking_hours?: number;
  accommodation?: string;
  meals?: string;
}

export interface Listing {
  id: string;
  agency_id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  price: number;
  duration: string;
  duration_days: number | null; // Nullable
  difficulty: Difficulty;
  max_participants: number;
  images: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[] | Record<string, unknown> | unknown[];
  meeting_point: string | null;
  status: ListingStatus;
  featured: boolean;
  rating: number; // NOT NULL, default 0
  review_count: number; // NOT NULL, default 0
  created_at: string;
  updated_at: string;
  agency?: Agency | null; // Optional — only exists when joined, can return nothing
}

export interface Availability {
  id: string;
  listing_id: string;
  date: string;
  spots_total: number;
  spots_remaining: number;
  price_override: number | null;
  blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  traveler_id: string;
  agency_id: string;
  listing_id: string;
  availability_id: string | null;
  trip_date: string;
  guests: number;
  traveler_name: string;
  traveler_email: string;
  traveler_phone: string | null;
  price_per_person: number;
  total_amount: number; // NOT NULL
  commission_rate: number; // NOT NULL
  commission_amount: number; // NOT NULL
  net_payout: number; // NOT NULL
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_intent_id: string | null;
  refund_amount: number;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  listing?: Listing | null;
  agency?: Agency | null;
}

export interface Review {
  id: string;
  traveler_id: string;
  listing_id: string;
  booking_id: string;
  agency_id: string;
  rating: number;
  comment: string;
  photos: string[];
  hidden: boolean;
  created_at: string;
  updated_at: string;
  traveler_name?: string;
}

export interface Payout {
  id: string;
  agency_user_id: string;
  amount: number;
  booking_ids: string[];
  status: PayoutStatus;
  stripe_transfer_id: string | null;
  method: PayoutMethod;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface AgencyBankDetails {
  id: string;
  agency_user_id: string;
  bank_name: string;
  account_holder: string;
  account_number_secret_id: string;
  swift_code: string;
  last_four: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  traveler_id: string;
  agency_id: string;
  booking_id: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing | null;
}

export interface NotificationPreferences {
  user_id: string;
  new_booking: boolean;
  booking_cancelled: boolean;
  payout_processed: boolean;
  new_message: boolean;
  marketing: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface PlatformSettings {
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
}
