export interface AltitudeProtocol {
  altitudeMeters: number;
  altitudeFeet: number;
  keyWaypoints: string[];
  oxygenPercentage: number;
  recommendations: string[];
  dailyAscentMaxMeters: number;
  symptomsToWatch: string[];
}

export interface LakeLouiseQuestion {
  id: string;
  category: string;
  title: string;
  options: {
    points: number;
    label: string;
    description: string;
  }[];
}

export interface PermitRule {
  regionId: string;
  regionName: string;
  majorTreks: string[];
  requiresRestrictedPermit: boolean;
  mandatoryGuide: boolean;
  permits: {
    name: string;
    issuingAuthority: string;
    costNpr: number;
    costUsdBase: number;
    durationNotes: string;
    documentsRequired: string[];
  }[];
  seasonalSurcharges?: {
    season: string;
    months: string;
    feeDescription: string;
  }[];
  specialRules: string[];
}

export interface GearItem {
  id: string;
  category: 'clothing_layers' | 'footwear' | 'sleep_pack' | 'health_water' | 'electronics' | 'documents';
  name: string;
  importance: 'mandatory' | 'recommended' | 'optional';
  seasons: ('spring' | 'autumn' | 'winter' | 'monsoon')[];
  minAltitudeMeters: number;
  description: string;
  rentalEstimateDailyUsd?: number;
  purchaseEstimateUsd?: number;
}

export interface MountainWeatherStation {
  id: string;
  region: 'everest' | 'annapurna' | 'langtang' | 'manaslu';
  name: string;
  altitudeMeters: number;
  altitudeFeet: number;
  status: 'optimal' | 'caution' | 'challenging';
  currentTempDayC: number;
  currentTempNightC: number;
  windSpeedKmh: number;
  condition: string;
  visibilityKm: number;
  trailStatus: string;
  flightStatus?: string;
  lastUpdated: string;
  advisory: string;
}

export const ALTITUDE_TIERS: AltitudeProtocol[] = [
  {
    altitudeMeters: 2800,
    altitudeFeet: 9186,
    keyWaypoints: ['Lukla (2,846m)', 'Phakding (2,610m)', 'Syabrubesi (1,503m)', 'Chamje (1,430m)'],
    oxygenPercentage: 74,
    dailyAscentMaxMeters: 800,
    recommendations: [
      'Normal acclimatization tier. Drink minimum 3 liters of purified water daily.',
      'Maintain an easy conversation pace ("bistari, bistari" in Nepali: slowly, slowly).',
      'Avoid sleeping pills and alcohol which depress respiratory drive.',
    ],
    symptomsToWatch: ['Mild dehydration headache', 'Slight fatigue'],
  },
  {
    altitudeMeters: 3500,
    altitudeFeet: 11482,
    keyWaypoints: ['Namche Bazaar (3,440m)', 'Manang (3,519m)', 'Kyanjin Gompa (3,870m)', 'Ghorepani (2,874m)'],
    oxygenPercentage: 66,
    dailyAscentMaxMeters: 500,
    recommendations: [
      'MANDATORY acclimatization rest day required upon reaching 3,400m–3,500m.',
      'Active acclimatization: "Climb high, sleep low" (e.g. hike to Everest View Hotel 3,880m and sleep at Namche).',
      'Max sleep elevation gain from here onward is strictly 300m - 500m per night.',
      'Consider prophylactic Diamox (Acetazolamide 125mg BID) if previous history of AMS.',
    ],
    symptomsToWatch: ['Throbbing morning headache', 'Loss of appetite', 'Lightheadedness upon standing'],
  },
  {
    altitudeMeters: 4500,
    altitudeFeet: 14763,
    keyWaypoints: ['Dingboche (4,410m)', 'Tengboche (3,867m)', 'Machhermo (4,470m)', 'Yak Kharka (4,050m)'],
    oxygenPercentage: 58,
    dailyAscentMaxMeters: 400,
    recommendations: [
      'Second mandatory acclimatization rest day (e.g., Dingboche to Nangkartshang Peak 5,083m).',
      'Check resting pulse oximeter twice daily (morning & evening) with your lead guide.',
      'Typical SpO2 saturation drops to 75%-85% here. Under 70% with dyspnea warrants descent.',
      'Dress in insulated windproof layers before sunset as temperatures plummet below -10°C.',
    ],
    symptomsToWatch: ['Nausea/vomiting', 'Insomnia due to Cheyne-Stokes periodic breathing', 'Persistent dry cough'],
  },
  {
    altitudeMeters: 5500,
    altitudeFeet: 18044,
    keyWaypoints: ['Everest Base Camp (5,364m)', 'Kala Patthar (5,644m)', 'Thorong La Pass (5,416m)', 'Cho La Pass (5,420m)', 'Larkya La (5,106m)'],
    oxygenPercentage: 50,
    dailyAscentMaxMeters: 300,
    recommendations: [
      'Extreme high altitude: Effective oxygen is half of sea-level pressure.',
      'Limit summit exposure (Kala Patthar / Thorong La) to 30-45 minutes before starting immediate descent.',
      'Any signs of ataxia (heel-to-toe walking instability) or pink frothy sputum require immediate emergency descent + oxygen + helicopter dispatch.',
      'Never leave a symptomatic trekker unaccompanied.',
    ],
    symptomsToWatch: ['Confusion, ataxia (HACE)', 'Shortness of breath at rest, bubbling lung sounds (HAPE)', 'Severe lethargy'],
  },
];

