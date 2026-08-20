const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldApi = `app.get('/api/lessons/:lessonId/stream', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  let user = null;
  if (token) {
     user = DB.getUsers().find(u => u.sessionToken === token);
  }

  const { lessonId } = req.params;
  let foundLesson = null;
  let foundCourse = null;

  for (const course of DB.getCourses()) {
    for (const section of DB.getSections(course.id)) {
      const lesson = DB.getLessons(section.id).find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        foundCourse = course;
        break;
      }
    }
    if (foundLesson) break;
  }

  if (!foundLesson || !foundCourse) return res.status(404).json({ error: 'Not found' });

  if (foundLesson.isPreview) {
     return res.json({ videoUrl: foundLesson.videoId, secureToken: 'free-preview-token' });
  }

  if (!user) {
     return res.status(401).json({ error: 'Authentication required' });
  }

  const hasActiveSub = DB.getSubscriptions(user.id).some(s => s.status === 'active');
  const hasPaidCourse = DB.getPayments().some(p => p.userId === user.id && p.courseId === foundCourse.id && p.status === 'completed');

  if ((hasActiveSub && foundCourse.subscriptionIncluded) || hasPaidCourse) {
     return res.json({ videoUrl: foundLesson.videoId, secureToken: 'secure-signed-token' });
  }

  return res.status(403).json({ error: 'Access denied. Please purchase the course.' });
});`;

const newApi = `app.get('/api/lessons/:lessonId/stream', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  let user = null;
  if (token) {
     const userId = verifyToken(token);
     if (userId) {
       user = DB.getUsers().find(u => u.id === userId);
     }
  }

  const { lessonId } = req.params;
  let foundLesson = null;
  let foundCourse = null;

  for (const course of DB.getCourses()) {
    for (const section of DB.getSections(course.id)) {
      const lesson = DB.getLessons(section.id).find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        foundCourse = course;
        break;
      }
    }
    if (foundLesson) break;
  }

  if (!foundLesson || !foundCourse) return res.status(404).json({ error: 'Not found' });

  if (foundLesson.isPreview) {
     return res.json({ videoUrl: foundLesson.videoId, secureToken: 'free-preview-token' });
  }

  if (!user) {
     return res.status(401).json({ error: 'Authentication required' });
  }

  const hasActiveSub = !!DB.getSubscription(user.id);
  const hasPaidCourse = DB.getEnrollments(user.id).some(e => e.courseId === foundCourse.id);

  if ((hasActiveSub && foundCourse.subscriptionIncluded) || hasPaidCourse) {
     return res.json({ videoUrl: foundLesson.videoId, secureToken: 'secure-signed-token' });
  }

  return res.status(403).json({ error: 'Access denied. Please purchase the course.' });
});`;

code = code.replace(oldApi, newApi);
fs.writeFileSync('server.ts', code);
