const fs = require('fs');
let code = fs.readFileSync('src/pages/CourseDetails.tsx', 'utf8');
code = code.replace(/overflow-hidden/g, 'overflow-x-hidden');
fs.writeFileSync('src/pages/CourseDetails.tsx', code);

let playerCode = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');
playerCode = playerCode.replace(/overflow-hidden pb-10/g, 'overflow-x-hidden pb-10');
fs.writeFileSync('src/components/CoursePlayer.tsx', playerCode);
