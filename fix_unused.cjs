const fs = require('fs');
let code = fs.readFileSync('src/pages/CourseDetails.tsx', 'utf8');
code = code.replace(/onEnrollIndividual,\n/g, '');
code = code.replace(/onEnrollIndividual: \(courseId: string, finalAmount: number, couponCode\?: string\) => void;/g, '');
fs.writeFileSync('src/pages/CourseDetails.tsx', code);
