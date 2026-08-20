/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'How does the Subscription Pass differ from Individual Course purchases?',
      a: 'The Subscription Pass unlocks instant full-catalog access to all designated "subscription-included" courses for a low monthly (₹999), quarterly (₹2,499), or yearly (₹7,999) recurring fee. An Individual Course purchase provides permanent, lifetime validity to a single specific class for a one-time fee.'
    },
    {
      q: 'Are certificates provided upon completion? How are they verified?',
      a: 'Yes. Upon finishing 100% of the video chapters in any course, you can instantly claim a high-resolution Digital Certificate of Completion on your Student Dashboard. Each certificate carries a unique security code. Employers can enter this number directly on our verification portal to validate the certificate\'s authenticity instantly.'
    },
    {
      q: 'How do I access and chat with the Gemini AI study tutor?',
      a: 'Our server-side Gemini AI Pedagogical Assistant is embedded directly inside the Course Player. Open any lesson from your Dashboard, click on the floating "Ask AI Tutor" button in the bottom right corner, and ask questions. The AI is fully aware of the active lecture title and syllabus description!'
    },
    {
      q: 'What is your refund and cancellation policy?',
      a: 'For subscription passes, you can cancel recurring renewals anytime directly on your Student Dashboard under "Subscription Settings" with a single click. No hidden fees or lock-ins. Individual course purchases have a 7-day academic satisfaction refund guarantee.'
    },
    {
      q: 'Do you offer offline video downloads?',
      a: 'All video lectures are delivered in premium, encrypted streams to maintain intellectual security. While videos cannot be saved offline, you have unlimited streaming access, and all supplementary materials (PDF notebooks, code files, homework sheets) are fully downloadable.'
    }
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen space-y-10 font-sans" id="faq_page">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#79C99A]">Knowledge Base</span>
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-[#17221B]">Frequently Asked Questions</h1>
        <p className="text-sm text-[#66736B] font-light">
          Everything you need to know about academic certifications, subscription renewals, payments, and AI study tools.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white border border-[#E5ECE7] rounded-2xl overflow-hidden shadow-sm transition-all">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-sans text-sm font-bold text-[#17221B] hover:bg-[#F1F8F3] transition"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4.5 w-4.5 text-[#79C99A] shrink-0" />
                  <span>{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-[#66736B]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#66736B]" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-[#E5ECE7] p-5 text-xs text-[#66736B] leading-relaxed font-light bg-[#FAFCFA]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
