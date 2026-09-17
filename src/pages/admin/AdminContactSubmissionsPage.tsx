import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  Check,
  X,
  User,
  AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  fetchContactSubmissions,
  updateContactSubmissionStatus,
} from '../../lib/adminData';
import type { ContactSubmission } from '../../lib/types';
import { toast } from 'sonner';

export const AdminContactSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchContactSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load contact submissions');
      toast.error('Failed to load contact submissions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'new' | 'read' | 'replied'
  ) => {
    try {
      await updateContactSubmissionStatus(id, newStatus);
      toast.success(`Inquiry marked as ${newStatus.toUpperCase()}`);
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }
      await loadData();
    } catch (err: any) {
      toast.error('Failed to update submission: ' + err.message);
    }
  };

  const filtered = submissions.filter((s) => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.subject || '').toLowerCase().includes(q) ||
      (s.message || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout
      title="Traveler Inquiries & Contact Submissions"
      subtitle="Supervise inbound visitor inquiries, expedition customization queries, and support messages"
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
            className="px-3 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'new' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            New ({submissions.filter((s) => s.status === 'new').length})
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'read' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setStatusFilter('replied')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'replied' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Replied
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sender, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* DENSE SUBMISSIONS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Sender</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Message Snippet</th>
                <th className="py-2.5 px-4">Submitted Date</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No inquiries match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {s.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {s.email}
                    </td>

                    <td className="py-3 px-4 text-slate-900 font-semibold">
                      {s.subject || 'General Inquiry'}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-500 truncate">{s.message}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'read'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(s)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION / REPLY MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Inquiry Dispatch & Follow-up
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Sender Name</span>
                  <span className="font-bold text-slate-900">{selectedSubmission.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Email</span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-mono text-amber-700 font-semibold hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Date Received</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Current Status</span>
                  <span className="font-bold uppercase text-slate-800">{selectedSubmission.status}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  Subject: {selectedSubmission.subject || 'General Inquiry'}
                </span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <a
                href={`mailto:${selectedSubmission.email}?subject=Re: ${encodeURIComponent(
                  selectedSubmission.subject || 'Your Nepal Trekking Inquiry'
                )}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                Reply via Email
              </a>

              <div className="flex items-center gap-2">
                {selectedSubmission.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'read')}
                    className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 shadow-2xs"
                  >
                    Mark Read
                  </button>
                )}
                {selectedSubmission.status !== 'replied' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'replied')}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 shadow-2xs"
                  >
                    Mark Replied
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
