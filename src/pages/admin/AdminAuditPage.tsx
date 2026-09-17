import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  User,
  Layers,
  ChevronDown,
  ChevronRight,
  Code,
  X,
  AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { fetchAllAuditLogs } from '../../lib/audit';
import type { AuditLogEntry } from '../../lib/types';
import { toast } from 'sonner';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAllAuditLogs();
      setLogs(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load audit logs');
      toast.error('Failed to load audit logs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const actionTypes = Array.from(new Set(logs.map((l) => l.action)));

  const filtered = logs.filter((l) => {
    const matchesAction = actionFilter === 'all' || l.action === actionFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (l.action || '').toLowerCase().includes(q) ||
      (l.entity_type || '').toLowerCase().includes(q) ||
      (l.entity_id || '').toLowerCase().includes(q) ||
      (l.actor_user_id || '').toLowerCase().includes(q) ||
      (l.details ? JSON.stringify(l.details).toLowerCase().includes(q) : false);

    return matchesAction && matchesSearch;
  });

  return (
    <AdminLayout
      title="Security & Compliance Audit Trail"
      subtitle="Immutable event ledger recording all administrative updates, role upgrades, and escrow releases"
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 shrink-0">Filter Action:</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
          >
            <option value="all">All Actions ({logs.length})</option>
            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, target ID, actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Action Type</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Target Entity</th>
                <th className="py-2.5 px-4">Diffs & Payload</th>
                <th className="py-2.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {log.actor_user_id || 'system_service'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-900 font-semibold">{log.entity_type}</span>
                      <span className="text-slate-400 font-mono text-[10px] block truncate max-w-xs">
                        {log.entity_id}
                      </span>
                    </td>

                    {/* OLD / NEW VALUE PREVIEW */}
                    <td className="py-3 px-4 max-w-xs">
                      {log.details ? (
                        <div className="space-y-0.5 text-[11px]">
                          {Object.entries(log.details)
                            .slice(0, 2)
                            .map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-slate-400 font-mono">{k}: </span>
                                <span className="text-slate-700 font-semibold">{String(v)}</span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No metadata</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Code className="w-3 h-3" />
                        Inspect Diff
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIFF INSPECTOR MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Audit Entry Diff & Cryptographic Footprint
                </h3>
                <span className="font-mono text-xs text-slate-500">{selectedEntry.id}</span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Action</span>
                  <span className="font-mono font-bold text-amber-700">{selectedEntry.action}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Target Entity</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedEntry.entity_type} ({selectedEntry.entity_id})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Actor ID</span>
                  <span className="font-mono text-slate-700">{selectedEntry.actor_user_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Timestamp</span>
                  <span className="font-mono text-slate-700">{selectedEntry.created_at}</span>
                </div>
              </div>

              {/* VALUE DIFFS SECTION */}
              <div>
                <span className="font-bold text-slate-900 block mb-1">State Mutation Diffs:</span>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto space-y-1">
                  {selectedEntry.details && Object.keys(selectedEntry.details).length > 0 ? (
                    Object.entries(selectedEntry.details).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-amber-400 font-semibold">{key}:</span>
                        <span className="text-slate-200">{JSON.stringify(val)}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500">No diff attributes recorded for this event.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
