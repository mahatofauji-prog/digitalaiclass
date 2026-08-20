const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target = `<div className="flex justify-between items-center pt-3 border-t border-[#E5ECE7]">
                          <button
                            onClick={() => onUnenroll(course.id)}
                            className="text-[10px] text-red-600 hover:text-red-500 font-bold uppercase tracking-wider"
                            title="Unenroll Simulator"
                          >
                            Unenroll
                          </button>
                          
                        </div>`;
const replacement = `<div className="flex justify-between items-center pt-3 border-t border-[#E5ECE7] gap-2">
                          <button
                            onClick={() => onUnenroll(course.id)}
                            className="text-[10px] text-red-600 hover:text-red-500 font-bold uppercase tracking-wider shrink-0"
                            title="Unenroll Simulator"
                          >
                            Unenroll
                          </button>
                          <button
                            onClick={() => onNavigate('course-player', { courseId: course.id })}
                            className="rounded-xl bg-[#79C99A] hover:opacity-90 text-[#17221B] px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm"
                          >
                            Continue Learning
                          </button>
                        </div>`;
code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Dashboard.tsx', code);
