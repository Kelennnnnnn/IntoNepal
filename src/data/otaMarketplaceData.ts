/**
 * Into Nepal — OTA Marketplace Data Engine
 * 
 * Provides centralized multi-agency listings, verified agency profiles,
 * and persistent traveler and agency bookings across the marketplace.
 */

import { TrekListing, COMPREHENSIVE_TREKS } from './treksData';
import { BookingQuote, createBookingQuote } from '../domain/quote';
import { BalancePaymentMethod, Currency, createMoney } from '../domain/money';

export interface VerifiedAgencyProfile {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  about: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  licenseNumber: string;
  taanMemberNumber: string;
  panNumber: string;
  yearEstablished: number;
  primaryLocation: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website: string;
  fleetCount: number;
  licensedGuideCount: number;
  specialties: string[];
  badges: string[];
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    branch: string;
  };
}

export const VERIFIED_AGENCIES: VerifiedAgencyProfile[] = [
  {
    id: 'agency-sherpa-journeys',
    name: 'Sherpa Mountain Journeys Pvt. Ltd.',
    slug: 'sherpa-mountain-journeys',
    tagline: 'Authentic Himalayan mountaineering and high-altitude trekking',
    about: 'Founded by high-altitude UIAGM/IFMGA certified Sherpa climbers born in the Khumbu valley. We specialize in safety-first expeditions, ethical porter treatment, and responsible mountaineering across Sagarmatha and Makalu.',
    logo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=160&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    rating: 4.96,
    reviewCount: 214,
    licenseNumber: 'NTB-LIC-2041/068',
    taanMemberNumber: 'TAAN-REG-0812',
    panNumber: '304892184',
    yearEstablished: 2011,
    primaryLocation: 'Thamel, Kathmandu & Namche Bazaar',
    address: 'Amrit Marg, Chhetrapati / Thamel, Kathmandu, Nepal',
    phone: '+977 1 4701889',
    emergencyPhone: '+977 9851082910',
    email: 'namaste@sherpajourneys.com.np',
    website: 'https://sherpajourneys.com.np',
    fleetCount: 4,
    licensedGuideCount: 18,
    specialties: ['High-Altitude Trekking', 'Everest Expeditions', 'Climbing Clinics'],
    badges: ['NTB Verified', 'TAAN Certified', 'IFMGA Sherpa Guides', 'Fair Wage Employer'],
    bankDetails: {
      bankName: 'NIC ASIA Bank Ltd.',
      accountName: 'Sherpa Mountain Journeys Pvt. Ltd.',
      accountNumber: '0281098239019201',
      swiftCode: 'NICA-NP-KA',
      branch: 'Thamel Branch, Kathmandu',
    },
  },
  {
    id: 'agency-pokhara-trails',
    name: 'Pokhara Eco Treks & Adventures',
    slug: 'pokhara-eco-treks',
    tagline: 'Eco-conscious trekking and multi-sport adventures in Western Nepal',
    about: 'Operating out of Lakeside, Pokhara since 2014. We lead zero-waste expeditions in Annapurna, Mardi Himal, and Dhaulagiri, paired with white water rafting and paragliding combos.',
    logo: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33?w=160&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
    rating: 4.92,
    reviewCount: 178,
    licenseNumber: 'NTB-LIC-1582/071',
    taanMemberNumber: 'TAAN-REG-1044',
    panNumber: '305198234',
    yearEstablished: 2014,
    primaryLocation: 'Lakeside, Pokhara',
    address: 'Baidam Road, Lakeside-6, Pokhara, Nepal',
    phone: '+977 61 465220',
    emergencyPhone: '+977 9846029381',
    email: 'info@pokharaecotreks.com',
    website: 'https://pokharaecotreks.com',
    fleetCount: 3,
    licensedGuideCount: 14,
    specialties: ['Annapurna Circuit', 'Mardi Himal', 'Eco-Camping', 'Pokhara Day Tours'],
    badges: ['NTB Verified', 'TAAN Certified', 'Leave No Trace Partner', 'Local Community Fund'],
    bankDetails: {
      bankName: 'NIC ASIA Bank Ltd.',
      accountName: 'Pokhara Eco Treks & Adventures Pvt. Ltd.',
      accountNumber: '0491029381029382',
      swiftCode: 'NICA-NP-KA',
      branch: 'Lakeside Branch, Pokhara',
    },
  },
  {
    id: 'agency-terai-safari',
    name: 'Terai Wilderness Expeditions',
    slug: 'terai-wilderness',
    tagline: 'Responsible jungle safaris, tiger tracking & birding in Chitwan & Bardia',
    about: 'Specialists in Nepal lowland subtropical biodiversity. We partner with local Tharu naturalists for ethical, non-invasive elephant-free jungle walks, jeep safaris, and canoe excursions.',
    logo: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=160&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56',
    rating: 4.89,
    reviewCount: 94,
    licenseNumber: 'NTB-LIC-1190/073',
    taanMemberNumber: 'NATA-REG-0482',
    panNumber: '306492817',
    yearEstablished: 2016,
    primaryLocation: 'Sauraha, Chitwan & Thakurdwara, Bardia',
    address: 'Elephant Walk Way, Sauraha, Chitwan, Nepal',
    phone: '+977 56 580192',
    emergencyPhone: '+977 9855018273',
    email: 'wildlife@teraiwilderness.np',
    website: 'https://teraiwilderness.np',
    fleetCount: 5,
    licensedGuideCount: 9,
    specialties: ['One-Horned Rhino Safaris', 'Bengal Tiger Tracking', 'Tharu Cultural Immersion'],
    badges: ['NTB Verified', 'Ethical Wildlife Partner', 'Tharu Naturalist Guides'],
    bankDetails: {
      bankName: 'NIC ASIA Bank Ltd.',
      accountName: 'Terai Wilderness Expeditions Pvt. Ltd.',
      accountNumber: '0912019283019281',
      swiftCode: 'NICA-NP-KA',
      branch: 'Narayangarh Branch, Chitwan',
    },
  },
  {
    id: 'agency-river-runners',
    name: 'Himalayan River & Adventure Sports',
    slug: 'himalayan-river-runners',
    tagline: 'Whitewater rafting, canyoning and multi-river kayak expeditions',
    about: 'Pioneers of Nepal whitewater expeditions since 2008. All river guides hold International Rafting Federation (IRF) Class IV/V certifications and Wilderness First Responder diplomas.',
    logo: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=160&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed',
    rating: 4.95,
    reviewCount: 142,
    licenseNumber: 'NTB-LIC-1405/065',
    taanMemberNumber: 'NARA-REG-0118',
    panNumber: '302918273',
    yearEstablished: 2008,
    primaryLocation: 'Kathmandu & Pokhara Depot',
    address: 'Paknajol, Thamel, Kathmandu, Nepal',
    phone: '+977 1 4268192',
    emergencyPhone: '+977 9851029384',
    email: 'rapids@himalayanrivers.com',
    website: 'https://himalayanrivers.com',
    fleetCount: 8,
    licensedGuideCount: 16,
    specialties: ['Trishuli Day Rafting', 'Sun Koshi 8-Day Expedition', 'Bhote Koshi Extreme'],
    badges: ['NTB Verified', 'NARA River Member', 'IRF Certified River Guides'],
    bankDetails: {
      bankName: 'NIC ASIA Bank Ltd.',
      accountName: 'Himalayan River & Adventure Sports Pvt. Ltd.',
      accountNumber: '0182019283746192',
      swiftCode: 'NICA-NP-KA',
      branch: 'Kantipath Branch, Kathmandu',
    },
  },
];

