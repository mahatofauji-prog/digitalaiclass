/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, X, CreditCard } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface SubscriptionProps {
  onNavigate: (view: string) => void;
  isLoggedIn: boolean;
  onSubscribe: (planId: string, paymentProvider: string) => void;
  activePlanId?: string;
}

export default function Subscription({ onNavigate, isLoggedIn, onSubscribe, activePlanId }: SubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'Razorpay' | 'Stripe'>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: SubscriptionPlan[] = [
    {
      id: 'sub_monthly',
      name: 'Monthly All-Access Pass',
      price: 999,
      duration: 'Monthly',
      description: 'Perfect for fast-paced students looking to master core neural engineering principles in under 30 days.',
      active: true
    },
    {
      id: 'sub_quarterly',
      name: 'Quarterly Professional Pass',
      price: 2499,
      duration: 'Quarterly',
      description: 'Excellent for dedicated professionals building custom multi-agent crew pipelines and marketing funnel automation.',
      active: true
    },
    {
      id: 'sub_yearly',
      name: 'Yearly Academic Scholar',
      price: 7999,
      duration: 'Yearly',
      description: 'Best financial value. Unlocks complete full-year library access, premium updates, and private workshop recordings.',
      active: true
    }
  ];

  const handleCheckoutClick = (plan: SubscriptionPlan) => {
    if (activePlanId === plan.id) return;
    if (!isLoggedIn) {
      onNavigate('login');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleProcessCheckout = () => {
    if (!selectedPlan) return;
    setIsProcessing(true);

    setTimeout(() => {
      onSubscribe(selectedPlan.id, paymentProvider);
      setIsProcessing(false);
      setSelectedPlan(null);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans" id="subscription_pricing_page">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-[#79C99A]">One Subscription. A World of Learning.</span>
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-[#17221B] mt-1">
          Start Your AI Learning Journey
        </h1>
        <p className="text-xs text-[#66736B] mt-2 font-light">
          Get full unrestricted access to our growing collection of premium AI and digital skill courses.
        </p>
      </div>

      {/* Grid Pricing Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {plans.map((plan) => {
          const isCurrent = activePlanId === plan.id;
          const isBestValue = plan.duration === 'Yearly';

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl border p-6 bg-white shadow-sm transition-all duration-300 ${
                isBestValue 
                  ? 'border-[#79C99A] ring-2 ring-[#79C99A]/30 md:scale-105 z-10' 
                  : 'border-[#E5ECE7]'
              }`}
            >
              {isBestValue && (
                <div className="absolute top-3 right-3 rounded-full bg-[#79C99A] px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#17221B] shadow-sm">
                  BEST VALUE
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B]">{plan.name}</h3>
                <p className="text-xs text-[#66736B] font-light leading-relaxed">{plan.description}</p>
              </div>

              {/* Price Details */}
              <div className="my-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#17221B]">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#66736B]">/ {plan.duration === 'Monthly' ? 'month' : plan.duration === 'Quarterly' ? '3 months' : 'year'}</span>
                </div>
                <p className="text-[10px] text-[#66736B] mt-1 uppercase font-bold tracking-wider">
                  {plan.duration === 'Monthly' ? 'Billed monthly.' : plan.duration === 'Quarterly' ? 'Billed once quarterly.' : 'Billed once annually.'} Cancel online with one tap.
                </p>
              </div>

              {/* Checklists */}
              <ul className="space-y-2.5 text-xs text-[#66736B] mb-8 divide-y divide-[#E5ECE7]">
                <li className="flex items-center gap-2.5 pt-2.5 first:pt-0">
                  <CheckCircle2 className="h-4 w-4 text-[#79C99A] shrink-0" />
                  <span>Subscription courses included</span>
                </li>
                <li className="flex items-center gap-2.5 pt-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#79C99A] shrink-0" />
                  <span>New courses added regularly</span>
                </li>
                <li className="flex items-center gap-2.5 pt-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#79C99A] shrink-0" />
                  <span>Learn at your own pace</span>
                </li>
                <li className="flex items-center gap-2.5 pt-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#79C99A] shrink-0" />
                  <span>Progress tracking & metrics</span>
                </li>
                <li className="flex items-center gap-2.5 pt-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#79C99A] shrink-0" />
                  <span>Verifiable certificates of achievement</span>
                </li>
              </ul>

              {/* Checkout Button */}
              <button
                onClick={() => handleCheckoutClick(plan)}
                disabled={isCurrent}
                className={`w-full rounded-xl py-3.5 text-center text-xs font-black uppercase tracking-widest transition-all mt-auto ${
                  isCurrent
                    ? 'bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B] cursor-default font-extrabold'
                    : isBestValue
                      ? 'bg-[#79C99A] text-[#17221B] hover:opacity-90 shadow-sm'
                      : 'bg-white hover:bg-[#FAFCFA] border border-[#E5ECE7] text-[#17221B]'
                }`}
                id={`sub_plan_btn_${plan.id}`}
              >
                {isCurrent ? 'Current Membership' : 'Start Learning'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Grid */}
      <div className="max-w-3xl mx-auto bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm mb-12">
        <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3 mb-4">
          Membership Comparison
        </h3>
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 font-black text-[10px] uppercase tracking-widest text-[#66736B] border-b border-[#E5ECE7] pb-2">
            <span>Attributes</span>
            <span className="text-center text-[#79C99A]">Subscription Pass</span>
            <span className="text-center text-[#17221B]">Individual Buy</span>
          </div>
          {[
            { name: 'Total Course Catalog Access', sub: 'Subscription-Included Courses Only', individual: 'Purchased Course Only' },
            { name: 'Duration of Access License', sub: 'Validity of active membership', individual: 'Lifetime Unlimited Access' },
            { name: 'Interactive Gemini Tutor Chat', sub: 'Yes (included in player)', individual: 'Yes (included in player)' },
            { name: 'Downloadable Resources', sub: 'Yes', individual: 'Yes' },
            { name: 'Credential Verification URL', sub: 'Yes (verifiable permanent link)', individual: 'Yes (verifiable permanent link)' }
          ].map((row, index) => (
            <div key={index} className="grid grid-cols-3 py-2 border-b border-[#E5ECE7] last:border-b-0 text-[#66736B]">
              <span>{row.name}</span>
              <span className="text-center font-bold text-[#17221B]">{row.sub}</span>
              <span className="text-center font-bold text-[#17221B]">{row.individual}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription checkout modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" id="sub_checkout_modal">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E5ECE7] text-[#17221B]">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-[#66736B] hover:text-[#17221B] transition"
              id="close_sub_checkout"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] mb-6 flex items-center gap-2 border-b border-[#E5ECE7] pb-3">
              <CreditCard className="h-5 w-5 text-[#79C99A]" />
              Membership Handshake
            </h3>

            <div className="divide-y divide-[#E5ECE7] space-y-4">
              <div className="pb-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#66736B] block">Membership Selected</span>
                <p className="font-sans text-sm font-black text-[#17221B] mt-1">{selectedPlan.name}</p>
                <p className="text-[9px] text-[#17221B] font-black uppercase tracking-wide mt-1">Renews automatically. Cancel online with one tap.</p>
              </div>

              {/* Provider Selector */}
              <div className="py-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#66736B]">Secure Payment Channel</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Razorpay', label: 'Razorpay / UPI' },
                    { id: 'Stripe', label: 'Stripe / Cards' }
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      onClick={() => setPaymentProvider(prov.id as any)}
                      className={`rounded-xl border p-3 text-xs font-semibold text-center transition flex flex-col items-center justify-center gap-1.5 ${
                        paymentProvider === prov.id
                          ? 'border-[#79C99A] bg-[#F1F8F3] text-[#17221B] font-bold'
                          : 'border-[#E5ECE7] hover:border-[#79C99A]/40 bg-[#FAFCFA] text-[#66736B]'
                      }`}
                    >
                      {prov.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="py-4 text-xs space-y-2">
                <div className="flex justify-between text-[#66736B]">
                  <span>Plan Value</span>
                  <strong className="text-[#17221B]">₹{selectedPlan.price.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-[#66736B]">
                  <span>GST inclusive 18%</span>
                  <span className="italic">₹0.00</span>
                </div>
                <div className="flex justify-between border-t border-[#E5ECE7] pt-3 font-sans text-sm font-bold text-[#17221B]">
                  <span>Payable Now</span>
                  <span className="text-[#17221B] font-black">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={handleProcessCheckout}
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-[#79C99A] text-[#17221B] py-3.5 text-center text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm"
                  id="sub_checkout_submit_btn"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-[#17221B] border-t-transparent rounded-full animate-spin" />
                      Authorizing with {paymentProvider}...
                    </div>
                  ) : (
                    `Subscribe and Pay ₹${selectedPlan.price.toLocaleString('en-IN')}`
                  )}
                </button>
                <p className="text-[9px] text-[#66736B] uppercase tracking-widest text-center mt-2.5 font-bold">
                  🔒 Encrypted billing pipeline. Sandbox handshakes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
