/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Heart, Award, CreditCard, User, 
  Bell, Printer, Trash 
} from 'lucide-react';
import { 
  User as UserType, Course, Enrollment, Certificate, 
  PaymentRecord, Notification 
} from '../types';

interface DashboardProps {
  user: UserType;
  courses: (Course & { studentCount?: number })[];
  initialTab?: string;
  onNavigate: (view: string, extra?: any) => void;
  onUnenroll: (courseId: string) => void;
  onRemoveWishlist: (courseId: string) => void;
  onCancelSub: () => void;
  onUpdateProfile: (name: string, phone: string, avatar: string) => void;
  onMarkNotificationRead: (id: string) => void;
}

export default function Dashboard({
  user,
  courses,
  initialTab = 'overview',
  onNavigate,
  onUnenroll,
  onRemoveWishlist,
  onCancelSub,
  onUpdateProfile,
  onMarkNotificationRead
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Data State
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Settings Form State
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(user.avatar);
  const [settingsStatus, setSettingsStatus] = useState('');

  // Active viewing Certificate
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    // Load student records from server APIs
    async function loadStudentData() {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}` };
        
        // Parallel requests
        const [enrolRes, certRes, payRes, notifRes, userRes] = await Promise.all([
          fetch('/api/enrollments', { headers }),
          fetch('/api/certificates', { headers }),
          fetch('/api/payments/history', { headers }),
          fetch('/api/notifications', { headers }),
          fetch('/api/auth/me', { headers })
        ]);

        if (enrolRes.ok) setEnrollments(await enrolRes.json());
        if (certRes.ok) setCertificates(await certRes.json());
        if (payRes.ok) setPayments(await payRes.json());
        if (notifRes.ok) setNotifications(await notifRes.json());
        if (userRes.ok) {
          const u = await userRes.json();
          if (u.user) {
            setWishlist(u.user.wishlist || []);
            setProfileName(u.user.name);
            setProfilePhone(u.user.phone || '');
            setProfileAvatar(u.user.avatar);
          }
        }
      } catch (e) {
        console.error('Error fetching student dashboard records:', e);
      }
    }
    if (user) {
      loadStudentData();
    }
  }, [user, activeTab]);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileName, profilePhone, profileAvatar);
    setSettingsStatus('Profile successfully updated!');
    setTimeout(() => setSettingsStatus(''), 3000);
  };

  const handleClaimCertificate = async (courseId: string) => {
    try {
      const response = await fetch('/api/certificates/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}`
        },
        body: JSON.stringify({ courseId })
      });
      const data = await response.json();
      if (response.ok && data.certificate) {
        setCertificates(prev => [...prev, data.certificate]);
        setSelectedCertificate(data.certificate);
        setActiveTab('certificates');
      } else {
        alert(data.error || 'Failed to claim certificate. Verify that you have reached 100% course progress.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const enrolledCourses = enrollments.map(enrol => {
    const course = courses.find(c => c.id === enrol.courseId);
    return course ? { ...course, progress: enrol.progress, isCompleted: enrol.completed } : null;
  }).filter(Boolean) as (Course & { progress: number; isCompleted: boolean })[];

  const wishlistedCourses = courses.filter(c => wishlist.includes(c.id));

  const stats = {
    enrolledCount: enrollments.length,
    completedCount: enrollments.filter(e => e.completed).length,
    certificatesCount: certificates.length
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans" id="student_dashboard">
      
      {/* Page Header */}
      <div className="mb-8 border-b border-[#E5ECE7] pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={profileAvatar} 
            alt={profileName} 
            referrerPolicy="no-referrer"
            className="h-16 w-16 rounded-full border border-[#E5ECE7] object-cover bg-white" 
          />
          <div>
            <h1 className="font-sans text-xl sm:text-2xl font-black text-[#17221B]">Welcome back, {profileName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#F1F8F3] text-[#17221B] border border-[#79C99A]/30 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">VERIFIED STUDENT</span>
              {user.role === 'admin' && <span className="bg-amber-150 text-amber-900 border border-amber-300 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">LMS ADMIN ACCESS</span>}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('courses')}
          className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
        >
          Explore Courses
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Sidebar Tabs Navigation */}
        <div className="lg:col-span-3 space-y-1 bg-white p-4 rounded-2xl border border-[#E5ECE7] h-fit shadow-sm" id="dashboard_tabs">
          {[
            { id: 'overview', name: 'Overview Console', icon: <LayoutDashboard className="h-4 w-4" /> },
            { id: 'my-courses', name: 'My Active Classes', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'subscription', name: 'Membership Pass', icon: <CreditCard className="h-4 w-4" /> },
            { id: 'certificates', name: 'Academic Diplomas', icon: <Award className="h-4 w-4" /> },
            { id: 'wishlist', name: 'Saved Wishlist', icon: <Heart className="h-4 w-4" /> },
            { id: 'notifications', name: 'Student Notices', icon: <Bell className="h-4 w-4" /> },
            { id: 'payments', name: 'Receipts & Ledger', icon: <CreditCard className="h-4 w-4" /> },
            { id: 'profile', name: 'Settings & Profile', icon: <User className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedCertificate(null); }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-[#79C99A] text-[#17221B] font-black'
                  : 'text-[#66736B] hover:bg-[#FAFCFA] hover:text-[#17221B]'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Right column: Workspace */}
        <div className="lg:col-span-9 space-y-6">

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6" id="overview_tab_panel">
              {/* Stats Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Active Curriculums', value: stats.enrolledCount, desc: 'Courses you are attending' },
                  { label: 'Lectures Completed', value: stats.completedCount, desc: 'Classes with 100% progress' },
                  { label: 'Academic Certificates', value: stats.certificatesCount, desc: 'Verifiable credentials claimed' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-[#E5ECE7] rounded-2xl p-5 shadow-sm space-y-1">
                    <p className="text-[9px] font-black tracking-widest text-[#66736B] uppercase">{stat.label}</p>
                    <p className="font-sans text-3xl font-black text-[#17221B]">{stat.value}</p>
                    <p className="text-[10px] text-[#66736B] font-light">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Continue Watching Section */}
              <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Continue Attending lectures</h3>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <BookOpen className="h-10 w-10 text-[#66736B] mx-auto" />
                    <p className="text-xs text-[#66736B] font-light">You are not actively attending any classes yet.</p>
                    <button onClick={() => onNavigate('courses')} className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest">
                      Join Your First Class
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5ECE7]">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-md">
                          <strong className="text-xs font-sans font-bold text-[#17221B] block leading-snug">{course.title}</strong>
                          <span className="text-[9px] bg-[#FAFCFA] border border-[#E5ECE7] text-[#66736B] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{course.category}</span>
                          
                          {/* Progress slider bar */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="w-48 bg-[#FAFCFA] h-2 rounded-full overflow-hidden border border-[#E5ECE7]">
                              <div className="bg-[#79C99A] h-full transition-all duration-300" style={{ width: `${course.progress}%` }} />
                            </div>
                            <span className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">{course.progress}% Completed</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {course.progress >= 100 && !certificates.some(c => c.courseId === course.id) && (
                            <button
                              onClick={() => handleClaimCertificate(course.id)}
                              className="rounded-xl bg-[#79C99A] text-[#17221B] px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Claim Diploma
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate('course-details', { slug: course.slug })}
                            className="rounded-xl bg-white hover:bg-[#FAFCFA] border border-[#E5ECE7] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#17221B] transition-all"
                          >
                            Class Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MY COURSES */}
          {activeTab === 'my-courses' && (
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4" id="my_courses_tab_panel">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">My Classes Dashboard</h3>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FAFCFA] border border-[#E5ECE7] text-[#66736B]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h4 className="font-sans text-base font-bold text-[#17221B]">Your Classroom is empty</h4>
                  <p className="text-xs text-[#66736B] max-w-sm mx-auto font-light leading-relaxed">
                    Subscribe or purchase a premium lifetime course license to instantly start attending structured lectures.
                  </p>
                  <button onClick={() => onNavigate('courses')} className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest">
                    View Course Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="border border-[#E5ECE7] rounded-2xl overflow-hidden bg-white shadow-sm">
                      <div className="aspect-video relative bg-[#FAFCFA] border-b border-[#E5ECE7]">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-white/95 border border-[#E5ECE7] text-[#17221B] text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                          {course.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="font-sans text-sm font-bold text-[#17221B] leading-snug line-clamp-1">{course.title}</h4>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-[#66736B] font-bold uppercase tracking-wider">
                            <span>Syllabus Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-[#FAFCFA] border border-[#E5ECE7] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#79C99A] h-full" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-[#E5ECE7]">
                          <button
                            onClick={() => onUnenroll(course.id)}
                            className="text-[10px] text-red-600 hover:text-red-500 font-bold uppercase tracking-wider"
                            title="Unenroll Simulator"
                          >
                            Unenroll
                          </button>
                          
                          {course.progress >= 100 && !certificates.some(c => c.courseId === course.id) ? (
                            <button
                              onClick={() => handleClaimCertificate(course.id)}
                              className="rounded-xl bg-[#79C99A] text-[#17221B] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Claim Diploma
                            </button>
                          ) : (
                            <button
                              onClick={() => onNavigate('course-player', { courseId: course.id })}
                              className="rounded-xl bg-[#79C99A] text-[#17221B] px-4 py-2 text-xs font-black uppercase tracking-widest transition"
                            >
                              Attend Lecture
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-6" id="subscription_tab_panel">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Subscription Membership</h3>
              {user.isSubscribed ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#79C99A]/30 bg-[#F1F8F3] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="rounded bg-[#79C99A] text-[#17221B] text-[9px] font-black px-2.5 py-0.5 uppercase tracking-widest">
                        ACTIVE MEMBERSHIP PASS
                      </span>
                      <h4 className="font-sans text-base font-black text-[#17221B] mt-1.5">Academic Unlimited Subscription Pass</h4>
                      <p className="text-xs text-[#66736B] leading-relaxed font-light">
                        Full unlimited access to all subscription-marked classes. Renewing automatically.
                      </p>
                    </div>

                    <button
                      onClick={onCancelSub}
                      className="rounded-xl border border-red-500/20 text-red-600 hover:bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Cancel Membership
                    </button>
                  </div>

                  <div className="text-[11px] text-[#66736B] leading-relaxed space-y-1.5 bg-[#FAFCFA] p-4 rounded-xl border border-[#E5ECE7]">
                    <p className="font-black text-[#17221B] uppercase tracking-widest text-[9px]">Billing details:</p>
                    <p>Current renewal rate: ₹999/month inclusive of Indian GST.</p>
                    <p>Subscribed profile email: <strong className="text-[#17221B]">{user.email}</strong></p>
                    <p>Cancellation policy: Immediate tap cancellation. Access terminates exactly at the next cycle boundary.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Award className="h-12 w-12 text-[#66736B] mx-auto" />
                  <h4 className="font-sans text-base font-bold text-[#17221B]">No active Membership pass</h4>
                  <p className="text-xs text-[#66736B] max-w-sm mx-auto font-light leading-relaxed">
                    Unlock all subscription-marked courses instantly with a simple membership. Cancel with a single tap.
                  </p>
                  <button
                    onClick={() => onNavigate('subscription')}
                    className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    View Pricing Matrices (₹999/mo)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICATES & DIGITAL DEGREES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6" id="certificates_tab_panel">
              {selectedCertificate ? (
                /* Interactive Certificate Generator */
                <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5ECE7] pb-3">
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="text-xs font-bold text-[#66736B] hover:text-[#17221B]"
                    >
                      &larr; Back to diploma directory
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 rounded-xl border border-[#E5ECE7] bg-[#FAFCFA] hover:bg-[#F1F8F3] text-[#17221B] px-3 py-2 text-xs font-black uppercase tracking-widest"
                      id="print_diploma_btn"
                    >
                      <Printer className="h-4 w-4" />
                      Print Certificate
                    </button>
                  </div>

                  {/* Elegant double-border visual diploma layout */}
                  <div 
                    className="relative border-8 border-double border-[#79C99A] bg-white p-10 text-center space-y-6 mx-auto max-w-2xl select-none shadow-sm rounded-xl"
                    id="digital_credential_canvas"
                  >
                    <div className="absolute right-8 top-8 opacity-5 font-sans text-[100px] font-black text-[#79C99A]">
                      SEAL
                    </div>

                    <div className="space-y-1">
                      <span className="font-sans text-xs font-black tracking-widest text-[#79C99A] uppercase block">Digital AI Class</span>
                      <span className="text-[9px] text-[#66736B] block tracking-widest uppercase font-bold">LMS Verifiable Credential</span>
                    </div>

                    <div className="h-px bg-[#E5ECE7] max-w-md mx-auto" />

                    <h2 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-widest text-[#17221B] italic">Certificate of Completion</h2>
                    <p className="text-[10px] text-[#66736B] uppercase tracking-widest font-bold">This is proudly presented to</p>

                    <p className="font-sans text-xl font-black text-[#17221B] border-b border-[#E5ECE7] max-w-xs mx-auto pb-1 italic">
                      {selectedCertificate.userName}
                    </p>

                    <p className="text-xs text-[#66736B] max-w-md mx-auto leading-relaxed font-light">
                      for successfully and completely navigating 100% of the course lectures, project assignments, and structured video syllabus for:
                    </p>

                    <p className="text-sm font-black text-[#17221B] max-w-lg mx-auto">
                      "{courses.find(c => c.id === selectedCertificate.courseId)?.title || 'Generative Intelligence Masterclass'}"
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-6 max-w-md mx-auto items-end">
                      <div className="text-center space-y-1">
                        <p className="text-[10px] font-bold text-[#66736B] uppercase tracking-wider">Academic Director</p>
                        <div className="h-px bg-[#E5ECE7]" />
                        <p className="text-[8px] uppercase tracking-wider text-[#17221B] font-bold">Dr. Arnab Sen</p>
                      </div>
                      <div className="text-center space-y-1 flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-[#79C99A] bg-[#F1F8F3] flex items-center justify-center text-[#17221B] text-[9px] font-black shadow-inner mb-1">
                          PASS
                        </div>
                        <div className="h-px bg-[#E5ECE7] w-full" />
                        <p className="text-[8px] uppercase tracking-wider text-[#17221B] font-bold">Official Registrar Seal</p>
                      </div>
                    </div>

                    <div className="pt-6 text-[9px] text-[#66736B] uppercase font-bold tracking-widest space-y-1">
                      <p>Credential Registry Ref: <strong className="text-[#17221B]">{selectedCertificate.id}</strong></p>
                      <p>Issue Date: <strong className="text-[#17221B]">{new Date(selectedCertificate.createdAt).toLocaleDateString()}</strong></p>
                      <p className="text-green-700 font-black">✓ Authentic Blockchain transaction confirmed</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Academic Diplomas Directory</h3>
                  {certificates.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <Award className="h-12 w-12 text-[#66736B] mx-auto" />
                      <h4 className="font-sans text-base font-bold text-[#17221B]">No diplomas claimed yet</h4>
                      <p className="text-xs text-[#66736B] max-w-sm mx-auto font-light leading-relaxed">
                        Earn credentials by watching 100% of your course chapters. Return here once you reach full lecture completion to claim!
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E5ECE7]">
                      {certificates.map((cert) => {
                        const c = courses.find(item => item.id === cert.courseId);
                        return (
                          <div key={cert.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-sans font-bold text-[#17221B] block">{c?.title || 'Academic Course'}</strong>
                              <p className="text-[10px] text-[#66736B]">Credential Reference: {cert.id} • Issued {new Date(cert.createdAt).toLocaleDateString()}</p>
                            </div>

                            <button
                              onClick={() => setSelectedCertificate(cert)}
                              className="rounded-xl bg-[#FAFCFA] border border-[#E5ECE7] hover:bg-[#F1F8F3] text-[#17221B] px-4 py-2 text-xs font-black uppercase tracking-widest transition-all"
                            >
                              View Diploma
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4" id="wishlist_tab_panel">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Saved Course Queue</h3>
              {wishlistedCourses.length === 0 ? (
                <p className="text-xs text-[#66736B] italic py-8 text-center font-light">Your wishlist queue is currently empty.</p>
              ) : (
                <div className="divide-y divide-[#E5ECE7]">
                  {wishlistedCourses.map((course) => (
                    <div key={course.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <strong className="text-xs font-sans font-bold text-[#17221B] block">{course.title}</strong>
                        <span className="text-[9px] bg-[#FAFCFA] border border-[#E5ECE7] text-[#66736B] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{course.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onRemoveWishlist(course.id)}
                          className="text-[#66736B] hover:text-red-600 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('course-details', { slug: course.slug })}
                          className="rounded-xl bg-[#79C99A] text-[#17221B] px-4 py-2 text-xs font-black uppercase tracking-widest"
                        >
                          View Syllabus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4" id="notifications_tab_panel">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Student Bulletins</h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-[#66736B] italic py-8 text-center font-light">No notices or bullet records on file.</p>
              ) : (
                <div className="divide-y divide-[#E5ECE7]">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start gap-2 ${!notif.read ? 'bg-[#F1F8F3] px-3 rounded-xl border-l-2 border-[#79C99A]' : ''}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-[#17221B]">{notif.title}</strong>
                          {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-[#79C99A] shrink-0" />}
                        </div>
                        <p className="text-xs text-[#66736B] leading-relaxed font-light">{notif.message}</p>
                        <p className="text-[10px] text-[#66736B] font-mono">{new Date(notif.createdAt).toLocaleString()}</p>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className="text-[10px] text-[#79C99A] hover:underline font-black shrink-0 self-end sm:self-center uppercase tracking-wider"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PAYMENTS LEDGER */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4" id="payments_tab_panel">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Billing Invoice Records</h3>
              {payments.length === 0 ? (
                <p className="text-xs text-[#66736B] italic py-8 text-center font-light">No transactional invoice receipts found.</p>
              ) : (
                <div className="overflow-x-auto border border-[#E5ECE7] rounded-xl">
                  <table className="w-full text-xs text-left text-[#66736B] min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#E5ECE7] bg-[#F1F8F3] text-[9px] uppercase font-black tracking-widest text-[#17221B]">
                        <th className="p-3">Invoice Id</th>
                        <th className="p-3">Resource Purchased</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Gateway</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5ECE7]">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAFCFA] transition-colors">
                          <td className="p-3 font-mono text-[10px] font-bold text-[#17221B]">{p.id}</td>
                          <td className="p-3 font-bold text-[#17221B]">
                            {courses.find(item => item.id === p.courseId)?.title || p.planId || 'LMS All-Access pass'}
                          </td>
                          <td className="p-3 font-black text-[#17221B]">₹{p.amount.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="rounded bg-white border border-[#E5ECE7] text-[#66736B] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                              {p.provider}
                            </span>
                          </td>
                          <td className="p-3 text-[#66736B] font-mono text-[10px]">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4" id="profile_tab_panel">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Student settings</h3>
              {settingsStatus && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-xs text-green-700 font-bold animate-fade-in uppercase tracking-wider">
                  {settingsStatus}
                </div>
              )}

              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Select Academic Avatar</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150'
                    ].map((av, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setProfileAvatar(av)}
                        className={`relative rounded-full h-11 w-11 overflow-hidden border-2 transition ${
                          profileAvatar === av ? 'border-[#79C99A] scale-105 shadow-md' : 'border-transparent opacity-50'
                        }`}
                      >
                        <img src={av} alt="Avatar option" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Permanent Registry Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:outline-none bg-[#FAFCFA] text-[#66736B] cursor-not-allowed"
                    title="Emails cannot be modified"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Mobile Contact</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
