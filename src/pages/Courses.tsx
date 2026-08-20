/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, BookOpen, Check } from 'lucide-react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';

interface CoursesProps {
  courses: (Course & { rating?: number; reviewsCount?: number; studentCount?: number })[];
  onNavigate: (view: string, extra?: any) => void;
  userEnrollments: string[];
}

export default function Courses({ courses, onNavigate, userEnrollments }: CoursesProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Categories list
  const categories = useMemo(() => {
    const list = new Set(courses.map(c => c.category));
    return ['All', ...Array.from(list)];
  }, [courses]);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.shortDescription.toLowerCase().includes(q) || 
        c.instructor.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory);
    }

    // Level Filter
    if (selectedLevel !== 'All') {
      result = result.filter(c => c.level === selectedLevel);
    }

    // Access Type Filter
    if (selectedPricing === 'Subscription') {
      result = result.filter(c => c.subscriptionIncluded);
    } else if (selectedPricing === 'Premium Buy Only') {
      result = result.filter(c => !c.subscriptionIncluded);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // popular
      result.sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));
    }

    return result;
  }, [courses, search, selectedCategory, selectedLevel, selectedPricing, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans box-border w-full" id="courses_discovery_page">
      
      {/* Title Segment */}
      <div className="mb-8 border-b border-[#E5ECE7] pb-6">
        <span className="text-xs font-black uppercase tracking-widest text-[#79C99A]">Explore Courses</span>
        <h1 className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-[#17221B] mt-1">
          Academic Course Marketplace
        </h1>
        <p className="text-xs text-[#66736B] mt-1.5 font-light">
          Find courses designed to help you build practical skills. Explore single lifetimes or unlock them in subscription plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter panel */}
        <div className="lg:col-span-3 space-y-5 bg-white p-5 rounded-2xl border border-[#E5ECE7] h-fit shadow-sm" id="courses_filter_panel">
          <div className="flex items-center gap-2 border-b border-[#E5ECE7] pb-3 mb-1">
            <SlidersHorizontal className="h-4 w-4 text-[#79C99A]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#17221B]">Filters</h3>
          </div>

          {/* Search box */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest block">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search course title or author..."
                className="w-full rounded-lg border border-[#E5ECE7] py-2 pl-8 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-white text-[#17221B] placeholder-[#66736B]/50"
                id="search_course_input"
              />
              <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-[#66736B]/60" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest block">Categories</label>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left rounded-lg px-2.5 py-2 text-xs transition-all flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-[#F1F8F3] text-[#17221B] font-bold border border-[#79C99A]/20'
                      : 'text-[#66736B] hover:bg-[#FAFCFA] hover:text-[#17221B]'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="h-3.5 w-3.5 text-[#79C99A]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest block">Syllabus Level</label>
            <div className="flex flex-col gap-1">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`text-left rounded-lg px-2.5 py-2 text-xs transition-all flex items-center justify-between ${
                    selectedLevel === lvl
                      ? 'bg-[#F1F8F3] text-[#17221B] font-bold border border-[#79C99A]/20'
                      : 'text-[#66736B] hover:bg-[#FAFCFA] hover:text-[#17221B]'
                  }`}
                >
                  <span>{lvl}</span>
                  {selectedLevel === lvl && <Check className="h-3.5 w-3.5 text-[#79C99A]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Access Filter */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest block">Included In</label>
            <div className="flex flex-col gap-1">
              {[
                { name: 'All Access Models', value: 'All' },
                { name: 'Subscription pass included', value: 'Subscription' },
                { name: 'Premium lifetime only', value: 'Premium Buy Only' }
              ].map((pricing) => (
                <button
                  key={pricing.value}
                  onClick={() => setSelectedPricing(pricing.value)}
                  className={`text-left rounded-lg px-2.5 py-2 text-xs transition-all flex items-center justify-between ${
                    selectedPricing === pricing.value
                      ? 'bg-[#F1F8F3] text-[#17221B] font-bold border border-[#79C99A]/20'
                      : 'text-[#66736B] hover:bg-[#FAFCFA] hover:text-[#17221B]'
                  }`}
                >
                  <span>{pricing.name}</span>
                  {selectedPricing === pricing.value && <Check className="h-3.5 w-3.5 text-[#79C99A]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Grid of courses */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5ECE7] shadow-sm">
            <p className="text-xs text-[#66736B]">
              Showing <span className="font-bold text-[#17221B]">{filteredCourses.length}</span> course results matching filters
            </p>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#66736B] uppercase font-black text-[9px] tracking-widest">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-[#E5ECE7] bg-white text-[#17221B] px-3 py-1.5 text-xs focus:border-[#79C99A] focus:outline-none font-bold"
                id="courses_sort_select"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Releases</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center bg-white border border-[#E5ECE7] rounded-3xl py-24 px-4 space-y-4 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F8F3] text-[#79C99A] border border-[#E5ECE7]">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-base font-black text-[#17221B]">No courses match your criteria</h3>
              <p className="text-xs text-[#66736B] max-w-sm mx-auto leading-relaxed font-light">
                We couldn't locate any classes matching your keywords, levels, or category constraints. Try resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSelectedPricing('All');
                  setSortBy('popular');
                }}
                className="rounded-xl bg-[#79C99A] hover:bg-[#79C99A]/90 px-6 py-3 text-xs font-black uppercase tracking-widest text-[#17221B] transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-6" id="courses_results_grid">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => onNavigate('course-details', { slug: course.slug })}
                  isEnrolled={userEnrollments.includes(course.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
