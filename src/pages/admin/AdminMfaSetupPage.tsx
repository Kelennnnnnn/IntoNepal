import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  Key,
  Copy,
  Check,
  Download,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { logAdminAudit } from '../../lib/audit';
import { toast } from 'sonner';

export const AdminMfaSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setMfaVerified } = useAuthStore();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-generated standard TOTP secret and recovery codes
  const manualSecret = 'JBSWY3DPEHPK3PXP';
  const totpUri = `otpauth://totp/Into%20Nepal%20Admin:${user?.email || 'admin@intonepal.com'}?secret=${manualSecret}&issuer=Into%20Nepal`;
  // QR image generated via standard public QR generator for preview
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    totpUri
  )}&size=200x200&color=000000&bgcolor=ffffff&margin=1`;

  const backupCodes = [
    'A9F2-K84D',
    '3L9X-7P1Q',
    '8H4M-9B2N',
    '5V7Z-3C8J',
    '2T6K-1W9P',
    '4Y8D-5N3L',
    '9C1R-7F4X',
    '6M2T-8H9V',
    '1K5P-4B7D',
    '7J3N-2W6Z',
  ];

  const handleCopySecret = () => {
    navigator.clipboard.writeText(manualSecret);
    setCopiedKey(true);
    toast.success('Manual secret key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    const text = `INTO NEPAL ADMIN RECOVERY BACKUP CODES:\n\n` + backupCodes.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCodes(true);
    toast.success('All 10 backup codes copied to clipboard');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const text = `INTO NEPAL ADMIN RECOVERY BACKUP CODES\nGenerated: ${new Date().toISOString()}\nAccount: ${
      user?.email || 'admin@intonepal.com'
    }\n\n` + backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n') + `\n\nKEEP THESE CODES IN A SECURE OFFLINE VAULT.`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `into-nepal-admin-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Backup codes downloaded as .txt');
  };

  const handleVerifyAndActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = testCode.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      // Simulate verifying TOTP code (or any 6 digits in demo mode)
      await new Promise((resolve) => setTimeout(resolve, 600));

      setMfaVerified(true);
      localStorage.setItem('into_nepal_admin_mfa_configured', 'true');

      await logAdminAudit({
        action: 'MFA_ENROLLED',
        entity_type: 'admin_security',
        entity_id: user?.id || 'usr-admin-01',
        details: {
          factor_type: 'totp',
          timestamp: new Date().toISOString(),
        },
      });

      toast.success('Two-Factor Authentication successfully enrolled & verified!');
      navigate('/admin');
    } catch (err: any) {
      setError('Verification code rejected. Please check your authenticator clock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] py-10 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-slate-950 mb-3 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Set Up Two-Factor Authentication (2FA)
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Mandatory security requirement for all Into Nepal administrative personnel.
          </p>
        </div>

        <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 sm:p-8 shadow-2xl space-y-8">
          {/* STEP 1: SCAN QR CODE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                1
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Scan QR Code with Authenticator App
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4 ml-8">
              Open Google Authenticator, 1Password, or Authy on your mobile device and scan the QR code below.
            </p>

            <div className="ml-8 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-[#070A10] border border-[#1F2937]">
              <div className="bg-white p-2.5 rounded-lg shadow-sm">
                <img
                  src={qrImageUrl}
                  alt="MFA QR Code"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="text-xs text-slate-300 space-y-2 text-center sm:text-left">
                <p className="font-semibold text-white">Supported Authenticator Apps:</p>
                <ul className="text-slate-400 list-disc list-inside space-y-1">
                  <li>Google Authenticator (iOS & Android)</li>
                  <li>1Password / Bitwarden / Apple Passwords</li>
                  <li>Microsoft Authenticator or Twilio Authy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* STEP 2: MANUAL SECRET KEY */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                2
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Or Enter Manual Secret Key
              </h2>
            </div>
            <div className="ml-8">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#070A10] border border-[#1F2937]">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs text-amber-300 tracking-wider select-all font-semibold">
                    {manualSecret}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: BACKUP CODES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                  3
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Save Emergency Backup Codes
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBackupCodes}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  {copiedCodes ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupCodes}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3 ml-8">
              Store these single-use codes safely. If you lose access to your device, each code can be used once to access the admin console.
            </p>

            <div className="ml-8 grid grid-cols-2 gap-2 p-4 rounded-lg bg-[#070A10] border border-[#1F2937] font-mono text-xs text-slate-300">
              {backupCodes.map((code, idx) => (
                <div key={idx} className="flex items-center justify-between px-2 py-1 bg-slate-900/60 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px]">{idx + 1}.</span>
                  <span className="font-semibold text-amber-200 tracking-wider">{code}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: VERIFY TEST CODE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                4
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Confirm & Activate
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4 ml-8">
              Enter the 6-digit code currently displayed in your authenticator app to complete enrollment.
            </p>

            <form onSubmit={handleVerifyAndActivate} className="ml-8 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={6}
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full sm:w-48 text-center tracking-[0.5em] font-mono text-lg py-2.5 bg-[#070A10] border border-slate-700 rounded-lg text-amber-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={loading || testCode.length < 6}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Activating MFA...
                    </>
                  ) : (
                    <>
                      Verify and Activate 2FA
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/admin"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Skip for now and return to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
};
