const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Add import
code = code.replace(`import { Course, User as UserType, Coupon, PaymentRecord } from '../types';`, `import { Course, User as UserType, Coupon, PaymentRecord } from '../types';\nimport AdminCurriculumEditor from '../components/AdminCurriculumEditor';`);

// Add state for editing course
code = code.replace(`const [showAddCourse, setShowAddCourse] = useState(false);`, `const [showAddCourse, setShowAddCourse] = useState(false);\n  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);`);

// In the rendering, if editingCourseId is set, show the curriculum editor
const renderTarget = `return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans" id="admin_control_desk">`;
    
const replacementRender = `return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans" id="admin_control_desk">
      {editingCourseId && (
        <AdminCurriculumEditor 
          courseId={editingCourseId} 
          onClose={() => setEditingCourseId(null)} 
        />
      )}`;
      
code = code.replace(renderTarget, replacementRender);

// Add Manage button
const rowTarget = `<td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}`;
const rowReplacement = `<td className="p-3 text-right">
                      <button
                        onClick={() => setEditingCourseId(course.id)}
                        className="text-[#66736B] hover:text-[#79C99A] transition-colors p-1 mr-2"
                        title="Manage Curriculum"
                      >
                        <BookOpen className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}`;
code = code.replace(rowTarget, rowReplacement);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
