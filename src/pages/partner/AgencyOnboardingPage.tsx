import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AgencyOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Step 1 Form
  const [companyName, setCompanyName] = useState('Himalayan Horizon Adventures Pvt. Ltd.');
  const [ntbLicense, setNtbLicense] = useState('NTB-LIC-3190/079');
  const [taanReg, setTaanReg] = useState('TAAN-MEM-1420');
  const [address, setAddress] = useState('Thamel Marg, Kathmandu 44600, Nepal');

  // Step 2 Form
  const [leadContact, setLeadContact] = useState('Dawa Sherpa');
  const [email, setEmail] = useState('operations@himalayanhorizon.com.np');
  const [phone, setPhone] = useState('+977 1 4700192');
  const [guideCount, setGuideCount] = useState('14');

  // Step 3 Form
  const [bankName, setBankName] = useState('NIC ASIA Bank Ltd.');
  const [accountName, setAccountName] = useState('Himalayan Horizon Adventures Pvt. Ltd.');
  const [accountNumber, setAccountNumber] = useState('440192847192001');
  const [swiftCode, setSwiftCode] = useState('NICAIBKA');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F1D] flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E4DD] h-16 flex items-center px-4 sm:px-8 justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A1F1D] flex items-center justify-center text-[#D97706]">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-serif font-black text-lg text-[#1A1F1D]">INTO NEPAL</span>
        </Link>
        <span className="text-xs font-semibold text-[#5F6B66]">
          Agency Accreditation Wizard
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold border-b border-[#E8E4DD] pb-4">
          <span className={step >= 1 ? 'text-[#1E4B8F]' : 'text-[#9DA8A3]'}>
            1. Company Credentials
          </span>
          <span className={step >= 2 ? 'text-[#1E4B8F]' : 'text-[#9DA8A3]'}>
            2. Safety & Guides
          </span>
          <span className={step >= 3 ? 'text-[#1E4B8F]' : 'text-[#9DA8A3]'}>
            3. Bank Payout Wire
          </span>
          <span className={step >= 4 ? 'text-[#059669]' : 'text-[#9DA8A3]'}>
            4. Review & Launch
          </span>
        </div>

        {step < 4 ? (
          <form onSubmit={handleNext} className="bg-white rounded-2xl border border-[#E8E4DD] p-6 sm:p-8 space-y-6 shadow-sm">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-bold text-[#1A1F1D]">
                    Step 1: Agency Legal Identification
                  </h2>
                  <p className="text-xs text-[#5F6B66]">
                    We verify every operator against the official Nepal Tourism Board government register.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Company Registered Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#1A1F1D] mb-1">NTB License Number *</label>
                      <input
                        type="text"
                        required
                        value={ntbLicense}
                        onChange={(e) => setNtbLicense(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1A1F1D] mb-1">TAAN Registration Number</label>
                      <input
                        type="text"
                        value={taanReg}
                        onChange={(e) => setTaanReg(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Primary Physical Office Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-bold text-[#1A1F1D]">
                    Step 2: Key Personnel & Certified Guides
                  </h2>
                  <p className="text-xs text-[#5F6B66]">
                    Provide operational leadership and mountain rescue coordination details.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Managing Director / Operations Lead *</label>
                    <input
                      type="text"
                      required
                      value={leadContact}
                      onChange={(e) => setLeadContact(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#1A1F1D] mb-1">Dispatch Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1A1F1D] mb-1">24/7 Hotline Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Number of Licensed Trekking & Climbing Guides</label>
                    <input
                      type="number"
                      required
                      value={guideCount}
                      onChange={(e) => setGuideCount(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-bold text-[#1A1F1D]">
                    Step 3: Corporate Bank Account (NIC ASIA Clearing)
                  </h2>
                  <p className="text-xs text-[#5F6B66]">
                    Your 85% platform escrow settlements will be wired directly into this official Nepali business account.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1A1F1D] mb-1">Account Holder Name (Must match legal entity) *</label>
                    <input
                      type="text"
                      required
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#1A1F1D] mb-1">Account Number *</label>
                      <input
                        type="text"
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1A1F1D] mb-1">SWIFT / BIC Code *</label>
                      <input
                        type="text"
                        required
                        value={swiftCode}
                        onChange={(e) => setSwiftCode(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] text-[#1A1F1D] font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DD]">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep((s) => s - 1)}
                  className="text-xs font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Previous</span>
                </Button>
              ) : <div />}

              <Button type="submit" size="sm" className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold">
                <span>{step === 3 ? 'Complete & Submit' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </form>
        ) : (
          /* Step 4: Submission Confirmation */
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-8 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
                Application Received for {companyName}!
              </h2>
              <p className="text-xs text-[#5F6B66] max-w-md mx-auto">
                Our verification desk has linked your NTB license ({ntbLicense}). You can now access your partner cockpit to review sample bookings and tour listings.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link to="/agency/dashboard">
                <Button className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold px-6 py-2.5">
                  <span>Enter Agency Partner Cockpit</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
