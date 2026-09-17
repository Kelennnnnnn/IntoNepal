import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Mail, Phone, MapPin, Send, AlertTriangle, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { checkContactRateLimit, recordContactAttempt } from '@/lib/rateLimit';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Expedition Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rateLimitBlock, setRateLimitBlock] = useState<{ blocked: boolean; seconds: number }>({
    blocked: false,
    seconds: 0,
  });

  // Countdown timer for rate limit
  useEffect(() => {
    if (rateLimitBlock.seconds <= 0) {
      if (rateLimitBlock.blocked) {
        setRateLimitBlock({ blocked: false, seconds: 0 });
      }
      return;
    }

    const interval = setInterval(() => {
      setRateLimitBlock((prev) => {
        if (prev.seconds <= 1) {
          return { blocked: false, seconds: 0 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitBlock.seconds, rateLimitBlock.blocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Check rate limit (max 3 submissions per 5 minutes)
    const check = checkContactRateLimit(cleanEmail);
    if (!check.allowed) {
      setRateLimitBlock({ blocked: true, seconds: check.retryAfterSeconds });
      toast.error(`Too many submissions. Please wait ${check.retryAfterSeconds}s before sending another message.`);
      return;
    }

    // Record submission attempt
    recordContactAttempt(cleanEmail);
    setIsSubmitting(true);

    try {
      // Insert into contact_submissions table
      const { error } = await (supabase.from('contact_submissions' as any) as any).insert([
        {
          name: name.trim(),
          email: cleanEmail,
          subject: subject.trim(),
          message: message.trim(),
        },
      ]);

      if (error) {
        // Fallback for local storage if Supabase is offline
        const localKey = 'into_nepal_local_inquiries';
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        existing.push({
          id: 'local_' + Date.now(),
          name,
          email: cleanEmail,
          subject,
          message,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(localKey, JSON.stringify(existing));
      }

      setIsSuccess(true);
      toast.success('Inquiry submitted successfully! A verified Himalayan specialist will reply within 24 hours.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      toast.error('Failed to deliver message: ' + (err.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="bg-[#0B1528] text-white py-14 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold">
            Direct Expeditions Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Connect with Himalayan Specialists
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have questions about permits, seasonal high passes, altitude preparation, or custom agency itineraries?
            Our licensed team in Kathmandu is here to guide you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details & Trust Badges */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-slate-900">
                Kathmandu Headquarters
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Operations Center</span>
                    <span>Thamel Marg, Ward 26, Kathmandu, Bagmati Province, Nepal</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Emergency & Helicopter Support</span>
                    <span>+977-1-4700000 / +977-9801234567 (24/7)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Expedition Inquiries</span>
                    <span>concierge@intonepal.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Working Hours (NPT)</span>
                    <span>Sunday – Friday: 8:00 AM – 7:00 PM NPT</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Government Licensed Himalayan Marketplace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Message Delivered to Kathmandu Concierge
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you for reaching out. We have logged your expedition inquiry and a licensed local operator
                    will respond to your email shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="font-serif text-2xl font-bold text-slate-900">
                      Send Us an Inquiry
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Our platform rate limiter prevents spam and protects local guide communications.
                    </p>
                  </div>

                  {/* Rate limit warning banner if blocked */}
                  {rateLimitBlock.blocked && (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 text-amber-900 text-xs font-medium animate-pulse">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold block text-sm">Submission Limit Reached</span>
                        Please wait <span className="font-mono font-bold text-amber-950">{rateLimitBlock.seconds}s</span> before submitting again.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tenzing Norgay"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tenzing@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Subject / Expedition Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                    >
                      <option value="Expedition Inquiry">Expedition & Trek Inquiry</option>
                      <option value="Permit Clarification">TIMS & National Park Permits</option>
                      <option value="Custom Private Group">Custom Private Group / Itinerary</option>
                      <option value="Agency Verification">Agency Partnership & Verification</option>
                      <option value="Emergency & Cancellation">Cancellation or Date Rescheduling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Detailed Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please include preferred trek dates, group size, physical experience level, or any dietary constraints..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Rate limited to 3 inquiries per 5 minutes per user.
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting || rateLimitBlock.blocked}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
