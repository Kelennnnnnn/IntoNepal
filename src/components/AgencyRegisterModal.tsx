import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Building, Phone, Mail, FileText, MapPin, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AgencyRegisterModalProps {
  onClose: () => void;
}

export const AgencyRegisterModal: React.FC<AgencyRegisterModalProps> = ({ onClose }) => {
  const [agencyName, setAgencyName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [taanReg, setTaanReg] = useState('');
  const [panVat, setPanVat] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Kathmandu (Thamel)');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        await (supabase as any).from('agency_applications').insert({
          company_name: agencyName,
          license_number: licenseNo,
          taan_number: taanReg,
          pan_vat_number: panVat,
          contact_person: contactPerson,
          phone,
          email,
          city,
          status: 'pending_review',
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Agency registration:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-[#CBD5E1] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-[#ECEFF3] px-6 py-4 flex items-center justify-between bg-[#1E4B8F] text-white">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="font-bold font-serif text-base">Register Local Nepali Agency</h3>
              <p className="text-[11px] text-blue-100">Join the verified operator network for Into Nepal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold font-serif text-[#17222E]">Application Submitted!</h4>
            <p className="text-xs text-[#5A6B7C] leading-relaxed max-w-sm mx-auto">
              Namaste! Our verification team will review your Department of Tourism credentials ({licenseNo}) and reach out via WhatsApp at <strong>{phone}</strong> within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-5 py-2 rounded text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-[#FBF8F3] border border-[#ECEFF3] p-3 rounded text-[#5A6B7C] text-[11px] leading-relaxed">
              We exclusively verify Nepali-registered trekking companies with valid Department of Tourism licenses and TAAN/NMA credentials to protect travelers and empower local Sherpa guides.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#5A6B7C] font-semibold mb-1">Company Registered Name *</label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Annapurna Alpine Pioneers Pvt. Ltd."
                  className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A6B7C] font-semibold mb-1">Govt Tourism License # *</label>
                  <input
                    type="text"
                    required
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="e.g. DoT Lic. #1940/076"
                    className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5A6B7C] font-semibold mb-1">TAAN / NMA Member ID</label>
                  <input
                    type="text"
                    value={taanReg}
                    onChange={(e) => setTaanReg(e.target.value)}
                    placeholder="e.g. TAAN-Reg #512"
                    className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A6B7C] font-semibold mb-1">PAN / VAT Number *</label>
                  <input
                    type="text"
                    required
                    value={panVat}
                    onChange={(e) => setPanVat(e.target.value)}
                    placeholder="e.g. 601234567"
                    className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5A6B7C] font-semibold mb-1">Office Location</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-[#CBD5E1] bg-white rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none cursor-pointer"
                  >
                    <option value="Kathmandu (Thamel)">Kathmandu (Thamel)</option>
                    <option value="Pokhara (Lakeside)">Pokhara (Lakeside)</option>
                    <option value="Chitwan (Sauraha)">Chitwan (Sauraha)</option>
                    <option value="Namche Bazaar (Khumbu)">Namche Bazaar (Khumbu)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A6B7C] font-semibold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Pemba Sherpa"
                    className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5A6B7C] font-semibold mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 980 123 4567"
                    className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A6B7C] font-semibold mb-1">Official Agency Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@agency.com.np"
                  className="w-full border border-[#CBD5E1] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#1E4B8F] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#ECEFF3] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#CBD5E1] px-4 py-1.5 rounded hover:bg-gray-50 text-[#5A6B7C] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1E4B8F] hover:bg-[#183d73] text-white px-5 py-1.5 rounded font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Verification Request'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
