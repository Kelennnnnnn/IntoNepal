import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  ArrowLeft,
  Building2,
  CreditCard,
  ShieldCheck,
  Save,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VERIFIED_AGENCIES } from '@/data/otaMarketplaceData';

export const AgencySettingsPage: React.FC = () => {
  const current = VERIFIED_AGENCIES[0];

  // Company Details
  const [companyName, setCompanyName] = useState(current.name);
  const [licenseNo, setLicenseNo] = useState(current.licenseNumber);
  const [taanNo, setTaanNo] = useState(current.taanMemberNumber || 'TAAN-REG-2048');
  const [panNo, setPanNo] = useState(current.panNumber || '602391048');
  const [email, setEmail] = useState(current.email || 'operations@himalayanglacier.com');
  const [phone, setPhone] = useState(current.phone || '+977 1 4700888');
  const [officeAddress, setOfficeAddress] = useState(current.address || 'Thamel Marg, Ward 26, Kathmandu, Nepal');
  const [website, setWebsite] = useState(current.website || 'https://www.himalayanglacier.com');

  // Bank & Payout Details
  const [bankName, setBankName] = useState('Nabil Bank Limited');
  const [accountName, setAccountName] = useState('Himalayan Glacier Trekking Pvt. Ltd.');
  const [accountNumber, setAccountNumber] = useState('01201017500392');
  const [branch, setBranch] = useState('Thamel Branch, Kathmandu');
  const [swiftCode, setSwiftCode] = useState('NABILNPKA');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/agency/dashboard"
              className="text-xs text-[#5F6B66] hover:text-[#1A1F1D] flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#E8E4DD]">|</span>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#1E4B8F]" />
              <h1 className="font-serif font-bold text-base text-[#1A1F1D]">
                Agency Profile & Bank Payout Settings
              </h1>
            </div>
          </div>

          <Button
            type="submit"
            form="agency-settings-form"
            variant="primary"
            size="sm"
            disabled={saving}
            className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </header>

      {/* Notice Banner */}
      {savedSuccess && (
        <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] px-4 py-2.5 text-center text-xs font-bold text-[#065F46] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Agency profile and bank settlement settings updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <form id="agency-settings-form" onSubmit={handleSave} className="space-y-6">
          {/* Company Legal Profile */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DD]">
              <Building2 className="w-5 h-5 text-[#1E4B8F]" />
              <div>
                <h2 className="font-serif font-bold text-base text-[#1A1F1D]">Government Licensing & Credentials</h2>
                <p className="text-xs text-[#5F6B66]">Official credentials verified by Nepal Tourism Board (NTB).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Registered Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Department of Tourism License #</label>
                <input
                  type="text"
                  required
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">TAAN Membership #</label>
                <input
                  type="text"
                  value={taanNo}
                  onChange={(e) => setTaanNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Inland Revenue PAN / VAT #</label>
                <input
                  type="text"
                  required
                  value={panNo}
                  onChange={(e) => setPanNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DD]">
              <Phone className="w-5 h-5 text-[#1E4B8F]" />
              <div>
                <h2 className="font-serif font-bold text-base text-[#1A1F1D]">Office & Traveler Contact Details</h2>
                <p className="text-xs text-[#5F6B66]">Direct communication channels shown on confirmed bookings.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">24/7 Operations / WhatsApp Hotline</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#1A1F1D] mb-1">Office Physical Address in Nepal</label>
                <input
                  type="text"
                  required
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#1A1F1D] mb-1">Official Company Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                />
              </div>
            </div>
          </div>

          {/* Bank & Direct Payout Details */}
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DD]">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-[#16A34A]" />
                <div>
                  <h2 className="font-serif font-bold text-base text-[#1A1F1D]">Commercial Bank Account (Settlement)</h2>
                  <p className="text-xs text-[#5F6B66]">Bank details for wire transfers and booking deposit escrow releases.</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Encrypted in Supabase Vault</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Nepali Commercial Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold outline-none"
                >
                  <option value="Nabil Bank Limited">Nabil Bank Limited</option>
                  <option value="NIC Asia Bank Limited">NIC Asia Bank Limited</option>
                  <option value="Himalayan Bank Limited">Himalayan Bank Limited</option>
                  <option value="Standard Chartered Bank Nepal">Standard Chartered Bank Nepal</option>
                  <option value="Global IME Bank Limited">Global IME Bank Limited</option>
                  <option value="Nepal Investment Mega Bank">Nepal Investment Mega Bank</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Account Holder Name (As per Bank)</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Bank Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">SWIFT / BIC Code</label>
                <input
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E4DD] bg-[#FBF8F3] font-mono"
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
