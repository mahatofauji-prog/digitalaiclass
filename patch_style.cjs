const fs = require('fs');
let code = fs.readFileSync('src/pages/CourseDetails.tsx', 'utf8');

code = code.replace(
  `return (
    <div className="mx-auto max-w-[1000px] w-full px-4 py-8 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans box-border">`,
  `return (
    <div className="mx-auto max-w-[1000px] w-full px-4 py-8 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans box-border overflow-hidden">`
);

fs.writeFileSync('src/pages/CourseDetails.tsx', code);

let playerCode = fs.readFileSync('src/components/CoursePlayer.tsx', 'utf8');
playerCode = playerCode.replace(
  `return (
    <div className="w-full bg-[#FAFCFA] min-h-screen font-sans box-border pb-10">
      <div className="mx-auto max-w-[1000px] w-full p-4 sm:p-6 lg:p-8">`,
  `return (
    <div className="w-full bg-[#FAFCFA] min-h-screen font-sans box-border overflow-hidden pb-10">
      <div className="mx-auto max-w-[1000px] w-full p-4 sm:p-6 lg:p-8 box-border">`
);
fs.writeFileSync('src/components/CoursePlayer.tsx', playerCode);