// Additional diverse OTA listings to enrich beyond multi-day treks
export const ADDITIONAL_OTA_LISTINGS: TrekListing[] = [
  {
    id: 'trishuli-rafting-day',
    title: 'Trishuli River White Water Rafting & Cliff Jump (Day Trip)',
    category: 'Rafting',
    categoryColor: '#0EA5E9',
    region: 'Terai / Wildlife',
    location: 'Trishuli River Gorge, Dhading',
    duration: '1 Day',
    durationDays: 1,
    difficulty: 'Moderate',
    maxAltitude: '350m',
    price: 65,
    rating: 4.94,
    reviewCount: 168,
    agencyName: 'Himalayan River & Adventure Sports',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1405/065',
    agencyTaanMember: 'NARA-REG-0118',
    agencyPhone: '+977 1 4268192',
    agencyEmail: 'rapids@himalayanrivers.com',
    nextDate: '2026-10-02',
    availableDates: ['2026-10-02', '2026-10-05', '2026-10-09', '2026-10-14'],
    spotsLeft: 8,
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Best Day Trip', 'Class III+ Rapids', 'Lunch Included', 'Beginner Friendly'],
    description: 'Experience Nepal’s most popular river adventure. Fast-paced Class III/IV rapids, scenic canyon swimming, and buffet riverside lunch included. Direct transport from Kathmandu or Pokhara.',
    bestSeasons: 'Sep – Dec & Mar – Jun',
    groupSize: '4 – 16 Persons',
    itinerary: [
      {
        day: 1,
        title: 'Kathmandu to Charaudi & 3 Hours Whitewater Action',
        altitude: '350m',
        walkingHours: '3 hrs rafting',
        highlights: 'Sneaker Rapid, Monsoon Magic, Cliff Jumping, Riverbank BBQ',
        accommodation: 'Day Return to Kathmandu / Pokhara',
      },
    ],
    included: ['All rafting equipment & helmets', 'Certified IRF River Guide & Safety Kayak', 'Riverside hot buffet lunch', 'Private transportation to/from put-in point'],
    excluded: ['Personal dry clothes', 'Alcoholic beverages', 'Personal travel insurance'],
    gearList: ['Swimwear or quick-dry shorts', 'River sandals with straps (no flip flops)', 'Sunblock and sunglasses strap'],
    altitudeNotice: 'Low altitude river valley. No acclimatization required.',
  },
  {
    id: 'everest-heli-breakfast',
    title: 'Everest Helicopter Scenic Tour & Breakfast at Hotel Everest View',
    category: 'Adventure',
    categoryColor: '#E11D48',
    region: 'Everest',
    location: 'Lukla, Syangboche & Kala Patthar (Flyover)',
    duration: '1 Day (4 Hours)',
    durationDays: 1,
    difficulty: 'Easy',
    maxAltitude: '3,880m (Syangboche Landing)',
    price: 980,
    rating: 4.98,
    reviewCount: 88,
    agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-2041/068',
    agencyTaanMember: 'TAAN-REG-0812',
    agencyPhone: '+977 1 4701889',
    agencyEmail: 'namaste@sherpajourneys.com.np',
    nextDate: '2026-10-04',
    availableDates: ['2026-10-04', '2026-10-06', '2026-10-08', '2026-10-11'],
    spotsLeft: 3,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['VIP Luxury', 'Guaranteed Window Seat', 'Everest Landing', 'Champagne Breakfast'],
    description: 'Fly directly from Kathmandu Tribhuvan Airport over the Khumbu Glacier, Tengboche Monastery, and close to Sagarmatha (Mt. Everest). Land at Hotel Everest View for an unforgettable breakfast facing Ama Dablam.',
    bestSeasons: 'Oct – Dec & Feb – May',
    groupSize: '1 – 5 Persons per flight',
    itinerary: [
      {
        day: 1,
        title: 'Kathmandu Departure, Lukla Refuel, Kala Patthar Flyby & Everest Breakfast',
        altitude: '3,880m',
        walkingHours: '4 hrs total flight & ground time',
        highlights: 'Mount Everest Panorama, Khumbu Icefall aerial views, Syangboche landing',
        accommodation: 'None (Morning Excursion)',
      },
    ],
    included: ['Airbus H125 / B3e helicopter flight', 'Kathmandu hotel airport transfers', 'National Park permit & local tax', 'Breakfast at Hotel Everest View', 'Oxygen set onboard'],
    excluded: ['Personal tips for flight crew', 'Warm jacket rental'],
    gearList: ['Heavy windproof down jacket', 'UV Category 4 sunglasses', 'Camera with extra batteries'],
    altitudeNotice: 'Short 45-minute ground stop at 3,880m. Oxygen available if required.',
  },
  {
    id: 'kathmandu-valley-unesco',
    title: 'Kathmandu Valley 7 UNESCO World Heritage Sites Private Guided Tour',
    category: 'Cultural',
    categoryColor: '#D97706',
    region: 'Terai / Wildlife',
    location: 'Kathmandu, Patan & Bhaktapur',
    duration: '2 Days',
    durationDays: 2,
    difficulty: 'Easy',
    maxAltitude: '1,400m',
    price: 180,
    rating: 4.91,
    reviewCount: 95,
    agencyName: 'Pokhara Eco Treks & Adventures',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1582/071',
    agencyTaanMember: 'TAAN-REG-1044',
    agencyPhone: '+977 61 465220',
    agencyEmail: 'info@pokharaecotreks.com',
    nextDate: '2026-10-01',
    availableDates: ['2026-10-01', '2026-10-03', '2026-10-07', '2026-10-10'],
    spotsLeft: 10,
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Culture & History', 'UNESCO Expert Guide', 'Private A/C Transport', 'Newari Feast'],
    description: 'Immerse in ancient Newari architecture, living goddess Kumari tradition, cremation rituals at Pashupatinath, and the giant stupas of Boudhanath and Swayambhunath.',
    bestSeasons: 'All Year Round',
    groupSize: '1 – 8 Persons',
    itinerary: [
      {
        day: 1,
        title: 'Swayambhunath (Monkey Temple), Kathmandu Durbar Square & Patan',
        altitude: '1,400m',
        walkingHours: '5 hrs sightseeing',
        highlights: 'Living Goddess Kumari, Golden Temple, Newari Woodcrafts',
        accommodation: 'Kathmandu Hotel',
      },
      {
        day: 2,
        title: 'Boudhanath Stupa, Pashupatinath Temple & Ancient Bhaktapur City',
        altitude: '1,400m',
        walkingHours: '5 hrs sightseeing',
        highlights: 'Tibetan prayer wheels, Hindu cremation ghats, 55-Window Palace, King Curd',
        accommodation: 'None',
      },
    ],
    included: ['Certified English/Multilingual UNESCO Heritage Guide', 'Private climate-controlled vehicle', 'All monument entry tickets', 'Authentic Newari cultural lunch on Day 1'],
    excluded: ['Hotel accommodation', 'Personal shopping and pottery purchases'],
    gearList: ['Comfortable walking shoes', 'Modest clothing covering shoulders and knees for temple entry'],
    altitudeNotice: 'Kathmandu valley elevation 1,400m. No altitude concern.',
  },
  {
    id: 'island-peak-climbing-16',
    title: 'Island Peak (Imja Tse 6,189m) Himalayan Mountaineering Expedition',
    category: 'Mountaineering',
    categoryColor: '#E11D48',
    region: 'Everest',
    location: 'Khumbu Valley & Chhukung',
    duration: '16 Days',
    durationDays: 16,
    difficulty: 'Expert',
    maxAltitude: '6,189m',
    price: 2450,
    rating: 4.97,
    reviewCount: 68,
    agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-2041/068',
    agencyTaanMember: 'TAAN-REG-0812',
    agencyPhone: '+977 1 4701889',
    agencyEmail: 'namaste@sherpajourneys.com.np',
    nextDate: '2026-10-15',
    availableDates: ['2026-10-15', '2026-11-01', '2027-04-10', '2027-04-25'],
    spotsLeft: 4,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['6,000m Peak', 'UIAGM Sherpa Guide 1:1', 'Fixed Rope & Crampon Training', 'Base Camp Tents'],
    description: 'The pinnacle classic trekking peak of the Everest region. Includes full acclimatization trek through Namche and Dingboche, hands-on glacier training at Base Camp, and pre-dawn summit assault over the headwall to the 6,189m summit ridge.',
    bestSeasons: 'Apr – May & Oct – Nov',
    groupSize: '2 – 8 Climbers',
    itinerary: [
      {
        day: 1,
        title: 'Kathmandu to Lukla Flight & Trek to Phakding',
        altitude: '2,610m',
        walkingHours: '4 hrs',
        highlights: 'Lukla mountain airstrip, suspension bridges over Dudh Koshi',
        accommodation: 'Teahouse Lodge',
      },
      {
        day: 2,
        title: 'Phakding to Namche Bazaar',
        altitude: '3,440m',
        walkingHours: '6 hrs',
        highlights: 'Hillary Suspension Bridge, first glimpse of Everest',
        accommodation: 'Sherpa Teahouse',
      },
      {
        day: 11,
        title: 'Chhukung to Island Peak Base Camp & Glacier School',
        altitude: '5,200m',
        walkingHours: '4 hrs',
        highlights: 'Jumar and abseil practice on fixed lines with Sherpa instructors',
        accommodation: 'Four-Season Mountain Tents',
      },
      {
        day: 12,
        title: 'Summit Push to 6,189m & Return to Chhukung',
        altitude: '6,189m',
        walkingHours: '10–12 hrs',
        highlights: 'Crampon traverse, summit ridge of Imja Tse, 360-degree panorama of Lhotse and Makalu',
        accommodation: 'Teahouse in Chhukung',
      },
    ],
    included: ['NMA Climbing Permit & Garbage Deposit', '1:1 or 1:2 UIAGM certified Sherpa climbing leader', 'Full group climbing gear (ropes, snow bars, ice screws)', 'High-altitude expedition tents & cook staff at Base Camp'],
    excluded: ['Personal mountaineering boots & crampons', 'Helicopter evacuation insurance (mandatory)'],
    gearList: ['Double climbing boots (rated -20C)', '12-point crampons', 'Ice axe', 'Climbing harness & ascender/jumar'],
    altitudeNotice: 'High-altitude expedition exceeding 6,000m. Strict acclimatization protocol enforced.',
  },
  {
    id: 'bardia-tiger-safari-5',
    title: 'Bardia National Park Untamed Bengal Tiger Tracking & River Float',
    category: 'Wildlife',
    categoryColor: '#16A34A',
    region: 'Terai / Wildlife',
    location: 'Thakurdwara, Bardia National Park (Far-West Nepal)',
    duration: '5 Days',
    durationDays: 5,
    difficulty: 'Moderate',
    maxAltitude: '220m',
    price: 680,
    rating: 4.96,
    reviewCount: 47,
    agencyName: 'Terai Wilderness Expeditions',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1190/073',
    agencyTaanMember: 'NATA-REG-0482',
    agencyPhone: '+977 56 580192',
    agencyEmail: 'wildlife@teraiwilderness.np',
    nextDate: '2026-10-12',
    availableDates: ['2026-10-12', '2026-10-20', '2026-11-05', '2026-11-18'],
    spotsLeft: 6,
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['High Tiger Density', 'Elephant-Free Sanctuary', 'Wild River Float', 'Indigenous Tharu Naturalists'],
    description: 'Nepal’s premier untamed wilderness. Bardia boasts the densest population of Royal Bengal Tigers in Asia without the tourist crowds of Chitwan. Features full-day quiet tracking walks, Geruwa river float for Gangetic dolphins, and Tharu homestay cuisine.',
    bestSeasons: 'Oct – May (Peak sightings Mar – May)',
    groupSize: '2 – 6 Persons',
    itinerary: [
      {
        day: 1,
        title: 'Flight Kathmandu to Nepalgunj & Scenic Drive to Bardia',
        altitude: '200m',
        walkingHours: '2 hrs village walk',
        highlights: 'Tharu traditional mud-brick homesteads, peaceful Karnali river sunset',
        accommodation: 'Eco Jungle Lodge',
      },
      {
        day: 2,
        title: 'Full Day Wilderness Walking Safari in Core Tiger Habitat',
        altitude: '220m',
        walkingHours: '6–7 hrs on foot',
        highlights: 'Machan (watchtower) sit-in, pugmark tracking, one-horned rhinos along waterholes',
        accommodation: 'Eco Jungle Lodge',
      },
      {
        day: 3,
        title: 'Geruwa River Raft Drift & Gangetic Dolphin Watch',
        altitude: '180m',
        walkingHours: '4 hrs river float',
        highlights: 'Gharial crocodiles, wild Asian elephants drinking at riverbank, kingfishers',
        accommodation: 'Eco Jungle Lodge',
      },
    ],
    included: ['All national park entrance & naturalist conservation permits', '2 licensed local Tharu tiger trackers per group', 'Full-board organic meals at eco-lodge', 'Nepalgunj airport pick-up and drop-off in private 4x4'],
    excluded: ['Domestic flight KTM-KEP-KTM', 'Alcoholic beverages', 'Binoculars rental'],
    gearList: ['Muted natural-color clothing (green, khaki, brown; no bright colors)', 'High-magnification binoculars', 'Insect repellent & wide-brim hat'],
    altitudeNotice: 'Lowland Terai altitude 200m. Heat precautions in April/May.',
  },
  {
    id: 'pokhara-paragliding-adventure',
    title: 'Pokhara Sarangkot Tandem Paragliding & Himalayan Aerial Panorama',
    category: 'Adventure',
    categoryColor: '#0284C7',
    region: 'Annapurna',
    location: 'Sarangkot & Phewa Lake, Pokhara',
    duration: 'Half Day',
    durationDays: 1,
    difficulty: 'Easy',
    maxAltitude: '1,600m',
    price: 95,
    rating: 4.93,
    reviewCount: 210,
    agencyName: 'Pokhara Eco Treks & Adventures',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1582/071',
    agencyTaanMember: 'TAAN-REG-1044',
    agencyPhone: '+977 61 465220',
    agencyEmail: 'info@pokharaecotreks.com',
    nextDate: '2026-10-01',
    availableDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
    spotsLeft: 12,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['APPI Certified Pilots', 'GoPro HD Video Included', 'Phewa Lake Landing', 'Hotel Transfers'],
    description: 'Soar like a Himalayan vulture above the Pokhara valley with uninterrupted views of Machapuchare (Fishtail, 6,993m) and the Annapurna range. Thermal gliding over terraced hills and landing gracefully on the shores of Lake Phewa.',
    bestSeasons: 'Sep – Jun',
    groupSize: '1 – 15 Persons',
    itinerary: [
      {
        day: 1,
        title: 'Lakeside Pick-up, Sarangkot Launch (1,600m) & 30-min Thermal Flight',
        altitude: '1,600m',
        walkingHours: '30 mins flight',
        highlights: 'Thermal updrafts, aerial views of Phewa Lake and Annapurna South',
        accommodation: 'None',
      },
    ],
    included: ['APPI/CAAN certified tandem pilot', 'GoPro wide-angle photos & raw 4K video footage on memory card', 'Hotel pick-up from Lakeside Pokhara', 'Full passenger flight insurance'],
    excluded: ['Personal transport outside Lakeside Pokhara'],
    gearList: ['Running shoes or lace-up trainers (no open sandals)', 'Windproof jacket and sunglasses'],
    altitudeNotice: 'No altitude concerns.',
  },
  {
    id: 'sun-koshi-river-expedition-8',
    title: 'Sun Koshi "River of Gold" 8-Day Wilderness Rafting Expedition',
    category: 'Rafting',
    categoryColor: '#0EA5E9',
    region: 'Terai / Wildlife',
    location: 'Dolalghat to Chatara (Eastern Nepal)',
    duration: '8 Days',
    durationDays: 8,
    difficulty: 'Difficult',
    maxAltitude: '620m',
    price: 890,
    rating: 4.97,
    reviewCount: 52,
    agencyName: 'Himalayan River & Adventure Sports',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1405/065',
    agencyTaanMember: 'NARA-REG-0118',
    agencyPhone: '+977 1 4268192',
    agencyEmail: 'rapids@himalayanrivers.com',
    nextDate: '2026-10-25',
    availableDates: ['2026-10-25', '2026-11-10', '2027-03-15'],
    spotsLeft: 6,
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Top 10 World Rivers', 'Class IV/IV+ Rapids', 'Wilderness Beach Campfires', 'Expedition Gear Provided'],
    description: 'Ranked by National Geographic as one of the world’s top ten river journeys. Travel 270 kilometers through deep jungle canyons, ancient Hindu temples, and roaring whitewater rapids before exiting into the Gangetic plains.',
    bestSeasons: 'Oct – Nov & Mar – May',
    groupSize: '4 – 14 Paddlers',
    itinerary: [
      {
        day: 1,
        title: 'Kathmandu to Dolalghat & First Rapids to Dumja',
        altitude: '620m',
        walkingHours: '4 hrs rafting',
        highlights: 'Meatgrinder rapid, riverside camp under starry skies',
        accommodation: 'Wilderness Sand Beach Tents',
      },
      {
        day: 4,
        title: 'Harkapur Gorge & The Big White Rapids',
        altitude: '400m',
        walkingHours: '5 hrs rafting',
        highlights: 'Class IV+ Harkapur I & II, huge wave trains, campfire feast',
        accommodation: 'Wilderness Sand Beach Tents',
      },
      {
        day: 8,
        title: 'Tribeni Confluence, Baraha Chhetra & Chatara Outflow',
        altitude: '120m',
        walkingHours: '3 hrs rafting',
        highlights: 'Ancient riverside shrine, tranquil float to plains',
        accommodation: 'Return to Kathmandu / Biratnagar flight',
      },
    ],
    included: ['Self-bailing expedition rafts & safety kayak escort', 'Full camping equipment (tents, foam mattresses)', '3 hearty hot meals cooked fresh daily by river kitchen staff', 'Waterproof dry bags for personal gear'],
    excluded: ['Domestic flight Biratnagar to Kathmandu on Day 8', 'Sleeping bag (available for rent)'],
    gearList: ['River sandals with secure straps', 'Quick-dry thermals', 'Headlamp with red light mode', 'Biodegradable soap'],
    altitudeNotice: 'Lowland river system. No altitude sickness risk.',
  },
  {
    id: 'lumbini-peace-pilgrimage-3',
    title: 'Lumbini Sacred Birthplace of Lord Buddha & Kapilavastu Heritage Tour',
    category: 'Cultural',
    categoryColor: '#D97706',
    region: 'Terai / Wildlife',
    location: 'Lumbini Sacred Garden & Kapilavastu Kingdom',
    duration: '3 Days',
    durationDays: 3,
    difficulty: 'Easy',
    maxAltitude: '150m',
    price: 290,
    rating: 4.88,
    reviewCount: 41,
    agencyName: 'Terai Wilderness Expeditions',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1190/073',
    agencyTaanMember: 'NATA-REG-0482',
    agencyPhone: '+977 56 580192',
    agencyEmail: 'wildlife@teraiwilderness.np',
    nextDate: '2026-10-08',
    availableDates: ['2026-10-08', '2026-10-18', '2026-11-02', '2026-11-20'],
    spotsLeft: 8,
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['UNESCO World Heritage', 'Maya Devi Temple Marker Stone', 'World Buddhist Monasteries', 'Meditation Sessions'],
    description: 'Visit the exact birthplace of Siddhartha Gautama (Buddha) in 623 BC. Explore the ancient Ashoka Pillar, sacred Puskarini bathing pond, monastic zones built by 30+ nations, and the archaeological ruins of Prince Siddhartha’s childhood palace in Tilaurakot.',
    bestSeasons: 'Sep – Apr',
    groupSize: '1 – 10 Persons',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bhairahawa / Lumbini & Sacred Garden Sunset',
        altitude: '150m',
        walkingHours: '3 hrs walk',
        highlights: 'Maya Devi Temple, Nativity stone marker, Ashoka Pillar inscription',
        accommodation: 'Peace Garden Hotel Lumbini',
      },
      {
        day: 2,
        title: 'East & West Monastic Zones Exploration by Eco-Bicycle',
        altitude: '150m',
        walkingHours: '4 hrs eco cycling',
        highlights: 'Royal Thai Monastery, German Lotus Stupa, Tibetan Gompa, World Peace Pagoda',
        accommodation: 'Peace Garden Hotel Lumbini',
      },
    ],
    included: ['Licensed Buddhist scholar & cultural heritage guide', 'All monument and archaeological site admissions', 'Private electric vehicle or quality hybrid bicycles', 'Meditation session at monastic enclave'],
    excluded: ['Meals not specified', 'Kathmandu to Bhairahawa domestic airfare'],
    gearList: ['Easy slip-on shoes for frequent temple entry', 'Modest clothing covering knees and shoulders', 'Sun protection hat'],
    altitudeNotice: 'Terai plains 150m. Gentle terrain.',
  },
  {
    id: 'mardi-himal-ridge-trek-6',
    title: 'Mardi Himal Secret Ridge Trek & Machapuchare Base Camp (Close-Up)',
    category: 'Trekking',
    categoryColor: '#1B7A5A',
    region: 'Annapurna',
    location: 'Kande, Forest Camp, High Camp & Mardi Viewpoint',
    duration: '6 Days',
    durationDays: 6,
    difficulty: 'Moderate',
    maxAltitude: '4,500m',
    price: 520,
    rating: 4.95,
    reviewCount: 138,
    agencyName: 'Pokhara Eco Treks & Adventures',
    agencyVerified: true,
    agencyLicense: 'NTB-LIC-1582/071',
    agencyTaanMember: 'TAAN-REG-1044',
    agencyPhone: '+977 61 465220',
    agencyEmail: 'info@pokharaecotreks.com',
    nextDate: '2026-10-06',
    availableDates: ['2026-10-06', '2026-10-12', '2026-10-22', '2026-11-04'],
    spotsLeft: 7,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Uncrowded Trail', 'Machapuchare Fishtail Views', 'Rhododendron Forest', 'Teahouse Trek'],
    description: 'The hidden gem of the Annapurna sanctuary. Hike along a razor-sharp mountain ridge above the clouds, directly beneath the sacred, unclimbed south face of Mount Machapuchare.',
    bestSeasons: 'Sep – Dec & Mar – May',
    groupSize: '2 – 10 Trekkers',
    itinerary: [
      {
        day: 1,
        title: 'Drive Pokhara to Kande & Trek to Australian Camp / Pothana',
        altitude: '1,900m',
        walkingHours: '3–4 hrs',
        highlights: 'Fishtail mountain views, Gurung stone paved staircases',
        accommodation: 'Mountain Lodge',
      },
      {
        day: 4,
        title: 'High Camp Sunrise Hike to Mardi Himal Viewpoint (4,500m)',
        altitude: '4,500m',
        walkingHours: '6–7 hrs',
        highlights: 'Face-to-face with Machapuchare, Annapurna I and Hiunchuli at dawn',
        accommodation: 'High Camp Teahouse',
      },
    ],
    included: ['ACAP Conservation Permit & TIMS Card', 'Licensed English-speaking Annapurna trekking guide & porter', 'All teahouse accommodation & three meals a day', 'Private vehicle transfers from Pokhara hotel'],
    excluded: ['Bar bills & hot showers on trail', 'Personal trekking equipment'],
    gearList: ['Sturdy hiking boots with ankle support', 'Trekking poles', 'Thermal layers & down jacket (-10C)'],
    altitudeNotice: 'Ridge walk reaches 4,500m. Acclimatization built into itinerary.',
  },
];

