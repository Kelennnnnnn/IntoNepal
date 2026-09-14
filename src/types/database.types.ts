export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AgencyStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type ListingCategory =
  | 'Trekking'
  | 'Adventure'
  | 'Cultural'
  | 'Wildlife'
  | 'Rafting'
  | 'Mountaineering'
  | 'Wellness'
  | 'Photography';
export type ListingDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Difficult' | 'Expert';
export type ListingStatus = 'draft' | 'published' | 'hidden';
export type BookingStatus = 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PayoutMethod = 'stripe' | 'manual';
export type ContactStatus = 'new' | 'read' | 'replied';

export interface Database {
  public: {
    Tables: {
      agency_applications: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          registration_number: string;
          address: string;
          city: string;
          contact_person: string;
          phone: string;
          email: string;
          website?: string | null;
          description?: string | null;
          years_operating?: number;
          license_doc_url?: string | null;
          registration_doc_url?: string | null;
          insurance_doc_url?: string | null;
          status?: AgencyStatus;
          rejection_reason?: string | null;
          stripe_account_id?: string | null;
          logo_url?: string | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agency_applications']['Insert']>;
      };
      listings: {
        Row: {
          id: string;
          agency_id: string;
          title: string;
          description: string;
          category: ListingCategory;
          location: string;
          price: number;
          duration: string;
          duration_days: number;
          difficulty: ListingDifficulty;
          max_participants: number;
          images: string[];
          includes: string[];
          excludes: string[];
          itinerary: Json;
          meeting_point: string | null;
          status: ListingStatus;
          featured: boolean;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          title: string;
          description: string;
          category: ListingCategory;
          location: string;
          price: number;
          duration: string;
          difficulty: ListingDifficulty;
          max_participants: number;
          images?: string[];
          includes?: string[];
          excludes?: string[];
          itinerary?: Json;
          meeting_point?: string | null;
          status?: ListingStatus;
          featured?: boolean;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['listings']['Insert']>;
      };
      availability: {
        Row: {
          id: string;
          listing_id: string;
          date: string;
          spots_total: number;
          spots_remaining: number;
          price_override: number | null;
          blocked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          date: string;
          spots_total: number;
          spots_remaining: number;
          price_override?: number | null;
          blocked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['availability']['Insert']>;
      };
      bookings: {
        Row: {
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
          total_amount: number;
          commission_rate: number;
          commission_amount: number;
          net_payout: number;
          status: BookingStatus;
          payment_status: PaymentStatus;
          payment_intent_id: string | null;
          refund_amount: number;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          traveler_id: string;
          agency_id: string;
          listing_id: string;
          availability_id?: string | null;
          trip_date: string;
          guests: number;
          traveler_name: string;
          traveler_email: string;
          traveler_phone?: string | null;
          price_per_person: number;
          total_amount: number;
          commission_rate: number;
          commission_amount: number;
          net_payout: number;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          payment_intent_id?: string | null;
          refund_amount?: number;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      reviews: {
        Row: {
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
        };
        Insert: {
          id?: string;
          traveler_id: string;
          listing_id: string;
          booking_id: string;
          agency_id: string;
          rating: number;
          comment: string;
          photos?: string[];
          hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      payouts: {
        Row: {
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
        };
        Insert: {
          id?: string;
          agency_user_id: string;
          amount: number;
          booking_ids?: string[];
          status?: PayoutStatus;
          stripe_transfer_id?: string | null;
          method?: PayoutMethod;
          notes?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['payouts']['Insert']>;
      };
      agency_bank_details: {
        Row: {
          id: string;
          agency_user_id: string;
          bank_name: string;
          account_holder: string;
          account_number_secret_id: string;
          swift_code: string;
          last_four: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_user_id: string;
          bank_name: string;
          account_holder: string;
          account_number_secret_id: string;
          swift_code: string;
          last_four: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agency_bank_details']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          traveler_id: string;
          agency_id: string;
          booking_id: string | null;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          traveler_id: string;
          agency_id: string;
          booking_id?: string | null;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>;
      };
      notification_preferences: {
        Row: {
          user_id: string;
          new_booking: boolean;
          booking_cancelled: boolean;
          payout_processed: boolean;
          new_message: boolean;
          marketing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          new_booking?: boolean;
          booking_cancelled?: boolean;
          payout_processed?: boolean;
          new_message?: boolean;
          marketing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notification_preferences']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: ContactStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: ContactStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
      audit_log: {
        Row: {
          id: string;
          actor_user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          details?: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['audit_log']['Insert']>;
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['platform_settings']['Insert']>;
      };
      webhook_events: {
        Row: {
          event_id: string;
          event_type: string;
          processed_at: string;
        };
        Insert: {
          event_id: string;
          event_type: string;
          processed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['webhook_events']['Insert']>;
      };
    };
    Functions: {
      claim_availability_spots: {
        Args: {
          p_availability_id: string;
          p_guests: number;
        };
        Returns: boolean;
      };
      release_availability_spots: {
        Args: {
          p_availability_id: string;
          p_guests: number;
        };
        Returns: void;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_verified_agency: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
    };
  };
}
