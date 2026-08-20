const fs = require('fs');
let code = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');

// 1. Add states and streamData
const stateInjection = `const [loading, setLoading] = useState(true);
  const [accessState, setAccessState] = useState<'loading' | 'granted' | 'denied' | 'unauthenticated'>('loading');
  const [streamData, setStreamData] = useState<{videoUrl: string} | null>(null);`;

code = code.replace("const [loading, setLoading] = useState(true);", stateInjection);

// 2. Fetch stream dynamically when activeLesson changes
const fetchStreamEffect = `
  useEffect(() => {
    async function verifyAccess() {
      if (!activeLesson) return;
      setAccessState('loading');
      try {
        const headers: any = {};
        const token = localStorage.getItem('session_token');
        if (token) headers['Authorization'] = \`Bearer \${token}\`;

        const res = await fetch(\`/api/lessons/\${activeLesson.id}/stream\`, { headers });
        if (res.ok) {
          const data = await res.json();
          setStreamData(data);
          setAccessState('granted');
        } else if (res.status === 401) {
          setAccessState('unauthenticated');
        } else if (res.status === 403) {
          setAccessState('denied');
        } else {
          setAccessState('denied');
        }
      } catch (e) {
        console.error(e);
        setAccessState('denied');
      }
    }
    verifyAccess();
  }, [activeLesson]);
`;

code = code.replace("const handleSelectLesson = (lesson: Lesson) => {", fetchStreamEffect + "\n  const handleSelectLesson = (lesson: Lesson) => {");

// 3. Update the video area rendering
const originalVideoBlock = `{/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-sm border border-[#E5ECE7]">
              <iframe
                src={\`https://www.youtube.com/embed/\${activeLesson.videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0\`}
                title={activeLesson.title}
                allow="autoplay; encrypted-media"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>`;

const newVideoBlock = `{/* Video Player Area */}
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAFCFA] shadow-sm border border-[#E5ECE7] flex flex-col items-center justify-center">
              {accessState === 'loading' && (
                <div className="flex flex-col items-center justify-center p-6">
                   <div className="h-8 w-8 border-4 border-[#79C99A] border-t-transparent rounded-full animate-spin mb-3" />
                   <p className="text-[10px] text-[#66736B] font-bold uppercase tracking-widest">Verifying Access...</p>
                </div>
              )}
              {accessState === 'granted' && streamData && (
                <iframe
                  src={\`https://www.youtube.com/embed/\${streamData.videoUrl}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0\`}
                  title={activeLesson.title}
                  allow="autoplay; encrypted-media"
                  className="w-full h-full border-0 absolute inset-0 bg-black"
                />
              )}
              {accessState === 'unauthenticated' && (
                <div className="text-center p-6 bg-white w-full h-full flex flex-col items-center justify-center absolute inset-0 z-10">
                  <div className="bg-[#F1F8F3] p-3 rounded-full mb-3">
                     <Lock className="h-6 w-6 text-[#79C99A]" />
                  </div>
                  <h3 className="text-lg font-black text-[#17221B] mb-2">Please log in to continue</h3>
                  <p className="text-xs text-[#66736B] mb-6 max-w-sm">You must be logged into your account to access course materials.</p>
                  <div className="flex gap-3">
                    <button onClick={() => onNavigate('auth', { mode: 'login' })} className="rounded-xl bg-[#79C99A] text-[#17221B] px-6 py-2.5 text-xs font-black uppercase tracking-widest shadow-sm hover:opacity-90 transition-all">Log In</button>
                    <button onClick={() => onNavigate('auth', { mode: 'signup' })} className="rounded-xl bg-white text-[#17221B] border border-[#E5ECE7] px-6 py-2.5 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-[#FAFCFA] transition-all">Create Account</button>
                  </div>
                </div>
              )}
              {accessState === 'denied' && (
                <div className="text-center p-6 bg-white w-full h-full flex flex-col items-center justify-center absolute inset-0 z-10">
                  <div className="bg-red-50 p-3 rounded-full mb-3">
                     <Lock className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-black text-[#17221B] mb-2">COURSE LOCKED</h3>
                  <p className="text-xs text-[#66736B] mb-2 max-w-sm">Purchase this course to access all lessons and videos.</p>
                  <p className="text-sm font-black text-[#17221B] mb-6">{course.title} - ₹{course.price.toLocaleString('en-IN')}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto items-center justify-center">
                    <button onClick={() => onNavigate('course-details', { slug: course.slug })} className="w-full sm:w-auto rounded-xl bg-[#17221B] text-white px-6 py-3 text-xs font-black uppercase tracking-widest shadow-sm hover:opacity-90 transition-all">
                      Buy This Course
                    </button>
                    
                    {course.subscriptionIncluded && (
                      <>
                        <span className="text-[10px] text-[#66736B] font-bold uppercase mx-2 hidden sm:block">OR</span>
                        <button onClick={() => onNavigate('subscription')} className="w-full sm:w-auto rounded-xl bg-[#79C99A] text-[#17221B] px-6 py-3 text-xs font-black uppercase tracking-widest shadow-sm hover:opacity-90 transition-all">
                          Get Subscription
                        </button>
                      </>
                    )}
                  </div>
                  {course.subscriptionIncluded && (
                    <p className="text-[9px] text-[#66736B] mt-5 uppercase tracking-widest">Unlock all subscription courses with an active subscription.</p>
                  )}
                </div>
              )}
            </div>`;

code = code.replace(originalVideoBlock, newVideoBlock);

// 4. Disable "Mark Complete" if access denied or unauthenticated
const originalMarkComplete = `<button
                    onClick={() => handleToggleCompleted(activeLesson.id)}`;

const newMarkComplete = `<button
                    disabled={accessState !== 'granted'}
                    onClick={() => handleToggleCompleted(activeLesson.id)}`;
                    
code = code.replace(originalMarkComplete, newMarkComplete);

fs.writeFileSync('src/components/CoursePlayer.tsx', code);
