/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Search, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Course, User } from '../types';
import CourseCard from '../components/CourseCard';

interface HomeProps {
  courses: (Course & { rating?: number; reviewsCount?: number; studentCount?: number })[];
  onNavigate: (view: string, extra?: any) => void;
  userEnrollments: string[];
  user?: User | null;
}


const heroImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
];

export default function Home({ courses, onNavigate, userEnrollments, user }: HomeProps) {
  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const filterCategories = [
    'All',
    'AI',
    'Generative AI',
    'Business',
    'Productivity',
    'Marketing',
    'Programming',
    'Other'
  ];

  const sortOptions = [
    { value: 'Popular', label: 'Popular' },
    { value: 'Newest', label: 'Newest' },
    { value: 'Highest Rated', label: 'Highest Rated' },
    { value: 'Price Low to High', label: 'Price: Low to High' },
    { value: 'Price High to Low', label: 'Price: High to Low' }
  ];

  // Filter & Sort Logic
  const filteredAndSortedCourses = React.useMemo(() => {
    let result = courses.filter((course) => {
      // 1. Category Filtering
      const cat = selectedCategory.toLowerCase().trim();
      let matchesCategory = false;
      if (selectedCategory === 'All') {
        matchesCategory = true;
      } else if (cat === 'ai') {
        matchesCategory = course.category.toLowerCase().includes('ai') || course.category.toLowerCase() === 'core ai';
      } else if (cat === 'other') {
        const knownCats = ['ai', 'core ai', 'generative ai', 'business', 'productivity', 'marketing', 'programming'];
        matchesCategory = !knownCats.some(known => course.category.toLowerCase().includes(known) || course.category.toLowerCase() === known);
      } else {
        matchesCategory = course.category.toLowerCase().includes(cat) || cat.includes(course.category.toLowerCase());
      }

      // 2. Search Query Filtering
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        course.title.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q)
      );

      return matchesCategory && matchesSearch;
    });

    // 3. Sorting
    if (sortBy === 'Popular') {
      result = [...result].sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));
    } else if (sortBy === 'Newest') {
      result = [...result].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    } else if (sortBy === 'Highest Rated') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Price Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [courses, selectedCategory, searchQuery, sortBy]);

  const subscriptionPlans = [
    {
      id: 'sub_monthly',
      name: 'Monthly All-Access Pass',
      price: 999,
      period: 'month',
      billedText: 'Billed monthly.',
      desc: 'Perfect for fast-paced students looking to master core neural engineering principles in under 30 days.'
    },
    {
      id: 'sub_quarterly',
      name: 'Quarterly Professional Pass',
      price: 2499,
      period: '3 months',
      billedText: 'Billed once quarterly.',
      desc: 'Excellent for dedicated professionals building custom multi-agent crew pipelines and marketing funnel automation.'
    },
    {
      id: 'sub_yearly',
      name: 'Yearly Academic Scholar',
      price: 7999,
      period: 'year',
      billedText: 'Billed once annually.',
      desc: 'Best financial value. Unlocks complete full-year library access, premium updates, and private workshop recordings.',
      isBestValue: true
    }
  ];

  return (
    <div className="bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans flex flex-col" id="home_page_wrapper">
      
      {/* 2. Compact Hero Section */}
      <section className="relative overflow-hidden bg-white py-12 md:py-16 border-b border-[#E5ECE7]" id="hero_section">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#F1F8F3] rounded-full filter blur-[100px] pointer-events-none opacity-80" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 bg-[#F1F8F3] text-[#17221B] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#79C99A]/40 mb-4">
            <Sparkles className="h-3 w-3 text-[#79C99A]" />
            Learn AI Skills. Build Your Future.
          </span>
          
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#17221B]">
            Learn AI Skills. <br className="sm:hidden" />
            <span className="text-[#79C99A]">Build Your Future.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#66736B] leading-relaxed max-w-xl mx-auto mt-4 font-light">
            Learn practical AI and digital skills through structured courses designed for real-world applications.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 pt-6 w-full px-2 sm:px-0">
            <button
              onClick={() => {
                const element = document.getElementById('explore_courses_section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto justify-center rounded-xl bg-[#79C99A] hover:bg-[#79C99A]/90 text-[#17221B] px-4 sm:px-6 py-3.5 font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-sm flex items-center gap-1.5"
              id="hero_explore_btn"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('subscription')}
              className="w-full sm:w-auto justify-center rounded-xl bg-white hover:bg-[#FAFCFA] border border-[#E5ECE7] text-[#17221B] px-4 sm:px-6 py-3.5 font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-sm flex items-center"
              id="hero_sub_btn"
            >
              Start Learning
            </button>
          </div>
        </div>

        {/* Hero Marquee Animation */}
        <div className="relative mt-12 md:mt-16 w-full flex overflow-hidden group">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          
          {/* Marquee Track */}
          <div className="flex animate-marquee gap-4 px-2 w-[max-content]">
            {[...heroImages, ...heroImages].map((img, i) => (
              <div key={i} className="relative h-40 sm:h-56 md:h-64 w-60 sm:w-80 md:w-96 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 shadow-sm border border-[#E5ECE7]">
                <img src={img} alt="Learning Context" className="w-full h-full object-cover filter hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Explore All Courses (The core workspace) */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex-grow box-border w-full" id="explore_courses_section">
        
        {/* Header Block */}
        <div className="mb-8 border-b border-[#E5ECE7] pb-5">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-[#17221B]">Explore All Courses</h2>
          <p className="text-xs text-[#66736B] mt-1 font-light">
            Browse our complete collection of AI and digital skills courses.
          </p>
        </div>

        {/* 6. Course Filters + Sort Control Panels */}
        <div className="bg-white border border-[#E5ECE7] rounded-2xl p-4 mb-8 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course title or keyword..."
                className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-4 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/50 transition-all"
                id="home_course_search_input"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#66736B]/60" />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[10px] font-black text-[#66736B] hover:text-[#17221B] uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#66736B] flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3 text-[#79C99A]" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[#E5ECE7] bg-[#FAFCFA] px-3 py-2 text-xs font-bold text-[#17221B] focus:border-[#79C99A] focus:outline-none cursor-pointer"
                id="home_course_sort_select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="border-t border-[#FAFCFA] pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-[#79C99A] text-[#17221B] border-[#79C99A]'
                      : 'bg-[#FAFCFA] text-[#66736B] border-[#E5ECE7] hover:bg-[#F1F8F3] hover:text-[#17221B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Course Grid: Hard 3-column Layout across ALL screen configurations */}
        {filteredAndSortedCourses.length === 0 ? (
          <div className="text-center bg-white border border-[#E5ECE7] rounded-2xl py-16 px-4 space-y-3 shadow-sm max-w-xl mx-auto">
            <p className="text-sm font-black text-[#17221B]">No courses matching your search</p>
            <p className="text-xs text-[#66736B] max-w-xs mx-auto font-light leading-relaxed">
              We couldn't find any courses in category "{selectedCategory}" with matching keywords. Try clearing filters or searching another keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortBy('Popular');
              }}
              className="rounded-xl bg-[#79C99A] hover:bg-[#79C99A]/90 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#17221B] transition-all shadow-sm"
            >
              Reset Filters & Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-6" id="home_courses_grid">
            {filteredAndSortedCourses.map((course) => {
              const enrollment = user?.enrollments?.find(e => e.courseId === course.id);
              const progress = enrollment?.progress;

              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => onNavigate('course-details', { slug: course.slug })}
                  isEnrolled={userEnrollments.includes(course.id)}
                  progress={progress}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 7. Single Compact Subscription Section */}
      <section className="bg-[#F1F8F3] py-12 md:py-16 border-t border-b border-[#E5ECE7]" id="subscription_section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="rounded-full bg-[#FAFCFA] text-[#17221B] border border-[#79C99A]/40 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
              Unrestricted Pass
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#17221B] tracking-tight mt-3">
              One Subscription. A World of Learning.
            </h2>
            <p className="text-xs text-[#66736B] leading-relaxed max-w-xl mx-auto mt-2 font-light">
              Get access to all courses included in the subscription with one recurring membership.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 bg-white shadow-sm transition-all duration-300 ${
                  plan.isBestValue 
                    ? 'border-[#79C99A] ring-2 ring-[#79C99A]/20 md:scale-105 z-10' 
                    : 'border-[#E5ECE7]'
                }`}
              >
                {plan.isBestValue && (
                  <div className="absolute top-3.5 right-3.5 rounded-full bg-[#79C99A] px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#17221B] shadow-sm">
                    BEST VALUE
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-sans text-[11px] font-black uppercase tracking-widest text-[#17221B]">{plan.name}</h3>
                  <p className="text-[11px] text-[#66736B] font-light leading-relaxed">{plan.desc}</p>
                </div>

                <div className="my-5 border-t border-[#FAFCFA] pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#17221B]">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#66736B] font-bold">/ {plan.period}</span>
                  </div>
                  <p className="text-[9px] text-[#66736B] mt-1 font-semibold uppercase tracking-wider">
                    {plan.billedText} Cancel online with one click.
                  </p>
                </div>

                <ul className="space-y-1.5 text-[10px] text-[#66736B] mb-5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-[#79C99A] shrink-0" />
                    All premium AI curricula included
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-[#79C99A] shrink-0" />
                    New masterclass releases added regularly
                  </li>
                </ul>

                <button
                  onClick={() => onNavigate('subscription')}
                  className="w-full rounded-xl bg-[#79C99A] hover:bg-[#79C99A]/90 py-3 text-center text-[10px] font-black uppercase tracking-widest text-[#17221B] transition-all shadow-sm mt-auto"
                >
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Professional Clean Footer */}
      <footer className="bg-white border-t border-[#E5ECE7] py-10 mt-auto" id="homepage_footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E5ECE7]">
            
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-3.5">
              <span className="text-sm font-black uppercase tracking-widest text-[#17221B] flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#79C99A]"></span>
                Digital AI Class
              </span>
              <p className="text-xs text-[#66736B] leading-relaxed font-light max-w-sm">
                A premium online course marketplace designed to equip professionals, students, and creators with production-grade AI and automation skillsets.
              </p>
              <p className="text-[10px] text-[#66736B]/60 font-medium">
                © 2026 Digital AI Class. All rights reserved.
              </p>
            </div>

            {/* Platform Navigation Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-[#17221B]">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('home')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('courses')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Courses
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('dashboard')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Library
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('subscription')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Subscription
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Links Column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-[#17221B]">Legal & Support</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('about')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Contact & Support
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('faq')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('privacy-policy')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('terms-conditions')} className="text-[#66736B] hover:text-[#79C99A] transition-colors font-light">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#66736B] font-light">
            <p>Designed with meticulous attention to detail, optimized for seamless desktop and mobile engagement.</p>
            <div className="flex gap-4">
              <span className="hover:text-[#17221B] cursor-pointer">Twitter</span>
              <span className="hover:text-[#17221B] cursor-pointer">LinkedIn</span>
              <span className="hover:text-[#17221B] cursor-pointer">GitHub</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
