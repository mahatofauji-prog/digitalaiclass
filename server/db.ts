/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { 
  User, Course, CourseSection, Lesson, Enrollment, LessonProgress, 
  Subscription, SubscriptionPlan, Payment, Coupon, Certificate, 
  Notification, CourseReview, WishlistItem 
} from '../src/types';

// Database JSON File Path
const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

// Interface for DB Structure
interface DBStructure {
  users: User[];
  courses: Course[];
  sections: CourseSection[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  progress: LessonProgress[];
  subscriptions: Subscription[];
  plans: SubscriptionPlan[];
  payments: Payment[];
  coupons: Coupon[];
  certificates: Certificate[];
  notifications: Notification[];
  reviews: CourseReview[];
  wishlist: WishlistItem[];
}

// Initial Demo Data
const initialPlans: SubscriptionPlan[] = [
  { id: 'sub_monthly', name: 'Monthly All-Access', price: 999, duration: 'Monthly', description: 'Unlock all subscription courses on a monthly basis.', active: true },
  { id: 'sub_quarterly', name: 'Quarterly All-Access', price: 2499, duration: 'Quarterly', description: 'Get 3 months of unlimited learning and save 15%.', active: true },
  { id: 'sub_yearly', name: 'Yearly Professional', price: 7999, duration: 'Yearly', description: 'Our best value. Full year of absolute access plus early access to new releases.', active: true }
];

const initialCoupons: Coupon[] = [
  { id: 'coupon_1', code: 'AICLASS50', discountType: 'percentage', discountValue: 50, maxUses: 100, usedCount: 15, expiryDate: '2027-12-31', active: true, minPurchase: 500 },
  { id: 'coupon_2', code: 'WELCOME200', discountType: 'fixed', discountValue: 200, maxUses: 500, usedCount: 42, expiryDate: '2027-12-31', active: true, minPurchase: 1000 }
];

const initialCourses: Course[] = [
  {
    id: 'course_1',
    title: 'AI Fundamentals & Neural Networks',
    slug: 'ai-fundamentals',
    shortDescription: 'Master the core mathematical and conceptual foundations of artificial intelligence and machine learning.',
    description: '<p>Dive deep into the world of Artificial Intelligence. This course is designed to bridge the gap between absolute beginner concepts and deep technical understanding.</p><h5>What you will learn:</h5><ul><li>The history and evolution of AI and deep learning networks.</li><li>How gradient descent, backpropagation, and neurons function mathematically.</li><li>Hands-on Python scripts to build your very first neural network from scratch.</li><li>Practical insights into machine learning workflows, preprocessing, and model selection.</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=800&auto=format&fit=crop',
    category: 'Core AI',
    instructor: 'Dr. Evelyn Carter',
    price: 1499,
    originalPrice: 4999,
    subscriptionIncluded: true,
    published: true,
    featured: true,
    level: 'Beginner',
    duration: '14 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_2',
    title: 'Generative AI Masterclass (LLMs & Diffusion Models)',
    slug: 'generative-ai-masterclass',
    shortDescription: 'Learn how to build, fine-tune, and deploy modern Large Language Models and diffusion networks.',
    description: '<p>The generative AI revolution is changing every industry. In this masterclass, you will learn the core architectures that power models like ChatGPT, Claude, Midjourney, and Stable Diffusion.</p><h5>What you will learn:</h5><ul><li>Transformer architectures: Self-attention mechanisms decoded.</li><li>Fine-tuning LLMs with custom datasets using LoRA and QLoRA.</li><li>Prompt construction, vector databases, and Retrieval-Augmented Generation (RAG).</li><li>Diffusion mathematical formulations and image latent-space manipulation.</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    category: 'Generative AI',
    instructor: 'Alex Mercer, AI Researcher',
    price: 2499,
    originalPrice: 8999,
    subscriptionIncluded: true,
    published: true,
    featured: true,
    level: 'Advanced',
    duration: '22 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_3',
    title: 'Advanced Prompt Engineering Professional',
    slug: 'prompt-engineering',
    shortDescription: 'Master the art and science of instruction design for enterprise-grade LLM automation.',
    description: '<p>A course dedicated purely to the discipline of prompt engineering. This is not about simple questions; it is about structuring complex logical architectures to get deterministic results from generative engines.</p><h5>What you will learn:</h5><ul><li>Few-Shot Prompting, Chain-of-Thought (CoT), and Tree-of-Thoughts (ToT).</li><li>ReAct framework and implementing multi-agent tool calls.</li><li>Mitigating hallucinations, securing LLM inputs from prompt injections.</li><li>Automated prompt tuning and prompt chaining pipelines.</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    category: 'Engineering',
    instructor: 'Sarah Jenkins, Principal Prompt Architect',
    price: 999,
    originalPrice: 2999,
    subscriptionIncluded: true,
    published: true,
    featured: false,
    level: 'Intermediate',
    duration: '8 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_4',
    title: 'AI Tools for Business & Operations',
    slug: 'ai-tools-for-business',
    shortDescription: 'Integrate AI workflows into daily management, finance, content, and executive operations.',
    description: '<p>Supercharge your business operations. This course reviews how non-technical leaders and founders can deploy high-ROI AI tools to optimize client services, text production, and analytical reporting.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    category: 'Business',
    instructor: 'Marcus Sterling',
    price: 1999,
    originalPrice: 5999,
    subscriptionIncluded: false, // Individual Purchase Premium Course
    published: true,
    featured: true,
    level: 'Beginner',
    duration: '10 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_5',
    title: 'ChatGPT & Copilot Productivity Playbook',
    slug: 'chatgpt-productivity',
    shortDescription: 'Unlock extreme workspace efficiency using interactive Copilots, ChatGPT Custom GPTs, and scripting.',
    description: '<p>Maximize your hourly leverage. Learn how to write reports, draft coding snippets, summarize folders of papers, and plan projects in minutes instead of days.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    category: 'Productivity',
    instructor: 'Emily Zhao',
    price: 799,
    originalPrice: 1999,
    subscriptionIncluded: true,
    published: true,
    featured: false,
    level: 'Beginner',
    duration: '6 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_6',
    title: 'AI Automation & Multi-Agent Workflows',
    slug: 'ai-automation',
    shortDescription: 'Build autonomous visual and code workflows using Make.com, n8n, LangChain, and CrewAI.',
    description: '<p>Connect APIs and create autonomous workflows that do your daily job for you. Learn how to parse incoming emails, run analysis, write articles, and trigger Slack notifications fully in the background.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    category: 'Automation',
    instructor: 'Vikram Patel, DevOps & AI Solutions Architect',
    price: 2999,
    originalPrice: 9999,
    subscriptionIncluded: false, // Individual Purchase Premium Course
    published: true,
    featured: true,
    level: 'Advanced',
    duration: '18 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_7',
    title: 'Digital Marketing & Content Engine with AI',
    slug: 'digital-marketing-ai',
    shortDescription: 'Build a hyper-scaled SEO, copywriting, and ad creatives funnel using custom trained models.',
    description: '<p>Stop spending thousands on ad copies and agency retainers. Harness generative image and text models to build dynamic advertising engines that optimize landing page content and copy automatically.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=800&auto=format&fit=crop',
    category: 'Business',
    instructor: 'Chloe Fontaine',
    price: 1299,
    originalPrice: 3999,
    subscriptionIncluded: true,
    published: true,
    featured: false,
    level: 'Intermediate',
    duration: '11 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course_8',
    title: 'AI Video & Audio Content Creation',
    slug: 'ai-content-creation',
    shortDescription: 'Learn to direct, write, voice-over, and edit cinematic shorts and audiobooks using generative pipelines.',
    description: '<p>Unlock full multimedia synthesis. We show you how to generate audio voices using ElevenLabs, create animated videos using Runway Gen-2 and Sora, and piece them together into full-blown narratives.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop',
    category: 'Creativity',
    instructor: 'Sarah Jenkins',
    price: 1699,
    originalPrice: 4999,
    subscriptionIncluded: true,
    published: true,
    featured: false,
    level: 'Beginner',
    duration: '9 hours',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialSections: CourseSection[] = [
  // Sections for Course 1
  { id: 'sec_1_1', courseId: 'course_1', title: 'Course Overview & Introduction to Neural Nets', order: 1 },
  { id: 'sec_1_2', courseId: 'course_1', title: 'The Mathematics of Machine Learning', order: 2 },
  { id: 'sec_1_3', courseId: 'course_1', title: 'Building a Neural Network from Scratch in Python', order: 3 },
  // Sections for Course 2
  { id: 'sec_2_1', courseId: 'course_2', title: 'The Transformer Architecture Deep Dive', order: 1 },
  { id: 'sec_2_2', courseId: 'course_2', title: 'Fine-Tuning Large Language Models (LLMs)', order: 2 },
  { id: 'sec_2_3', courseId: 'course_2', title: 'Diffusion Models & Stable Diffusion Internals', order: 3 },
  // Sections for Course 3
  { id: 'sec_3_1', courseId: 'course_3', title: 'Foundational Directives & Context Windows', order: 1 },
  { id: 'sec_3_2', courseId: 'course_3', title: 'Advanced Reasoning & Multi-Step Logic', order: 2 },
  // Sections for Course 4
  { id: 'sec_4_1', courseId: 'course_4', title: 'Business Strategy meets GenAI', order: 1 },
  // Sections for Course 5
  { id: 'sec_5_1', courseId: 'course_5', title: 'Getting Started with Custom GPTs', order: 1 },
  // Sections for Course 6
  { id: 'sec_6_1', courseId: 'course_6', title: 'Multi-Agent Networks with CrewAI', order: 1 },
  // Sections for Course 7
  { id: 'sec_7_1', courseId: 'course_7', title: 'AI-Assisted SEO Content funnels', order: 1 },
  // Sections for Course 8
  { id: 'sec_8_1', courseId: 'course_8', title: 'Voice Cloning and Text-to-Speech Mastery', order: 1 }
];

const initialLessons: Lesson[] = [
  // Course 1, Section 1
  { id: 'les_1_1', sectionId: 'sec_1_1', title: 'Welcome to the AI Fundamentals Journey', description: 'Meet your instructor and learn the structure of the course.', videoId: 'dQw4w9WgXcQ', duration: '08:24', order: 1, isPreview: true },
  { id: 'les_1_2', sectionId: 'sec_1_1', title: 'History of AI: From Turing to Deep Learning', description: 'A fascinating history of how neural research rose from the ashes of AI winter.', videoId: 'dQw4w9WgXcQ', duration: '12:15', order: 2, isPreview: false },
  // Course 1, Section 2
  { id: 'les_1_3', sectionId: 'sec_1_2', title: 'Understanding Linear Regression & Gradient Descent', description: 'Learn the underlying derivative curves that drive optimization.', videoId: 'dQw4w9WgXcQ', duration: '22:40', order: 1, isPreview: false },
  { id: 'les_1_4', sectionId: 'sec_1_2', title: 'Backpropagation and Vector Calculus Made Simple', description: 'Step-by-step arithmetic for backwards passing of error weights.', videoId: 'dQw4w9WgXcQ', duration: '28:10', order: 2, isPreview: false },
  // Course 1, Section 3
  { id: 'les_1_5', sectionId: 'sec_1_3', title: 'Python Environment Configuration with Jupyter', description: 'Install python and launch a clean visual notebook.', videoId: 'dQw4w9WgXcQ', duration: '06:50', order: 1, isPreview: true },
  { id: 'les_1_6', sectionId: 'sec_1_3', title: 'Coding standard Forward Pass in Numpy', description: 'Writing dots, weights, and bias arrays from scratch.', videoId: 'dQw4w9WgXcQ', duration: '18:35', order: 2, isPreview: false },

  // Course 2, Section 1
  { id: 'les_2_1', sectionId: 'sec_2_1', title: 'The Attention Is All You Need Paper Explained', description: 'Deconstructing the monumental paper that changed everything.', videoId: 'dQw4w9WgXcQ', duration: '15:10', order: 1, isPreview: true },
  { id: 'les_2_2', sectionId: 'sec_2_1', title: 'Multi-Head Self-Attention Mathematics', description: 'Queries, Keys, and Values vector calculations.', videoId: 'dQw4w9WgXcQ', duration: '24:50', order: 2, isPreview: false },
  // Course 2, Section 2
  { id: 'les_2_3', sectionId: 'sec_2_2', title: 'Dataset Preparation for Llama Fine-Tuning', description: 'How to clean, format, and structure text datasets for training.', videoId: 'dQw4w9WgXcQ', duration: '19:15', order: 1, isPreview: false },
  { id: 'les_2_4', sectionId: 'sec_2_2', title: 'Training with PEFT, LoRA, and PyTorch', description: 'Run fine-tuning using minimum GPU VRAM configuration.', videoId: 'dQw4w9WgXcQ', duration: '34:10', order: 2, isPreview: false },
  // Course 2, Section 3
  { id: 'les_2_5', sectionId: 'sec_2_3', title: 'Anatomy of Stable Diffusion', description: 'How autoencoders, latent noise, and UNets combine to generate images.', videoId: 'dQw4w9WgXcQ', duration: '21:05', order: 1, isPreview: false },

  // Course 3, Section 1
  { id: 'les_3_1', sectionId: 'sec_3_1', title: 'Introduction to Prompt Frameworks', description: 'Learn standard prompt systems like CRISPE and CREATE.', videoId: 'dQw4w9WgXcQ', duration: '09:12', order: 1, isPreview: true },
  { id: 'les_3_2', sectionId: 'sec_3_1', title: 'System-Level vs. User-Level Messaging', description: 'Command variables, instruction guidelines, and delimiters.', videoId: 'dQw4w9WgXcQ', duration: '14:30', order: 2, isPreview: false },
  // Course 3, Section 2
  { id: 'les_3_3', sectionId: 'sec_3_2', title: 'Chain of Thought & Few-Shot Frameworks', description: 'Enforcing step-by-step logic and mathematical computations.', videoId: 'dQw4w9WgXcQ', duration: '18:50', order: 1, isPreview: false },

  // Course 4, Section 1
  { id: 'les_4_1', sectionId: 'sec_4_1', title: 'Deploying AI Tools in Enterprise Operations', description: 'Calculate ROI, build roadmap templates, and identify bottlenecks.', videoId: 'dQw4w9WgXcQ', duration: '16:45', order: 1, isPreview: true },

  // Course 5, Section 1
  { id: 'les_5_1', sectionId: 'sec_5_1', title: 'Building custom GPTs in ChatGPT', description: 'Configure custom instructions, knowledge uploads, and API connections.', videoId: 'dQw4w9WgXcQ', duration: '12:35', order: 1, isPreview: true },

  // Course 6, Section 1
  { id: 'les_6_1', sectionId: 'sec_6_1', title: 'Assembling your first AI Agent Crew', description: 'Defining roles, goals, and passing task objects autonomously.', videoId: 'dQw4w9WgXcQ', duration: '22:15', order: 1, isPreview: true },

  // Course 7, Section 1
  { id: 'les_7_1', sectionId: 'sec_7_1', title: 'SEO funnels using Claude and SEMRush', description: 'Creating organic traffic loops using fully formatted AI markdown posts.', videoId: 'dQw4w9WgXcQ', duration: '14:20', order: 1, isPreview: true },

  // Course 8, Section 1
  { id: 'les_8_1', sectionId: 'sec_8_1', title: 'Vocal Cloning with ElevenLabs API', description: 'Synthesizing voice models using custom audio uploads securely.', videoId: 'dQw4w9WgXcQ', duration: '10:55', order: 1, isPreview: true }
];

const initialReviews: CourseReview[] = [
  { id: 'rev_1', courseId: 'course_1', userId: 'usr_student', userName: 'John Doe', rating: 5, review: 'Absolutely mind-blowing course! Dr. Carter explains the mathematical equations with such precision that even someone like me without a heavy CS background could understand. Best LMS purchase yet!', createdAt: new Date().toISOString() },
  { id: 'rev_2', courseId: 'course_1', userId: 'usr_dummy_1', userName: 'Maria Santos', rating: 4.8, review: 'Very practical, and coding the neural net in Numpy from scratch made things finally click. Recommended!', createdAt: new Date().toISOString() },
  { id: 'rev_3', courseId: 'course_2', userId: 'usr_student', userName: 'John Doe', rating: 5, review: 'Advanced and deeply rewarding. The section on LoRA fine-tuning saved me weeks of researching papers on my own.', createdAt: new Date().toISOString() }
];

// Helper to write to database
function saveDB(db: DBStructure): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// Initial DB Setup
export function initDB(): DBStructure {
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const data = JSON.parse(content) as DBStructure;
      // Safeguard in case tables are missing
      if (!data.users) data.users = [];
      if (!data.courses) data.courses = initialCourses;
      if (!data.sections) data.sections = initialSections;
      if (!data.lessons) data.lessons = initialLessons;
      if (!data.enrollments) data.enrollments = [];
      if (!data.progress) data.progress = [];
      if (!data.subscriptions) data.subscriptions = [];
      if (!data.plans) data.plans = initialPlans;
      if (!data.payments) data.payments = [];
      if (!data.coupons) data.coupons = initialCoupons;
      if (!data.certificates) data.certificates = [];
      if (!data.notifications) data.notifications = [];
      if (!data.reviews) data.reviews = initialReviews;
      if (!data.wishlist) data.wishlist = [];
      return data;
    } catch (e) {
      console.error('Error loading existing db.json, recreating...', e);
    }
  }

  // Set up mock users
  const adminUser: User = {
    id: 'usr_admin',
    name: 'Admin Master',
    email: 'admin@digitalaiclass.com',
    phone: '9876543210',
    role: 'admin',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const studentUser: User = {
    id: 'usr_student',
    name: 'Jane Student',
    email: 'student@digitalaiclass.com',
    phone: '9123456780',
    role: 'student',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const db: DBStructure = {
    users: [adminUser, studentUser],
    courses: initialCourses,
    sections: initialSections,
    lessons: initialLessons,
    enrollments: [
      // Pre-enroll the demo student in course 1 as subscription based
      {
        id: 'enroll_1',
        userId: 'usr_student',
        courseId: 'course_1',
        purchaseType: 'subscription',
        purchasedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days expiry
      }
    ],
    progress: [
      {
        id: 'prog_1',
        userId: 'usr_student',
        lessonId: 'les_1_1',
        progressPercentage: 100,
        completed: true,
        lastWatchedAt: new Date().toISOString()
      },
      {
        id: 'prog_2',
        userId: 'usr_student',
        lessonId: 'les_1_2',
        progressPercentage: 45,
        completed: false,
        lastWatchedAt: new Date().toISOString()
      }
    ],
    subscriptions: [
      {
        id: 'sub_active_student',
        userId: 'usr_student',
        planId: 'sub_monthly',
        paymentProvider: 'Razorpay',
        providerSubscriptionId: 'sub_rzp_mock123',
        status: 'Active',
        startDate: new Date().toISOString(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      }
    ],
    plans: initialPlans,
    payments: [
      {
        id: 'pay_1',
        userId: 'usr_student',
        amount: 999,
        currency: 'INR',
        paymentProvider: 'Razorpay',
        providerPaymentId: 'pay_mock_999rzp',
        type: 'subscription',
        status: 'successful',
        createdAt: new Date().toISOString()
      }
    ],
    coupons: initialCoupons,
    certificates: [],
    notifications: [
      {
        id: 'notif_1',
        userId: 'usr_student',
        title: 'Welcome to Digital AI Class!',
        message: 'Explore courses, practice models, and start your certified AI professional journey.',
        type: 'success',
        read: false,
        createdAt: new Date().toISOString()
      }
    ],
    reviews: initialReviews,
    wishlist: []
  };

  saveDB(db);
  return db;
}

// Relational Operations
export const DB = {
  getUsers: () => {
    const db = initDB();
    return db.users;
  },

  addUser: (user: User) => {
    const db = initDB();
    db.users.push(user);
    saveDB(db);
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const db = initDB();
    const user = db.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, { ...updates, updatedAt: new Date().toISOString() });
      saveDB(db);
      return user;
    }
    return null;
  },

  getCourses: () => {
    const db = initDB();
    return db.courses;
  },

  addCourse: (course: Course) => {
    const db = initDB();
    db.courses.push(course);
    saveDB(db);
  },

  updateCourse: (id: string, updates: Partial<Course>) => {
    const db = initDB();
    const course = db.courses.find(c => c.id === id);
    if (course) {
      Object.assign(course, { ...updates, updatedAt: new Date().toISOString() });
      saveDB(db);
      return course;
    }
    return null;
  },

  deleteCourse: (id: string) => {
    const db = initDB();
    db.courses = db.courses.filter(c => c.id !== id);
    db.sections = db.sections.filter(s => s.courseId !== id);
    saveDB(db);
  },

  getSections: (courseId: string) => {
    const db = initDB();
    return db.sections
      .filter(s => s.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  },

  addSection: (section: CourseSection) => {
    const db = initDB();
    db.sections.push(section);
    saveDB(db);
    return section;
  },

  getLessons: (sectionId: string) => {
    const db = initDB();
    return db.lessons
      .filter(l => l.sectionId === sectionId)
      .sort((a, b) => a.order - b.order);
  },

  addLesson: (lesson: Lesson) => {
    const db = initDB();
    db.lessons.push(lesson);
    saveDB(db);
    return lesson;
  },

  getEnrollments: (userId: string) => {
    const db = initDB();
    return db.enrollments.filter(e => e.userId === userId);
  },

  addEnrollment: (enrollment: Enrollment) => {
    const db = initDB();
    // Prevent duplicates
    const exists = db.enrollments.find(e => e.userId === enrollment.userId && e.courseId === enrollment.courseId);
    if (!exists) {
      db.enrollments.push(enrollment);
      saveDB(db);
    }
  },

  removeEnrollment: (userId: string, courseId: string) => {
    const db = initDB();
    db.enrollments = db.enrollments.filter(e => !(e.userId === userId && e.courseId === courseId));
    saveDB(db);
  },

  getProgress: (userId: string) => {
    const db = initDB();
    return db.progress.filter(p => p.userId === userId);
  },

  updateProgress: (userId: string, lessonId: string, progressPercentage: number, completed: boolean) => {
    const db = initDB();
    let prog = db.progress.find(p => p.userId === userId && p.lessonId === lessonId);
    if (prog) {
      prog.progressPercentage = progressPercentage;
      prog.completed = completed || prog.completed;
      prog.lastWatchedAt = new Date().toISOString();
    } else {
      prog = {
        id: `prog_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        lessonId,
        progressPercentage,
        completed,
        lastWatchedAt: new Date().toISOString()
      };
      db.progress.push(prog);
    }
    saveDB(db);
    return prog;
  },

  getSubscription: (userId: string) => {
    const db = initDB();
    return db.subscriptions.find(s => s.userId === userId && s.status === 'Active') || null;
  },

  addSubscription: (subscription: Subscription) => {
    const db = initDB();
    // Deactivate previous active ones
    db.subscriptions = db.subscriptions.map(s => {
      if (s.userId === subscription.userId && s.status === 'Active') {
        s.status = 'Expired';
      }
      return s;
    });
    db.subscriptions.push(subscription);
    saveDB(db);
  },

  cancelSubscription: (userId: string) => {
    const db = initDB();
    const sub = db.subscriptions.find(s => s.userId === userId && s.status === 'Active');
    if (sub) {
      sub.cancelAtPeriodEnd = true;
      saveDB(db);
      return sub;
    }
    return null;
  },

  getPlans: () => {
    const db = initDB();
    return db.plans;
  },

  getPayments: (userId?: string) => {
    const db = initDB();
    if (userId) {
      return db.payments.filter(p => p.userId === userId);
    }
    return db.payments;
  },

  addPayment: (payment: Payment) => {
    const db = initDB();
    db.payments.push(payment);
    saveDB(db);
  },

  getCoupons: () => {
    const db = initDB();
    return db.coupons;
  },

  getCoupon: (code: string) => {
    const db = initDB();
    return db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active) || null;
  },

  addCoupon: (coupon: Coupon) => {
    const db = initDB();
    db.coupons.push(coupon);
    saveDB(db);
  },

  useCoupon: (code: string) => {
    const db = initDB();
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (coupon) {
      coupon.usedCount += 1;
      if (coupon.usedCount >= coupon.maxUses) {
        coupon.active = false;
      }
      saveDB(db);
    }
  },

  getCertificates: (userId?: string) => {
    const db = initDB();
    if (userId) {
      return db.certificates.filter(c => c.userId === userId);
    }
    return db.certificates;
  },

  addCertificate: (certificate: Certificate) => {
    const db = initDB();
    db.certificates.push(certificate);
    saveDB(db);
  },

  getNotifications: (userId: string) => {
    const db = initDB();
    return db.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNotification: (notification: Notification) => {
    const db = initDB();
    db.notifications.push(notification);
    saveDB(db);
  },

  markNotificationRead: (userId: string, notifId: string) => {
    const db = initDB();
    const notif = db.notifications.find(n => n.userId === userId && n.id === notifId);
    if (notif) {
      notif.read = true;
      saveDB(db);
    }
  },

  getReviews: (courseId: string) => {
    const db = initDB();
    return db.reviews.filter(r => r.courseId === courseId);
  },

  addReview: (review: CourseReview) => {
    const db = initDB();
    db.reviews.push(review);
    saveDB(db);
  },

  getWishlist: (userId: string) => {
    const db = initDB();
    return db.wishlist.filter(w => w.userId === userId);
  },

  toggleWishlist: (userId: string, courseId: string) => {
    const db = initDB();
    const index = db.wishlist.findIndex(w => w.userId === userId && w.courseId === courseId);
    let added = false;
    if (index > -1) {
      db.wishlist.splice(index, 1);
    } else {
      db.wishlist.push({
        id: `wish_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        courseId,
        createdAt: new Date().toISOString()
      });
      added = true;
    }
    saveDB(db);
    return added;
  }
};
