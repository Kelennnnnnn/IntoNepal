import React, { useState, useEffect } from 'react';
import {
  Sliders,
  AlertTriangle,
  ShieldAlert,
  CreditCard,
  Banknote,
  Percent,
  RefreshCw,
  CheckCircle2,
  Lock,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  fetchPlatformSettings,
  updatePlatformSetting,
  type SystemSettingsState,
} from '../../lib/adminData';
import { toast } from 'sonner';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsState>({
    maintenance_mode: false,
    payments_enabled: true,
    payouts_enabled: true,
    commission_rate: 15,
  });
  const [commissionDraft, setCommissionDraft] = useState<number>(15);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmation modal state
  const [pendingConfirm, setPendingConfirm] = useState<{
    key: keyof SystemSettingsState;
    nextValue: any;
    title: string;
    description: string;
    isDestructive?: boolean;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchPlatformSettings();
      setSettings(data);
      setCommissionDraft(data.commission_rate);
    } catch (err: any) {
      toast.error('Failed to load platform settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToggleConfirm = (
    key: keyof SystemSettingsState,
    nextValue: any,
    title: string,
    description: string,
    isDestructive = false
  ) => {
    setPendingConfirm({
      key,
      nextValue,
      title,
      description,
      isDestructive,
    });
  };

  const handleExecuteConfirmedSetting = async () => {
    if (!pendingConfirm) return;
    setIsProcessing(true);

    try {
      toast.loading(`Writing ${pendingConfirm.key} to platform_settings...`, { id: 'setting-update' });
      await updatePlatformSetting(pendingConfirm.key, pendingConfirm.nextValue);
      toast.success(`Platform setting "${pendingConfirm.key}" updated to ${JSON.stringify(pendingConfirm.nextValue)}`, {
        id: 'setting-update',
      });
      setPendingConfirm(null);
      await loadData();
    } catch (err: any) {
      toast.error('Failed to update platform setting: ' + err.message, { id: 'setting-update' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveCommission = () => {
    const rate = Number(commissionDraft);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      toast.error('Please specify a valid commission percentage between 0% and 50%.');
      return;
    }

    triggerToggleConfirm(
      'commission_rate',
      rate,
      `Update Platform Commission Rate to ${rate}%?`,
      `This will alter the fee calculation on all future bookings. A $1,000 package will yield $${(rate * 10).toFixed(2)} in platform revenue and $${(1000 - rate * 10).toFixed(2)} to partner agencies.`,
      false
    );
  };

  return (
    <AdminLayout
      title="Platform Controls & Global Governance"
      subtitle="Configure emergency circuit-breakers, marketplace commission rates, and maintenance locks"
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
      <div className="max-w-4xl space-y-6">
        {/* EMERGENCY CONTROLS PANEL */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Emergency Circuit Breakers</h2>
              <p className="text-xs text-slate-500">
                Direct kill switches that safeguard users and platform integrity during critical incidents
              </p>
            </div>
          </div>

          <div className="p-6 divide-y divide-slate-100 text-xs">
            {/* MAINTENANCE MODE */}
            <div className="py-4 first:pt-0 flex items-center justify-between">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-900">Maintenance Mode</span>
                  {settings.maintenance_mode ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 animate-pulse uppercase">
                      ACTIVE (Restricted)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      System Online
                    </span>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed">
                  When active, non-admin visitors and agency partners will see a scheduled maintenance screen.
                  Only administrators with active 2FA can bypass this screen.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  triggerToggleConfirm(
                    'maintenance_mode',
                    !settings.maintenance_mode,
                    settings.maintenance_mode ? 'Deactivate Maintenance Mode?' : 'ACTIVATE Maintenance Mode?',
                    settings.maintenance_mode
                      ? 'This will restore public access to traveler and partner portals immediately.'
                      : 'WARNING: This will lock all customer search, checkout, and partner dashboard portals.',
                    !settings.maintenance_mode
                  )
                }
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-2xs ${
                  settings.maintenance_mode
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                }`}
              >
                {settings.maintenance_mode ? 'Disable Maintenance' : 'Enable Maintenance'}
              </button>
            </div>

            {/* PAYMENTS ENABLED */}
            <div className="py-4 flex items-center justify-between">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-900">Customer Payment Processing</span>
                  {settings.payments_enabled ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Enabled
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                      HALTED
                    </span>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Controls the ability for customers to execute credit card charges via Stripe.
                  Disable immediately if unusual chargeback activity or payment provider discrepancies occur.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  triggerToggleConfirm(
                    'payments_enabled',
                    !settings.payments_enabled,
                    settings.payments_enabled ? 'Emergency Halt: Stop All Payments?' : 'Resume Customer Payments?',
                    settings.payments_enabled
                      ? 'Customers attempting to book will receive an alert stating checkout is temporarily paused.'
                      : 'Card checkout and booking reservation charges will resume immediately.',
                    settings.payments_enabled
                  )
                }
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-2xs ${
                  settings.payments_enabled
                    ? 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {settings.payments_enabled ? 'Halt All Payments' : 'Resume Payments'}
              </button>
            </div>

            {/* PAYOUTS ENABLED */}
            <div className="py-4 last:pb-0 flex items-center justify-between">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-900">Agency Escrow Disbursements</span>
                  {settings.payouts_enabled ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Enabled
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                      FROZEN
                    </span>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Controls automated and manual release of escrow funds to partner bank accounts.
                  Disable to freeze disbursements while reviewing potential fraudulent agency activity.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  triggerToggleConfirm(
                    'payouts_enabled',
                    !settings.payouts_enabled,
                    settings.payouts_enabled ? 'Freeze All Agency Disbursements?' : 'Unfreeze Partner Payouts?',
                    settings.payouts_enabled
                      ? 'No funds will be remitted to partner bank accounts until this freeze is lifted.'
                      : 'Payout processing buttons and automated Stripe transfers will become active.',
                    settings.payouts_enabled
                  )
                }
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-2xs ${
                  settings.payouts_enabled
                    ? 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {settings.payouts_enabled ? 'Freeze Disbursements' : 'Unfreeze Disbursements'}
              </button>
            </div>
          </div>
        </div>

        {/* COMMISSION RATE CONFIGURATION */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2.5">
            <Percent className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Platform Commission Take Rate</h2>
              <p className="text-xs text-slate-500">
                Set the default marketplace percentage deducted on every booking
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-full sm:w-64">
                <label className="block font-semibold text-slate-700 mb-1">
                  Commission Percentage (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionDraft}
                    onChange={(e) => setCommissionDraft(Number(e.target.value))}
                    className="w-24 p-2 border border-slate-300 rounded-lg font-mono font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="font-bold text-slate-500 text-sm">%</span>
                </div>
              </div>

              {/* SLIDER */}
              <div className="flex-1 w-full">
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={commissionDraft}
                  onChange={(e) => setCommissionDraft(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>5% (Partner Friendly)</span>
                  <span>15% (Current Default)</span>
                  <span>30% (High Premium)</span>
                </div>
              </div>
            </div>

            {/* LIVE SIMULATION BOX */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Sample Revenue Split Simulation on a $1,000 Trek:
              </span>
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-sans">Traveler Pays</span>
                  <span className="font-bold text-slate-900">$1,000.00</span>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-200">
                  <span className="text-[10px] text-amber-700 block font-sans">Platform Keeps ({commissionDraft}%)</span>
                  <span className="font-bold text-amber-600">
                    ${(1000 * (commissionDraft / 100)).toFixed(2)}
                  </span>
                </div>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block font-sans">Agency Receives</span>
                  <span className="font-bold text-emerald-600">
                    ${(1000 * (1 - commissionDraft / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveCommission}
                disabled={commissionDraft === settings.commission_rate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                Update Commission Rate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-full ${
                  pendingConfirm.isDestructive
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{pendingConfirm.title}</h3>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {pendingConfirm.description}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setPendingConfirm(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteConfirmedSetting}
                className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-2xs ${
                  pendingConfirm.isDestructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isProcessing ? 'Saving to Database...' : 'Confirm & Apply Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
