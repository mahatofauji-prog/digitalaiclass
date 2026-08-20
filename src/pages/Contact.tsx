/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen space-y-12 font-sans" id="contact_page">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#79C99A]">Student Assistance</span>
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-[#17221B]">Connect With Us</h1>
        <p className="text-sm text-[#66736B] font-light max-w-xl mx-auto">
          Need help with course checkout, subscription cancellation, or digital certificate verification? Get in touch with our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Support channels list */}
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-[#E5ECE7] shadow-sm">
          <h2 className="font-sans text-sm font-black uppercase tracking-widest text-[#17221B] mb-2">Support Coordinates</h2>
          <p className="text-xs text-[#66736B] font-light leading-relaxed">
            Our student coordination lines are active Monday to Friday from 9:00 AM to 6:00 PM (IST).
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 text-xs">
              <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B] shrink-0">
                <Mail className="h-4 w-4 text-[#79C99A]" />
              </div>
              <div>
                <strong className="text-[#17221B] block">Email Support Desk</strong>
                <a href="mailto:support@digitalaiclass.com" className="text-[#66736B] hover:text-[#17221B] transition font-light">support@digitalaiclass.com</a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B] shrink-0">
                <Phone className="h-4 w-4 text-[#79C99A]" />
              </div>
              <div>
                <strong className="text-[#17221B] block">Phone Hotline</strong>
                <span className="text-[#66736B] font-light">+91 98765 43210</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B] shrink-0">
                <MapPin className="h-4 w-4 text-[#79C99A]" />
              </div>
              <div>
                <strong className="text-[#17221B] block">Academic Office</strong>
                <span className="text-[#66736B] font-light">14 Sector-5, Salt Lake Electronics Complex, Kolkata, India</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5ECE7]">
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-green-600 hover:bg-green-700 py-3.5 text-xs font-black text-white uppercase tracking-widest transition-all"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>

        {/* Support Form */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5ECE7] shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-[#79C99A] mx-auto animate-bounce" />
              <h3 className="font-sans text-base font-black text-[#17221B]">Ticket Submitted</h3>
              <p className="text-xs text-[#66736B] font-light max-w-xs mx-auto">
                Thank you! We have received your inquiry. An academic advisor will reply within 24 working hours.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-black text-[#79C99A] hover:underline"
              >
                Submit another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-sans text-sm font-black uppercase tracking-widest text-[#17221B]">Submit a Ticket</h2>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Describe your Inquiry</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What can we help you with?"
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] resize-none placeholder-[#66736B]/55"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#79C99A] text-[#17221B] py-3.5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90"
              >
                <Send className="h-4 w-4 text-[#17221B]" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
