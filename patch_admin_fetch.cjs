const fs = require('fs');
let code = fs.readFileSync('src/components/AdminCurriculumEditor.tsx', 'utf8');

code = code.replace(
  "const res = await fetch(`/api/admin/courses/${courseId}/curriculum`);",
  "const res = await fetch(`/api/admin/courses/${courseId}/curriculum`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}` } });"
);

fs.writeFileSync('src/components/AdminCurriculumEditor.tsx', code);
