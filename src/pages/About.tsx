/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Sparkles, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen space-y-12 font-sans" id="about_page">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#79C99A]">The Academic Vision</span>
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-[#17221B]">About Digital AI Class</h1>
        <p className="text-sm text-[#66736B] font-light max-w-xl mx-auto">
          We are dedicated to building a high-leverage learning management platform specializing in masterclass neural theory, automation scripts, and digital workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-[#E5ECE7] shadow-sm">
        <div className="space-y-4">
          <h2 className="font-sans text-lg font-black uppercase tracking-widest text-[#17221B]">Our Core Mission</h2>
          <p className="text-xs text-[#66736B] leading-relaxed font-light">
            Technology is moving at a breakneck pace. AI is changing how we construct databases, how we script APIs, how we write copy, and how we direct design. Our mission is to simplify these concepts.
          </p>
          <p className="text-xs text-[#66736B] leading-relaxed font-light">
            Instead of boring lectures, we create high-retention curriculums that guide you step-by-step through practical implementations. Build neural nets from scratch, deploy agents on CrewAI, and scale automation visually.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-video bg-[#FAFCFA] border border-[#E5ECE7]">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
            alt="Students collaborating"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Target className="h-5 w-5 text-[#79C99A]" />,
            title: 'Action-Driven Curriculums',
            desc: 'Every lesson centers on active development. Write actual scripts, run test prompt chains, and execute pipelines.'
          },
          {
            icon: <Sparkles className="h-5 w-5 text-[#79C99A]" />,
            title: 'Modern Classrooms',
            desc: 'Integrates real server-side AI tutors. Clear up terminology blockers instantly inside the course player.'
          },
          {
            icon: <Award className="h-5 w-5 text-[#79C99A]" />,
            title: 'Verifiable Credentials',
            desc: 'Complete 100% video lectures to secure blockchain-verifiable digital certificates, easily sharable to LinkedIn.'
          }
        ].map((highlight, index) => (
          <div key={index} className="bg-white border border-[#E5ECE7] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 shrink-0">
              {highlight.icon}
            </div>
            <h3 className="text-[11px] font-black text-[#17221B] uppercase tracking-widest">{highlight.title}</h3>
            <p className="text-xs text-[#66736B] leading-relaxed font-light">{highlight.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
