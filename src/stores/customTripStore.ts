import { create } from 'zustand';

export type RegionKey = 'Everest' | 'Annapurna' | 'Manaslu' | 'Langtang' | 'Mustang' | 'Wilderness';

export type AccommodationTier = 'standard_teahouse' | 'comfort_lodges' | 'luxury_mountain_lodges';

export type GuideTier = 'certified_english' | 'senior_sherpa' | 'multilingual_guide';

export type PorterRatio = '1_porter_2_trekkers' | '1_porter_1_trekker' | 'guide_only';

export interface CustomAddOns {
  helicopterDescent: boolean;
  oxygenCylinderSafetyKit: boolean;
  satelliteCommunicator: boolean;
  gearRentalPackage: boolean;
  kathmanduHeritageDay: boolean;
  porterTipFund: boolean;
}

export interface CustomQuoteProposal {
  id: string;
  tripRequestId: string;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  leadGuideName: string;
  leadGuideLicense: string;
  pricePerPersonUSD: number;
  totalPriceUSD: number;
  deposit15USD: number;
  includedHighlights: string[];
  itinerarySummary: string;
  validUntil: string;
  agencyNote: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface CustomTripRequest {
  id: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelerCountry: string;
  region: RegionKey;
  targetTrek: string;
  routePacing: 'Classic Standard' | 'Conservative (Extra Acclimatization)' | 'High Pass Circuit' | 'Expedited Alpine';
  partySize: number;
  departureMonth: string;
  tripDurationDays: number;
  accommodationTier: AccommodationTier;
  guideTier: GuideTier;
  porterRatio: PorterRatio;
  addOns: CustomAddOns;
  estimatedTotalUSD: number;
  estimatedDepositUSD: number;
  specialRequests: string;
  status: 'submitted' | 'quotes_received' | 'booked';
  quotes: CustomQuoteProposal[];
  createdAt: string;
}

interface CustomTripStore {
  requests: CustomTripRequest[];
  activeDraft: Partial<CustomTripRequest>;
  updateDraft: (fields: Partial<CustomTripRequest>) => void;
  resetDraft: () => void;
  submitDraft: () => CustomTripRequest;
  addQuoteToRequest: (requestId: string, quote: Omit<CustomQuoteProposal, 'id' | 'createdAt' | 'status'>) => CustomQuoteProposal;
  acceptQuote: (requestId: string, quoteId: string) => void;
  getRequestById: (id: string) => CustomTripRequest | undefined;
}

const STORAGE_KEY = 'into_nepal_custom_trip_requests_v1';

// Initial pre-populated custom trip requests for demonstration
const INITIAL_REQUESTS: CustomTripRequest[] = [
  {
    id: 'REQ-2026-8812',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah.j@example.com',
    travelerPhone: '+1 415 555 0199',
    travelerCountry: 'United States 🇺🇸',
    region: 'Everest',
    targetTrek: 'Everest Base Camp & Gokyo Lakes via Cho La Pass',
    routePacing: 'Conservative (Extra Acclimatization)',
    partySize: 2,
    departureMonth: 'October 2026',
    tripDurationDays: 16,
    accommodationTier: 'comfort_lodges',
    guideTier: 'senior_sherpa',
    porterRatio: '1_porter_2_trekkers',
    addOns: {
      helicopterDescent: true,
      oxygenCylinderSafetyKit: true,
      satelliteCommunicator: true,
      gearRentalPackage: false,
      kathmanduHeritageDay: true,
      porterTipFund: true,
    },
    estimatedTotalUSD: 4180,
    estimatedDepositUSD: 627,
    specialRequests: 'One vegetarian trekker. Requesting private helicopter return from Gorak Shep to Lukla to avoid downhill knee strain.',
    status: 'quotes_received',
    createdAt: '2026-09-15T14:30:00Z',
    quotes: [
      {
        id: 'QUO-2026-104',
        tripRequestId: 'REQ-2026-8812',
        agencyId: 'agency-sherpa-journeys',
        agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
        agencyLogo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=160&auto=format&fit=crop',
        leadGuideName: 'Pasang Dawa Sherpa (3x Everest Summiteer)',
        leadGuideLicense: 'NMA / IFMGA Lic #3902',
        pricePerPersonUSD: 2090,
        totalPriceUSD: 4180,
        deposit15USD: 627,
        includedHighlights: [
          'Chartered B3e Helicopter flight from Gorak Shep directly to Lukla/Kathmandu',
          'En-suite heated rooms with electric blankets at Namche and Dingboche comfort lodges',
          'Medical Grade O2 cylinder + pulse oximeter monitored 2x daily',
          'Garmin inReach Satellite Communicator for family tracking',
          'All Sagarmatha & Khumbu permits + direct government royalties',
        ],
        itinerarySummary: '16 Days: Kathmandu → Lukla → Namche (2 nights) → Gokyo Lakes → Cho La Pass → EBC & Kala Patthar → Heli descent',
        validUntil: 'Oct 01, 2026',
        agencyNote: 'Namaste Sarah! We operate our own base in Namche Bazaar. Your guide Pasang has safely led 40+ Cho La crossings. The 15% escrow deposit secures your private helicopter flight window.',
        status: 'pending',
        createdAt: '2026-09-15T18:00:00Z',
      },
    ],
  },
  {
    id: 'REQ-2026-9420',
    travelerName: 'Marcus Lindqvist',
    travelerEmail: 'marcus.nordic@example.se',
    travelerPhone: '+46 70 123 4567',
    travelerCountry: 'Sweden 🇸🇪',
    region: 'Manaslu',
    targetTrek: 'Manaslu Circuit & Tsum Valley Wilderness',
    routePacing: 'Classic Standard',
    partySize: 4,
    departureMonth: 'November 2026',
    tripDurationDays: 18,
    accommodationTier: 'standard_teahouse',
    guideTier: 'certified_english',
    porterRatio: '1_porter_2_trekkers',
    addOns: {
      helicopterDescent: false,
      oxygenCylinderSafetyKit: true,
      satelliteCommunicator: true,
      gearRentalPackage: true,
      kathmanduHeritageDay: false,
      porterTipFund: true,
    },
    estimatedTotalUSD: 5760,
    estimatedDepositUSD: 864,
    specialRequests: 'Photographers group interested in ancient Tibetan monasteries and winter high passes.',
    status: 'submitted',
    createdAt: '2026-09-16T11:20:00Z',
    quotes: [],
  },
];

export const useCustomTripStore = create<CustomTripStore>((set, get) => {
  const loadSaved = (): CustomTripRequest[] => {
    if (typeof window === 'undefined') return INITIAL_REQUESTS;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  };

  const saveToStorage = (reqs: CustomTripRequest[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reqs));
    } catch {
      // ignore
    }
  };

