import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ArrowLeft,
  DollarSign,
  Users,
  Calendar,
  Compass,
  Star,
  Globe2,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AgencyAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Header */}
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
              <TrendingUp className="w-4 h-4 text-[#1E4B8F]" />
              <h1 className="font-serif font-bold text-base text-[#1A1F1D]">
                Agency Business & Performance Analytics
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#FBF8F3] p-1 rounded-xl border border-[#E8E4DD] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === '30d' ? 'bg-[#1E4B8F] text-white' : 'text-[#5F6B66] hover:text-[#1A1F1D]'
              }`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === '90d' ? 'bg-[#1E4B8F] text-white' : 'text-[#5F6B66] hover:text-[#1A1F1D]'
              }`}
            >
              Peak Season (90D)
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === '1y' ? 'bg-[#1E4B8F] text-white' : 'text-[#5F6B66] hover:text-[#1A1F1D]'
              }`}
            >
              Full Year
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Top 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#5F6B66] mb-1">
              <span>Gross Marketplace Volume</span>
              <DollarSign className="w-4 h-4 text-[#1E4B8F]" />
            </div>
            <div className="font-serif text-2xl font-black text-[#1A1F1D]">$46,850</div>
            <div className="text-[11px] text-[#16A34A] font-semibold mt-2 flex items-center gap-1">
              <span>+28.4%</span>
              <span className="text-[#5F6B66]">vs previous period</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#5F6B66] mb-1">
              <span>85% Direct Cash Inflow</span>
              <DollarSign className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="font-serif text-2xl font-black text-[#16A34A]">$39,822</div>
            <div className="text-[11px] text-[#5F6B66] mt-2">
              Settled directly upon traveler arrival
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#5F6B66] mb-1">
              <span>Confirmed Travelers</span>
              <Users className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="font-serif text-2xl font-black text-[#1A1F1D]">38 Trekkers</div>
            <div className="text-[11px] text-[#16A34A] font-semibold mt-2">
              100% departure fulfillment
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#5F6B66] mb-1">
              <span>Average Traveler Rating</span>
              <Star className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
            </div>
            <div className="font-serif text-2xl font-black text-[#1A1F1D]">4.94 / 5.0</div>
            <div className="text-[11px] text-[#5F6B66] mt-2">
              Based on 42 verified reviews
            </div>
          </div>
        </div>

        {/* Section 2: Revenue Trend & Departure Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Bar Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DD]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D]">Monthly Revenue & Growth</h3>
                <p className="text-xs text-[#5F6B66]">Direct bookings across peak trekking months.</p>
              </div>
              <span className="text-xs font-bold text-[#1E4B8F] bg-[#EFF6FF] px-2.5 py-1 rounded-lg">
                2026 Season
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { month: 'September 2026 (Early Autumn)', revenue: 11200, travelers: 9, target: 14000 },
                { month: 'October 2026 (Peak Autumn)', revenue: 21450, travelers: 17, target: 20000 },
                { month: 'November 2026 (Late Autumn)', revenue: 14200, travelers: 12, target: 15000 },
              ].map((item, idx) => {
                const percent = Math.min(100, Math.round((item.revenue / item.target) * 100));
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1A1F1D]">{item.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#5F6B66]">{item.travelers} Trekkers</span>
                        <strong className="font-serif font-black text-[#1A1F1D]">
                          ${item.revenue.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                    <div className="w-full bg-[#FBF8F3] border border-[#E8E4DD] rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-[#1E4B8F] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guest Origin Countries */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#1E4B8F]" />
                <h3 className="font-serif font-bold text-base text-[#1A1F1D]">Traveler Demographics</h3>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { country: 'United States', flag: '🇺🇸', percent: 34, count: '13 travelers' },
                { country: 'Germany', flag: '🇩🇪', percent: 21, count: '8 travelers' },
                { country: 'United Kingdom', flag: '🇬🇧', percent: 18, count: '7 travelers' },
                { country: 'Australia', flag: '🇦🇺', percent: 13, count: '5 travelers' },
                { country: 'Canada', flag: '🇨🇦', percent: 8, count: '3 travelers' },
                { country: 'Other Nations', flag: '🌐', percent: 6, count: '2 travelers' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span className="font-medium text-[#1A1F1D]">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#5F6B66] text-[11px]">{c.count}</span>
                    <span className="font-bold text-[#1E4B8F] w-8 text-right">{c.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Top Performing Trek Packages */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DD]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1A1F1D]">Top Performing Itineraries</h3>
              <p className="text-xs text-[#5F6B66]">Trek packages with the highest booking velocity and inquiry conversions.</p>
            </div>
            <Link to="/agency/listings" className="text-xs font-bold text-[#1E4B8F] hover:underline">
              Manage All Inventory →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF8F3] border-b border-[#E8E4DD] text-[#5F6B66] uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Trek Package</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-4">Gross Revenue</th>
                  <th className="py-3 px-4">Conversion Rate</th>
                  <th className="py-3 px-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DD]">
                {[
                  {
                    title: 'Everest Base Camp & Kala Patthar Trek',
                    cat: 'Trekking',
                    bookings: 18,
                    rev: '$26,100',
                    conv: '18.4%',
                    rating: '4.96',
                  },
                  {
                    title: 'Annapurna Circuit & Thorong La Pass',
                    cat: 'Trekking',
                    bookings: 11,
                    rev: '$13,750',
                    conv: '16.2%',
                    rating: '4.92',
                  },
                  {
                    title: 'Upper Mustang Forbidden Kingdom Trek',
                    cat: 'Cultural & Restricted',
                    bookings: 6,
                    rev: '$12,900',
                    conv: '22.1%',
                    rating: '5.00',
                  },
                  {
                    title: 'Langtang Valley & Kyanjin Gompa Trek',
                    cat: 'Trekking',
                    bookings: 3,
                    rev: '$2,850',
                    conv: '14.5%',
                    rating: '4.88',
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FBF8F3]/50">
                    <td className="py-3 px-4 font-bold text-[#1A1F1D]">{row.title}</td>
                    <td className="py-3 px-4 text-[#5F6B66]">{row.cat}</td>
                    <td className="py-3 px-4 font-semibold text-[#1A1F1D]">{row.bookings} Pax</td>
                    <td className="py-3 px-4 font-bold text-[#16A34A]">{row.rev}</td>
                    <td className="py-3 px-4 text-[#1E4B8F] font-semibold">{row.conv}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#1A1F1D] flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 text-[#D97706] fill-[#D97706]" />
                      <span>{row.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
