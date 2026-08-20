const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const customEndpoints = `

app.get('/api/courses/id/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const course = DB.getCourses().find(c => c.id === id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const sections = DB.getSections(course.id).map(section => {
    const lessons = DB.getLessons(section.id).map(l => {
      const { videoId, ...rest } = l;
      return rest;
    });
    return {
      ...section,
      lessons
    };
  });

  res.json({ course, sections });
});

app.get('/api/admin/courses/:id/curriculum', adminMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const course = DB.getCourses().find(c => c.id === id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const sections = DB.getSections(course.id).map(section => {
    const lessons = DB.getLessons(section.id);
    return {
      ...section,
      lessons
    };
  });

  res.json({ course, sections });
});

app.get('/api/lessons/:lessonId/stream', (req: Request, res: Response) => {
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
});

`;

code = code.replace("if (process.env.NODE_ENV !== 'production') {", customEndpoints + "\n  if (process.env.NODE_ENV !== 'production') {");
fs.writeFileSync('server.ts', code);