export const LAKE_LOUISE_SURVEY: LakeLouiseQuestion[] = [
  {
    id: 'll_headache',
    category: 'Headache',
    title: 'Headache Severity',
    options: [
      { points: 0, label: 'None', description: 'No headache whatsoever' },
      { points: 1, label: 'Mild', description: 'Mild headache, dull or throbbing occasionally' },
      { points: 2, label: 'Moderate', description: 'Moderate headache that responds slowly to paracetamol/ibuprofen' },
      { points: 3, label: 'Severe', description: 'Severe, incapacitating headache that prevents normal movement' },
    ],
  },
  {
    id: 'll_gi',
    category: 'Gastrointestinal',
    title: 'Gastrointestinal Symptoms',
    options: [
      { points: 0, label: 'Normal Appetite', description: 'Good appetite, normal digestion' },
      { points: 1, label: 'Poor Appetite / Nausea', description: 'Loss of appetite or slight stomach queasiness' },
      { points: 2, label: 'Moderate Nausea', description: 'Moderate nausea or occasional vomiting' },
      { points: 3, label: 'Severe Vomiting', description: 'Severe, persistent nausea and repeated vomiting' },
    ],
  },
  {
    id: 'll_fatigue',
    category: 'Fatigue',
    title: 'Fatigue and Weakness',
    options: [
      { points: 0, label: 'Normal Energy', description: 'Normal energy level appropriate for trekking effort' },
      { points: 1, label: 'Mild Fatigue', description: 'Mild tiredness or general weakness' },
      { points: 2, label: 'Moderate Fatigue', description: 'Moderate weakness; struggles to carry daypack or keep pace' },
      { points: 3, label: 'Severe Exhaustion', description: 'Severe weakness; unable to walk without physical support' },
    ],
  },
  {
    id: 'll_dizziness',
    category: 'Dizziness',
    title: 'Dizziness / Lightheadedness',
    options: [
      { points: 0, label: 'None', description: 'Clear head, balanced' },
      { points: 1, label: 'Mild Dizziness', description: 'Occasional lightheadedness upon standing quickly' },
      { points: 2, label: 'Moderate Dizziness', description: 'Frequent spinning sensation or feeling unsteady' },
      { points: 3, label: 'Severe Vertigo', description: 'Incapacitating dizziness, losing balance while sitting' },
    ],
  },
  {
    id: 'll_functional',
    category: 'Functionality',
    title: 'Functional Impact on Trekking Activities',
    options: [
      { points: 0, label: 'No Impairment', description: 'Able to hike, eat, and socialize normally' },
      { points: 1, label: 'Mild Impairment', description: 'Walking slightly slower, but can complete the daily itinerary' },
      { points: 2, label: 'Moderate Impairment', description: 'Must stop frequently; unable to carry daypack' },
      { points: 3, label: 'Bedridden', description: 'Cannot leave bed/teahouse; cannot participate in any trekking' },
    ],
  },
];

