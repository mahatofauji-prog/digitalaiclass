const fs = require('fs');

// Fix CourseDetails
let code = fs.readFileSync('src/pages/CourseDetails.tsx', 'utf8');
code = code.replace(/truncate/g, 'break-words');
fs.writeFileSync('src/pages/CourseDetails.tsx', code);

// Fix CoursePlayer
let playerCode = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');
playerCode = playerCode.replace(/truncate/g, 'break-words');
fs.writeFileSync('src/components/CoursePlayer.tsx', playerCode);

