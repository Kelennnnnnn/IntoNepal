import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  Heart,
  ShieldCheck,
  Globe2,
  Users,
  Compass,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';

export const AboutPage: React.FC = () => {
  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D]">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#1A1F1D] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D97706] text-xs font-bold border border-white/10">
              <Compass className="w-3.5 h-3.5" />
              <span>Our Founding Mission</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
              Direct-to-Local Adventure Tourism in the Himalayas
            </h1>
            <p className="text-sm sm:text-base text-[#E2DDD5] leading-relaxed max-w-2xl mx-auto">
              We built Into Nepal to eliminate predatory foreign middleman markups and connect global adventurers directly with licensed, verified Nepali mountain guides and tour agencies.
            </p>
          </div>
        </section>

        {/* The Problem & Our Solution */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-[#E8E4DD] p-8 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C8362E]">
                The Traditional Model
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
                Foreign Travel Resellers & Heavy Markups
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
                Most international booking platforms charge travelers huge commissions while sub-contracting the real guiding work to local Nepali outfits at heavily discounted rates. Porters and grassroots guides receive only a fraction of what travelers paid, while customers deal with foreign customer service desks with no real-time trail knowledge.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#16A34A] p-8 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                The Into Nepal Direct Advantage
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
                100% Direct Local Value & Fair Compensation
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed">
                By booking directly through Into Nepal, your money directly funds local Sherpa guides, indigenous porters, and family-owned teahouses. You reserve with an honest 15% booking deposit, and settle the remaining 85% balance in-person upon arrival in Nepal, ensuring transparency, fair wages, and authentic local guidance.
              </p>
            </div>
          </div>

          {/* 3 Core Pillars */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-8 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1F1D]">
                Our Ethical Guiding Standards
              </h2>
              <p className="text-xs text-[#5F6B66]">
                Every agency on Into Nepal commits to verified ethical and environmental travel standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E4B8F] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                  Government & NTB Vetted
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Only licensed agencies registered with the Department of Tourism, Nepal Tourism Board (NTB), and TAAN are admitted to our marketplace.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                  Porter Protection & Fair Pay
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Strict adherence to maximum 20kg load limits, high-altitude gear provisions, emergency evacuation coverage, and fair baseline compensation for all support crew.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D]">
                  Leave No Trace & Clean Trails
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed">
                  Active participation in the Sagarmatha Pollution Control Committee (SPCC) cleanup drives, bans on single-use plastics in national parks, and eco-conscious lodge sourcing.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-[#1A1F1D] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl font-bold">Ready to Explore Nepal Directly?</h3>
              <p className="text-xs text-[#E2DDD5] mt-1">
                Browse 45+ verified itineraries with live departure dates and authentic pricing.
              </p>
            </div>
            <Link to="/activities">
              <Button
                variant="primary"
                size="md"
                className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Find Your Trek</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
};
