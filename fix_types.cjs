const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const oldPayment = `export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentProvider: 'Razorpay' | 'Stripe' | 'Mock';
  providerPaymentId: string;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: string;
}`;

const newPayment = `export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentProvider: 'Razorpay' | 'Stripe' | 'Mock';
  providerPaymentId: string;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: string;
  courseId?: string;
}`;

code = code.replace(oldPayment, newPayment);
fs.writeFileSync('src/types.ts', code);
