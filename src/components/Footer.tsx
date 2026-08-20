/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Github, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white text-[#66736B] border-t border-[#E5ECE7]" id="app_footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 text-[#17221B] font-sans text-base font-black">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C99A] text-[#17221B] font-extrabold">
                A
              </div>
              <span className="font-sans tracking-tight">Digital AI Class</span>
            </div>
            <p className="text-xs text-[#66736B] leading-relaxed">
              Premium online education designed to master modern neural structures, generative engineering, and cognitive business systems.
            </p>
            <div className="flex space-x-3 text-[#66736B]">
              <a href="#" className="hover:text-[#17221B] transition"><Github className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#17221B] transition"><Mail className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#17221B] transition"><Phone className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#17221B]">Learning Center</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">All Courses</button>
              </li>
              <li>
                <button onClick={() => onNavigate('subscription')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">Subscription Access</button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">Individual Library</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">Academic Vision</button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#17221B]">Student Support</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">FAQs & Answers</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">Submit Ticket</button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">Cancellation Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#17221B] transition text-[#66736B] font-bold uppercase tracking-wider text-[10px]">Academic Advisors</button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#17221B]">Certified Learning</h3>
            <p className="text-xs text-[#66736B] leading-relaxed">
              Earn shareable blockchain-verifiable digital credentials with full course transcript. 100% video progress required.
            </p>
            <div className="rounded-2xl bg-[#F1F8F3] p-4 text-[11px] text-[#66736B] border border-[#E5ECE7]">
              <span className="font-bold text-[#17221B] block mb-1 flex items-center gap-1 text-xs">
                Verify Credentials
                <ExternalLink className="h-3.5 w-3.5 inline text-[#79C99A]" />
              </span>
              Enter any issued certificate number inside the Student Dashboard to instantly verify.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E5ECE7] pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#66736B] uppercase font-bold tracking-widest gap-4">
          <p>© {new Date().getFullYear()} Digital AI Class Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#17221B] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#17221B] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#17221B] transition">Security Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
