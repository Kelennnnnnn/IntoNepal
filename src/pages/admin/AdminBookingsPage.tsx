import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  DollarSign,
  Percent,
  CreditCard,
  User,
  Building2,
  MapPin,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { fetchAdminBookings, updateBookingStatus } from '../../lib/adminData';
import type { Booking } from '../../lib/types';
import { toast } from 'sonner';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled' | 'pending'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminBookings();
      setBookings(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load bookings');
      toast.error('Failed to load bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusOverride = async (bookingId: string, newStatus: string, newPaymentStatus?: string) => {
    setIsUpdating(true);
    try {
      await updateBookingStatus(bookingId, newStatus, newPaymentStatus);
      toast.success(`Booking ${bookingId} status updated to ${newStatus.toUpperCase()}`);
      setSelectedBooking(null);
      await loadData();
    } catch (err: any) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (b.id || '').toLowerCase().includes(q) ||
      (b.traveler_name || '').toLowerCase().includes(q) ||
      (b.traveler_email || '').toLowerCase().includes(q) ||
      (b.listing_id || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Financial totals for current view
  const totalGross = filtered.reduce((acc, b) => acc + Number(b.total_amount || 0), 0);
  const totalFees = filtered.reduce((acc, b) => acc + Number(b.commission_amount || 0), 0);
  const totalNet = filtered.reduce((acc, b) => acc + Number(b.net_payout || 0), 0);

  return (
    <AdminLayout
      title="Global Booking Ledger & Commission Audit"
      subtitle="Supervise reservation flows, platform commission deductions, and agency escrow balances"
      actions={
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      }
    >
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={loadData}
            className="px-3 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      {/* FINANCIAL SUMMARY STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Filtered Gross Volume
          </span>
          <span className="text-xl font-black font-mono text-slate-900">
            ${totalGross.toFixed(2)}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
            Platform Take (15% Commission)
          </span>
          <span className="text-xl font-black font-mono text-amber-600">
            ${totalFees.toFixed(2)}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Net Agency Payout Escrow
          </span>
          <span className="text-xl font-black font-mono text-emerald-600">
            ${totalNet.toFixed(2)}
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'confirmed' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'cancelled' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search traveler, booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* DENSE BOOKINGS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Booking ID</th>
                <th className="py-2.5 px-4">Traveler Details</th>
                <th className="py-2.5 px-4">Trip Date</th>
                <th className="py-2.5 px-4">Guests</th>
                <th className="py-2.5 px-4 text-right">Total (Gross)</th>
                <th className="py-2.5 px-4 text-right">Platform Fee</th>
                <th className="py-2.5 px-4 text-right">Net to Agency</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.traveler_name}</div>
                      <div className="text-[11px] text-slate-500">{b.traveler_email}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {b.trip_date}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${Number(b.total_amount).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-amber-600">
                      ${Number(b.commission_amount).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      ${Number(b.net_payout).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'confirmed' || b.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Detail Drawer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / OVERRIDE MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Booking Financial & Dispatch Ledger
                </h3>
                <span className="font-mono text-xs text-slate-500">{selectedBooking.id}</span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* COMMISSION SPLIT CARD */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
                  Audited Financial Breakdown
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Total Collected</span>
                    <span className="text-base font-bold">${Number(selectedBooking.total_amount).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-300 block font-sans">Platform Take (15%)</span>
                    <span className="text-base font-bold text-amber-400">
                      -${Number(selectedBooking.commission_amount).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block font-sans">Net Agency Escrow</span>
                    <span className="text-base font-bold text-emerald-400">
                      ${Number(selectedBooking.net_payout).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-[11px] block">Traveler Full Name</span>
                  <span className="font-bold text-slate-900">{selectedBooking.traveler_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Contact Email</span>
                  <span className="font-mono text-slate-900">{selectedBooking.traveler_email}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Contact Phone</span>
                  <span className="font-mono text-slate-900">{selectedBooking.traveler_phone || 'None recorded'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Scheduled Trip Date</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.trip_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Stripe Payment Reference</span>
                  <span className="font-mono text-[10px] text-slate-600">{selectedBooking.payment_intent_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Payment Settlement</span>
                  <span className="font-bold text-emerald-700 capitalize">{selectedBooking.payment_status}</span>
                </div>
              </div>

              {/* ADMINISTRATIVE OVERRIDE */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <span className="font-bold text-amber-900 block">Administrator Status Override:</span>
                <p className="text-[11px] text-amber-800">
                  Directly modify the lifecycle status of this booking. All actions write to the audit log.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusOverride(selectedBooking.id, 'confirmed', 'paid')}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 text-[11px]"
                  >
                    Set Confirmed
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusOverride(selectedBooking.id, 'completed', 'paid')}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 text-[11px]"
                  >
                    Set Completed
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusOverride(selectedBooking.id, 'cancelled', 'refunded')}
                    className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-[11px]"
                  >
                    Cancel & Mark Refunded
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