export const PERMIT_RULES: PermitRule[] = [
  {
    regionId: 'everest_khumbu',
    regionName: 'Everest & Khumbu Region',
    majorTreks: ['Everest Base Camp (EBC)', 'Gokyo Lakes & Cho La Pass', 'Three Passes Trek', 'Mera Peak'],
    requiresRestrictedPermit: false,
    mandatoryGuide: false, // Solukhumbu autonomous municipality allows independent entry, but highly advised
    permits: [
      {
        name: 'Khumbu Pasang Lhamu Rural Municipality Permit',
        issuingAuthority: 'Khumbu Local Government (Lukla or Monjo checkpoint)',
        costNpr: 3000,
        costUsdBase: 23,
        durationNotes: 'Valid for full duration of stay in Khumbu municipality',
        documentsRequired: ['Original Passport', 'Flight Ticket to Lukla or Phaplu'],
      },
      {
        name: 'Sagarmatha National Park Entry Permit',
        issuingAuthority: 'Department of National Parks (Monjo or Nepal Tourism Board Kathmandu)',
        costNpr: 3000,
        costUsdBase: 23,
        durationNotes: 'Single entry permit into the UNESCO World Heritage National Park',
        documentsRequired: ['Passport copy', '2 passport photos (if issuing in Kathmandu)'],
      },
    ],
    specialRules: [
      'TIMS Card is NOT required for the Everest region (replaced by local Khumbu Municipality card in 2018).',
      'Trekker identification card must be carried at all times for military checkpoints at Jorsalle, Namche, and Dingboche.',
    ],
  },
  {
    regionId: 'annapurna',
    regionName: 'Annapurna Conservation Region',
    majorTreks: ['Annapurna Circuit (Thorong La)', 'Annapurna Base Camp (ABC)', 'Poon Hill & Ghorepani', 'Mardi Himal'],
    requiresRestrictedPermit: false,
    mandatoryGuide: true, // NTB 2023 mandate
    permits: [
      {
        name: 'ACAP (Annapurna Conservation Area Project Permit)',
        issuingAuthority: 'National Trust for Nature Conservation (NTNC / NTB Kathmandu or Pokhara)',
        costNpr: 3000,
        costUsdBase: 23,
        durationNotes: 'Single entry, valid for duration of trek',
        documentsRequired: ['Original Passport', '2 passport-size photographs', 'Emergency contact info'],
      },
      {
        name: 'TIMS Card (Trekkers Information Management System)',
        issuingAuthority: 'TAAN (Trekking Agencies’ Association of Nepal) via licensed agency',
        costNpr: 2000,
        costUsdBase: 15,
        durationNotes: 'Blue TIMS card for organized trekkers accompanied by a licensed guide',
        documentsRequired: ['Passport copy', '2 photos', 'Agency verification code', 'Insurance policy number'],
      },
    ],
    specialRules: [
      'Mandatory Licensed Guide Rule: As of April 1, 2023, independent/solo foreign trekking in Annapurna is restricted without a certified Nepali guide.',
      'Checkpoints exist at Birethanti, Dharapani, Chame, Manang, and Muktinath.',
    ],
  },
  {
    regionId: 'langtang_helambu',
    regionName: 'Langtang & Helambu Region',
    majorTreks: ['Langtang Valley Trek', 'Gosainkunda Frozen Lakes', 'Helambu Cultural Trek', 'Tamang Heritage Trail'],
    requiresRestrictedPermit: false,
    mandatoryGuide: true,
    permits: [
      {
        name: 'Langtang National Park Entry Permit',
        issuingAuthority: 'Department of National Parks (Dhunche / Syabrubesi or NTB Kathmandu)',
        costNpr: 3000,
        costUsdBase: 23,
        durationNotes: 'Single entry permit',
        documentsRequired: ['Original Passport', 'Entry stamp verification'],
      },
      {
        name: 'TIMS Card',
        issuingAuthority: 'TAAN via authorized agency',
        costNpr: 2000,
        costUsdBase: 15,
        durationNotes: 'Mandatory agency-sponsored registration',
        documentsRequired: ['Passport copy', 'Insurance details'],
      },
    ],
    specialRules: [
      'If connecting Langtang with Helambu via Gosainkunda Pass, an additional Shivapuri Nagarjun National Park entry ticket (NPR 1,000) is verified at Sundarijal.',
    ],
  },
  {
    regionId: 'manaslu_restricted',
    regionName: 'Manaslu Circuit (Restricted Area)',
    majorTreks: ['Manaslu Circuit Trek (Larkya La 5,106m)', 'Tsum Valley Hidden Valley Trek'],
    requiresRestrictedPermit: true,
    mandatoryGuide: true,
    permits: [
      {
        name: 'Department of Immigration Restricted Area Permit (RAP)',
        issuingAuthority: 'Department of Immigration (Maitighar, Kathmandu via registered agency only)',
        costNpr: 13450,
        costUsdBase: 100,
        durationNotes: 'Autumn (Sep-Nov): $100 for first 7 days + $15/day thereafter. Spring/Winter: $75/week + $10/day.',
        documentsRequired: ['Original passport with valid Nepal visa', 'Minimum group size of 2 trekkers', 'Licensed guide assigned by TAAN agency'],
      },
      {
        name: 'MCAP (Manaslu Conservation Area Permit)',
        issuingAuthority: 'NTNC / NTB Kathmandu',
        costNpr: 3000,
        costUsdBase: 23,
        durationNotes: 'Valid for entry from Jagat to Larkya La',
        documentsRequired: ['Passport copy', '2 passport photos'],
      },
      {
        name: 'ACAP (Annapurna Conservation Area Permit)',
        issuingAuthority: 'NTNC / NTB Kathmandu',
        costNpr: 3000,
        costUsdBase: 23,
        durationNotes: 'Mandatory because trek exits through Dharapani / Besisahar (Annapurna territory)',
        documentsRequired: ['Passport copy', '2 passport photos'],
      },
    ],
    seasonalSurcharges: [
      {
        season: 'Autumn Peak (September - November)',
        months: 'Sep 01 - Nov 30',
        feeDescription: '$100 USD per person for first 7 days, then $15 USD per person per day',
      },
      {
        season: 'Winter, Spring & Summer (December - August)',
        months: 'Dec 01 - Aug 31',
        feeDescription: '$75 USD per person for first 7 days, then $10 USD per person per day',
      },
    ],
    specialRules: [
      'STRICT REGULATION: Minimum 2 foreign trekkers required to apply for the RAP. Solo permits are never issued.',
      'Must be accompanied by a government-licensed Nepali trekking guide from start to finish.',
      'Satellite phones and drones require separate Ministry of Information and Civil Aviation clearance.',
    ],
  },
];