// Complete OTA catalog combining treks with diverse activities
export const ALL_OTA_LISTINGS: TrekListing[] = [
  ...COMPREHENSIVE_TREKS,
  ...ADDITIONAL_OTA_LISTINGS,
];

/**
 * Persisted OTA Booking Record Model
 * Accurately models the 15% Platform Reservation Fee and 85% Agency Balance.
 */
export interface OTABookingRecord {
  id: string;
  bookingReference: string;
  quoteId: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  category: string;
  agencyId: string;
  agencyName: string;
  agencyLicense: string;
  agencyPhone: string;
  agencyEmail: string;
  departureDate: string;
  guestCount: number;
  currency: Currency;
  
  // Financial breakdown
  unitPrice: number;
  totalProductValue: number;       // Gross ($100 * guests)
  
  platformFeeRate: number;         // 0.15 (15%)
  platformFeeAmount: number;       // $15 * guests (PAID NOW)
  platformFeeStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  platformPaymentReference: string;
  platformPaidAt: string;
  
  agencyBalanceRate: number;       // 0.85 (85%)
  agencyBalanceAmount: number;     // $85 * guests (PAID LATER)
  remainingBalanceMethod: BalancePaymentMethod;
  agencyBalanceStatus: 'DUE_ON_ARRIVAL' | 'HELD_IN_PLATFORM_ESCROW' | 'CONFIRMED_PAID_TO_AGENCY' | 'SETTLED_TO_AGENCY';
  
