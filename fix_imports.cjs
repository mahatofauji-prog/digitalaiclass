const fs = require('fs');
let code = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');

code = code.replace(
  "import { \n  Play, CheckCircle, ArrowLeft\n} from 'lucide-react';",
  "import { \n  Play, CheckCircle, ArrowLeft, Lock\n} from 'lucide-react';"
);

fs.writeFileSync('src/components/CoursePlayer.tsx', code);