export const GEAR_CHECKLIST: GearItem[] = [
  // Layering & Clothing
  {
    id: 'gear-down-jacket',
    category: 'clothing_layers',
    name: 'Heavy Down Jacket (-15°C to -20°C rated, 700+ fill power)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 3000,
    description: 'Essential for teahouses and early morning pass crossings where indoor heating is limited to dining room stoves in the evenings.',
    rentalEstimateDailyUsd: 1.5,
    purchaseEstimateUsd: 120,
  },
  {
    id: 'gear-hardshell',
    category: 'clothing_layers',
    name: 'Gore-Tex / Waterproof Windproof Shell Jacket with Hood',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Protects against biting alpine gales at mountain passes and unexpected Himalayan precipitation.',
    rentalEstimateDailyUsd: 1.0,
    purchaseEstimateUsd: 85,
  },
  {
    id: 'gear-thermal-base',
    category: 'clothing_layers',
    name: 'Merino Wool Thermal Base Layers (2 sets: Top & Bottom)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 2500,
    description: 'Merino wool wicks moisture, regulates body temp, and resists odor for 10+ days on the trail without washing.',
    purchaseEstimateUsd: 65,
  },
  {
    id: 'gear-fleece-mid',
    category: 'clothing_layers',
    name: 'Polartec 200 Fleece Jacket or Lightweight Active Puffer',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 2000,
    description: 'Mid-layer worn during cold morning departures before body temperature warms up.',
    purchaseEstimateUsd: 45,
  },
  {
    id: 'gear-gloves-inner',
    category: 'clothing_layers',
    name: 'Thermal Liner Gloves + Waterproof Insulated Alpine Mitts',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 3500,
    description: 'Layered hand system prevents frostbite when ascending high passes (Thorong La / Kala Patthar) at 4:00 AM.',
    purchaseEstimateUsd: 35,
  },
  // Footwear
  {
    id: 'gear-boots',
    category: 'footwear',
    name: 'Broken-in Waterproof Trekking Boots with Ankle Support',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Do NOT wear brand new boots. Ensure they are well broken-in before arriving in Nepal to avoid debilitating blisters.',
    purchaseEstimateUsd: 150,
  },
  {
    id: 'gear-socks',
    category: 'footwear',
    name: 'Heavy Merino Hiking Socks (4-5 pairs) + Liner Socks',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 2000,
    description: 'Cushions feet against stone stairs and prevents friction blisters on 6-8 hour daily hiking segments.',
    purchaseEstimateUsd: 40,
  },
  {
    id: 'gear-microspikes',
    category: 'footwear',
    name: 'Trail Microspikes / Slip-on Traction Cleats',
    importance: 'recommended',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 4500,
    description: 'Vital when crossing frozen scree, ice patches on Cho La Pass, or packed snow on Thorong La.',
    rentalEstimateDailyUsd: 0.8,
    purchaseEstimateUsd: 18,
  },
  {
    id: 'gear-camp-shoes',
    category: 'footwear',
    name: 'Lightweight Teahouse Slippers or Down Booties',
    importance: 'recommended',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Lets your feet breathe and recover after removing heavy hiking boots inside teahouses.',
    purchaseEstimateUsd: 15,
  },
  // Sleep & Pack
  {
    id: 'gear-sleeping-bag',
    category: 'sleep_pack',
    name: 'Four-Season Alpine Sleeping Bag (-15°C to -20°C comfort rating)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 3000,
    description: 'Teahouse unheated rooms drop below freezing. While blankets are available, they are often insufficient above 4,000m.',
    rentalEstimateDailyUsd: 1.5,
    purchaseEstimateUsd: 140,
  },
  {
    id: 'gear-duffel-bag',
    category: 'sleep_pack',
    name: '80L–90L Heavy-Duty Water-Resistant Duffel Bag (for Porter)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Maximum weight carried by your porter is legally capped at 15kg per trekker under ethical Himalayan porter welfare standards.',
    purchaseEstimateUsd: 35,
  },
  {
    id: 'gear-daypack',
    category: 'sleep_pack',
    name: '28L–35L Daypack with Raincover (Traveler Carries)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Holds your water bottles, extra fleece, rain jacket, camera, sunscreen, and emergency medical kit during the hike.',
    purchaseEstimateUsd: 65,
  },
  {
    id: 'gear-trekking-poles',
    category: 'sleep_pack',
    name: 'Telescopic Aluminum or Carbon Trekking Poles (Pair)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Reduces impact forces on knee joints by up to 25% during steep stone stair descents (e.g. Ulleri or Namche hill).',
    rentalEstimateDailyUsd: 0.8,
    purchaseEstimateUsd: 22,
  },
  // Health & Water
  {
    id: 'gear-water-filtration',
    category: 'health_water',
    name: 'Water Filter (Sawyer Squeeze/LifeStraw) + Chlorine Dioxide Tabs',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Protects against Giardia. Eliminates single-use plastic bottles which are banned in Khumbu municipality.',
    purchaseEstimateUsd: 35,
  },
  {
    id: 'gear-diamox',
    category: 'health_water',
    name: 'Diamox (Acetazolamide 125mg or 250mg) + Personal Meds',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 3000,
    description: 'Accelerates altitude acclimatization. Carry blister Compeed plasters, rehydration salts (ORS), and broad-spectrum antibiotics (Ciprofloxacin/Azithromycin).',
    purchaseEstimateUsd: 15,
  },
  {
    id: 'gear-sunglasses',
    category: 'health_water',
    name: 'Category 3 or 4 Glacier Sunglasses (100% UV Protection)',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 3500,
    description: 'Himalayan snow glare can cause irreversible snow blindness in hours without proper side-shield eye protection.',
    purchaseEstimateUsd: 40,
  },
  // Electronics & Documents
  {
    id: 'gear-powerbank',
    category: 'electronics',
    name: '20,000mAh Cold-Resistant Power Bank with Fast Charging',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 2500,
    description: 'Teahouses charge $3–$7 USD per device charging hour at higher elevations. Keep powerbank inside your sleeping bag at night.',
    purchaseEstimateUsd: 38,
  },
  {
    id: 'gear-headlamp',
    category: 'electronics',
    name: 'LED Headlamp (300+ lumens) with Spare Rechargeable Batteries',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter'],
    minAltitudeMeters: 2000,
    description: 'Crucial for pre-dawn pass ascents (e.g. 3:30 AM starts for Thorong La or Poon Hill) and unlit teahouse hallways.',
    purchaseEstimateUsd: 28,
  },
  {
    id: 'gear-docs',
    category: 'documents',
    name: 'Waterproof Document Pouch with 4x Passport Photos + Cash in NPR',
    importance: 'mandatory',
    seasons: ['autumn', 'spring', 'winter', 'monsoon'],
    minAltitudeMeters: 2000,
    description: 'Trail checkpoints verify physical permits. Remote teahouses and checkpoints do not accept credit cards or foreign currency.',
    purchaseEstimateUsd: 12,
  },
];

