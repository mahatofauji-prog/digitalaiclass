const fs = require('fs');
let code = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');

const target = `const completedIds = progData.filter(p => p.completed).map(p => p.lessonId);
          setCompletedLessonIds(completedIds);`;
const replacement = `const completedIds = progData.filter(p => p.completed).map(p => p.lessonId);
          setCompletedLessonIds(completedIds);
          
          if (!initialLessonId && data.sections) {
            const flatLessons = data.sections.flatMap(s => s.lessons);
            const firstIncomplete = flatLessons.find(l => !completedIds.includes(l.id));
            if (firstIncomplete) {
              setActiveLesson(firstIncomplete);
            }
          }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/CoursePlayer.tsx', code);
