import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Award,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { VERIFIED_AGENCIES, ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';
import { LevelBadge } from '@/components/ui/LevelBadge';

export const AgencyProfilePage: React.FC = () => {
  const { agencyId } = useParams<{ agencyId: string }>();

  const agency = useMemo(() => {
    return (
      VERIFIED_AGENCIES.find((a) => a.id === agencyId || a.slug === agencyId) ||
      VERIFIED_AGENCIES[0]
    );
  }, [agencyId]);

  const agencyListings = useMemo(() => {
    return ALL_OTA_LISTINGS.filter(
      (item) => item.agencyName === agency.name || item.agencyLicense === agency.licenseNumber
    );
  }, [agency]);

  return (
    <CustomerLayout>
      {/* Agency Hero Header */}
      <div className="bg-[#1A1F1D] text-white">
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img
            src={agency.coverImage}
            alt={agency.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F1D] via-[#1A1F1D]/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-1.5 shadow-xl shrink-0 overflow-hidden">
              <img
                src={agency.logo}
                alt={agency.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#10B981]/20 px-2.5 py-1 rounded-full border border-[#10B981]/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Nepal Tourism Board Verified Operator
                </span>
                <span className="text-xs text-[#D9D3C9]">
                  TAAN Member #{agency.taanMemberNumber}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {agency.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#D9D3C9] max-w-2xl">
                {agency.tagline}
              </p>
            </div>

            <div className="flex sm:flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-1 text-[#F59E0B]">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-xl font-bold text-white">{agency.rating}</span>
                <span className="text-xs text-[#9DA8A3]">({agency.reviewCount} reviews)</span>
              </div>
              <span className="text-[11px] text-[#9DA8A3]">Operating Since {agency.yearEstablished}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Accreditation Strip */}
      <div className="bg-[#FBF8F3] border-b border-[#E8E4DD] py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-[#5F6B66] uppercase block font-bold">Government License</span>
            <strong className="text-[#1A1F1D]">{agency.licenseNumber}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#5F6B66] uppercase block font-bold">Headquarters</span>
            <strong className="text-[#1A1F1D]">{agency.primaryLocation}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#5F6B66] uppercase block font-bold">Licensed Staff</span>
            <strong className="text-[#1A1F1D]">{agency.licensedGuideCount} Certified Guides</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#5F6B66] uppercase block font-bold">In-Market Support</span>
            <strong className="text-[#1A1F1D]">{agency.phone}</strong>
          </div>
        </div>
      </div>

      {/* Main Content: Agency Story & Tour Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              About {agency.name}
            </h2>
            <p className="text-sm text-[#303834] leading-relaxed">
              {agency.about}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {agency.badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF3FA] text-[#1E4B8F] border border-[#1E4B8F]/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E4DD] shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-sm font-bold text-[#1A1F1D] border-b border-[#E8E4DD] pb-2">
              Agency Contact & Dispatch Office
            </h3>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <span>{agency.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#1B7A5A] shrink-0" />
              <span>{agency.emergencyPhone} (24/7 Hotline)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1E4B8F] shrink-0" />
              <span>{agency.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#5F6B66] shrink-0" />
              <span>{agency.website}</span>
            </p>
          </div>
        </div>

        {/* Agency Tours & Expeditions Catalog */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E4DD] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
                Verified Catalog
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
                Tours & Activities by {agency.name}
              </h2>
            </div>
            <span className="text-xs font-bold text-[#5F6B66]">
              {agencyListings.length} Experiences Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyListings.map((item) => (
              <div
                key={item.id}
                className="group bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-48 bg-[#1A1F1D] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <LevelBadge difficulty={item.difficulty} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#1A1F1D]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D97706]" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B8F] bg-[#1E4B8F]/10 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#1A1F1D] line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5F6B66] line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Commercial Split Pill */}
                  <div className="pt-3 border-t border-[#E8E4DD] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5F6B66] block">
                        From ${item.price} / person
                      </span>
                      <span className="text-xs font-bold text-[#059669]">
                        Pay ${(item.price * 0.15).toFixed(0)} to reserve
                      </span>
                    </div>

                    <Link to={`/activities/${item.id}`}>
                      <Button size="sm" className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