export const MOUNTAIN_WEATHER_STATIONS: MountainWeatherStation[] = [
  {
    id: 'weather-lukla',
    region: 'everest',
    name: 'Lukla / Tenzing-Hillary Airport',
    altitudeMeters: 2846,
    altitudeFeet: 9337,
    status: 'optimal',
    currentTempDayC: 14,
    currentTempNightC: 2,
    windSpeedKmh: 12,
    condition: 'Crisp Morning Sunshine, Afternoon Ridge Fog',
    visibilityKm: 15,
    trailStatus: 'Open & Dry',
    flightStatus: 'Operating Visual Flight Rules (Morning Departure Window 06:00 - 11:30 AM)',
    lastUpdated: 'Live Ground Telemetry (Automated Sync)',
    advisory: 'Twin Otter mountain flights running smoothly from Ramechhap and Kathmandu. Book early morning slots to avoid afternoon thermal crosswinds.',
  },
  {
    id: 'weather-namche',
    region: 'everest',
    name: 'Namche Bazaar (Sherpa Capital)',
    altitudeMeters: 3440,
    altitudeFeet: 11286,
    status: 'optimal',
    currentTempDayC: 11,
    currentTempNightC: -2,
    windSpeedKmh: 14,
    condition: 'Clear Himalayan Panoramas',
    visibilityKm: 25,
    trailStatus: 'Clear Stone Trails, Good Footing',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Kongde Ri & Thamserku visible with clear blue skies. Acclimatization hike to Everest View Hotel highly recommended.',
  },
  {
    id: 'weather-ebc',
    region: 'everest',
    name: 'Gorak Shep & Everest Base Camp',
    altitudeMeters: 5164,
    altitudeFeet: 16942,
    status: 'caution',
    currentTempDayC: 2,
    currentTempNightC: -16,
    windSpeedKmh: 28,
    condition: 'Sub-Zero Alpine Freeze, High UV',
    visibilityKm: 30,
    trailStatus: 'Glacial Moraine Rocks & Hardpack Ice',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Night temperatures plunge to -16°C. Khumbu Glacier moraine stable; trekking poles and windproof balaclavas mandatory.',
  },
  {
    id: 'weather-pokhara',
    region: 'annapurna',
    name: 'Pokhara Lakeside Base',
    altitudeMeters: 822,
    altitudeFeet: 2696,
    status: 'optimal',
    currentTempDayC: 24,
    currentTempNightC: 14,
    windSpeedKmh: 6,
    condition: 'Pleasant Subtropical Sunshine',
    visibilityKm: 20,
    trailStatus: 'Smooth Vehicle Access to Nayapul / Kande',
    flightStatus: 'All domestic flights operating normal schedule',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Warm lakeside conditions with clear morning views of Machapuchare (Fishtail) and Annapurna South.',
  },
  {
    id: 'weather-manang',
    region: 'annapurna',
    name: 'Manang Valley (Rain Shadow)',
    altitudeMeters: 3519,
    altitudeFeet: 11545,
    status: 'optimal',
    currentTempDayC: 10,
    currentTempNightC: -4,
    windSpeedKmh: 18,
    condition: 'Arid Tibetan Plateau Sunshine',
    visibilityKm: 35,
    trailStatus: 'Dry scree and pine forests',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Protected by Annapurna massif rain shadow. Ideal conditions for Ice Lake (Chongkor) acclimatization day hike.',
  },
  {
    id: 'weather-thorong-la',
    region: 'annapurna',
    name: 'Thorong La Pass (High Altitude Saddle)',
    altitudeMeters: 5416,
    altitudeFeet: 17769,
    status: 'caution',
    currentTempDayC: -1,
    currentTempNightC: -18,
    windSpeedKmh: 35,
    condition: 'Alpine Wind Glare & Hard Packed Snow',
    visibilityKm: 25,
    trailStatus: 'Pass Open (Microspikes advised on north descent)',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Teahouse teams at High Camp report pass is open. Depart by 04:30 AM to beat 11:00 AM summit wind gales.',
  },
  {
    id: 'weather-kyanjin',
    region: 'langtang',
    name: 'Kyanjin Gompa (Langtang Valley)',
    altitudeMeters: 3870,
    altitudeFeet: 12696,
    status: 'optimal',
    currentTempDayC: 9,
    currentTempNightC: -5,
    windSpeedKmh: 10,
    condition: 'Crisp Valley Mountain Breeze',
    visibilityKm: 20,
    trailStatus: 'Trail fully repaired and clearly marked',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Kyanjin Ri and Tserko Ri (4,984m) trails are clear of deep snow. Cheese factory is operational.',
  },
  {
    id: 'weather-larkya',
    region: 'manaslu',
    name: 'Larkya La Pass (Manaslu Circuit)',
    altitudeMeters: 5106,
    altitudeFeet: 16751,
    status: 'caution',
    currentTempDayC: -2,
    currentTempNightC: -15,
    windSpeedKmh: 32,
    condition: 'High Elevation Glacial Winds',
    visibilityKm: 25,
    trailStatus: 'Pass Open with Guide Escort',
    lastUpdated: 'Live Ground Telemetry',
    advisory: 'Dharamsala teahouse is open. Trekking parties moving across pass smoothly into Bimthang.',
  },
];

