const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/onEnrollIndividual=\{handleEnrollIndividual\}/g, '');
fs.writeFileSync('src/App.tsx', code);
