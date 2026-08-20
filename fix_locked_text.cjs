const fs = require('fs');
let code = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');

const oldText = `<p className="text-sm font-black text-[#17221B] mb-6">{course.title} - ₹{course.price.toLocaleString('en-IN')}</p>`;
const newText = `<div className="mb-6 space-y-1">
                    <p className="text-sm font-black text-[#17221B]">{course.title}</p>
                    {course.shortDescription && <p className="text-xs text-[#66736B] max-w-sm mx-auto">{course.shortDescription}</p>}
                    <p className="text-sm font-bold text-[#79C99A]">₹{course.price.toLocaleString('en-IN')}</p>
                  </div>`;

code = code.replace(oldText, newText);
fs.writeFileSync('src/components/CoursePlayer.tsx', code);
