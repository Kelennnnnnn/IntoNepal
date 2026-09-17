import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ArrowLeft,
  Send,
  Building2,
  Calendar,
  ShieldCheck,
  Search,
  Mountain,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  Plane,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { VERIFIED_AGENCIES, ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';
import { useCustomTripStore, CustomQuoteProposal } from '@/stores/customTripStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useAuthStore } from '@/stores/authStore';

interface TravelerMessage {
  id: string;
  sender: 'traveler' | 'agency';
  text: string;
  timestamp: string;
  customQuote?: CustomQuoteProposal;
}

interface InquiryThread {
  id: string;
  agencyName: string;
  agencyLogo?: string;
  tourTitle: string;
  tourId: string;
  tourPrice: number;
  dates: string;
  isCustomRequest?: boolean;
  requestId?: string;
  status: 'active' | 'booking_ready' | 'quote_received';
  lastMessage: string;
  lastTimestamp: string;
  messages: TravelerMessage[];
}

export const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { formatPrice, currency } = useCurrencyStore();
  const { requests, acceptQuote } = useCustomTripStore();

  // Standard pre-populated inquiry threads
  const [threads, setThreads] = useState<InquiryThread[]>([
    // First thread: from Custom Trip Store (REQ-2026-8812) with formal quote
    {
      id: 'th-custom-8812',
      agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
      agencyLogo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=160&auto=format&fit=crop',
      tourTitle: 'Custom Private: Everest Base Camp & Cho La Pass + Helicopter Descent',
      tourId: 'custom-req-8812',
      tourPrice: 4180,
      dates: 'October 2026 (16 Days)',
      isCustomRequest: true,
      requestId: 'REQ-2026-8812',
      status: 'quote_received',
      lastMessage: 'Official Binding Quote #QUO-2026-104 submitted: $4,180 total with B3e Helicopter flight from Gorak Shep.',
      lastTimestamp: 'Yesterday',
      messages: [
        {
          id: 'tm-c1',
          sender: 'traveler',
          text: 'Hello! We submitted a custom private expedition for 2 trekkers requesting conservative acclimatization via Gokyo Lakes, Cho La Pass, and private helicopter return from Gorak Shep.',
          timestamp: 'Yesterday, 2:30 PM',
        },
        {
          id: 'tm-c2',
          sender: 'agency',
          text: 'Tashi Delek Sarah! We have reviewed your route brief. Our base in Namche Bazaar has scheduled senior IFMGA climbing guide Pasang Dawa Sherpa for your team, and reserved the chartered B3e helicopter window.',
          timestamp: 'Yesterday, 6:00 PM',
          customQuote: {
            id: 'QUO-2026-104',
            tripRequestId: 'REQ-2026-8812',
            agencyId: 'agency-sherpa-journeys',
            agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
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
            agencyNote: 'Namaste Sarah! Your 15% escrow deposit ($627) locks in your private helicopter flight window and guaranteed private room reservations.',
            status: 'pending',
            createdAt: '2026-09-15T18:00:00Z',
          },
        },
      ],
    },
    {
      id: 'th-1',
      agencyName: 'Himalayan Glacier Expeditions',
      tourTitle: 'Everest Base Camp & Kala Patthar High Altitude Trek',
      tourId: ALL_OTA_LISTINGS[0].id,
      tourPrice: 1450,
      dates: 'Oct 15 - Oct 27, 2026',
      status: 'active',
      lastMessage: 'Are sleeping bags and down jackets available to rent through your office in Thamel?',
      lastTimestamp: '10:42 AM',
      messages: [
        {
          id: 'tm-1',
          sender: 'traveler',
          text: 'Hello! We are looking to book the 12-day EBC trek for two people starting around October 15th.',
          timestamp: 'Yesterday, 4:15 PM',
        },
        {
          id: 'tm-2',
          sender: 'agency',
          text: 'Namaste! October 15th is prime autumn season with crystalline visibility. We have 4 open slots in that departure led by senior IFMGA guide Dawa Sherpa.',
          timestamp: 'Yesterday, 5:02 PM',
        },
        {
          id: 'tm-3',
          sender: 'traveler',
          text: 'Are sleeping bags and down jackets available to rent through your office in Thamel?',
          timestamp: 'Today, 10:42 AM',
        },
      ],
    },
    {
      id: 'th-2',
      agencyName: 'Mountain Monarch Wilderness',
      tourTitle: 'Annapurna Circuit & Thorong La High Pass Trek',
      tourId: ALL_OTA_LISTINGS[1].id,
      tourPrice: 1250,
      dates: 'Nov 02 - Nov 16, 2026',
      status: 'booking_ready',
      lastMessage: 'Please bring 2 passport photos for the local TIMS card. We have reserved your slots!',
      lastTimestamp: 'Sep 14',
      messages: [
        {
          id: 'tm2-1',
          sender: 'traveler',
          text: 'Hi, do I need to bring passport photos for the ACAP permit or do you handle everything digitally?',
          timestamp: 'Sep 14, 2:30 PM',
        },
        {
          id: 'tm2-2',
          sender: 'agency',
          text: 'Please bring 2 passport photos for the local TIMS card. We have reserved your slots!',
          timestamp: 'Sep 14, 3:10 PM',
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('th-custom-8812');
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: TravelerMessage = {
      id: `msg-${Date.now()}`,
      sender: 'traveler',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setThreads(
      threads.map((t) => {
        if (t.id !== activeThreadId) return t;
        return {
          ...t,
          lastMessage: inputText.trim(),
          lastTimestamp: 'Just now',
          messages: [...t.messages, newMsg],
        };
      })
    );
    setInputText('');
  };

  // 1-Click Book Custom Quote via 15% Escrow
  const handleBookCustomQuote = (quote: CustomQuoteProposal) => {
    if (activeThread.requestId) {
      acceptQuote(activeThread.requestId, quote.id);
    }

    const checkoutPayload = {
      quote: {
        id: quote.id,
        listingId: `custom-${quote.tripRequestId}`,
        departureId: `dep-custom-${Date.now()}`,
        agencyId: quote.agencyId,
        travelerId: user?.id || 'traveler-guest',
        participantCount: 2,
        currency: 'USD',
        unitPrice: {
          amount: quote.pricePerPersonUSD,
          minorUnits: Math.round(quote.pricePerPersonUSD * 100),
          currency: 'USD',
        },
        totalProductValue: {
          amount: quote.totalPriceUSD,
          minorUnits: Math.round(quote.totalPriceUSD * 100),
          currency: 'USD',
        },
        platformFeeRate: 0.15,
        platformFeeAmount: {
          amount: quote.deposit15USD,
          minorUnits: Math.round(quote.deposit15USD * 100),
          currency: 'USD',
        },
        agencyBalanceRate: 0.85,
        agencyBalanceAmount: {
          amount: quote.totalPriceUSD - quote.deposit15USD,
          minorUnits: Math.round((quote.totalPriceUSD - quote.deposit15USD) * 100),
          currency: 'USD',
        },
        remainingBalanceMethod: 'DIRECT_TO_AGENCY',
        cancellationPolicySnapshot: 'Custom Expedition Cancellation Policy (15% escrow protected)',
        balancePaymentTermsSnapshot: 'Direct to agency at Kathmandu pre-trip briefing',
        pricingVersion: 1,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      activityTitle: activeThread.tourTitle,
      activityImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
      activityCategory: 'Trekking',
      agencyName: quote.agencyName,
      agencyLicense: quote.leadGuideLicense,
      agencyPhone: '+977 1 4701889',
      agencyEmail: 'expeditions@intonepal.com',
    };

    sessionStorage.setItem('active_ota_quote', JSON.stringify(checkoutPayload));
    navigate('/booking/payment');
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.agencyName.toLowerCase().includes(search.toLowerCase()) ||
      t.tourTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DD]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E4DD] text-xs font-bold text-[#1E4B8F] mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Traveler Inquiries &amp; Custom Expedition Quotes</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1F1D]">
                Messages with Verified Local Operators
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/plan-custom-trek">
                <Button className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan New Custom Trek</span>
                </Button>
              </Link>
              <Link to="/my-bookings">
                <Button variant="outline" size="sm" className="text-xs font-bold bg-white border-[#E8E4DD]">
                  View My Bookings
                </Button>
              </Link>
            </div>
          </div>

          {/* Inbox Grid */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[550px]">
            {/* Thread List */}
            <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-[#E8E4DD] shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[#E8E4DD]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] text-xs">
                  <Search className="w-3.5 h-3.5 text-[#5F6B66]" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#1A1F1D]"
                  />
                </div>
              </div>

              <div className="divide-y divide-[#E8E4DD] overflow-y-auto flex-1">
                {filteredThreads.map((thread) => {
                  const isSelected = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                        isSelected ? 'bg-[#EFF6FF] border-l-4 border-l-[#1E4B8F]' : 'hover:bg-[#FBF8F3]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1A1F1D] truncate">
                          {thread.agencyName}
                        </span>
                        <span className="text-[10px] text-[#5F6B66]">{thread.lastTimestamp}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {thread.isCustomRequest && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#FEF4E7] text-[#D97706] rounded border border-[#D97706]/30">
                            Custom Quote
                          </span>
                        )}
                        <span className="text-[11px] text-[#1E4B8F] font-semibold truncate">
                          {thread.tourTitle}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#5F6B66] line-clamp-1">
                        {thread.lastMessage}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Thread Window */}
            <div className="flex-1 bg-white rounded-2xl border border-[#E8E4DD] shadow-sm flex flex-col overflow-hidden">
              {/* Thread Header Banner */}
              <div className="p-4 border-b border-[#E8E4DD] bg-[#FBF8F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-sm sm:text-base text-[#1A1F1D]">
                      {activeThread.agencyName}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                      <span>Verified Local Agency</span>
                    </span>
                  </div>

                  <div className="text-xs text-[#1E4B8F] font-semibold mt-1 flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>{activeThread.tourTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1A1F1D]">
                    {formatPrice(activeThread.tourPrice)}
                  </span>
                  {!activeThread.isCustomRequest && (
                    <Link to={`/activities/${activeThread.tourId}`}>
                      <Button
                        size="sm"
                        className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <span>View Listing</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-white min-h-[350px]">
                {activeThread.messages.map((m) => {
                  const isTraveler = m.sender === 'traveler';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isTraveler ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#5F6B66]">
                        <span className="font-semibold">
                          {isTraveler ? 'You' : activeThread.agencyName}
                        </span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isTraveler
                            ? 'bg-[#1E4B8F] text-white rounded-br-none'
                            : 'bg-[#FBF8F3] text-[#1A1F1D] border border-[#E8E4DD] rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>

                      {/* Render Rich Formal Custom Quote Card */}
                      {m.customQuote && (
                        <div className="mt-3 w-full max-w-lg rounded-2xl border border-[#D97706]/40 bg-[#FEF4E7]/40 p-5 shadow-xs space-y-4">
                          <div className="flex items-start justify-between border-b border-[#D97706]/20 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#D97706] text-white px-2 py-0.5 rounded-full">
                                  Official Custom Quote Proposal
                                </span>
                                <span className="text-xs text-[#5F6B66]">
                                  #{m.customQuote.id}
                                </span>
                              </div>
                              <h4 className="text-sm font-serif font-bold text-[#1A1F1D] mt-1">
                                {m.customQuote.agencyName}
                              </h4>
                              <p className="text-[11px] text-[#5F6B66]">
                                Assigned Lead Guide: <span className="font-semibold text-[#1A1F1D]">{m.customQuote.leadGuideName}</span> ({m.customQuote.leadGuideLicense})
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">
                                Quoted Total ({currency})
                              </span>
                              <span className="text-lg font-bold text-[#1E4B8F]">
                                {formatPrice(m.customQuote.totalPriceUSD)}
                              </span>
                              <span className="text-[10px] text-[#1B7A5A] font-semibold block">
                                {formatPrice(m.customQuote.pricePerPersonUSD)} / person
                              </span>
                            </div>
                          </div>

                          {/* Included Highlights */}
                          <div className="space-y-1.5 text-xs text-[#1A1F1D]">
                            <span className="font-bold text-[11px] uppercase tracking-wide text-[#5F6B66] block">
                              Custom Expedition Highlights Included:
                            </span>
                            {m.customQuote.includedHighlights.map((hi, hidx) => (
                              <div key={hidx} className="flex items-start gap-2 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A5A] shrink-0 mt-0.5" />
                                <span>{hi}</span>
                              </div>
                            ))}
                          </div>

                          {/* Escrow Deposit & Book Button */}
                          <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E4B8F]">
                                <Lock className="w-3.5 h-3.5" />
                                <span>15% Escrow Deposit: {formatPrice(m.customQuote.deposit15USD)}</span>
                              </div>
                              <p className="text-[10px] text-[#5F6B66]">
                                Balance of {formatPrice(m.customQuote.totalPriceUSD - m.customQuote.deposit15USD)} payable directly to operator in Kathmandu.
                              </p>
                            </div>

                            <Button
                              onClick={() => handleBookCustomQuote(m.customQuote!)}
                              className="bg-[#1E4B8F] hover:bg-[#153464] text-white text-xs font-bold whitespace-nowrap px-4 py-2"
                            >
                              <span>Accept &amp; Book Quote →</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#E8E4DD] bg-[#FBF8F3] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask operator about custom dates, route adjustments, or guide credentials..."
                  className="flex-1 text-xs p-3 rounded-xl border border-[#E8E4DD] bg-white text-[#1A1F1D] outline-none focus:border-[#1E4B8F]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5 px-5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
