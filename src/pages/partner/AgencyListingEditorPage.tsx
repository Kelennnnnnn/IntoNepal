import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Mountain,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileText,
  Camera,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';

interface FormItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude: number;
  hiking_hours: number;
  accommodation: string;
  meals: string;
}

export const AgencyListingEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const existingListing = id ? ALL_OTA_LISTINGS.find((l) => l.id === id) : null;

  // Basic Details
  const [title, setTitle] = useState(existingListing ? existingListing.title : '');
  const [category, setCategory] = useState(existingListing ? existingListing.category : 'Trekking');
  const [difficulty, setDifficulty] = useState(existingListing ? existingListing.difficulty : 'Moderate');
  const [region, setRegion] = useState(existingListing ? existingListing.region : 'Everest');
  const [location, setLocation] = useState(existingListing ? existingListing.location : 'Solukhumbu, Nepal');
  const [durationDays, setDurationDays] = useState(existingListing ? existingListing.durationDays : 12);
  const [maxAltitude, setMaxAltitude] = useState(5364);
  const [startingPoint, setStartingPoint] = useState('Lukla');
  const [endingPoint, setEndingPoint] = useState('Lukla');
  const [bestSeasons, setBestSeasons] = useState('Spring (Mar-May) & Autumn (Sep-Nov)');

  // Pricing & Group
  const [price, setPrice] = useState(existingListing ? existingListing.price : 1450);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [maxGroupSize, setMaxGroupSize] = useState(12);

  // Overview Description
  const [overview, setOverview] = useState(
    existingListing?.description ||
      'An iconic Himalayan expedition through traditional Sherpa villages, ancient gompas, and breathtaking glaciated peaks.'
  );

  // Itinerary
  const [itinerary, setItinerary] = useState<FormItineraryDay[]>(() => {
    if (existingListing?.itinerary && existingListing.itinerary.length > 0) {
      return existingListing.itinerary.map((it) => ({
        day: it.day,
        title: it.title,
        description: it.highlights || '',
        altitude: parseInt(it.altitude.replace(/[^0-9]/g, '')) || 2800,
        hiking_hours: 5,
        accommodation: 'Local Teahouse',
        meals: 'Breakfast, Lunch, Dinner',
      }));
    }
    return [
      {
        day: 1,
        title: 'Arrival in Kathmandu & Gear Briefing',
        description: 'Welcome to Nepal! Check-in at your hotel, inspect technical equipment, and complete TIMS documentation.',
        altitude: 1400,
        hiking_hours: 0,
        accommodation: '3-Star Hotel in Thamel',
        meals: 'Welcome Dinner',
      },
      {
        day: 2,
        title: 'Scenic Mountain Flight to Lukla & Trek to Phakding',
        description: 'Early morning flight across Himalayan ridges to Lukla airport. Hike downhill following the Dudh Koshi river.',
        altitude: 2610,
        hiking_hours: 4,
        accommodation: 'Mountain Teahouse',
        meals: 'Breakfast, Lunch, Dinner',
      },
      {
        day: 3,
        title: 'Trek to Namche Bazaar (The Sherpa Capital)',
        description: 'Cross iconic Hillary suspension bridges through pine forests, climbing up into the amphitheater of Namche.',
        altitude: 3440,
        hiking_hours: 6,
        accommodation: 'Sherpa Teahouse',
        meals: 'Breakfast, Lunch, Dinner',
      },
    ];
  });

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>([
    'All National Park entry permits & municipality fees',
    'Trekkers’ Information Management System (TIMS) card',
    'Government-licensed, wilderness first-aid certified Sherpa guide',
    'Experienced porter support (1 porter per 2 trekkers, max 20kg)',
    'All teahouse accommodation during the trek',
    '3 standard daily meals (Breakfast, Lunch, Dinner) during trek',
    'Domestic scheduled flights (Kathmandu - Lukla - Kathmandu)',
    'Pulse oximeter daily altitude monitoring',
  ]);

  const [exclusions, setExclusions] = useState<string[]>([
    'International flights & Nepal entry tourist visa',
    'Comprehensive personal travel & high-altitude helicopter rescue insurance',
    'Personal gear (down jacket, sleeping bag, trekking poles)',
    'Hot showers, battery charging, and Wi-Fi at teahouses',
    'Gratuities / tips for guide and porters',
  ]);

  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  // Primary image
  const [imageUrl, setImageUrl] = useState(
    existingListing?.image ||
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80'
  );

  const [submitting, setSubmitting] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleAddDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        day: nextDay,
        title: `Day ${nextDay}: Mountain Route Segment`,
        description: 'Scenic ascent along the valley trail with acclimatization pauses.',
        altitude: 3800,
        hiking_hours: 5,
        accommodation: 'Mountain Lodge',
        meals: 'Breakfast, Lunch, Dinner',
      },
    ]);
  };

  const handleRemoveDay = (index: number) => {
    if (itinerary.length <= 1) return;
    const updated = itinerary
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, day: idx + 1 }));
    setItinerary(updated);
  };

  const handleUpdateDay = (index: number, field: keyof FormItineraryDay, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setInclusions([...inclusions, newInclusion.trim()]);
    setNewInclusion('');
  };

  const handleRemoveInclusion = (idx: number) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    setExclusions([...exclusions, newExclusion.trim()]);
    setNewExclusion('');
  };

  const handleRemoveExclusion = (idx: number) => {
    setExclusions(exclusions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSavedNotice(true);
      setTimeout(() => {
        navigate('/agency/listings');
      }, 1500);
    }, 800);
  };

  const deposit15 = Math.round(price * 0.15);
  const arrivalBalance85 = price - deposit15;

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/agency/listings"
              className="text-xs text-[#5F6B66] hover:text-[#1A1F1D] flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Tour Inventory</span>
            </Link>
            <span className="text-[#E8E4DD]">|</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
              {isEditing ? 'Edit Package' : 'New Tour Package'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/agency/listings">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              form="tour-editor-form"
              variant="primary"
              size="sm"
              disabled={submitting}
              className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : isEditing ? 'Save & Update' : 'Submit for NTB Verification'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      {savedNotice && (
        <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] px-4 py-3 text-center text-xs font-bold text-[#065F46] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Package successfully saved and queued for Nepal Tourism Board compliance review!</span>
        </div>
      )}

      {/* Main Editor Form */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <form id="tour-editor-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DD]">
              <Mountain className="w-5 h-5 text-[#1E4B8F]" />
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">Basic Tour Information</h2>
                <p className="text-xs text-[#5F6B66]">Trip naming, primary category, geography, and altitude profile.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">
                  Tour / Expedition Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Everest Base Camp & Kala Patthar High Altitude Trek"
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                >
                  <option value="Trekking">Trekking</option>
                  <option value="Mountaineering">Mountaineering & Peak Climbing</option>
                  <option value="Wildlife Safari">Wildlife Safari</option>
                  <option value="Whitewater Rafting">Whitewater Rafting</option>
                  <option value="Cultural Heritage">Cultural & Heritage</option>
                  <option value="Helicopter Tours">Helicopter Tours</option>
                  <option value="Wellness">Yoga & Meditation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Difficulty Grade</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                >
                  <option value="Easy">Easy (Gentle terrain, low altitude)</option>
                  <option value="Moderate">Moderate (Up to 3,800m, 4-6 hrs hiking)</option>
                  <option value="Challenging">Challenging (Up to 5,500m, high passes)</option>
                  <option value="Strenuous">Strenuous (Glacier travel, high stamina)</option>
                  <option value="Technical">Technical (Crampons, fixed ropes, 6000m+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Himalayan Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                >
                  <option value="Everest">Everest & Khumbu</option>
                  <option value="Annapurna">Annapurna & Dhaulagiri</option>
                  <option value="Langtang">Langtang & Helambu</option>
                  <option value="Mustang">Upper Mustang & Lo Manthang</option>
                  <option value="Manaslu">Manaslu Circuit</option>
                  <option value="Chitwan">Chitwan & Terai Lowlands</option>
                  <option value="Pokhara">Pokhara Valley</option>
                  <option value="Kathmandu">Kathmandu Valley</option>
                  <option value="Far-West">Dolpo & Western Wilderness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Specific Location / District</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Solukhumbu, Sagarmatha National Park"
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Total Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Maximum Altitude (Meters)</label>
                <input
                  type="number"
                  min="100"
                  max="8848"
                  value={maxAltitude}
                  onChange={(e) => setMaxAltitude(Number(e.target.value))}
                  placeholder="e.g., 5364"
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Starting & Ending Trailhead</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    placeholder="Start (e.g. Lukla)"
                    className="text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none"
                  />
                  <input
                    type="text"
                    value={endingPoint}
                    onChange={(e) => setEndingPoint(e.target.value)}
                    placeholder="End (e.g. Lukla)"
                    className="text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Optimal Seasons</label>
                <input
                  type="text"
                  value={bestSeasons}
                  onChange={(e) => setBestSeasons(e.target.value)}
                  placeholder="e.g., Mar-May & Sep-Nov"
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-medium outline-none focus:border-[#1E4B8F]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Trip Overview & Experience Pitch</label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none focus:border-[#1E4B8F]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Fair Escrow Model */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DD]">
              <DollarSign className="w-5 h-5 text-[#16A34A]" />
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">Pricing & Booking Architecture</h2>
                <p className="text-xs text-[#5F6B66]">Transparent 15% booking deposit + 85% direct local operator settlement.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">
                  Package Price per Person (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#5F6B66]">$</span>
                  <input
                    type="number"
                    min="50"
                    max="50000"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-sm font-bold text-[#1A1F1D] outline-none focus:border-[#1E4B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Minimum Travelers</label>
                <input
                  type="number"
                  min="1"
                  value={minGroupSize}
                  onChange={(e) => setMinGroupSize(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Maximum Group Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={maxGroupSize}
                  onChange={(e) => setMaxGroupSize(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-bold outline-none"
                />
              </div>
            </div>

            {/* Split Breakdown Card */}
            <div className="bg-[#FBF8F3] rounded-xl border border-[#E8E4DD] p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E8E4DD]">
                <div className="text-[#5F6B66] text-[11px]">Total Traveler Price</div>
                <div className="text-base font-black text-[#1A1F1D] mt-0.5">${price} USD</div>
                <div className="text-[10px] text-[#5F6B66] mt-1">Per person all-inclusive</div>
              </div>

              <div className="p-3 bg-[#ECFDF5] rounded-lg border border-[#A7F3D0]">
                <div className="text-[#065F46] text-[11px] font-bold">15% Online Deposit</div>
                <div className="text-base font-black text-[#16A34A] mt-0.5">${deposit15} USD</div>
                <div className="text-[10px] text-[#065F46] mt-1">Guarantees slot & permits</div>
              </div>

              <div className="p-3 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                <div className="text-[#1E40AF] text-[11px] font-bold">85% Local Balance Inflow</div>
                <div className="text-base font-black text-[#1E4B8F] mt-0.5">${arrivalBalance85} USD</div>
                <div className="text-[10px] text-[#1E40AF] mt-1">Paid directly to you upon arrival</div>
              </div>
            </div>
          </div>

          {/* Section 3: Day-by-Day Itinerary Builder */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#D97706]" />
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">Day-by-Day Route Itinerary</h2>
                  <p className="text-xs text-[#5F6B66]">Describe each day's trail conditions, elevation, and accommodation.</p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddDay}
                variant="outline"
                size="sm"
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </Button>
            </div>

            <div className="space-y-4">
              {itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#1E4B8F] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0">
                      {day.day}
                    </span>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                      placeholder="Day Title (e.g., Namche to Tengboche Monastery)"
                      className="flex-1 text-xs font-bold text-[#1A1F1D] bg-white border border-[#E8E4DD] rounded-lg p-2 outline-none"
                    />
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(idx)}
                        className="text-[#9CA3AF] hover:text-red-500 p-1"
                        title="Delete day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={2}
                    value={day.description}
                    onChange={(e) => handleUpdateDay(idx, 'description', e.target.value)}
                    placeholder="Describe route highlights, mountain views, suspension bridges, or wildlife..."
                    className="w-full text-xs text-[#1A1F1D] bg-white border border-[#E8E4DD] rounded-lg p-2.5 outline-none"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#5F6B66] font-semibold block mb-1">Night Altitude (m)</span>
                      <input
                        type="number"
                        value={day.altitude}
                        onChange={(e) => handleUpdateDay(idx, 'altitude', Number(e.target.value))}
                        className="w-full text-xs p-1.5 rounded-lg border border-[#E8E4DD] bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B66] font-semibold block mb-1">Hiking Hours</span>
                      <input
                        type="number"
                        value={day.hiking_hours}
                        onChange={(e) => handleUpdateDay(idx, 'hiking_hours', Number(e.target.value))}
                        className="w-full text-xs p-1.5 rounded-lg border border-[#E8E4DD] bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B66] font-semibold block mb-1">Accommodation</span>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => handleUpdateDay(idx, 'accommodation', e.target.value)}
                        placeholder="e.g. Teahouse"
                        className="w-full text-xs p-1.5 rounded-lg border border-[#E8E4DD] bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B66] font-semibold block mb-1">Meals Included</span>
                      <input
                        type="text"
                        value={day.meals}
                        onChange={(e) => handleUpdateDay(idx, 'meals', e.target.value)}
                        placeholder="e.g. B, L, D"
                        className="w-full text-xs p-1.5 rounded-lg border border-[#E8E4DD] bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Inclusions & Exclusions */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DD]">
              <ShieldCheck className="w-5 h-5 text-[#1E4B8F]" />
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">Inclusions & Exclusions</h2>
                <p className="text-xs text-[#5F6B66]">Ensure full clarity to eliminate traveler confusion on the trail.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#16A34A] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Included Services</span>
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    placeholder="Add included item..."
                    className="flex-1 text-xs p-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddInclusion}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {inclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg p-2 flex items-center justify-between gap-2"
                    >
                      <span className="text-[#1A1F1D]">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(idx)}
                        className="text-[#9CA3AF] hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#C8362E] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Excluded Services</span>
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    placeholder="Add excluded item..."
                    className="flex-1 text-xs p-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddExclusion}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {exclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg p-2 flex items-center justify-between gap-2"
                    >
                      <span className="text-[#1A1F1D]">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(idx)}
                        className="text-[#9CA3AF] hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Cover Photo */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DD]">
              <Camera className="w-5 h-5 text-[#1E4B8F]" />
              <div>
                <h2 className="font-serif font-bold text-lg text-[#1A1F1D]">Media & Visual Presentation</h2>
                <p className="text-xs text-[#5F6B66]">Provide high-resolution imagery showcasing trail conditions.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1F1D] mb-1.5">Cover Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-3 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
              />
            </div>

            {imageUrl && (
              <div className="relative rounded-xl overflow-hidden h-48 border border-[#E8E4DD]">
                <img src={imageUrl} alt="Tour Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                  Live Preview
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link to="/agency/listings">
              <Button variant="outline" size="md" className="text-xs font-bold">
                Discard Changes
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-2 px-6"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Submitting Package...' : 'Save & Publish Package'}</span>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
