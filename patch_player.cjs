const fs = require('fs');
const code = `import React, { useState, useEffect } from 'react';
import { 
  Play, CheckCircle, ArrowLeft, Settings, Lock
} from 'lucide-react';
import { Course, CourseSection, Lesson, ProgressRecord } from '../types';
import AIChatBot from './AIChatBot';

interface CoursePlayerProps {
  courseId: string;
  initialLessonId?: string;
  onNavigate: (view: string, extra?: any) => void;
}

export default function CoursePlayer({ courseId, initialLessonId, onNavigate }: CoursePlayerProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<(CourseSection & { lessons: Lesson[] })[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // Student progress tracker states
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Load course player files
  useEffect(() => {
    async function loadPlayerClassroom() {
      try {
        const headers = { 'Authorization': \`Bearer \${localStorage.getItem('session_token') || ''}\` };
        
        // 1. Fetch Course details
        const response = await fetch(\`/api/courses/id/\${courseId}\`);
        const data = await response.json();
        if (response.ok && data.course) {
          setCourse(data.course);
          setSections(data.sections);
          
          // Set active lesson
          const flatLessons = data.sections.flatMap((s: any) => s.lessons) as Lesson[];
          const initial = flatLessons.find(l => l.id === initialLessonId) || flatLessons[0];
          setActiveLesson(initial || null);
        }

        // 2. Fetch Progress tracking records
        const progRes = await fetch(\`/api/progress/\${courseId}\`, { headers });
        if (progRes.ok) {
          const progData = await progRes.json() as ProgressRecord[];
          const completedIds = progData.filter(p => p.completed).map(p => p.lessonId);
          setCompletedLessonIds(completedIds);
          
          if (!initialLessonId && data.sections) {
            const flatLessons = data.sections.flatMap((s: any) => s.lessons) as Lesson[];
            const firstIncomplete = flatLessons.find(l => !completedIds.includes(l.id));
            if (firstIncomplete) {
              setActiveLesson(firstIncomplete);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching course player assets:', e);
      } finally {
        setLoading(false);
      }
    }
    loadPlayerClassroom();
  }, [courseId, initialLessonId]);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleToggleCompleted = async (lessonId: string) => {
    const isCompleted = completedLessonIds.includes(lessonId);
    
    // Optimistic state update
    const updated = isCompleted 
      ? completedLessonIds.filter(id => id !== lessonId)
      : [...completedLessonIds, lessonId];
    
    setCompletedLessonIds(updated);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('session_token') || ''}\`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed: !isCompleted
        })
      });
      if (!response.ok) {
        setCompletedLessonIds(completedLessonIds);
      }
    } catch (e) {
      console.error(e);
      setCompletedLessonIds(completedLessonIds);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center space-y-4 bg-[#FAFCFA] min-h-screen box-border w-full flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-[#79C99A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#66736B] font-bold uppercase tracking-widest">Loading Player...</p>
      </div>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center space-y-4 bg-[#FAFCFA] min-h-screen box-border w-full flex flex-col items-center justify-center">
        <h2 className="font-sans text-xl font-bold text-[#17221B]">Classroom Unavailable</h2>
        <button onClick={() => onNavigate('dashboard')} className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const flatLessonsCount = sections.flatMap(s => s.lessons).length;
  const progressPercent = flatLessonsCount > 0 
    ? Math.round((completedLessonIds.length / flatLessonsCount) * 100) 
    : 0;

  const flatLessons = sections.flatMap(s => s.lessons);
  const currentIndex = flatLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  // Find active chapter name
  const activeSection = sections.find(s => s.lessons.some(l => l.id === activeLesson.id));

  return (
    <div className="w-full bg-[#FAFCFA] min-h-screen font-sans box-border pb-10">
      <div className="mx-auto max-w-[1000px] w-full p-4 sm:p-6 lg:p-8">
        
        {/* Back to syllabus bar */}
        <div className="flex items-center justify-between pb-4 mb-4">
          <button
            onClick={() => onNavigate('course-details', { slug: course.slug })}
            className="flex items-center gap-1.5 text-xs font-bold text-[#66736B] hover:text-[#17221B] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Curriculum
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          
          {/* Main Player Column */}
          <div className="w-full lg:flex-1 space-y-4">
            
            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-sm border border-[#E5ECE7]">
              <iframe
                src={\`https://www.youtube.com/embed/\${activeLesson.videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0\`}
                title={activeLesson.title}
                allow="autoplay; encrypted-media"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>

            {/* Video Controls & Info */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E5ECE7] shadow-sm w-full">
              <div className="space-y-1">
                <h1 className="font-sans text-lg sm:text-xl md:text-2xl font-black text-[#17221B] leading-tight break-words">
                  {activeLesson.title}
                </h1>
                {activeSection && (
                  <p className="text-xs sm:text-sm text-[#66736B] font-bold">
                    Chapter {activeSection.order} • {activeSection.title}
                  </p>
                )}
              </div>

              {/* Progress & Controls */}
              <div className="mt-6 pt-4 border-t border-[#E5ECE7] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-bold text-[#66736B] uppercase tracking-wider shrink-0">Progress: {progressPercent}%</span>
                    <div className="flex-1 sm:w-32 bg-[#FAFCFA] border border-[#E5ECE7] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#79C99A] h-full transition-all" style={{ width: \`\${progressPercent}%\` }} />
                    </div>
                  </div>

                  {progressPercent >= 100 && (
                    <button
                      onClick={() => onNavigate('dashboard', { tab: 'certificates' })}
                      className="rounded-xl bg-[#79C99A] text-[#17221B] px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto text-center"
                    >
                      Download Certificate
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full">
                  <button
                    onClick={() => prevLesson && handleSelectLesson(prevLesson)}
                    disabled={!prevLesson}
                    className={\`rounded-xl px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 \${
                      prevLesson ? 'bg-[#FAFCFA] border border-[#E5ECE7] hover:bg-[#F1F8F3] text-[#17221B]' : 'opacity-50 cursor-not-allowed bg-[#FAFCFA] text-[#66736B] border border-[#E5ECE7]'
                    }\`}
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Previous</span>
                  </button>

                  <button
                    onClick={() => handleToggleCompleted(activeLesson.id)}
                    className={\`rounded-xl px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shrink-0 \${
                      completedLessonIds.includes(activeLesson.id)
                        ? 'bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B]'
                        : 'bg-[#79C99A] text-[#17221B] hover:opacity-90 shadow-sm'
                    }\`}
                  >
                    <CheckCircle className={\`h-3 w-3 sm:h-4 sm:w-4 shrink-0 \${completedLessonIds.includes(activeLesson.id) ? 'text-green-700' : 'text-[#17221B]'}\`} />
                    <span className="truncate">{completedLessonIds.includes(activeLesson.id) ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  <button
                    onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                    disabled={!nextLesson}
                    className={\`rounded-xl px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 \${
                      nextLesson ? 'bg-[#FAFCFA] border border-[#E5ECE7] hover:bg-[#F1F8F3] text-[#17221B]' : 'opacity-50 cursor-not-allowed bg-[#FAFCFA] text-[#66736B] border border-[#E5ECE7]'
                    }\`}
                  >
                    <span className="truncate">Next</span>
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 rotate-180 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Chapter/Topic Navigation */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5ECE7] shadow-sm p-4 w-full">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3 mb-3">Course Topics</h3>
              
              <div className="space-y-4 overflow-y-auto max-h-[50vh] lg:max-h-[600px] pr-1">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <strong className="text-xs font-bold text-[#17221B] block leading-tight mb-2 font-sans truncate pr-2">
                      {section.order}. {section.title}
                    </strong>
                    
                    <div className="flex flex-col gap-1.5 border-l-2 border-[#E5ECE7] pl-3 ml-1">
                      {section.lessons.map((lesson) => {
                        const isActive = activeLesson.id === lesson.id;
                        const isCompleted = completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className={\`w-full text-left text-xs rounded-xl p-2.5 transition-all flex items-center justify-between \${
                              isActive 
                                ? 'bg-[#79C99A] text-[#17221B] font-black shadow-sm' 
                                : 'bg-transparent hover:bg-[#FAFCFA] text-[#66736B] hover:text-[#17221B]'
                            }\`}
                          >
                            <div className="pr-2 min-w-0">
                              <p className={\`truncate \${isActive ? 'text-[#17221B]' : 'text-[#17221B]'}\`}>
                                {lesson.title}
                              </p>
                              <span className={\`text-[9px] font-mono block mt-0.5 \${isActive ? 'text-[#17221B]/80' : 'text-[#66736B]'}\`}>{lesson.duration}</span>
                            </div>

                            <div className="shrink-0 pl-1">
                              {isCompleted ? (
                                <CheckCircle className={\`h-4 w-4 \${isActive ? 'text-[#17221B]' : 'text-green-700'}\`} />
                              ) : (
                                <Play className={\`h-3 w-3 \${isActive ? 'text-[#17221B] fill-current' : 'text-[#66736B]'}\`} />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <AIChatBot 
        courseName={course.title}
        lessonName={activeLesson.title}
        lessonDescription={activeLesson.description}
      />
    </div>
  );
}
`;
fs.writeFileSync('src/components/CoursePlayer.tsx', code);
