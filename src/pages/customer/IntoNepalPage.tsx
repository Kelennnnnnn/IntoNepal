import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Mountain,
  Sun,
  CloudRain,
  Leaf,
  Snowflake,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin,
  Trees,
  Waves,
  Landmark,
  ArrowRight,
  Globe2,
  CheckCircle2,
  ChevronRight,
  Heart,
  Users,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { getOptimizedImageUrl } from '@/lib/images';
import { ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';

// Four Distinct Seasons of Nepal
const SEASONS_DATA = [
  {
    id: 'spring',
    name: 'Spring',
    nepaliName: 'Basanta Ritu',
    months: 'March – May',
    temp: '16°C to 26°C (Valley) / -5°C to 10°C (High Alpine)',
    icon: Leaf,
    color: '#16A34A',
    bgLight: '#F0FDF4',
    border: '#BBF7D0',
    tag: 'Rhododendron Blooms & Peak Summits',
    description:
      'The hills ignite in fiery crimson, pink, and white rhododendrons (Lali Gurans). As temperatures climb and winter snow melts, high alpine passes open up, making it the premier climbing window for Mount Everest and 6,000m trekking peaks.',
    climate: 'Dry, mild days with clear mornings and occasional afternoon showers in valleys.',
    highlights: [
      'Rhododendron blooms blanket Poon Hill and Langtang slopes',
      'Mount Everest and Lhotse peak climbing expeditions launch from Khumbu Base Camp',
      'Wildlife in Chitwan and Bardia congregates at river waterholes',
      'Celebration of Holi (Festival of Colors) and Bisket Jatra (Nepali New Year)',
    ],
    recommendedActivities: [
      { id: 'ebc-classic-14', title: 'Everest Base Camp & Kala Patthar', duration: '14 Days', category: 'Trekking' },
      { id: 'island-peak-climbing-16', title: 'Island Peak 6,189m Mountaineering', duration: '16 Days', category: 'Mountaineering' },
      { id: 'bardia-tiger-safari-5', title: 'Bardia Untamed Tiger Safari', duration: '5 Days', category: 'Wildlife' },
      { id: 'trishuli-rafting-day', title: 'Trishuli River Whitewater Rafting', duration: '1 Day', category: 'Rafting' },
    ],
  },
  {
    id: 'summer',
    name: 'Summer / Monsoon',
    nepaliName: 'Barsha Ritu',
    months: 'June – August',
    temp: '22°C to 30°C (Valley) / 10°C to 18°C (Rain-Shadow)',
    icon: CloudRain,
    color: '#0284C7',
    bgLight: '#F0F9FF',
    border: '#BAE6FD',
    tag: 'Trans-Himalayan Rain-Shadow & Lush Terraces',
    description:
      'While southern slopes receive life-giving monsoon rains turning terraced valleys emerald green, the trans-Himalayan desert regions of Upper Mustang and Upper Dolpo sit in the rain shadow of the Annapurna and Dhaulagiri massifs, remaining sunny and dry.',
    climate: 'Southern valleys experience warm monsoon rain; Rain-shadow plateaus stay arid, cool, and cloud-free.',
    highlights: [
      'Upper Mustang (The Ancient Walled Kingdom of Lo) remains completely dry and sunny',
      'Upper Dolpo and Shey Phoksundo Lake offer crystal turquoise mountain scenery',
      'Lush green paddy fields come alive with Ropain (Rice Planting) folk festivals',
      'Wild high-volume rapids on Himalayan rivers provide world-class rafting thrills',
    ],
    recommendedActivities: [
      { id: 'upper-mustang-12', title: 'Upper Mustang Kingdom of Lo Trek', duration: '12 Days', category: 'Trekking' },
      { id: 'sun-koshi-river-expedition-8', title: 'Sun Koshi 8-Day Wilderness Rafting', duration: '8 Days', category: 'Rafting' },
      { id: 'kathmandu-valley-unesco', title: 'Kathmandu Valley UNESCO Heritage Tour', duration: '2 Days', category: 'Cultural' },
    ],
  },
  {
    id: 'autumn',
    name: 'Autumn',
    nepaliName: 'Sharad Ritu',
    months: 'September – November',
    temp: '14°C to 24°C (Valley) / -8°C to 8°C (High Alpine)',
    icon: Sun,
    color: '#D97706',
    bgLight: '#FFFBEB',
    border: '#FDE68A',
    tag: 'Golden Skies & Crystal Visibility (Peak Season)',
    description:
      'The undisputed crown jewel of Himalayan travel. Monsoon rains wash the air crystal clean, leaving deep cobalt-blue skies, sharp mountain horizons, mild daytime trekking temperatures, and Nepal’s greatest cultural festivals: Dashain and Tihar.',
    climate: 'Exceptionally stable weather, dry trails, and 100+ kilometer mountain visibility.',
    highlights: [
      'Unmatched panoramic views across all 8,000m Himalayan giants',
      'Perfect trail conditions for Everest Base Camp, Annapurna Circuit, and Manaslu',
      'Nationwide celebrations of Dashain and Tihar (Festival of Lights)',
      'Optimal conditions for Pokhara paragliding, mountain flights, and heli tours',
    ],
    recommendedActivities: [
      { id: 'annapurna-circuit-16', title: 'Annapurna Circuit & Thorong La Pass', duration: '16 Days', category: 'Trekking' },
      { id: 'manaslu-circuit-14', title: 'Manaslu Circuit & Larkya La Pass', duration: '14 Days', category: 'Trekking' },
      { id: 'pokhara-paragliding-adventure', title: 'Pokhara Sarangkot Tandem Paragliding', duration: 'Half Day', category: 'Adventure' },
      { id: 'everest-heli-breakfast', title: 'Everest Heli Tour & Champagne Breakfast', duration: '1 Day', category: 'Adventure' },
    ],
  },
  {
    id: 'winter',
    name: 'Winter',
    nepaliName: 'Hemanta / Shishir Ritu',
    months: 'December – February',
    temp: '8°C to 18°C (Valley) / -18°C to 2°C (High Alpine)',
    icon: Snowflake,
    color: '#475569',
    bgLight: '#F8FAFC',
    border: '#E2E8F0',
    tag: 'Crisp Sunshine, Lowland Treks & Wild Safaris',
    description:
      'While high passes experience heavy snowfall and sub-zero temperatures, the valleys and mid-hills enjoy sunny days and empty trails. Winter is the ideal season for subtropical jungle safaris in Chitwan and Bardia, as well as panoramic low-altitude ridge treks.',
    climate: 'Clear, crisp sunny days with cold nights; morning mists in lowlands that burn off by noon.',
    highlights: [
      'Peaceful, uncrowded teahouses on Ghorepani Poon Hill and Mardi Himal trails',
      'Prime game viewing in Chitwan and Bardia National Parks for one-horned rhinos',
      'Spiritual peace walks in Lumbini and ancient UNESCO heritage palaces of Patan and Bhaktapur',
      'Vibrant celebration of Tibetan Buddhist New Year (Lhosar) and Maha Shivaratri',
    ],
    recommendedActivities: [
      { id: 'mardi-himal-ridge-trek-6', title: 'Mardi Himal Secret Ridge Trek', duration: '6 Days', category: 'Trekking' },
      { id: 'lumbini-peace-pilgrimage-3', title: 'Lumbini Sacred Garden & Buddha Birthplace', duration: '3 Days', category: 'Cultural' },
      { id: 'bardia-tiger-safari-5', title: 'Bardia National Park Tiger Safari', duration: '5 Days', category: 'Wildlife' },
      { id: 'kathmandu-valley-unesco', title: 'Kathmandu Valley UNESCO Heritage Tour', duration: '2 Days', category: 'Cultural' },
    ],
  },
];

// Biodiversity Zones
const BIODIVERSITY_ZONES = [
  {
    elevation: '60m – 1,000m',
    name: 'Subtropical Lowlands (Terai & Inner Terai)',
    ecosystem: 'Dense Sal hardwood forests, riverine grasslands, oxbow wetlands, and fertile plains.',
    wildlife: 'Greater One-Horned Rhinoceros, Royal Bengal Tiger, Asian Elephant, Gharial Crocodile, Gangetic River Dolphin, Great Hornbill.',
    parks: 'Chitwan National Park (UNESCO), Bardia National Park, Shuklaphanta National Park, Koshi Tappu Wildlife Reserve.',
    icon: Trees,
  },
  {
    elevation: '1,000m – 3,000m',
    name: 'Temperate Mid-Hills (Pahar)',
    ecosystem: 'Broadleaf oak forests, terraced rice paddies, weeping pines, and blazing rhododendron forests.',
    wildlife: 'Red Panda, Himalayan Black Bear, Clouded Leopard, Barking Deer, Serow, 850+ bird species (including Danfe - Himalayan Monal).',
    parks: 'Shivapuri Nagarjun National Park, Langtang National Park, Annapurna Conservation Area (ACAP).',
    icon: Leaf,
  },
  {
    elevation: '3,000m – 4,500m',
    name: 'Subalpine & Alpine Meadows',
    ecosystem: 'Stunted birch, dwarf juniper scrub, high-altitude peat bogs, and vibrant summer wildflower pastures.',
    wildlife: 'Snow Leopard, Himalayan Blue Sheep (Bharal), Himalayan Tahr, Musk Deer, Tibetan Wolf, Golden Eagle, Bearded Vulture (Lammergeier).',
    parks: 'Sagarmatha National Park (UNESCO), Manaslu Conservation Area, Kanchenjunga Conservation Area.',
    icon: Mountain,
  },
  {
    elevation: '4,500m – 8,848m',
    name: 'Nival & Glaciated High Himalaya',
    ecosystem: 'Hanging glaciers, towering granite headwalls, perpetual snow fields, moraine lakes, and arctic cold extremes.',
    wildlife: 'Alpine Chough (spotted up to 8,200m), jumping spiders (the highest permanent animal life on Earth at 6,700m).',
    parks: 'Roof of the World: Everest, Kanchenjunga, Lhotse, Makalu, Cho Oyu, Dhaulagiri, Manaslu, Annapurna.',
    icon: Snowflake,
  },
];

// Cultural Groups
const ETHNIC_GROUPS = [
  {
    name: 'Sherpa of the Khumbu & Solu',
    region: 'High Himalayas (Everest / Makalu)',
    tradition: 'Tibetan Vajrayana Buddhism',
    about: 'Legendary mountain masters and deeply devout Buddhist guardians of the sacred Khumbu valley. Keepers of historic teahouses, ancient monasteries like Tengboche, and prayer-carved mani stones.',
  },
  {
    name: 'Newar of the Kathmandu Valley',
    region: 'Kathmandu, Patan & Bhaktapur',
    tradition: 'Syncretic Hinduism & Newar Buddhism',
    about: 'The original master architects, woodcarvers, and bronze casters who constructed the medieval pagoda palaces, sacred courtyards, and the living goddess Kumari tradition of Kathmandu Valley.',
  },
  {
    name: 'Gurung & Magar of the Annapurnas',
    region: 'Gandaki Basin & Annapurna Slopes',
    tradition: 'Shamanic Bon, Buddhism & Hinduism',
    about: 'Famed for traditional slate-roof stone villages (Ghandruk, Sikles), hospitality along the Annapurna trails, wild cliff honey harvesting, and centuries of valor as Gurkha regiments.',
  },
  {
    name: 'Tharu of the Terai Jungles',
    region: 'Chitwan, Bardia & Terai Plains',
    tradition: 'Animist Nature Worship & Tharu Culture',
    about: 'Indigenous forest dwellers of the southern subtropical jungles who developed natural resistance to jungle malaria. Renowned for intricate mud-relief wall art, stick dances, and expert wildlife tracking.',
  },
  {
    name: 'Thakali of the Kali Gandaki Gorge',
    region: 'Mustang & Kali Gandaki Valley',
    tradition: 'Buddhism & Shamanism',
    about: 'Master caravan traders of the ancient Himalayan Salt Route between Tibet and India. Famous for warm guest hospitality and Nepal’s celebrated culinary masterpiece: authentic Thakali Dal Bhat.',
  },
  {
    name: 'Tamang of the Central Hills',
    region: 'Langtang, Helambu & Ganesh Himal',
    tradition: 'Vajrayana Buddhism & Shamanism',
    about: 'Warm-hearted mountain people whose traditions trace to ancient horse traders. Famous for rich Thangka painting, intricate bone instruments, and peaceful farming villages along the Tamang Heritage Trail.',
  },
];

// Nepal's 8 Eight-Thousander Giants
const EIGHT_THOUSANDERS = [
  { name: 'Sagarmatha (Mt. Everest)', altitude: '8,848.86 m', rank: 1, region: 'Khumbu / Mahalangur' },
  { name: 'Kanchenjunga', altitude: '8,586 m', rank: 3, region: 'Eastern Himalaya' },
  { name: 'Lhotse', altitude: '8,516 m', rank: 4, region: 'Everest Massif' },
  { name: 'Makalu', altitude: '8,485 m', rank: 5, region: 'Makalu Barun' },
  { name: 'Cho Oyu', altitude: '8,188 m', rank: 6, region: 'Khumbu / Tibet Border' },
  { name: 'Dhaulagiri I', altitude: '8,167 m', rank: 7, region: 'Dhaulagiri Himal' },
  { name: 'Manaslu (Mountain of Spirit)', altitude: '8,163 m', rank: 8, region: 'Mansiri Himal' },
  { name: 'Annapurna I', altitude: '8,091 m', rank: 10, region: 'Annapurna Massif' },
];

export const IntoNepalPage: React.FC = () => {
  const [activeSeason, setActiveSeason] = useState('autumn');
  const selectedSeason = SEASONS_DATA.find((s) => s.id === activeSeason) || SEASONS_DATA[2];

  return (
    <CustomerLayout>
      {/* 1. HERO BANNER: Atmospheric & Authoritative */}
      <section className="relative w-full bg-[#141817] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={getOptimizedImageUrl('https://images.unsplash.com/photo-1544735716-392fe2489ffa', 1200)}
            alt="Himalayan Panorama"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141817] via-[#141817]/70 to-[#141817]/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#D97706] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Nepal • The Living Mandala</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Into Nepal: The World’s Greatest Geographic & Cultural Wonder
          </h1>

          <p className="text-base sm:text-xl text-[#E2DDD5] max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            From the 8,848-meter crown of Mount Everest to the subtropical jungles of Chitwan where one-horned rhinos roam free—explore Nepal’s four dynamic seasons, staggering biodiversity, and living multicultural traditions.
          </p>

          {/* Quick Anchor Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold">
            <a
              href="#why-nepal"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              Why Nepal
            </a>
            <a
              href="#seasons"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              Seasonal Calendar
            </a>
            <a
              href="#biodiversity"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              Biodiversity & Wildlife
            </a>
            <a
              href="#culture"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              Multicultural Mosaic
            </a>
            <Link
              to="/activities"
              className="px-4 py-2 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white transition-all flex items-center gap-1.5"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHY NEPAL: The Geographic & Spiritual Wonder */}
      <section id="why-nepal" className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-2">
              Unrivaled Geography
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight">
              Why Nepal Captivates the World
            </h2>
            <p className="text-sm sm:text-base text-[#5F6B66] mt-3 leading-relaxed">
              Nowhere else on Earth packs such extreme altitudinal variety into a compact landscape. Within less than 150 kilometers, the land ascends from sea-level subtropical plains to the highest point on the planet.
            </p>
          </div>

          {/* 4 Landmark Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF3FA] text-[#1E4B8F] flex items-center justify-center font-serif font-black text-xl mb-4">
                  8 / 14
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-2">
                  Eight 8,000m Giants
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Of the planet’s fourteen peaks surpassing 8,000 meters, eight stand majestically inside Nepal, including Sagarmatha (Mt. Everest), Kanchenjunga, and Annapurna.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#1E4B8F]">
                The Alpine Roof of the World
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FEF4E7] text-[#D97706] flex items-center justify-center font-serif font-black text-xl mb-4">
                  623 BC
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-2">
                  Birthplace of Buddha
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Siddhartha Gautama was born in the sacred sal groves of Lumbini, Nepal in 623 BC. Today it stands as a UNESCO World Heritage sanctuary of international peace and contemplation.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#D97706]">
                Sanctuary of Global Enlightenment
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EDF6F2] text-[#1B7A5A] flex items-center justify-center font-serif font-black text-xl mb-4">
                  125+
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-2">
                  Ethnic Harmonies
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Over 125 distinct ethnic groups and 123 spoken languages coexist in profound cultural harmony, celebrating both Vedic Hindu rituals and Tibetan Buddhist monastic prayers.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#1B7A5A]">
                Living Heritage & Traditions
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF8F3] border border-[#E8E4DD] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] text-[#C8362E] flex items-center justify-center font-serif font-black text-xl mb-4">
                  100%
                </div>
                <h3 className="font-bold text-base text-[#1A1F1D] mb-2">
                  Direct Local Impact
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Booking via Into Nepal guarantees that your expedition funds flow directly to certified Nepali mountain guides, porters, and local lodge-keepers—not foreign multinational middlemen.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E4DD]/60 text-[11px] font-semibold text-[#C8362E]">
                Empowering Local Communities
              </div>
            </div>
          </div>

          {/* Eight-Thousanders Showcase Strip */}
          <div className="bg-[#1A1F1D] rounded-3xl p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Nepal’s Crown: The Eight 8,000-Meter Peaks
                </h3>
                <p className="text-xs text-[#A8B4AE] mt-1">
                  Nepal is the global epicentre of extreme high-altitude mountaineering.
                </p>
              </div>
              <Link
                to="/activities?category=Trekking"
                className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View Expeditions</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {EIGHT_THOUSANDERS.map((peak) => (
                <div
                  key={peak.name}
                  className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#D97706] font-bold mb-1">
                    <span>World #{peak.rank}</span>
                    <span>{peak.altitude}</span>
                  </div>
                  <div className="font-bold text-sm text-white truncate">{peak.name}</div>
                  <div className="text-[10px] text-[#8E9994] mt-0.5 truncate">{peak.region}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR SEASONS ACTIVITY & TOUR CALENDAR */}
      <section id="seasons" className="py-16 sm:py-24 bg-[#FBF8F3] border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F] block mb-2">
              Year-Round Wonder
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight">
              Nepal Seasonal Travel & Activity Calendar
            </h2>
            <p className="text-sm sm:text-base text-[#5F6B66] mt-3 leading-relaxed">
              Every season offers a distinct persona. Whether tracking tigers in the winter mist, trekking high Himalayan passes under autumn skies, or marveling at rain-shadow canyons in summer, Nepal is a 12-month destination.
            </p>
          </div>

          {/* Season Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
            {SEASONS_DATA.map((season) => {
              const Icon = season.icon;
              const isSelected = activeSeason === season.id;
              return (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => setActiveSeason(season.id)}
                  className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#1A1F1D] shadow-md -translate-y-1'
                      : 'bg-white/60 border-[#E8E4DD] hover:bg-white hover:border-[#1E4B8F]/30'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                    style={{ backgroundColor: season.bgLight, color: season.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1A1F1D]">
                    {season.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#5F6B66] mt-0.5">
                    {season.months}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Season Detail Card */}
          <div className="bg-white rounded-3xl border border-[#E8E4DD] p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-[#E8E4DD]">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: selectedSeason.bgLight, color: selectedSeason.color, border: `1px solid ${selectedSeason.border}` }}
                >
                  <span>{selectedSeason.nepaliName}</span>
                  <span>•</span>
                  <span>{selectedSeason.tag}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D]">
                  {selectedSeason.name} in Nepal ({selectedSeason.months})
                </h3>
                <p className="text-sm text-[#5F6B66] leading-relaxed">
                  {selectedSeason.description}
                </p>
              </div>

              <div className="bg-[#FBF8F3] border border-[#E8E4DD] rounded-2xl p-4 sm:p-5 shrink-0 max-w-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1F1D] mb-1.5">
                  <Sun className="w-4 h-4 text-[#D97706]" />
                  <span>Climate & Temperatures</span>
                </div>
                <p className="text-xs text-[#5F6B66] leading-normal mb-3">
                  {selectedSeason.temp}
                </p>
                <div className="text-[11px] text-[#1E4B8F] font-semibold">
                  {selectedSeason.climate}
                </div>
              </div>
            </div>

            {/* Highlights and Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div>
                <h4 className="font-bold text-sm text-[#1A1F1D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B7A5A]" />
                  <span>Seasonal Highlights</span>
                </h4>
                <ul className="space-y-2.5">
                  {selectedSeason.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#1A1F1D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1E4B8F]" />
                  <span>Top Verified Activities for {selectedSeason.name}</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedSeason.recommendedActivities.map((act) => (
                    <Link
                      key={act.id}
                      to={`/activities/${act.id}`}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#FBF8F3] hover:bg-[#F4EFE8] border border-[#E8E4DD] transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block mb-0.5">
                          {act.category} • {act.duration}
                        </span>
                        <div className="text-xs sm:text-sm font-bold text-[#1A1F1D] group-hover:text-[#1E4B8F] transition-colors truncate">
                          {act.title}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#5F6B66] group-hover:text-[#1E4B8F] group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BIODIVERSITY & ECOLOGICAL EXTREMES */}
      <section id="biodiversity" className="py-16 sm:py-24 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B7A5A] block mb-2">
              Extreme Altitudinal Transect
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight">
              Wild Nepal: 4 Ecological Worlds in One Small Nation
            </h2>
            <p className="text-sm sm:text-base text-[#5F6B66] mt-3 leading-relaxed">
              Nepal occupies just 0.1% of the Earth’s surface, yet harbors nearly 10% of the world’s bird species, 4% of all mammals, and over 6,000 species of flowering flora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {BIODIVERSITY_ZONES.map((zone) => {
              const Icon = zone.icon;
              return (
                <div
                  key={zone.name}
                  className="rounded-2xl border border-[#E8E4DD] bg-[#FBF8F3] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DD] flex items-center justify-center text-[#1B7A5A]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF4E7] px-2.5 py-0.5 rounded-full">
                        {zone.elevation}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#1A1F1D] mb-2 leading-snug">
                      {zone.name}
                    </h3>

                    <p className="text-xs text-[#5F6B66] leading-relaxed mb-3">
                      {zone.ecosystem}
                    </p>

                    <div className="pt-3 border-t border-[#E8E4DD]/60">
                      <span className="text-[10px] uppercase font-bold text-[#1B7A5A] block mb-1">
                        Key Wildlife:
                      </span>
                      <p className="text-xs text-[#1A1F1D] font-medium leading-relaxed">
                        {zone.wildlife}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8E4DD]/60 text-[11px] text-[#5F6B66] font-medium italic">
                    Protected Areas: {zone.parks}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conservation Triumph Callout */}
          <div className="rounded-3xl bg-[#EDF6F2] border border-[#A7D7C5] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B7A5A] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Global Conservation Leadership</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#144835]">
                Nepal Doubled Its Wild Tiger Population & Achieved Zero Rhino Poaching
              </h3>
              <p className="text-xs sm:text-sm text-[#275F49] max-w-3xl leading-relaxed">
                Through community-led anti-poaching units, buffer zone revenue sharing with indigenous Tharu communities, and stringent army patrols in Chitwan and Bardia, Nepal stands as the premier success story in Asian wildlife preservation.
              </p>
            </div>
            <Link to="/activities?category=Wildlife" className="shrink-0">
              <Button variant="primary" size="md" className="font-bold text-xs bg-[#1B7A5A] hover:bg-[#145C43] text-white rounded-xl px-5">
                Browse Wildlife Safaris
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MULTICULTURAL MOSAIC & LIVING TRADITIONS */}
      <section id="culture" className="py-16 sm:py-24 bg-[#FBF8F3] border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-2">
              Living Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1F1D] tracking-tight">
              A Living Tapestry of Peoples & Faiths
            </h2>
            <p className="text-sm sm:text-base text-[#5F6B66] mt-3 leading-relaxed">
              Nepal’s magic extends far beyond its peaks. In medieval city squares, cliffside monasteries, and quiet river valleys, sacred traditions dating thousands of years remain woven into daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {ETHNIC_GROUPS.map((eth) => (
              <div
                key={eth.name}
                className="bg-white rounded-2xl border border-[#E8E4DD] p-6 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-[#D97706]">{eth.region}</span>
                    <span className="text-[#5F6B66] bg-[#FBF8F3] px-2.5 py-0.5 rounded-full border border-[#E8E4DD]">
                      {eth.tradition}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1A1F1D] mb-2">
                    {eth.name}
                  </h3>
                  <p className="text-xs text-[#5F6B66] leading-relaxed">
                    {eth.about}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 7 UNESCO Monuments Strip */}
          <div className="bg-white rounded-3xl border border-[#E8E4DD] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F] block mb-1">
                  World Heritage Zones
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1F1D]">
                  Kathmandu Valley: 7 Monument Zones in One Valley
                </h3>
              </div>
              <Link
                to="/activities/kathmandu-valley-unesco"
                className="text-xs font-bold text-[#1E4B8F] hover:underline flex items-center gap-1"
              >
                <span>Explore UNESCO Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              {[
                { name: 'Kathmandu Durbar Square', type: 'Royal Palace' },
                { name: 'Patan Durbar Square', type: 'Fine Arts Palace' },
                { name: 'Bhaktapur Durbar Square', type: 'Pottery & Pagodas' },
                { name: 'Swayambhunath Stupa', type: 'Monkey Temple' },
                { name: 'Boudhanath Stupa', type: 'Tibetan Mandala' },
                { name: 'Pashupatinath Temple', type: 'Sacred Shiva Shrine' },
                { name: 'Changu Narayan', type: 'Ancient Hindu Temple' },
              ].map((site) => (
                <div key={site.name} className="p-3 rounded-xl bg-[#FBF8F3] border border-[#E8E4DD]">
                  <div className="font-bold text-xs text-[#1A1F1D] leading-snug">{site.name}</div>
                  <div className="text-[10px] text-[#5F6B66] mt-1">{site.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION: Direct Marketplace Discovery */}
      <section className="bg-[#1A1F1D] text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D97706]">
            <Mountain className="w-3.5 h-3.5" />
            <span>Over 25+ Verified Local Operators</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Experience the Spirit of Nepal?
          </h2>

          <p className="text-sm sm:text-base text-[#D9D3C9] max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified local trekking, rafting, safari, and tour agencies. Transparent local pricing, guaranteed departures, and ethical community support.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link to="/activities">
              <Button
                variant="primary"
                size="lg"
                className="font-bold text-sm bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl px-8 shadow-lg"
              >
                Browse All Experiences
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="font-bold text-sm bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl px-8"
              >
                About Into Nepal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