  // Lead traveler details
  travelerId: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  nationality: string;
  passportNumber?: string;
  dietaryPreferences?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Status & Timestamps
  bookingStatus: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  confirmedAt: string;
}

const STORAGE_KEY_BOOKINGS = 'into_nepal_ota_bookings_v1';

// Seed initial authentic bookings for testing
const INITIAL_SEED_BOOKINGS: OTABookingRecord[] = [
  {
    id: 'bkg-seed-001',
    bookingReference: 'IN-2026-981240',
    quoteId: 'quote-seed-1',
    listingId: 'ebc-classic-14',
    listingTitle: 'Everest Base Camp & Kala Patthar High-Altitude Trek',
    listingImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    category: 'Trekking',
    agencyId: 'agency-sherpa-journeys',
    agencyName: 'Sherpa Mountain Journeys Pvt. Ltd.',
    agencyLicense: 'NTB-LIC-2041/068',
    agencyPhone: '+977 1 4701889',
    agencyEmail: 'namaste@sherpajourneys.com.np',
    departureDate: '2026-10-15',
    guestCount: 2,
    currency: 'USD',
    unitPrice: 1399,
    totalProductValue: 2798,
    platformFeeRate: 0.15,
    platformFeeAmount: 419.70, // 15% of $2,798
    platformFeeStatus: 'PAID',
    platformPaymentReference: 'NIC_SIM_2026_981240',
    platformPaidAt: '2026-09-10T14:30:00Z',
    agencyBalanceRate: 0.85,
    agencyBalanceAmount: 2378.30, // 85% of $2,798
    remainingBalanceMethod: 'DIRECT_TO_AGENCY',
    agencyBalanceStatus: 'DUE_ON_ARRIVAL',
    travelerId: 'traveler-alex',
    travelerName: 'Alex Mercer',
    travelerEmail: 'alex@example.com',
    travelerPhone: '+1 415 890 1234',
    nationality: 'United States',
    passportNumber: 'USA-9812401',
    dietaryPreferences: 'Vegetarian on trail',
    emergencyContactName: 'Laura Mercer',
    emergencyContactPhone: '+1 415 890 9999',
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-09-10T14:25:00Z',
    confirmedAt: '2026-09-10T14:30:00Z',
  },
  {
    id: 'bkg-seed-002',
    bookingReference: 'IN-2026-441092',
    quoteId: 'quote-seed-2',
    listingId: 'annapurna-circuit-12',
    listingTitle: 'Annapurna Circuit & Thorong La Pass Remote Trek',
    listingImage: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
    category: 'Trekking',
    agencyId: 'agency-pokhara-trails',
    agencyName: 'Pokhara Eco Treks & Adventures',
    agencyLicense: 'NTB-LIC-1582/071',
    agencyPhone: '+977 61 465220',
    agencyEmail: 'info@pokharaecotreks.com',
    departureDate: '2026-11-04',
    guestCount: 1,
    currency: 'USD',
    unitPrice: 1050,
    totalProductValue: 1050,
    platformFeeRate: 0.15,
    platformFeeAmount: 157.50, // 15% of $1,050
    platformFeeStatus: 'PAID',
    platformPaymentReference: 'NIC_SIM_2026_441092',
    platformPaidAt: '2026-09-12T09:15:00Z',
    agencyBalanceRate: 0.85,
    agencyBalanceAmount: 892.50, // 85% of $1,050
    remainingBalanceMethod: 'INTO_NEPAL_PLATFORM',
    agencyBalanceStatus: 'HELD_IN_PLATFORM_ESCROW',
    travelerId: 'traveler-alex',
    travelerName: 'Alex Mercer',
    travelerEmail: 'alex@example.com',
    travelerPhone: '+1 415 890 1234',
    nationality: 'United States',
    passportNumber: 'USA-9812401',
    dietaryPreferences: 'None',
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-09-12T09:10:00Z',
    confirmedAt: '2026-09-12T09:15:00Z',
  },
];

