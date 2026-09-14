import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CalendarCheck,
  Percent,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Compass,
  CreditCard,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  fetchAdminBookings,
  fetchAdminAgencies,
  fetchPayouts,
  fetchPlatformSettings,
  type SystemSettingsState,
} from '../../lib/adminData';
import { fetchAllAuditLogs } from '../../lib/audit';
import type { Booking, Agency, Payout, AuditLogEntry } from '../../lib/types';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [settings, setSettings] = useState<SystemSettingsState>({
    maintenance_mode: false,
    payments_enabled: true,
    payouts_enabled: true,
    commission_rate: 15,
  });

  useEffect(() => {
    async function load() {
      try {
        const [b, a, p, logs, s] = await Promise.all([
          fetchAdminBookings(),
          fetchAdminAgencies(),
          fetchPayouts(),
          fetchAllAuditLogs(),
          fetchPlatformSettings(),
        ]);
        setBookings(b);
        setAgencies(a);
        setPayouts(p);
        setAuditLogs(logs);
        setSettings(s);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute metrics
  const totalGmv = bookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
  const totalCommission = bookings.reduce(
    (sum, b) => sum + (Number(b.commission_amount) || 0),
    0
  );
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed');
  const pendingAgencies = agencies.filter((a) => a.status === 'pending');
  const failedPayouts = payouts.filter((p) => p.status === 'failed');

  return (
    <AdminLayout
      title="Platform Operations Dashboard"
      subtitle="Real-time financial telemetry, compliance queues, and system integrity overview"
    >
      {/* SYSTEM ALERTS STRIP */}
      <div className="space-y-2 mb-6">
        {settings.maintenance_mode && (
          <div className="p-3 bg-red-600 text-white rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                EMERGENCY ALERT: Platform Maintenance Mode is CURRENTLY ACTIVE.
              </span>
            </div>
            <Link
              to="/admin/settings"
              className="text-xs font-bold uppercase tracking-wider underline hover:text-red-100"
            >
              Modify Settings →
            </Link>
          </div>
        )}

        {failedPayouts.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Action Required:</strong> {failedPayouts.length} payout disbursement failed due to Stripe/Banking restriction.
              </span>
            </div>
            <Link
              to="/admin/payments"
              className="font-bold text-amber-800 hover:text-amber-950 underline shrink-0 ml-2"
            >
              Inspect & Retry →
            </Link>
          </div>
        )}

        {pendingAgencies.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Verification Queue:</strong> {pendingAgencies.length} trekking agency partner application awaiting license approval.
              </span>
            </div>
            <Link
              to="/admin/agencies"
              className="font-bold text-blue-800 hover:text-blue-950 underline shrink-0 ml-2"
            >
              Review Documents →
            </Link>
          </div>
        )}
      </div>

      {/* METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* GMV */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gross Merchandise Value (GMV)
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalGmv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Escrow & Completed volume</span>
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Platform Bookings
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {bookings.length}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600">{confirmedBookings.length} confirmed</span> / {bookings.length - confirmedBookings.length} other
          </div>
        </div>

        {/* COMMISSION */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Platform Commission Revenue
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            ${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Based on <span className="font-semibold text-slate-700">{settings.commission_rate}%</span> platform take rate
          </div>
        </div>

        {/* PENDING QUEUE */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Verifications
            </span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {pendingAgencies.length}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Requires manual license check</span>
            <Link to="/admin/agencies" className="text-purple-600 font-semibold hover:underline">
              Open Queue →
            </Link>
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT: RECENT BOOKINGS & AUDIT STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT BOOKINGS TABLE (2 COLS) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Platform Transactions</h2>
              <p className="text-xs text-slate-500">Latest reservations and commission splits</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Booking ID</th>
                  <th className="py-2.5 px-4">Traveler</th>
                  <th className="py-2.5 px-4">Trip Date</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                  <th className="py-2.5 px-4 text-right">Fee (15%)</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-700">
                      {b.id}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900">{b.traveler_name}</div>
                      <div className="text-[10px] text-slate-400">{b.traveler_email}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{b.trip_date}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${Number(b.total_amount).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-600">
                      ${Number(b.commission_amount).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUDIT LOG SNAPSHOT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Audit Trail Stream</h2>
              <p className="text-xs text-slate-500">Live administrative action ledger</p>
            </div>
            <Link
              to="/admin/audit"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Full Log <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No administrative events recorded yet.</p>
            ) : (
              auditLogs.slice(0, 7).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] font-medium truncate">
                    Target: <span className="font-mono text-slate-900">{log.entity_type} / {log.entity_id}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
