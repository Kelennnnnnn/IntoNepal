import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Banknote,
  DollarSign,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  PlusCircle,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  X,
  Send,
  Download,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  fetchPayouts,
  fetchOutstandingPayouts,
  processPayout,
  retryPayout,
  fetchAdminAgencies,
  type OutstandingAgencyPayout,
} from '../../lib/adminData';
import {
  getStoredDisputes,
  updateDisputeStatus,
  type DisputeMediation,
} from '../../data/reviewsAndDisputesData';
import type { Payout, Agency } from '../../lib/types';
import { toast } from 'sonner';

export const AdminPaymentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [outstanding, setOutstanding] = useState<OutstandingAgencyPayout[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [disputes, setDisputes] = useState<DisputeMediation[]>([]);

  // "Pay out" Confirm Dialog state
  const [payingAgency, setPayingAgency] = useState<OutstandingAgencyPayout | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // "Record Manual Payout" Modal state
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualAgencyId, setManualAgencyId] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualRef, setManualRef] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  // Retry modal state
  const [retryingPayout, setRetryingPayout] = useState<Payout | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [outList, history, ags] = await Promise.all([
        fetchOutstandingPayouts(),
        fetchPayouts(),
        fetchAdminAgencies(),
      ]);
      setOutstanding(outList);
      setPayoutHistory(history);
      setAgencies(ags);
      setDisputes(getStoredDisputes());
      if (ags.length > 0 && !manualAgencyId) {
        setManualAgencyId(ags[0].user_id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load payment ledgers');
      toast.error('Failed to load payment ledgers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleDisputeUpdate = () => {
      setDisputes(getStoredDisputes());
    };
    window.addEventListener('into_nepal_dispute_updated', handleDisputeUpdate);
    return () => {
      window.removeEventListener('into_nepal_dispute_updated', handleDisputeUpdate);
    };
  }, []);

  const handleResolveDispute = (
    id: string,
    status: DisputeMediation['status'],
    note: string
  ) => {
    updateDisputeStatus(id, status, note);
    setDisputes(getStoredDisputes());
    toast.success(`Dispute status updated to ${status}`);
  };

  // Handle "Pay out" via Stripe or configured automated method
  const handleExecutePayout = async () => {
    if (!payingAgency) return;
    setIsProcessing(true);

    try {
      toast.loading(`Processing escrow disbursement of $${payingAgency.amount_owed} to ${payingAgency.agency_name}...`, {
        id: 'payout-action',
      });

      const res = await processPayout({
        agencyUserId: payingAgency.agency_user_id,
        amount: payingAgency.amount_owed,
        bookingIds: payingAgency.booking_ids,
        method: payingAgency.payout_method,
        notes: `Automated ${(payingAgency.payout_method || 'bank_transfer').toUpperCase()} payout for ${payingAgency.unpaid_booking_count} bookings.`,
      });

      if (res.status === 'failed') {
        toast.error(`Payout failed: Provider rejected transfer. Added to retry queue.`, {
          id: 'payout-action',
          duration: 6000,
        });
      } else {
        toast.success(`Disbursement completed! Wire ref: ${res.transfer_reference || res.stripe_transfer_id || res.id}`, {
          id: 'payout-action',
        });
      }

      setPayingAgency(null);
      await loadData();
    } catch (err: any) {
      toast.error('Payout failed: ' + err.message, { id: 'payout-action' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle "Record Manual Payout" (outside bank wire)
  const handleRecordManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid payout amount.');
      return;
    }
    if (!manualRef.trim()) {
      toast.error('Please enter a bank wire reference number.');
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading('Recording manual bank transfer in ledger...', { id: 'manual-payout' });

      await processPayout({
        agencyUserId: manualAgencyId,
        amount: amt,
        bookingIds: [],
        method: 'manual',
        notes: `Bank Wire Ref: ${manualRef.trim()}. Notes: ${manualNotes.trim() || 'Direct bank settlement.'}`,
      });

      toast.success(`Manual wire recorded successfully for $${amt.toFixed(2)}`, {
        id: 'manual-payout',
      });

      setManualModalOpen(false);
      setManualAmount('');
      setManualRef('');
      setManualNotes('');
      await loadData();
    } catch (err: any) {
      toast.error('Failed to record manual payout: ' + err.message, { id: 'manual-payout' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Retry of failed payout
  const handleRetryConfirm = async () => {
    if (!retryingPayout) return;
    setIsProcessing(true);

    try {
      toast.loading(`Retrying payout disbursement ${retryingPayout.id}...`, { id: 'retry-payout' });
      await retryPayout(retryingPayout.id);
      toast.success('Payout retry succeeded and marked as completed.', { id: 'retry-payout' });
      setRetryingPayout(null);
      await loadData();
    } catch (err: any) {
      toast.error('Retry failed: ' + err.message, { id: 'retry-payout' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Computations
  const totalOutstanding = outstanding.reduce((sum, o) => sum + o.amount_owed, 0);
  const totalPaidHistorical = payoutHistory
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const handleExportBankManifest = () => {
    if (outstanding.length === 0) {
      toast.info('No pending disbursements to export.');
      return;
    }

    const headers = [
      'Agency Name',
      'Contact Person',
      'City',
      'Account / IBAN',
      'Bank / Routing',
      'Unpaid Bookings Count',
      'Amount Owed (USD)',
      'Estimated NPR (@ 134.50)',
      'Payout Method',
      'Generated Date',
    ];

    const rows = outstanding.map((item) => [
      `"${(item.agency_name || 'Agency').replace(/"/g, '""')}"`,
      `"${(item.bank_details?.account_holder || item.email || 'N/A').replace(/"/g, '""')}"`,
      `"Kathmandu"`,
      `"${item.bank_details?.last_four ? `ACC-••••${item.bank_details.last_four}` : 'ACC-9920194'}"`,
      `"${item.bank_details?.bank_name || 'NIC ASIA Bank / Himalayan Bank'}"`,
      item.booking_ids.length,
      item.amount_owed.toFixed(2),
      (item.amount_owed * 134.5).toFixed(2),
      item.payout_method || 'BANK_TRANSFER',
      new Date().toISOString().split('T')[0],
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `into-nepal-bank-wire-manifest-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${outstanding.length} agency wire records to CSV`);
  };

  return (
    <AdminLayout
      title="Payments, Escrow & Agency Disbursements"
      subtitle="Settle verified earnings with partners via Stripe Connect or audited bank wire transfers"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBankManifest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            title="Download Bank Wire batch file for Himalayan Bank or Nabil Bank settlement"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Wire Manifest (.CSV)
          </button>
          <button
            onClick={() => setManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Record Manual Payout
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
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
            className="px-3 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
      {/* 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* OUTSTANDING */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Outstanding Payouts (Escrow)
            </span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-amber-600">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Unsettled earnings held for completed and confirmed bookings
          </p>
        </div>

        {/* AGENCIES AWAITING PAYOUT */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Agencies Awaiting Payout
            </span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {outstanding.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Partner operators with ready disbursement balances
          </p>
        </div>

        {/* TOTAL PAID */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Paid Out (Historical)
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600">
            ${totalPaidHistorical.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Audited disbursements completed via Stripe & Bank Wire
          </p>
        </div>
      </div>

      {/* ESCROW MEDIATION & DISPUTES SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900">
                Escrow Mediation, Cancellations & Flight Reschedules
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review traveler-operator disputes, Lukla weather diversions, and refund requests safeguarded under the 15% platform deposit policy.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {disputes.length} Active Cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Case & Booking</th>
                <th className="py-2.5 px-4">Traveler & Agency</th>
                <th className="py-2.5 px-4">Reason & Details</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Mediation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {disputes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No active escrow disputes or cancellation cases. All expeditions in good standing.
                  </td>
                </tr>
              ) : (
                disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        #{d.id.toUpperCase()}
                      </span>
                      <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-1 rounded">
                        Ref: {d.bookingReference}
                      </span>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">
                        {d.listingTitle}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{d.travelerName}</div>
                      <div className="text-[11px] text-slate-500">{d.travelerEmail}</div>
                      <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
                        Agency: {d.agencyName}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-[300px]">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 mb-1">
                        {d.reason.replace(/_/g, ' ')}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {d.description}
                      </p>
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        <strong>Req:</strong> {d.preferredOutcome}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'REFUND_APPROVED'
                            ? 'bg-purple-100 text-purple-800'
                            : d.status === 'IN_MEDIATION'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status}
                      </span>
                      {d.adminNotes && (
                        <div className="text-[10px] text-slate-400 mt-1 italic line-clamp-1">
                          {d.adminNotes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      {d.status !== 'RESOLVED' && d.status !== 'REFUND_APPROVED' ? (
                        <div className="flex flex-col gap-1 items-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleResolveDispute(
                                d.id,
                                'RESOLVED',
                                'Reschedule dates granted with operating agency agreement.'
                              )
                            }
                            className="px-2 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            Approve Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleResolveDispute(
                                d.id,
                                'REFUND_APPROVED',
                                'Deposit refunded under Lukla weather & force majeure policy.'
                              )
                            }
                            className="px-2 py-1 text-[11px] font-bold bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors cursor-pointer"
                          >
                            Authorize Refund
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Case Concluded
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OUTSTANDING PAYOUTS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Pending Disbursements Ready for Settlement
            </h2>
            <p className="text-xs text-slate-500">
              Click &quot;Pay Out&quot; to trigger the Stripe Connect transfer or approve release
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 font-semibold">
            {outstanding.length} Queued
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Agency Partner</th>
                <th className="py-2.5 px-4">Unpaid Bookings</th>
                <th className="py-2.5 px-4">Payout Method & Details</th>
                <th className="py-2.5 px-4 text-right">Amount Owed</th>
                <th className="py-2.5 px-4 text-right">Disbursement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {outstanding.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    All agency partner earnings have been fully settled. No pending payouts.
                  </td>
                </tr>
              ) : (
                outstanding.map((item) => (
                  <tr key={item.agency_user_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.agency_name}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-semibold">
                      {item.unpaid_booking_count} {item.unpaid_booking_count === 1 ? 'trip' : 'trips'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.payout_method === 'nic_asia_wire' || item.payout_method === 'bank_wire' || item.payout_method === 'stripe'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          <Banknote className="w-3 h-3" />
                          {item.payout_method === 'nic_asia_wire' || item.payout_method === 'bank_wire' || item.payout_method === 'stripe' ? 'NIC ASIA Settlement' : 'Manual Wire'}
                        </span>
                        {item.bank_details && (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {item.bank_details.bank_name} (•••{item.bank_details.last_four})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-black text-sm text-slate-900">
                      ${Number(item.amount_owed || 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setPayingAgency(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        Pay Out ${Number(item.amount_owed || 0).toFixed(2)}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYOUT HISTORY TABLE WITH FAILED HIGHLIGHT */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Historical Payout Records</h2>
            <p className="text-xs text-slate-500">
              Audit ledger of all automated and manual partner remittances
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {payoutHistory.length} total transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Payout ID</th>
                <th className="py-2.5 px-4">Agency / Recipient</th>
                <th className="py-2.5 px-4 text-right">Amount (USD)</th>
                <th className="py-2.5 px-4">Method & Transfer Reference</th>
                <th className="py-2.5 px-4">Date Dispatched</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payoutHistory.map((p) => {
                const isFailed = p.status === 'failed';
                const agencyObj = agencies.find((a) => a.user_id === p.agency_user_id);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isFailed
                        ? 'bg-red-50/70 hover:bg-red-50 border-l-4 border-red-500'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {p.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {agencyObj?.company_name || p.agency_user_id}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{p.notes}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${Number(p.amount).toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold capitalize text-slate-800">
                          {p.method}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {p.transfer_reference || p.stripe_transfer_id || 'Settlement Wire'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'failed'
                            ? 'bg-red-200 text-red-900 font-black'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isFailed && (
                        <button
                          type="button"
                          onClick={() => setRetryingPayout(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-red-600 text-white rounded hover:bg-red-700 shadow-2xs transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Retry Payout
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM PAYOUT DIALOG */}
      {payingAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 rounded-full text-emerald-700">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Partner Payout
                </h3>
                <p className="text-xs text-slate-500">
                  Execute transfer of platform-held funds to agency bank
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Agency:</span>
                <span className="font-bold text-slate-900">{payingAgency.agency_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement Amount:</span>
                <span className="font-mono font-black text-emerald-600 text-sm">
                  ${Number(payingAgency.amount_owed || 0).toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bookings Included:</span>
                <span className="font-semibold text-slate-800">{payingAgency.unpaid_booking_count} bookings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payout Rail:</span>
                <span className="font-semibold text-slate-800 uppercase">{payingAgency.payout_method}</span>
              </div>
              {payingAgency.bank_details && (
                <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500">Bank Details:</span>
                  <span className="font-mono text-slate-700">
                    {payingAgency.bank_details.bank_name} •••{payingAgency.bank_details.last_four}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setPayingAgency(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayout}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                {isProcessing ? 'Calling process-payout...' : 'Confirm & Execute Payout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD MANUAL PAYOUT MODAL */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Record Manual Bank Wire Payout
              </h3>
              <button
                onClick={() => setManualModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordManual} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Trekking Agency
                </label>
                <select
                  required
                  value={manualAgencyId}
                  onChange={(e) => setManualAgencyId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {agencies.map((a) => (
                    <option key={a.user_id} value={a.user_id}>
                      {a.company_name} ({a.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amount Disbursed (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 2400.00"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bank Reference / SWIFT Wire Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HBL-NPR-98421098"
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Accounting Notes / Bank Details
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Wire transfer executed through Himalayan Bank Ltd Kathmandu central branch."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-2xs transition-colors"
                >
                  {isProcessing ? 'Recording...' : 'Record Wire Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETRY FAILED PAYOUT MODAL */}
      {retryingPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-full text-red-700">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Retry Failed Payout {retryingPayout.id}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              This will re-invoke the <code className="text-amber-700 font-mono">process-payout</code> edge service for
              the sum of <strong className="text-slate-900">${Number(retryingPayout.amount).toFixed(2)}</strong>.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRetryingPayout(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRetryConfirm}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg shadow-2xs"
              >
                {isProcessing ? 'Retrying...' : 'Confirm Retry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
