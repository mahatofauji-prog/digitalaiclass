/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  isSubscribed?: boolean;
  wishlist?: string[];
  enrollments?: { courseId: string; progress: number; completed: boolean }[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  category: string;
  instructor: string;
  price: number;
  originalPrice: number;
  subscriptionIncluded: boolean;
  published: boolean;
  featured: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g., "12 hours"
  createdAt: string;
  updatedAt: string;
}

export interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  videoId: string; // e.g. "youtube_id" or "vimeo_id" or local reference
  duration: string; // e.g., "10:15"
  order: number;
  isPreview: boolean;
}

export type PurchaseType = 'subscription' | 'individual';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  purchaseType: PurchaseType;
  purchasedAt: string;
  expiresAt: string | null;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  progressPercentage: number;
  completed: boolean;
  lastWatchedAt: string;
}

export type SubscriptionStatus = 'Active' | 'Trial' | 'Past Due' | 'Cancelled' | 'Expired';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  paymentProvider: 'Razorpay' | 'Stripe';
  providerSubscriptionId: string;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'Monthly' | 'Quarterly' | 'Yearly';
  description: string;
  active: boolean;
}

export type PaymentType = 'subscription' | 'course';
export type PaymentStatus = 'successful' | 'failed' | 'refunded';

export interface Payment {
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
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  active: boolean;
  minPurchase?: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  certificateUrl: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'coupon' | 'certificate';
  read: boolean;
  createdAt: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export type ProgressRecord = LessonProgress & { courseId?: string };

export interface PaymentRecord {
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
  planId?: string;
  provider?: string;
}
