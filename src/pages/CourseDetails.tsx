import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, Lock, ArrowLeft } from 'lucide-react';
import { Course, CourseSection, Lesson } from '../types';

interface CourseDetailsProps {
  slug: string;
  onNavigate: (view: string, extra?: any) => void;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  isEnrolled: boolean;
  
}

export default function CourseDetails({
  slug,
  onNavigate,
  isLoggedIn,
  isSubscribed,
  isEnrolled
}: CourseDetailsProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<(CourseSection & { lessons: Lesson[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const response = await fetch(`/api/courses/${slug}`);
        const data = await response.json();
        if (response.ok && data.course) {
          setCourse(data.course);
          setSections(data.sections);
        }
      } catch (e) {
        console.error('Error fetching course details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [slug]);

  const toggleChapter = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
    setLockedMessage(null);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center space-y-4 bg-[#FAFCFA] min-h-screen box-border w-full">
        <div className="mx-auto h-12 w-12 border-4 border-[#79C99A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#66736B] font-bold uppercase tracking-widest">Loading Curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center space-y-4 bg-[#FAFCFA] min-h-screen box-border w-full">
        <h2 className="font-sans text-xl font-black text-[#17221B]">Course Not Found</h2>
        <button onClick={() => onNavigate('courses')} className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all">
          Return to Courses
        </button>
      </div>
    );
  }

  const isEligibleWithSub = course.subscriptionIncluded && isSubscribed;
  const canLearn = isEnrolled || isEligibleWithSub;

  const handleTopicClick = (lesson: Lesson) => {
    onNavigate('course-player', { courseId: course.id, activeLessonId: lesson.id });
  };

  return (
    <div className="mx-auto max-w-[1000px] w-full px-4 py-8 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans box-border overflow-x-hidden">
      
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('courses')}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#66736B] hover:text-[#17221B] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>
        <h1 className="font-sans text-xl sm:text-2xl md:text-3xl font-black text-[#17221B] leading-tight break-words">
          {course.title}
        </h1>
      </div>

      {/* Curriculum Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B]">Course Curriculum</h3>
        </div>

        {lockedMessage && (
          <div className="bg-[#FFF4F4] border border-[#FFD6D6] text-red-600 text-xs font-bold p-4 rounded-xl shadow-sm text-center">
            {lockedMessage}
          </div>
        )}

        <div className="space-y-3">
          {sections.map((section, idx) => (
            <div key={section.id} className="border border-[#E5ECE7] bg-white rounded-xl overflow-x-hidden shadow-sm">
              <button
                onClick={() => toggleChapter(section.id)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-4 bg-[#F1F8F3] hover:opacity-95 text-left transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs sm:text-sm font-black uppercase text-[#79C99A] tracking-widest shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-[#17221B] break-words">
                    {section.title}
                  </strong>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] sm:text-xs text-[#66736B] font-bold uppercase tracking-wider hidden sm:inline">
                    {section.lessons.length} Topics
                  </span>
                  {expandedSection === section.id ? (
                    <ChevronUp className="h-5 w-5 text-[#17221B]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#17221B]" />
                  )}
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-[#E5ECE7] divide-y divide-[#E5ECE7]">
                  {section.lessons.map((lesson) => (
                    <button 
                      key={lesson.id} 
                      onClick={() => handleTopicClick(lesson)}
                      className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-[#FAFCFA] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {canLearn || lesson.isPreview ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F1F8F3] text-[#17221B] shrink-0 border border-[#79C99A]/30">
                            <Play className="h-3 w-3 fill-current" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FAFCFA] border border-[#E5ECE7] text-[#66736B] shrink-0">
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                        <span className={`text-xs sm:text-sm font-semibold break-words ${canLearn || lesson.isPreview ? 'text-[#17221B]' : 'text-[#66736B]'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {lesson.isPreview && !canLearn && (
                          <span className="bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/30 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest hidden sm:inline-block">
                            Free
                          </span>
                        )}
                        <span className="text-[10px] text-[#66736B] font-mono shrink-0">
                          {lesson.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