export function getStoredBookings(): OTABookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading stored bookings, using seeds:', err);
    return INITIAL_SEED_BOOKINGS;
  }
}

export function saveStoredBooking(record: OTABookingRecord): void {
  try {
    const current = getStoredBookings();
    const updated = [record, ...current.filter((b) => b.id !== record.id)];
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));

    // Dispatch real-time events for active components and other tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('into_nepal_booking_created', { detail: record }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (err) {
    console.error('Error saving stored booking:', err);
  }
}

/**
 * Real-time event subscription for live booking updates across client sessions
 */
export function subscribeToBookings(
  callback: (newBooking: OTABookingRecord) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    const customEvent = e as CustomEvent<OTABookingRecord>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY_BOOKINGS && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          callback(parsed[0]);
        }
      } catch {
        // ignore parse error
      }
    }
  };

  window.addEventListener('into_nepal_booking_created', handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('into_nepal_booking_created', handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

export function getBookingsForTraveler(travelerEmailOrId?: string): OTABookingRecord[] {
  const all = getStoredBookings();
  if (!travelerEmailOrId) return all;
  const target = travelerEmailOrId.toLowerCase();
  return all.filter(
    (b) =>
      b.travelerId.toLowerCase() === target ||
      b.travelerEmail.toLowerCase() === target ||
      target === 'user' ||
      target === 'demo'
  );
}

export function getBookingsForAgency(agencyIdOrName?: string): OTABookingRecord[] {
  const all = getStoredBookings();
  if (!agencyIdOrName) return all;
  const target = agencyIdOrName.toLowerCase();
  return all.filter(
    (b) =>
      b.agencyId.toLowerCase() === target ||
      b.agencyName.toLowerCase().includes(target) ||
      target === 'agency'
  );
}
