const fs = require('fs');
let code = fs.readFileSync('src/pages/CourseDetails.tsx', 'utf8');

const oldClick = `const handleTopicClick = (lesson: Lesson) => {
    setLockedMessage(null);
    if (canLearn || lesson.isPreview) {
      onNavigate('course-player', { courseId: course.id, activeLessonId: lesson.id });
    } else {
      setLockedMessage("This lesson is locked. Enroll in this course to continue learning.");
    }
  };`;

const newClick = `const handleTopicClick = (lesson: Lesson) => {
    onNavigate('course-player', { courseId: course.id, activeLessonId: lesson.id });
  };`;

code = code.replace(oldClick, newClick);
fs.writeFileSync('src/pages/CourseDetails.tsx', code);
