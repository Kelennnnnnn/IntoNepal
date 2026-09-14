import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  RefreshCw,
  MapPin,
  Clock,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  fetchAdminListings,
  toggleListingStatus,
  toggleListingFeatured,
} from '../../lib/adminData';
import type { Listing } from '../../lib/types';
import { toast } from 'sonner';

export const AdminListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminListings();
      setListings(data);
    } catch (err: any) {
      toast.error('Failed to load listings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (listing: Listing) => {
    try {
      const nextStatus = await toggleListingStatus(listing.id, listing.status);
      toast.success(
        `Listing "${listing.title}" is now ${nextStatus.toUpperCase()}`
      );
      await loadData();
    } catch (err: any) {
      toast.error('Failed to toggle status: ' + err.message);
    }
  };

  const handleToggleFeatured = async (listing: Listing) => {
    try {
      const nextFeatured = await toggleListingFeatured(listing.id, listing.featured || false);
      toast.success(
        `Listing "${listing.title}" is ${nextFeatured ? 'now Featured' : 'no longer Featured'}`
      );
      await loadData();
    } catch (err: any) {
      toast.error('Failed to toggle featured state: ' + err.message);
    }
  };

  const filtered = listings.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout
      title="Trek & Expedition Listing Moderation"
      subtitle="Supervise active itineraries, moderate visibility, and feature top expeditions"
      actions={
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      }
    >
      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Listings ({listings.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'published'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published ({listings.filter((l) => l.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('hidden')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'hidden'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hidden / Moderated ({listings.filter((l) => l.status === 'hidden').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search title, region, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* DENSE LISTINGS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Trek Package</th>
                <th className="py-2.5 px-4">Region / Location</th>
                <th className="py-2.5 px-4">Duration & Difficulty</th>
                <th className="py-2.5 px-4 text-right">Price (USD)</th>
                <th className="py-2.5 px-4 text-center">Featured</th>
                <th className="py-2.5 px-4 text-center">Visibility</th>
                <th className="py-2.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No listings match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        {item.images?.[0] && (
                          <img
                            src={item.images[0]}
                            alt=""
                            className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium">{item.duration}</div>
                      <div className="text-[10px] text-slate-500">{item.difficulty}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${item.price}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                          item.featured
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click to toggle featured status"
                      >
                        <Star className={`w-3 h-3 ${item.featured ? 'fill-amber-500 text-amber-600' : ''}`} />
                        <span>{item.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedListing(item)}
                          className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px]"
                        >
                          Inspect
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`px-2 py-1 rounded font-bold text-[11px] transition-colors ${
                            item.status === 'published'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {item.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>

                        <Link
                          to={`/activities/${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Open public listing"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Listing Moderation Details
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">{selectedListing.title}</h4>
                <p className="text-slate-600 leading-relaxed">{selectedListing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Location</span>
                  <span className="font-semibold text-slate-800">{selectedListing.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Price</span>
                  <span className="font-mono font-bold text-slate-900">${selectedListing.price} / person</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration</span>
                  <span className="font-semibold text-slate-800">{selectedListing.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Max Group Size</span>
                  <span className="font-semibold text-slate-800">{selectedListing.max_participants} Travelers</span>
                </div>
              </div>

              {selectedListing.includes && selectedListing.includes.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Package Inclusions:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {selectedListing.includes.map((inc, i) => (
                      <li key={i}>{inc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <Link
                to={`/activities/${selectedListing.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 font-semibold text-xs hover:underline flex items-center gap-1"
              >
                View Public Page <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded-md text-xs font-semibold hover:bg-slate-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleStatus(selectedListing);
                    setSelectedListing(null);
                  }}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-md hover:bg-amber-400"
                >
                  Toggle Visibility
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