export interface SavedInsurancePolicy {
  providerName: string;
  policyNumber: string;
  emergencyPhone: string;
  maxAltitudeCoverageMeters: number;
  hasHelicopterEvacuation: boolean;
  hasDirectBillingGuarantee: boolean;
  savedAt: string;
}

const STORAGE_KEY_INSURANCE = 'into_nepal_insurance_policy';
const STORAGE_KEY_PACKED_GEAR = 'into_nepal_packed_gear_ids';

export function getStoredInsurancePolicy(): SavedInsurancePolicy | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INSURANCE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredInsurancePolicy(policy: SavedInsurancePolicy): void {
  try {
    localStorage.setItem(STORAGE_KEY_INSURANCE, JSON.stringify(policy));
    window.dispatchEvent(new CustomEvent('into_nepal_insurance_updated', { detail: policy }));
  } catch (err) {
    console.error('Failed to persist insurance policy:', err);
  }
}

export function getStoredPackedGearIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PACKED_GEAR);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleStoredPackedGearId(gearId: string): string[] {
  try {
    const current = getStoredPackedGearIds();
    const next = current.includes(gearId)
      ? current.filter((id) => id !== gearId)
      : [...current, gearId];
    localStorage.setItem(STORAGE_KEY_PACKED_GEAR, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('into_nepal_packed_gear_updated', { detail: next }));
    return next;
  } catch {
    return [];
  }
}
