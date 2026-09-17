import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { fetchAdminAgencies, approveAgency, rejectAgency } from '../../lib/adminData';
import type { Agency } from '../../lib/types';
import { toast } from 'sonner';

export const AdminAgenciesPage: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected agency for Document Viewer / Detail Modal
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [activeDocUrl, setActiveDocUrl] = useState<string | null>(null);
  const [activeDocTitle, setActiveDocTitle] = useState<string>('');

  // Rejection modal state
  const [rejectingAgency, setRejectingAgency] = useState<Agency | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminAgencies();
      setAgencies(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load agency records');
      toast.error('Failed to load agency records: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * 🔴 CRITICAL REQUIREMENT IMPLEMENTATION:
   * (a) Reads user_id from the database (performed inside approveAgency)
   * (b) Calls role-upgrade edge function
   * (c) Surfaces failure as an error toast
   */
  const handleApprove = async (agencyId: string) => {
    setIsProcessing(true);
    try {
      toast.loading('Verifying agency in database and upgrading auth role...', { id: 'agency-approve' });
      const res = await approveAgency(agencyId);
      toast.success(`Partner verified successfully: ${res.companyName}. Role upgraded to agency.`, {
        id: 'agency-approve',
      });
      setSelectedAgency(null);
      await loadData();
    } catch (err: any) {
      // 🔴 (c) SURFACE failure as error toast
      console.error('CRITICAL APPROVAL FAILURE:', err);
      toast.error(`Approval Aborted: ${err.message}`, { id: 'agency-approve', duration: 8000 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingAgency) return;
    if (!rejectionReason.trim()) {
      toast.error('Please specify a rejection reason for the applicant.');
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading('Recording application rejection...', { id: 'agency-reject' });
      await rejectAgency(rejectingAgency.id, rejectionReason.trim());
      toast.success(`Application rejected for ${rejectingAgency.company_name}. Notice dispatched.`, {
        id: 'agency-reject',
      });
      setRejectingAgency(null);
      setRejectionReason('');
      setSelectedAgency(null);
      await loadData();
    } catch (err: any) {
      toast.error('Rejection failed: ' + err.message, { id: 'agency-reject' });
    } finally {
      setIsProcessing(false);
    }
  };

  const openDocument = (url: string, title: string) => {
    setActiveDocUrl(url);
    setActiveDocTitle(title);
  };

  // Filtered agencies
  const filtered = agencies.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (a.company_name || '').toLowerCase().includes(q) ||
      (a.city || '').toLowerCase().includes(q) ||
      (a.registration_number || '').toLowerCase().includes(q) ||
      (a.contact_person || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = agencies.filter((a) => a.status === 'pending').length;

  return (
    <AdminLayout
      title="Trekking Agency Verification Queue"
      subtitle="Verify Nepal Department of Tourism licenses, government certificates, and role upgrades"
      actions={
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
      {/* FILTER CONTROLS & SEARCH */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                filterStatus === 'pending'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === 'verified'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified Partners
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({agencies.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search company, reg #, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* DENSE AGENCIES TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Trekking Agency</th>
                <th className="py-2.5 px-4">Govt Reg Number</th>
                <th className="py-2.5 px-4">Contact & Location</th>
                <th className="py-2.5 px-4">Experience</th>
                <th className="py-2.5 px-4">Documents</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No agencies match the selected status or search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Agency Info */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{agency.company_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{agency.email}</span>
                      </div>
                    </td>

                    {/* Registration */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {agency.registration_number}
                      </span>
                    </td>

                    {/* Contact & Location */}
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium">{agency.contact_person}</div>
                      <div className="text-[11px] text-slate-500">{agency.city}, Nepal</div>
                    </td>

                    {/* Years operating */}
                    <td className="py-3 px-4 text-slate-700">
                      {agency.years_operating} years operating
                    </td>

                    {/* Documents Icons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {agency.license_doc_url ? (
                          <button
                            type="button"
                            onClick={() =>
                              openDocument(agency.license_doc_url!, `${agency.company_name} - Nepal Tourism License`)
                            }
                            className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                            title="View Tourism License"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">No doc</span>
                        )}

                        {agency.registration_doc_url && (
                          <button
                            type="button"
                            onClick={() =>
                              openDocument(agency.registration_doc_url!, `${agency.company_name} - Company Reg Certificate`)
                            }
                            className="p-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                            title="View Company Registration"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {agency.insurance_doc_url && (
                          <button
                            type="button"
                            onClick={() =>
                              openDocument(agency.insurance_doc_url!, `${agency.company_name} - Guide Insurance Policy`)
                            }
                            className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            title="View Insurance Doc"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          agency.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : agency.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {agency.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedAgency(agency)}
                          className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] transition-colors"
                        >
                          Review
                        </button>

                        {agency.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApprove(agency.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                              title="Approve and trigger role-upgrade"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => setRejectingAgency(agency)}
                              className="px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold text-[11px] transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / VERIFICATION DRAWER */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {selectedAgency.company_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Application ID: <span className="font-mono">{selectedAgency.id}</span> • User ID: <span className="font-mono">{selectedAgency.user_id}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgency(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* CURRENT STATUS */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">Verification Status:</span>
                <span
                  className={`font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-[10px] ${
                    selectedAgency.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedAgency.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedAgency.status}
                </span>
              </div>

              {selectedAgency.rejection_reason && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900">
                  <span className="font-bold">Prior Rejection Reason:</span>
                  <p className="mt-1">{selectedAgency.rejection_reason}</p>
                </div>
              )}

              {/* COMPANY DETAILS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block text-[11px]">Govt Registration Number</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedAgency.registration_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Years Operating</span>
                  <span className="font-semibold text-slate-900">{selectedAgency.years_operating} Years</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contact Person</span>
                  <span className="font-semibold text-slate-900">{selectedAgency.contact_person}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Official Phone</span>
                  <span className="font-semibold text-slate-900">{selectedAgency.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email</span>
                  <span className="font-semibold text-slate-900">{selectedAgency.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Address & City</span>
                  <span className="font-semibold text-slate-900">{selectedAgency.address}, {selectedAgency.city}</span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <span className="text-slate-500 block text-[11px] mb-1">Company Description</span>
                <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedAgency.description || 'No description provided.'}
                </p>
              </div>

              {/* DOCUMENT VIEWER BUTTONS */}
              <div>
                <span className="text-slate-900 font-bold block mb-2">Submitted Regulatory Documents</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedAgency.license_doc_url ? (
                    <button
                      type="button"
                      onClick={() => openDocument(selectedAgency.license_doc_url!, 'Nepal Tourism Department License')}
                      className="p-3 border border-blue-200 bg-blue-50/60 rounded-lg hover:bg-blue-100 flex items-center justify-between text-left group transition-colors"
                    >
                      <div>
                        <div className="font-bold text-blue-900">Tourism License</div>
                        <div className="text-[10px] text-blue-700">Official Certificate</div>
                      </div>
                      <Eye className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    <div className="p-3 border border-dashed border-slate-200 rounded-lg text-slate-400 text-center">
                      No License Uploaded
                    </div>
                  )}

                  {selectedAgency.registration_doc_url ? (
                    <button
                      type="button"
                      onClick={() => openDocument(selectedAgency.registration_doc_url!, 'Company Registration Certificate')}
                      className="p-3 border border-purple-200 bg-purple-50/60 rounded-lg hover:bg-purple-100 flex items-center justify-between text-left group transition-colors"
                    >
                      <div>
                        <div className="font-bold text-purple-900">Company Reg</div>
                        <div className="text-[10px] text-purple-700">Incorporation Doc</div>
                      </div>
                      <Eye className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    <div className="p-3 border border-dashed border-slate-200 rounded-lg text-slate-400 text-center">
                      No Reg Uploaded
                    </div>
                  )}

                  {selectedAgency.insurance_doc_url ? (
                    <button
                      type="button"
                      onClick={() => openDocument(selectedAgency.insurance_doc_url!, 'Staff & Porter Insurance Policy')}
                      className="p-3 border border-emerald-200 bg-emerald-50/60 rounded-lg hover:bg-emerald-100 flex items-center justify-between text-left group transition-colors"
                    >
                      <div>
                        <div className="font-bold text-emerald-900">Guide Insurance</div>
                        <div className="text-[10px] text-emerald-700">Rescue Policy</div>
                      </div>
                      <Eye className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    <div className="p-3 border border-dashed border-slate-200 rounded-lg text-slate-400 text-center">
                      No Insurance Doc
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedAgency(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white text-xs font-semibold transition-colors"
              >
                Close Drawer
              </button>

              {selectedAgency.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setRejectingAgency(selectedAgency)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-xs font-bold transition-colors"
                  >
                    Reject with Reason
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleApprove(selectedAgency.id)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Approve & Trigger Role Upgrade
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {activeDocUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Document Viewer: {activeDocTitle}
              </span>
              <button
                onClick={() => setActiveDocUrl(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 overflow-auto flex items-center justify-center min-h-[400px]">
              <img
                src={activeDocUrl}
                alt={activeDocTitle}
                className="max-h-[70vh] w-auto object-contain rounded border border-slate-300 shadow-md"
              />
            </div>
            <div className="px-5 py-3 border-t border-slate-200 bg-white flex justify-between items-center text-xs">
              <a
                href={activeDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 font-semibold hover:underline flex items-center gap-1"
              >
                Open Original in New Tab <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveDocUrl(null)}
                className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded font-semibold hover:bg-slate-300 transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingAgency && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Reject Agency Application
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify the reason for declining <strong className="text-slate-800">{rejectingAgency.company_name}</strong>.
              This reason will be recorded in the audit log and emailed to the applicant.
            </p>

            <textarea
              rows={4}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Nepal Tourism license image was blurry and expired on 2024-12-31. Please re-upload a valid license certificate."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingAgency(null);
                  setRejectionReason('');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing || !rejectionReason.trim()}
                onClick={handleRejectConfirm}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs"
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