  return {
    requests: loadSaved(),
    activeDraft: {
      region: 'Everest',
      targetTrek: 'Everest Base Camp & Kala Patthar',
      routePacing: 'Classic Standard',
      partySize: 2,
      departureMonth: 'October 2026',
      tripDurationDays: 14,
      accommodationTier: 'standard_teahouse',
      guideTier: 'certified_english',
      porterRatio: '1_porter_2_trekkers',
      addOns: {
        helicopterDescent: false,
        oxygenCylinderSafetyKit: true,
        satelliteCommunicator: true,
        gearRentalPackage: false,
        kathmanduHeritageDay: false,
        porterTipFund: true,
      },
      specialRequests: '',
    },

    updateDraft: (fields) => {
      set((state) => ({
        activeDraft: { ...state.activeDraft, ...fields },
      }));
    },

    resetDraft: () => {
      set({
        activeDraft: {
          region: 'Everest',
          targetTrek: 'Everest Base Camp & Kala Patthar',
          routePacing: 'Classic Standard',
          partySize: 2,
          departureMonth: 'October 2026',
          tripDurationDays: 14,
          accommodationTier: 'standard_teahouse',
          guideTier: 'certified_english',
          porterRatio: '1_porter_2_trekkers',
          addOns: {
            helicopterDescent: false,
            oxygenCylinderSafetyKit: true,
            satelliteCommunicator: true,
            gearRentalPackage: false,
            kathmanduHeritageDay: false,
            porterTipFund: true,
          },
          specialRequests: '',
        },
      });
    },

    submitDraft: () => {
      const draft = get().activeDraft;
      const newId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Calculate estimate
      const partySize = draft.partySize || 2;
      const days = draft.tripDurationDays || 14;

      let baseDailyPerPerson = 75; // Standard teahouse, food, guide share
      if (draft.accommodationTier === 'comfort_lodges') baseDailyPerPerson += 45;
      if (draft.accommodationTier === 'luxury_mountain_lodges') baseDailyPerPerson += 120;

      if (draft.guideTier === 'senior_sherpa') baseDailyPerPerson += 15;
      if (draft.guideTier === 'multilingual_guide') baseDailyPerPerson += 20;

      if (draft.porterRatio === '1_porter_1_trekker') baseDailyPerPerson += 18;

      let addOnTotalGroup = 0;
      if (draft.addOns?.helicopterDescent) addOnTotalGroup += 1100 * (partySize > 1 ? 2 : 1);
      if (draft.addOns?.oxygenCylinderSafetyKit) addOnTotalGroup += 180;
      if (draft.addOns?.satelliteCommunicator) addOnTotalGroup += 120;
      if (draft.addOns?.gearRentalPackage) addOnTotalGroup += 75 * partySize;
      if (draft.addOns?.kathmanduHeritageDay) addOnTotalGroup += 120 * partySize;
      if (draft.addOns?.porterTipFund) addOnTotalGroup += 50 * partySize;

      const totalGroupUSD = Math.round(baseDailyPerPerson * days * partySize + addOnTotalGroup);
      const depositUSD = Math.round(totalGroupUSD * 0.15);

      const newRequest: CustomTripRequest = {
        id: newId,
        travelerName: draft.travelerName || 'Guest Traveler',
        travelerEmail: draft.travelerEmail || 'traveler@example.com',
        travelerPhone: draft.travelerPhone || '+1 415 555 0199',
        travelerCountry: draft.travelerCountry || 'International',
        region: draft.region || 'Everest',
        targetTrek: draft.targetTrek || 'Custom Himalayan Route',
        routePacing: draft.routePacing || 'Classic Standard',
        partySize,
        departureMonth: draft.departureMonth || 'October 2026',
        tripDurationDays: days,
        accommodationTier: draft.accommodationTier || 'standard_teahouse',
        guideTier: draft.guideTier || 'certified_english',
        porterRatio: draft.porterRatio || '1_porter_2_trekkers',
        addOns: draft.addOns || {
          helicopterDescent: false,
          oxygenCylinderSafetyKit: true,
          satelliteCommunicator: true,
          gearRentalPackage: false,
          kathmanduHeritageDay: false,
          porterTipFund: true,
        },
        estimatedTotalUSD: totalGroupUSD,
        estimatedDepositUSD: depositUSD,
        specialRequests: draft.specialRequests || '',
        status: 'submitted',
        quotes: [],
        createdAt: new Date().toISOString(),
      };

      const updated = [newRequest, ...get().requests];
      set({ requests: updated });
      saveToStorage(updated);
      return newRequest;
    },

    addQuoteToRequest: (requestId, quoteData) => {
      const quoteId = `QUO-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newQuote: CustomQuoteProposal = {
        ...quoteData,
        id: quoteId,
        tripRequestId: requestId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const updated = get().requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'quotes_received' as const,
            quotes: [newQuote, ...req.quotes],
          };
        }
        return req;
      });

      set({ requests: updated });
      saveToStorage(updated);
      return newQuote;
    },

    acceptQuote: (requestId, quoteId) => {
      const updated = get().requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'booked' as const,
            quotes: req.quotes.map((q) =>
              q.id === quoteId ? { ...q, status: 'accepted' as const } : q
            ),
          };
        }
        return req;
      });

      set({ requests: updated });
      saveToStorage(updated);
    },

    getRequestById: (id) => {
      return get().requests.find((r) => r.id === id);
    },
  };
});
