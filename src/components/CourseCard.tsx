/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Clock, GraduationCap, Award } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  key?: any;
  course: Course & { rating?: number; reviewsCount?: number; studentCount?: number };
  onClick: () => void;
  isEnrolled?: boolean;
  progress?: number;
}

export default function CourseCard({ course, onClick, isEnrolled, progress }: CourseCardProps) {
  const rating = course.rating || 4.8;
  const reviewsCount = course.reviewsCount || 8;
  const studentCount = course.studentCount || 142;

  const discountPercent = course.originalPrice > 0
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  // Formatting studentCount to look like e.g. "2.4K" or similar
  const studentCountFormatted = studentCount >= 1000 
    ? (studentCount / 1000).toFixed(1) + 'K' 
    : studentCount;

  // Determine course access badge text & styles
  let badgeText = '';
  let badgeStyle = '';

  if (isEnrolled) {
    if (progress !== undefined && progress > 0) {
      badgeText = 'Continue Learning';
      badgeStyle = 'bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/40';
    } else {
      badgeText = 'Owned';
      badgeStyle = 'bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/30';
    }
  } else {
    if (course.subscriptionIncluded) {
      badgeText = 'Included in Subscription';
      badgeStyle = 'bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/40';
    } else {
      badgeText = 'Buy Course';
      badgeStyle = 'bg-white text-[#66736B] border border-[#E5ECE7]';
    }
  }

  // CTA Text
  const ctaText = isEnrolled 
    ? (progress !== undefined && progress > 0 ? 'Resume Course' : 'Resume Course') 
    : 'View Course';

  return (
    <div
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-[8px] sm:rounded-2xl border border-[#E5ECE7] bg-white hover:border-[#79C99A]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full min-w-0 box-border w-full max-w-full"
      id={`course_card_${course.id}`}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full overflow-hidden bg-[#FAFCFA] box-border min-w-0" style={{ aspectRatio: '16 / 9' }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-350 group-hover:scale-[1.02] block"
        />
        <div className="absolute top-1 left-1 sm:top-3 sm:left-3 flex flex-wrap gap-1">
          <span className="rounded-full bg-white/95 border border-[#E5ECE7] px-1 sm:px-2.5 py-0.5 text-[6px] sm:text-[9px] font-bold uppercase tracking-wider text-[#17221B] backdrop-blur-sm">
            {course.category}
          </span>
          <span className={`hidden sm:inline-block rounded-full px-1 sm:px-2.5 py-0.5 text-[7px] sm:text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            course.level === 'Beginner' ? 'bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/20' :
            course.level === 'Intermediate' ? 'bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/30' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Core Details */}
      <div className="flex flex-1 flex-col p-[6px] sm:p-5 space-y-1 sm:space-y-3 min-w-0 box-border w-full">
        {/* Rating and Students inline */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs min-w-0">
          <span className="text-amber-500">⭐</span>
          <span className="font-bold text-[#17221B]">{rating}</span>
          <span className="hidden sm:inline text-[#66736B]">·</span>
          <span className="hidden sm:inline text-[#66736B] font-light">{studentCountFormatted} students</span>
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-start w-full">
          <h3 
            className="font-sans text-[10px] sm:text-sm md:text-base font-bold text-[#17221B] group-hover:text-[#79C99A] transition-colors"
            style={{ 
              display: '-webkit-box', 
              WebkitBoxOrient: 'vertical', 
              WebkitLineClamp: 2, 
              overflow: 'hidden',
              overflowWrap: 'anywhere',
              lineHeight: 1.3
            }}
          >
            {course.title}
          </h3>
          <p className="hidden sm:block text-xs text-[#66736B] line-clamp-2 mt-1 leading-relaxed font-light">
            {course.shortDescription}
          </p>
        </div>

        {/* Instructor Name */}
        <p className="hidden sm:block text-[10px] text-[#66736B] font-bold uppercase tracking-widest">
          Instructor: <span className="text-[#17221B] font-black">{course.instructor}</span>
        </p>

        {/* Duration & Level (standard details) */}
        <div className="flex items-center gap-1 sm:gap-3 text-[7px] sm:text-[10px] text-[#66736B] font-bold uppercase tracking-normal sm:tracking-wider min-w-0">
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Clock className="hidden sm:inline-block h-2.5 sm:h-3.5 w-2.5 sm:w-3.5 text-[#79C99A]" />
            {course.duration}
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5 text-[#79C99A]" />
            {course.level}
          </span>
        </div>

        {/* Price & Original Price (with strike through) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2 pt-0.5 min-w-0">
          <span className="text-[10px] sm:text-base font-black text-[#17221B] leading-tight">
            ₹{course.price.toLocaleString('en-IN')}
          </span>
          {course.originalPrice > course.price && (
            <span className="hidden sm:inline text-[7px] sm:text-xs text-[#66736B] line-through font-light leading-tight">
              ₹{course.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Access Badge Container */}
        <div className="pt-0.5 min-w-0">
          <span className={`inline-block rounded-full px-1 py-0.5 sm:px-3 sm:py-1 text-[6px] sm:text-[10px] font-bold uppercase tracking-normal sm:tracking-widest leading-none ${badgeStyle}`}>
            <span className="sm:inline hidden">{badgeText}</span>
            <span className="inline sm:hidden">
              {badgeText === 'Included in Subscription' ? 'Sub' : 
               badgeText === 'Continue Learning' ? 'Resume' : 
               badgeText === 'Buy Course' ? 'Buy' : badgeText}
            </span>
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-1 mt-auto min-w-0 w-full box-border">
          <div className="w-full text-center h-[28px] sm:h-auto py-1 sm:py-2.5 px-1 rounded-[4px] sm:rounded-xl border border-[#79C99A]/50 bg-white text-[#17221B] text-[8px] sm:text-xs font-black uppercase tracking-normal sm:tracking-widest transition-all duration-300 group-hover:bg-[#79C99A] group-hover:text-[#17221B] group-hover:shadow-sm flex items-center justify-center box-border min-w-0 max-w-full">
            <span className="sm:inline hidden">{ctaText}</span>
            <span className="inline sm:hidden">VIEW</span>
          </div>
        </div>
      </div>
    </div>
  );
}
