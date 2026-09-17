import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Clock,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ALL_OTA_LISTINGS, VERIFIED_AGENCIES } from '@/data/otaMarketplaceData';

export const AgencyListingsPage: React.FC = () => {
  const currentAgency = VERIFIED_AGENCIES[0];
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New tour state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Trekking');
  const [newDuration, setNewDuration] = useState('10 Days');
  const [newPrice, setNewPrice] = useState('1150');

  const agencyListings = useMemo(() => {
    return ALL_OTA_LISTINGS.filter((l) => {
      const matchAgency = l.agencyName === currentAgency.name || true; // Show full catalog for demo
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'ALL' || l.category === categoryFilter;
      return matchAgency && matchSearch && matchCategory;
    });
  }, [currentAgency, search, categoryFilter]);

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateModal(false);
    alert(`Tour "${newTitle}" created in draft status and submitted for NTB verification.`);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/agency/dashboard" className="text-xs text-[#5F6B66] hover:text-[#1A1F1D] flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-[#E8E4DD]">|</span>
            <h1 className="font-serif font-bold text-base text-[#1A1F1D]">
              Tour Packages & Itinerary Inventory
            </h1>
          </div>

          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Tour Package</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Filter / Search Bar */}
        <div className="bg-white rounded-xl border border-[#E8E4DD] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#5F6B66]" />
            <input
              type="text"
              placeholder="Search tours by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-[#1A1F1D]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5F6B66] font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-1.5 rounded border border-[#E8E4DD] bg-[#FBF8F3] text-xs font-medium text-[#1A1F1D] outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Trekking">Trekking</option>
              <option value="Wildlife Safari">Wildlife Safari</option>
              <option value="Whitewater Rafting">Whitewater Rafting</option>
              <option value="Cultural Heritage">Cultural Heritage</option>
              <option value="Helicopter Tours">Helicopter Tours</option>
            </select>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl border border-[#E8E4DD] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF8F3] border-b border-[#E8E4DD] text-[#5F6B66] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tour / Activity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Price (100%)</th>
                  <th className="py-3.5 px-4">15% Deposit Model</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DD]">
                {agencyListings.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FBF8F3]/50 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img src={l.image} alt={l.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div>
                        <strong className="text-[#1A1F1D] block">{l.title}</strong>
                        <span className="text-[11px] text-[#5F6B66]">{l.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#1E4B8F]/10 text-[#1E4B8F] font-bold text-[10px]">
                        {l.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#1A1F1D] font-medium">{l.duration}</td>
                    <td className="py-4 px-4 font-bold text-[#1A1F1D]">${l.price}</td>
                    <td className="py-4 px-4">
                      <span className="text-[#059669] font-bold">${(l.price * 0.15).toFixed(0)} pay now</span>
                      <span className="block text-[10px] text-[#5F6B66]">${(l.price * 0.85).toFixed(0)} to agency</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                        <CheckCircle2 className="w-3 h-3" />
                        Published
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/activities/${l.id}`}>
                          <Button size="sm" variant="ghost" className="text-xs text-[#1E4B8F] p-1.5 h-auto">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" className="text-xs text-[#5F6B66] p-1.5 h-auto">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Tour */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#E8E4DD] max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8E4DD] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1A1F1D]">
                  Create New Tour Listing
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#5F6B66] hover:text-[#1A1F1D] text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTour} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">Tour / Package Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manaslu Circuit Remote Trek"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    >
                      <option value="Trekking">Trekking</option>
                      <option value="Wildlife Safari">Wildlife Safari</option>
                      <option value="Whitewater Rafting">Whitewater Rafting</option>
                      <option value="Cultural Heritage">Cultural Heritage</option>
                      <option value="Helicopter Tours">Helicopter Tours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Duration</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F1D] mb-1">Retail Price per Traveler (USD)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                  />
                  <p className="text-[11px] text-[#5F6B66] mt-1">
                    Into Nepal calculates: 15% Platform Reservation (${(Number(newPrice) * 0.15).toFixed(0)}) paid at booking, 85% Agency Balance (${(Number(newPrice) * 0.85).toFixed(0)}) paid directly to you.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#1E4B8F] text-white text-xs font-bold">
                    Submit Listing for Verification
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
