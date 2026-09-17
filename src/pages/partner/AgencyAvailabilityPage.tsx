import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Plus,
  Lock,
  Unlock,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';

interface DepartureSlot {
  id: string;
  listingId: string;
  tourTitle: string;
  startDate: string;
  endDate: string;
  spotsTotal: number;
  spotsRemaining: number;
  priceOverride?: number;
  leadGuide: string;
  status: 'guaranteed' | 'filling_fast' | 'sold_out' | 'blocked';
}

export const AgencyAvailabilityPage: React.FC = () => {
  const [selectedTour, setSelectedTour] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New slot form state
  const [newTourId, setNewTourId] = useState(ALL_OTA_LISTINGS[0].id);
  const [newStartDate, setNewStartDate] = useState('2026-10-15');
  const [newEndDate, setNewEndDate] = useState('2026-10-27');
  const [newSpots, setNewSpots] = useState(12);
  const [newPriceOverride, setNewPriceOverride] = useState<number | undefined>(undefined);
  const [newGuide, setNewGuide] = useState('Dawa Sherpa (IFMGA)');

  const [departures, setDepartures] = useState<DepartureSlot[]>([
    {
      id: 'dep-1',
      listingId: ALL_OTA_LISTINGS[0].id,
      tourTitle: ALL_OTA_LISTINGS[0].title,
      startDate: '2026-10-05',
      endDate: '2026-10-17',
      spotsTotal: 12,
      spotsRemaining: 3,
      leadGuide: 'Dawa Sherpa (IFMGA)',
      status: 'filling_fast',
    },
    {
      id: 'dep-2',
      listingId: ALL_OTA_LISTINGS[0].id,
      tourTitle: ALL_OTA_LISTINGS[0].title,
      startDate: '2026-10-20',
      endDate: '2026-11-01',
      spotsTotal: 12,
      spotsRemaining: 8,
      leadGuide: 'Pasang Nuru Sherpa',
      status: 'guaranteed',
    },
    {
      id: 'dep-3',
      listingId: ALL_OTA_LISTINGS[1].id,
      tourTitle: ALL_OTA_LISTINGS[1].title,
      startDate: '2026-10-10',
      endDate: '2026-10-22',
      spotsTotal: 10,
      spotsRemaining: 0,
      leadGuide: 'Khem Gurung',
      status: 'sold_out',
    },
    {
      id: 'dep-4',
      listingId: ALL_OTA_LISTINGS[2].id,
      tourTitle: ALL_OTA_LISTINGS[2].title,
      startDate: '2026-11-05',
      endDate: '2026-11-13',
      spotsTotal: 8,
      spotsRemaining: 5,
      leadGuide: 'Tenzing Lama',
      status: 'guaranteed',
    },
    {
      id: 'dep-5',
      listingId: ALL_OTA_LISTINGS[3].id,
      tourTitle: ALL_OTA_LISTINGS[3].title,
      startDate: '2026-10-18',
      endDate: '2026-10-28',
      spotsTotal: 12,
      spotsRemaining: 12,
      leadGuide: 'Pemba Dorje',
      status: 'blocked',
    },
  ]);

  const handleAddDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    const tour = ALL_OTA_LISTINGS.find((l) => l.id === newTourId);
    const newSlot: DepartureSlot = {
      id: `dep-${Date.now()}`,
      listingId: newTourId,
      tourTitle: tour?.title || 'Himalayan Tour',
      startDate: newStartDate,
      endDate: newEndDate,
      spotsTotal: Number(newSpots),
      spotsRemaining: Number(newSpots),
      priceOverride: newPriceOverride ? Number(newPriceOverride) : undefined,
      leadGuide: newGuide,
      status: 'guaranteed',
    };
    setDepartures([newSlot, ...departures]);
    setShowAddModal(false);
  };

  const handleToggleBlock = (id: string) => {
    setDepartures(
      departures.map((d) => {
        if (d.id !== id) return d;
        const newStatus = d.status === 'blocked' ? 'guaranteed' : 'blocked';
        return { ...d, status: newStatus };
      })
    );
  };

  const filteredDepartures = departures.filter((d) => {
    if (selectedTour !== 'ALL' && d.listingId !== selectedTour) return false;
    if (monthFilter !== 'ALL') {
      const monthStr = d.startDate.substring(5, 7);
      if (monthFilter === '10' && monthStr !== '10') return false;
      if (monthFilter === '11' && monthStr !== '11') return false;
      if (monthFilter === '12' && monthStr !== '12') return false;
    }
    return true;
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
              <CalendarIcon className="w-4 h-4 text-[#1E4B8F]" />
              <h1 className="font-serif font-bold text-base text-[#1A1F1D]">
                Departure Calendar & Capacity Management
              </h1>
            </div>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            size="sm"
            className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fixed Departure</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Info Banner */}
        <div className="bg-white rounded-xl border border-[#E8E4DD] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#1E4B8F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1A1F1D]">Atomic Concurrency Reservation Active</h3>
              <p className="text-[11px] text-[#5F6B66]">
                Departures are safeguarded by PostgreSQL row-level locks to prevent double-booking during peak autumn and spring rush.
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-[#5F6B66]">Total Active Scheduled Slots:</span>{' '}
            <strong className="text-[#1A1F1D] font-bold">{departures.length} Departures</strong>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-[#E8E4DD] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#5F6B66] font-semibold">Filter Tour:</span>
              <select
                value={selectedTour}
                onChange={(e) => setSelectedTour(e.target.value)}
                className="p-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-medium text-[#1A1F1D] outline-none"
              >
                <option value="ALL">All Active Packages</option>
                {ALL_OTA_LISTINGS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title.substring(0, 40)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5F6B66] font-semibold">Season Month:</span>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="p-2 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-medium text-[#1A1F1D] outline-none"
              >
                <option value="ALL">All Upcoming Months</option>
                <option value="10">October 2026 (Peak Autumn)</option>
                <option value="11">November 2026</option>
                <option value="12">December 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Departure Table */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF8F3] border-b border-[#E8E4DD] text-[#5F6B66] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tour Package</th>
                  <th className="py-3.5 px-4">Departure Dates</th>
                  <th className="py-3.5 px-4">Lead Guide</th>
                  <th className="py-3.5 px-4">Capacity Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DD]">
                {filteredDepartures.map((dep) => {
                  const percentLeft = Math.round((dep.spotsRemaining / dep.spotsTotal) * 100);
                  return (
                    <tr key={dep.id} className="hover:bg-[#FBF8F3]/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#1A1F1D]">
                        {dep.tourTitle}
                        {dep.priceOverride && (
                          <span className="block text-[10px] text-[#16A34A] font-semibold">
                            Custom Price: ${dep.priceOverride}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#1A1F1D] flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#1E4B8F]" />
                          <span>
                            {dep.startDate} → {dep.endDate}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#5F6B66]">{dep.leadGuide}</td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span
                              className={
                                dep.spotsRemaining === 0
                                  ? 'text-red-500'
                                  : dep.spotsRemaining <= 3
                                  ? 'text-[#D97706]'
                                  : 'text-[#16A34A]'
                              }
                            >
                              {dep.spotsRemaining} of {dep.spotsTotal} spots open
                            </span>
                          </div>
                          <div className="w-32 bg-[#E8E4DD] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                dep.spotsRemaining === 0
                                  ? 'bg-red-500'
                                  : dep.spotsRemaining <= 3
                                  ? 'bg-[#D97706]'
                                  : 'bg-[#16A34A]'
                              }`}
                              style={{ width: `${100 - percentLeft}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {dep.status === 'guaranteed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                            <CheckCircle2 className="w-3 h-3" />
                            Guaranteed
                          </span>
                        )}
                        {dep.status === 'filling_fast' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                            <Sparkles className="w-3 h-3" />
                            Filling Fast
                          </span>
                        )}
                        {dep.status === 'sold_out' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
                            Sold Out
                          </span>
                        )}
                        {dep.status === 'blocked' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
                            <Lock className="w-3 h-3" />
                            Date Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(dep.id)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#E8E4DD] hover:bg-[#FBF8F3] transition-colors inline-flex items-center gap-1 text-[#5F6B66] hover:text-[#1A1F1D]"
                        >
                          {dep.status === 'blocked' ? (
                            <>
                              <Unlock className="w-3 h-3 text-[#16A34A]" />
                              <span>Unblock</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-red-500" />
                              <span>Block Date</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Departure Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E8E4DD] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DD]">
              <h3 className="font-serif font-bold text-base text-[#1A1F1D]">Add New Fixed Departure</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#5F6B66] hover:text-[#1A1F1D] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDeparture} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Select Tour Package</label>
                <select
                  value={newTourId}
                  onChange={(e) => setNewTourId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold outline-none"
                >
                  {ALL_OTA_LISTINGS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">Total Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newSpots}
                    onChange={(e) => setNewSpots(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">Price Override (USD optional)</label>
                  <input
                    type="number"
                    placeholder="Leave empty for default"
                    value={newPriceOverride || ''}
                    onChange={(e) => setNewPriceOverride(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Assigned Lead Guide</label>
                <input
                  type="text"
                  value={newGuide}
                  onChange={(e) => setNewGuide(e.target.value)}
                  placeholder="e.g. Dawa Sherpa (IFMGA)"
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#1E4B8F] hover:bg-[#15386C] text-white font-bold"
                >
                  Publish Departure
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
