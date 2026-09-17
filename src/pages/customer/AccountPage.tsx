import React, { useState } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import {
  User,
  Mail,
  Phone,
  Globe,
  Shield,
  CreditCard,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || 'Alex Mercer');
  const [email] = useState(user?.email || 'alex@example.com');
  const [phone, setPhone] = useState('+1 415 890 1234');
  const [nationality, setNationality] = useState('United States');
  const [passportNumber, setPassportNumber] = useState('USA-9812401');
  const [emergencyName, setEmergencyName] = useState('Laura Mercer');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 415 890 9999');
  const [dietary, setDietary] = useState('Vegetarian on mountain trails');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <CustomerLayout>
      <div className="bg-[#FBF8F3] border-b border-[#E8E4DD] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B8F]">
            Traveler Profile
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1F1D]">
            Account & Traveler Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
            Keep your legal passport information and mountain safety preferences updated for rapid tour bookings.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1A1F1D] border-b border-[#E8E4DD] pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1E4B8F]" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={email}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#F4F9F6] text-[#5F6B66] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Expedition & Safety Requirements */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E4DD] p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1A1F1D] border-b border-[#E8E4DD] pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1B7A5A]" />
              <span>Expedition & Medical Emergency Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Passport / Government ID</label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Dietary Preferences</label>
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1F1D] mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] focus:border-[#1E4B8F] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-[#059669] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile preferences updated successfully!</span>
              </span>
            )}
            <div className="ml-auto">
              <Button type="submit" className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold px-6 py-2.5">
                <Save className="w-4 h-4 mr-1.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};
