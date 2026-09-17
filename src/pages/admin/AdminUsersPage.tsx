import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Building2,
  UserCheck,
  RefreshCw,
  Edit2,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { fetchAdminUsers, updateUserRole } from '../../lib/adminData';
import type { Role } from '../../lib/types';
import { toast } from 'sonner';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'agency' | 'admin'>('all');

  // Role modification modal
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load users');
      toast.error('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRoleModal = (u: any) => {
    setEditingUser(u);
    setSelectedRole(u.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    if (selectedRole === editingUser.role) {
      setEditingUser(null);
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading(`Updating security role for ${editingUser.email}...`, { id: 'role-update' });
      await updateUserRole(editingUser.id, selectedRole, editingUser.role);
      toast.success(`Role updated to "${selectedRole.toUpperCase()}" for ${editingUser.name || 'user'}`, {
        id: 'role-update',
      });
      setEditingUser(null);
      await loadData();
    } catch (err: any) {
      toast.error('Failed to update user role: ' + err.message, { id: 'role-update' });
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.id || '').toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <AdminLayout
      title="User Management & Access Control"
      subtitle="Audit platform identities, modify app_metadata roles, and enforce security policies"
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
      {/* FILTER CONTROLS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('agency')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'agency' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Agency Partners
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'admin' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Super Admins
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'user' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Travelers
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, email, user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* DENSE USERS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Email Address</th>
                <th className="py-2.5 px-4">User ID</th>
                <th className="py-2.5 px-4">Role Permission</th>
                <th className="py-2.5 px-4">Joined Date</th>
                <th className="py-2.5 px-4 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {u.email}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {u.id}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : u.role === 'agency'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {u.role === 'admin' && <ShieldAlert className="w-3 h-3 text-amber-700" />}
                        {u.role === 'agency' && <Building2 className="w-3 h-3 text-blue-700" />}
                        {u.role === 'user' && <UserCheck className="w-3 h-3 text-slate-500" />}
                        <span>{u.role}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenRoleModal(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROLE MODIFICATION MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Modify Platform Role & Permissions
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 text-xs space-y-1">
              <p className="text-slate-600">
                User: <strong className="text-slate-900">{editingUser.name}</strong> ({editingUser.email})
              </p>
              <p className="font-mono text-[10px] text-slate-400">ID: {editingUser.id}</p>
            </div>

            {selectedRole === 'admin' && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Warning:</strong> Admin privileges grant full uninhibited access to all escrow finances,
                  agency verifications, and system emergency switches.
                </span>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {(['user', 'agency', 'admin'] as Role[]).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                    selectedRole === r
                      ? 'border-amber-500 bg-amber-50/50 font-bold text-slate-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="roleOption"
                      value={r}
                      checked={selectedRole === r}
                      onChange={() => setSelectedRole(r)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="capitalize">{r}</span>
                      <span className="text-[10px] text-slate-500 block font-normal">
                        {r === 'admin' && 'Full superuser administrative clearance'}
                        {r === 'agency' && 'Trekking partner: manage trips, bookings & payouts'}
                        {r === 'user' && 'Standard traveler: search, book, and review'}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing || selectedRole === editingUser.role}
                onClick={handleSaveRole}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                {isProcessing ? 'Saving Role...' : 'Save Role Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
