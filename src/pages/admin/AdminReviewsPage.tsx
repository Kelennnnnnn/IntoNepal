import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { fetchAdminReviews, toggleReviewHidden } from '../../lib/adminData';
import type { Review } from '../../lib/types';
import { toast } from 'sonner';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  // Reason modal for hiding/restoring review
  const [targetReview, setTargetReview] = useState<Review | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminReviews();
      setReviews(data);
    } catch (err: any) {
      toast.error('Failed to load reviews: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModeration = (rev: Review) => {
    setTargetReview(rev);
    setModerationReason(
      rev.hidden
        ? 'Restored by administrator upon review'
        : 'Inappropriate language / spam violation'
    );
  };

  const handleConfirmModeration = async () => {
    if (!targetReview) return;
    setIsProcessing(true);

    try {
      const nextHidden = await toggleReviewHidden(
        targetReview.id,
        targetReview.hidden,
        moderationReason
      );
      toast.success(
        `Review ${nextHidden ? 'hidden from public activity pages' : 'restored to public view'}`
      );
      setTargetReview(null);
      await loadData();
    } catch (err: any) {
      toast.error('Failed to moderate review: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesVis =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && !r.hidden) ||
      (visibilityFilter === 'hidden' && r.hidden);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.comment.toLowerCase().includes(q) ||
      (r.traveler_name && r.traveler_name.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q);

    return matchesVis && matchesSearch;
  });

  return (
    <AdminLayout
      title="Customer Review Moderation"
      subtitle="Safeguard marketplace trust by moderating fake reviews, abusive language, or competitor spam"
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
      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setVisibilityFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              visibilityFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setVisibilityFilter('visible')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              visibilityFilter === 'visible' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Published ({reviews.filter((r) => !r.hidden).length})
          </button>
          <button
            onClick={() => setVisibilityFilter('hidden')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              visibilityFilter === 'hidden' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Hidden / Moderated ({reviews.filter((r) => r.hidden).length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search comment, traveler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* DENSE REVIEWS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Review ID & Author</th>
                <th className="py-2.5 px-4">Rating</th>
                <th className="py-2.5 px-4">Comment Body</th>
                <th className="py-2.5 px-4">Date Posted</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No reviews match current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((rev) => (
                  <tr
                    key={rev.id}
                    className={`transition-colors ${
                      rev.hidden ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {rev.traveler_name || 'Traveler'}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{rev.id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="font-mono font-bold text-slate-800 ml-1">
                          {rev.rating}/5
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">{rev.comment}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rev.hidden
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rev.hidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenModeration(rev)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                          rev.hidden
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        {rev.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{rev.hidden ? 'Restore' : 'Hide Review'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODERATION REASON MODAL */}
      {targetReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {targetReview.hidden ? 'Restore Review to Public View' : 'Hide Review from Public Pages'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Review ID: <span className="font-mono">{targetReview.id}</span> by{' '}
              <strong className="text-slate-800">{targetReview.traveler_name}</strong>
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 mb-4 italic">
              &quot;{targetReview.comment}&quot;
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moderation Reason (Audited)
              </label>
              <textarea
                rows={3}
                required
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTargetReview(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing || !moderationReason.trim()}
                onClick={handleConfirmModeration}
                className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-2xs ${
                  targetReview.hidden
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing ? 'Processing...' : targetReview.hidden ? 'Restore Review' : 'Confirm Hide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
