import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Calendar,
  ShieldAlert,
  CreditCard,
  Mountain,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';

interface FaqItem {
  q: string;
  a: string;
  category: 'planning' | 'permits' | 'altitude' | 'payments' | 'gear';
}

const FAQS: FaqItem[] = [
  {
    category: 'planning',
    q: 'When is the absolute best time to trek in Nepal?',
    a: 'Autumn (October to November) is the golden peak season, offering clear skies, mild temperatures, and unmatched mountain visibility across the Everest and Annapurna ranges. Spring (March to May) is second best, known for vibrant blooming rhododendron forests and warmer high passes. Summer/Monsoon (June to August) is ideal for rain-shadow treks in Upper Mustang and Dolpo, while winter (December to February) offers crisp, crowd-free hill trekking and lowland wildlife safaris in Chitwan.',
  },
  {
    category: 'planning',
    q: 'Do I need prior mountaineering or technical climbing experience?',
    a: 'No technical experience is needed for classic hiking routes like Everest Base Camp, Annapurna Circuit, or Langtang Valley. These follow established walking trails and require good cardiovascular endurance, stamina, and mental perseverance. Only designated "Trekking Peaks" (such as Island Peak 6,189m or Mera Peak 6,476m) require basic crampon, ice-axe, and fixed-rope skills, for which certified Sherpa guides provide hands-on glacier training at base camp.',
  },
  {
    category: 'permits',
    q: 'Are trekking permits and TIMS cards included in the package price?',
    a: 'Yes. All verified operator packages listed on Into Nepal explicitly include required National Park permits (e.g., Sagarmatha National Park, Annapurna Conservation Area Project / ACAP, Langtang), Trekkers’ Information Management System (TIMS) cards, and local rural municipality entry taxes.',
  },
  {
    category: 'permits',
    q: 'What is the visa process for international travelers entering Nepal?',
    a: 'Most international visitors can obtain a Tourist Visa on Arrival at Tribhuvan International Airport (KTM) in Kathmandu. Visa fees are $30 USD for 15 days, $50 USD for 30 days, and $125 USD for 90 days. You can also pre-fill the online Department of Immigration form prior to departure to expedite airport processing.',
  },
  {
    category: 'altitude',
    q: 'How do guides prevent and manage Acute Mountain Sickness (AMS)?',
    a: 'All verified Into Nepal itineraries incorporate mandatory rest and acclimatization days (e.g., at Namche Bazaar 3,440m or Dingboche 4,410m). Guides carry portable pulse oximeters to measure your blood oxygen saturation (SpO2) and heart rate twice daily. They are trained in wilderness first aid and carry high-altitude first aid kits. In the rare event of severe altitude sickness, our operators arrange immediate 24/7 helicopter emergency evacuation.',
  },
  {
    category: 'altitude',
    q: 'Is high-altitude travel and helicopter rescue insurance mandatory?',
    a: 'Yes, mandatory. You must have travel insurance that explicitly covers emergency helicopter evacuation and medical repatriation up to 6,000 meters (or the maximum altitude of your chosen trek). Reputable providers include Global Rescue, World Nomads, and Allianz.',
  },
  {
    category: 'payments',
    q: 'How does the 15% booking deposit and 85% balance model work?',
    a: 'You pay a secure 15% booking deposit online to lock in your confirmed departure dates, reserve permits, and book domestic mountain flights. The remaining 85% balance is settled directly with your verified local operator upon arrival in Kathmandu or Pokhara via cash (USD, EUR, GBP, NPR) or major credit cards.',
  },
  {
    category: 'payments',
    q: 'What happens if a domestic flight (e.g. Kathmandu to Lukla) is delayed due to weather?',
    a: 'Himalayan mountain weather can cause flight delays, particularly into Lukla or Jomsom. Operators build buffer days into itineraries or provide alternative shared helicopter flights (with differential costs handled transparently). If flights cannot operate due to prolonged weather closures, operators arrange alternative treks or refund unused service portions in accordance with our cancellation policy.',
  },
  {
    category: 'gear',
    q: 'Can I rent heavy cold-weather gear in Kathmandu or Pokhara?',
    a: 'Yes! High-quality down jackets (-20°C rated), sleeping bags, and trekking poles are easily rentable in the Thamel district of Kathmandu and Lakeside in Pokhara for approximately $1.50 to $2.50 USD per day. Your agency will assist you with gear inspection during your arrival orientation.',
  },
  {
    category: 'gear',
    q: 'What is the luggage weight limit for porters and domestic flights?',
    a: 'Domestic mountain flights to Lukla allow a maximum of 15kg (approx. 33 lbs) total luggage (10kg duffel bag + 5kg hand carry). Porters carry a maximum of 20kg to 25kg shared between two trekkers (10–12.5kg per trekker). Excess non-trekking luggage can be stored securely and free of charge at your hotel in Kathmandu.',
  },
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E4DD] text-xs font-bold text-[#1E4B8F]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Himalayan Travel Intelligence</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6B66] max-w-xl mx-auto">
              Everything you need to know about trekking seasons, required permits, altitude safety, packing, and our direct-to-local booking escrow.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-2.5 flex items-center gap-3 shadow-sm">
            <Search className="w-4 h-4 text-[#5F6B66] ml-2" />
            <input
              type="text"
              placeholder="Search questions (e.g., Lukla flights, altitude sickness, visa, gear)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-[#1A1F1D]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'planning', label: 'Trip Planning & Seasons' },
              { id: 'permits', label: 'Permits & Visas' },
              { id: 'altitude', label: 'Altitude & Safety' },
              { id: 'payments', label: 'Payment & 15% Deposit' },
              { id: 'gear', label: 'Packing & Gear Rental' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-[#1E4B8F] text-white shadow-sm'
                    : 'bg-white border border-[#E8E4DD] text-[#5F6B66] hover:text-[#1A1F1D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E4DD] p-8 text-center text-xs text-[#5F6B66]">
                No matching questions found. Try a different search query or contact our local team.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#1A1F1D] hover:text-[#1E4B8F] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#5F6B66] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#1E4B8F]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#5F6B66] leading-relaxed border-t border-[#E8E4DD]/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still Have Questions Box */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                Have a customized question about your trek?
              </h3>
              <p className="text-xs text-[#5F6B66] mt-0.5">
                Our Kathmandu advisory team and verified Sherpa guides are ready to assist.
              </p>
            </div>
            <Link to="/contact">
              <Button variant="primary" size="sm" className="bg-[#1E4B8F] text-white text-xs font-bold">
                Contact Trail Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
