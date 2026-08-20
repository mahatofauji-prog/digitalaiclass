const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldCheck = `  const hasActiveSub = !!DB.getSubscription(user.id);
  const hasPaidCourse = DB.getEnrollments(user.id).some(e => e.courseId === foundCourse.id);`;

const newCheck = `  const activeSub = DB.getSubscription(user.id);
  const validSubStates = ['active', 'paid', 'authorized', 'captured', 'successful'];
  const hasActiveSub = activeSub ? validSubStates.includes(activeSub.status.toLowerCase()) : false;

  const validPaymentStates = ['active', 'paid', 'authorized', 'captured', 'successful', 'completed'];
  const invalidPaymentStates = ['pending', 'failed', 'cancelled', 'expired', 'refunded', 'revoked'];
  
  // Actually check payment records, not just enrollment
  const hasPaidCourse = DB.getPayments().some(p => 
    p.userId === user.id && 
    p.courseId === foundCourse.id && 
    validPaymentStates.includes(p.status.toLowerCase()) &&
    !invalidPaymentStates.includes(p.status.toLowerCase())
  );`;

code = code.replace(oldCheck, newCheck);
fs.writeFileSync('server.ts', code);
