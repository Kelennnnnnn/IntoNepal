import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ArrowLeft,
  Send,
  User,
  Calendar,
  DollarSign,
  Mountain,
  Search,
  CheckCircle2,
  Clock,
  Paperclip,
  Sparkles,
  FileText,
  ShieldCheck,
  Plane,
  X,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomTripStore, CustomQuoteProposal } from '@/stores/customTripStore';

interface Message {
  id: string;
  sender: 'agency' | 'traveler';
  senderName: string;
  text: string;
  timestamp: string;
  customQuote?: CustomQuoteProposal;
}

interface Conversation {
  id: string;
  travelerName: string;
  travelerCountry: string;
  tourTitle: string;
  travelerPax: number;
  dates: string;
  isCustomRequest?: boolean;
  requestId?: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  messages: Message[];
}

export const AgencyMessagesPage: React.FC = () => {
  const { requests, addQuoteToRequest } = useCustomTripStore();

  const [filterTab, setFilterTab] = useState<'all' | 'custom_rfqs'>('all');
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);

  // Quote form state
  const [quoteLeadGuide, setQuoteLeadGuide] = useState('Pasang Dawa Sherpa (3x Everest Summiteer)');
  const [quoteLicense, setQuoteLicense] = useState('NMA / IFMGA Lic #3902');
  const [quotePerPersonUSD, setQuotePerPersonUSD] = useState(2090);
  const [quoteNotes, setQuoteNotes] = useState(
    'Namaste! We have reserved your chartered helicopter window with Simrik Air and allocated our senior guide.'
  );

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-custom-8812',
      travelerName: 'Sarah Jenkins',
      travelerCountry: 'United States 🇺🇸',
      tourTitle: 'Custom Private: Everest Base Camp & Cho La Pass + Helicopter Descent',
      travelerPax: 2,
      dates: 'Oct 2026 (16 Days)',
      isCustomRequest: true,
      requestId: 'REQ-2026-8812',
      unreadCount: 0,
      lastMessage: 'Official Binding Quote #QUO-2026-104 submitted: $4,180 total.',
      lastTimestamp: 'Yesterday',
      messages: [
        {
          id: 'cm-1',
          sender: 'traveler',
          senderName: 'Sarah Jenkins',
          text: 'Hello! We submitted a custom private expedition for 2 trekkers requesting conservative acclimatization via Gokyo Lakes, Cho La Pass, and private helicopter return from Gorak Shep.',
          timestamp: 'Yesterday, 2:30 PM',
        },
        {
          id: 'cm-2',
          sender: 'agency',
          senderName: 'Himalayan Glacier Expeditions',
          text: 'Tashi Delek Sarah! We have reviewed your route brief and compiled our official binding quote with chartered B3e helicopter descent and senior IFMGA guide.',
          timestamp: 'Yesterday, 6:00 PM',
          customQuote: {
            id: 'QUO-2026-104',
            tripRequestId: 'REQ-2026-8812',
            agencyId: 'agency-sherpa-journeys',
            agencyName: 'Himalayan Glacier Expeditions Pvt. Ltd.',
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
      id: 'conv-1',
      travelerName: 'Sarah Jenkins',
      travelerCountry: 'United States 🇺🇸',
      tourTitle: 'Everest Base Camp & Kala Patthar High Altitude Trek',
      travelerPax: 2,
      dates: 'Oct 15 - Oct 27, 2026',
      unreadCount: 1,
      lastMessage: 'Are sleeping bags and down jackets available to rent through your office in Thamel?',
      lastTimestamp: '10:42 AM',
      messages: [
        {
          id: 'm1',
          sender: 'traveler',
          senderName: 'Sarah Jenkins',
          text: 'Hello! We are looking to book the 12-day EBC trek for two people starting around October 15th.',
          timestamp: 'Yesterday, 4:15 PM',
        },
        {
          id: 'm2',
          sender: 'agency',
          senderName: 'Himalayan Glacier Expeditions',
          text: 'Namaste Sarah! October 15th is prime autumn season with crystalline visibility. We have 4 open slots in that departure led by senior IFMGA guide Dawa Sherpa.',
          timestamp: 'Yesterday, 5:02 PM',
        },
        {
          id: 'm3',
          sender: 'traveler',
          senderName: 'Sarah Jenkins',
          text: 'Are sleeping bags and down jackets available to rent through your office in Thamel?',
          timestamp: 'Today, 10:42 AM',
        },
      ],
    },
    {
      id: 'conv-2',
      travelerName: 'Markus Weber',
      travelerCountry: 'Germany 🇩🇪',
      tourTitle: 'Annapurna Circuit & Thorong La High Pass Trek',
      travelerPax: 1,
      dates: 'Nov 02 - Nov 16, 2026',
      unreadCount: 0,
      lastMessage: 'Thank you for the permit confirmation! Deposit is secured.',
      lastTimestamp: 'Yesterday',
      messages: [
        {
          id: 'm2-1',
          sender: 'traveler',
          senderName: 'Markus Weber',
          text: 'Hi, do I need to bring passport photos for the ACAP permit or do you handle everything digitally?',
          timestamp: 'Sep 14, 2:30 PM',
        },
        {
          id: 'm2-2',
          sender: 'agency',
          senderName: 'Himalayan Glacier Expeditions',
          text: 'Hello Markus! Please bring 2 passport-size physical photos for the municipal TIMS card, and we handle all digital permits online.',
          timestamp: 'Sep 14, 3:10 PM',
        },
        {
          id: 'm2-3',
          sender: 'traveler',
          senderName: 'Markus Weber',
          text: 'Thank you for the permit confirmation! Deposit is secured.',
          timestamp: 'Yesterday, 6:40 PM',
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('conv-custom-8812');
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: 'agency',
      senderName: 'Himalayan Glacier Expeditions',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setConversations(
      conversations.map((c) => {
        if (c.id !== activeConvId) return c;
        return {
          ...c,
          lastMessage: inputText.trim(),
          lastTimestamp: 'Just now',
          messages: [...c.messages, newMessage],
        };
      })
    );
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  // Submit formal custom quote
  const handleDispatchQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = quotePerPersonUSD * activeConv.travelerPax;
    const deposit15 = Math.round(totalPrice * 0.15);

    const newQuote: CustomQuoteProposal = {
      id: `QUO-2026-${Math.floor(100 + Math.random() * 900)}`,
      tripRequestId: activeConv.requestId || 'REQ-2026-8812',
      agencyId: 'agency-himalayan-glacier',
      agencyName: 'Himalayan Glacier Expeditions Pvt. Ltd.',
      leadGuideName: quoteLeadGuide,
      leadGuideLicense: quoteLicense,
      pricePerPersonUSD: quotePerPersonUSD,
      totalPriceUSD: totalPrice,
      deposit15USD: deposit15,
      includedHighlights: [
        'Dedicated Certified Lead Guide & Insured Porters (IPPG Charter)',
        'All Sagarmatha/ACAP National Park & TIMS Permits',
        'Private airport transfers in Kathmandu & pre-trip technical briefing',
        'Emergency 6,000m helicopter rescue dispatch coverage',
      ],
      itinerarySummary: `Custom Tailored Expedition for ${activeConv.travelerPax} Trekkers`,
      validUntil: '7 days from issue',
      agencyNote: quoteNotes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (activeConv.requestId) {
      addQuoteToRequest(activeConv.requestId, newQuote);
    }

    const quoteMsg: Message = {
      id: `qm-${Date.now()}`,
      sender: 'agency',
      senderName: 'Himalayan Glacier Expeditions',
      text: `We have submitted an Official Binding Custom Quote #${newQuote.id} for $${totalPrice.toLocaleString()} ($${quotePerPersonUSD.toLocaleString()} / person). 15% escrow deposit secures the reservation.`,
      timestamp: 'Just now',
      customQuote: newQuote,
    };

    setConversations(
      conversations.map((c) => {
        if (c.id !== activeConvId) return c;
        return {
          ...c,
          lastMessage: `Quote #${newQuote.id} sent ($${totalPrice.toLocaleString()})`,
          lastTimestamp: 'Just now',
          messages: [...c.messages, quoteMsg],
        };
      })
    );

    setQuoteModalOpen(false);
  };

  const filteredConversations = conversations.filter((c) => {
    if (filterTab === 'custom_rfqs' && !c.isCustomRequest) return false;
    return (
      c.travelerName.toLowerCase().includes(search.toLowerCase()) ||
      c.tourTitle.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/agency/dashboard"
              className="text-xs text-[#5F6B66] hover:text-[#1A1F1D] flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#E8E4DD]">|</span>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1E4B8F]" />
              <h1 className="font-serif font-bold text-base text-[#1A1F1D]">
                Traveler Direct Inquiry &amp; Custom Quote Dispatch
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#FBF8F3] p-1 rounded-xl border border-[#E8E4DD] text-xs">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  filterTab === 'all' ? 'bg-white text-[#1E4B8F] shadow-2xs' : 'text-[#5F6B66]'
                }`}
              >
                All Messages ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('custom_rfqs')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                  filterTab === 'custom_rfqs'
                    ? 'bg-[#1E4B8F] text-white shadow-2xs'
                    : 'text-[#D97706]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Custom RFQs</span>
              </button>
            </div>

            <Link
              to="/trail-profiler"
              className="text-xs font-bold text-[#1E4B8F] hover:underline flex items-center gap-1"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Trail Profiler</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Inbox Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar: Conversations */}
        <div className="w-full md:w-80 shrink-0 bg-white rounded-2xl border border-[#E8E4DD] shadow-sm flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-[#E8E4DD]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD] text-xs">
              <Search className="w-3.5 h-3.5 text-[#5F6B66]" />
              <input
                type="text"
                placeholder="Search travelers or routes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-[#1A1F1D]"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="divide-y divide-[#E8E4DD] overflow-y-auto flex-1">
            {filteredConversations.map((c) => {
              const isSelected = c.id === activeConvId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                    isSelected ? 'bg-[#EFF6FF] border-l-4 border-l-[#1E4B8F]' : 'hover:bg-[#FBF8F3]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1A1F1D]">{c.travelerName}</span>
                      <span className="text-[10px] text-[#5F6B66]">{c.travelerCountry}</span>
                    </div>
                    <span className="text-[10px] text-[#5F6B66]">{c.lastTimestamp}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {c.isCustomRequest && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#FEF4E7] text-[#D97706] rounded border border-[#D97706]/30">
                        Custom RFQ
                      </span>
                    )}
                    <span className="text-[11px] text-[#1E4B8F] font-semibold truncate">
                      {c.tourTitle}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5F6B66] line-clamp-1">{c.lastMessage}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Thread */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E8E4DD] shadow-sm flex flex-col overflow-hidden">
          {/* Thread Header */}
          <div className="p-4 border-b border-[#E8E4DD] bg-[#FBF8F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-sm sm:text-base text-[#1A1F1D]">
                  {activeConv.travelerName}
                </h2>
                <span className="text-xs text-[#5F6B66]">{activeConv.travelerCountry}</span>
                {activeConv.isCustomRequest && (
                  <span className="text-[10px] font-bold bg-[#D97706] text-white px-2 py-0.5 rounded-full">
                    Custom Private Expedition
                  </span>
                )}
              </div>
              <div className="text-xs text-[#1E4B8F] font-semibold mt-1 flex items-center gap-2">
                <Mountain className="w-3.5 h-3.5" />
                <span>{activeConv.tourTitle}</span>
                <span>•</span>
                <span>{activeConv.travelerPax} Trekkers</span>
                <span>•</span>
                <span>{activeConv.dates}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setQuoteModalOpen(true)}
                className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Binding Quote</span>
              </Button>
            </div>
          </div>

          {/* Quick Replies Strip */}
          <div className="px-4 py-2 bg-white border-b border-[#E8E4DD] flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[#5F6B66] font-bold shrink-0">Quick Templates:</span>
            <button
              type="button"
              onClick={() =>
                handleQuickReply(
                  'Namaste! We have verified permit requirements and allocated an English-speaking guide for your dates.'
                )
              }
              className="px-2.5 py-1 rounded-full bg-[#FBF8F3] border border-[#E8E4DD] text-[#1A1F1D] hover:bg-[#E8E4DD] shrink-0"
            >
              Permits &amp; Guide Ready
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickReply(
                  'Yes, high-altitude down jackets and -20°C sleeping bags are available at our Thamel depot for $2/day.'
                )
              }
              className="px-2.5 py-1 rounded-full bg-[#FBF8F3] border border-[#E8E4DD] text-[#1A1F1D] hover:bg-[#E8E4DD] shrink-0"
            >
              Gear Rental in Thamel
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickReply(
                  'Please provide scanned copies of your passports and travel insurance policies covering 6,000m evacuation.'
                )
              }
              className="px-2.5 py-1 rounded-full bg-[#FBF8F3] border border-[#E8E4DD] text-[#1A1F1D] hover:bg-[#E8E4DD] shrink-0"
            >
              Insurance &amp; Passports Request
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-white min-h-[360px]">
            {activeConv.messages.map((msg) => {
              const isAgency = msg.sender === 'agency';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgency ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#5F6B66]">
                    <span className="font-semibold">{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isAgency
                        ? 'bg-[#1E4B8F] text-white rounded-br-none'
                        : 'bg-[#FBF8F3] text-[#1A1F1D] border border-[#E8E4DD] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.customQuote && (
                    <div className="mt-2.5 w-full max-w-md p-4 rounded-xl bg-[#FEF4E7] border border-[#D97706]/30 text-xs text-[#1A1F1D] space-y-2">
                      <div className="flex items-center justify-between border-b border-[#D97706]/20 pb-2">
                        <span className="font-bold text-[#D97706]">
                          Formal Binding Quote #{msg.customQuote.id}
                        </span>
                        <span className="font-bold text-[#1E4B8F] text-sm">
                          ${msg.customQuote.totalPriceUSD.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5F6B66]">
                        Lead Guide: <span className="font-semibold text-[#1A1F1D]">{msg.customQuote.leadGuideName}</span>
                      </div>
                      <div className="text-[11px] text-[#1B7A5A] font-semibold">
                        15% Escrow Deposit Required: ${msg.customQuote.deposit15USD.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#E8E4DD] bg-[#FBF8F3] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write a message to traveler or clarify trek details..."
              className="flex-1 text-xs p-3 rounded-xl border border-[#E8E4DD] bg-white text-[#1A1F1D] outline-none focus:border-[#1E4B8F]"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5 px-4"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </main>

      {/* Dispatch Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8E4DD] overflow-hidden">
            <div className="bg-[#1E4B8F] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                  Direct Agency Quote Proposal
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  Send Formal Binding Custom Quote
                </h3>
              </div>
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchQuote} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#1A1F1D]">Assigned Lead Guide Name &amp; Credentials</label>
                <input
                  type="text"
                  required
                  value={quoteLeadGuide}
                  onChange={(e) => setQuoteLeadGuide(e.target.value)}
                  placeholder="e.g. Pasang Dawa Sherpa (3x Everest Summiteer)"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] bg-white text-[#1A1F1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1A1F1D]">Guide License / NMA Reg #</label>
                  <input
                    type="text"
                    required
                    value={quoteLicense}
                    onChange={(e) => setQuoteLicense(e.target.value)}
                    placeholder="e.g. NMA Lic #3902"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] bg-white text-[#1A1F1D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1A1F1D]">Price Per Person (USD)</label>
                  <input
                    type="number"
                    required
                    value={quotePerPersonUSD}
                    onChange={(e) => setQuotePerPersonUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] bg-white text-[#1A1F1D]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EFF3FA] border border-[#1E4B8F]/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#5F6B66] block">Total for {activeConv.travelerPax} Trekkers:</span>
                  <span className="font-bold text-sm text-[#1E4B8F]">
                    ${(quotePerPersonUSD * activeConv.travelerPax).toLocaleString()} USD
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#5F6B66] block">15% Escrow Deposit:</span>
                  <span className="font-bold text-sm text-[#1B7A5A]">
                    ${Math.round(quotePerPersonUSD * activeConv.travelerPax * 0.15).toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1F1D]">Personal Message &amp; Route Logistics Note</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DD] bg-white text-[#1A1F1D]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuoteModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold px-5"
                >
                  Dispatch Binding Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
