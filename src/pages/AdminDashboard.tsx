/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LayoutDashboard, BookOpen, User, CreditCard, 
  Tag, Plus, Trash, CheckCircle2 
} from 'lucide-react';
import { Course, User as UserType, Coupon, PaymentRecord } from '../types';
import AdminCurriculumEditor from '../components/AdminCurriculumEditor';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'courses' | 'students' | 'payments' | 'coupons'>('analytics');
  
  // Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<UserType[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Course Creator States
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Core AI');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(1499);
  const [newOriginalPrice, setNewOriginalPrice] = useState(4999);
  const [newInstructor, setNewInstructor] = useState('Dr. Arnab Sen');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newDuration, setNewDuration] = useState('6 hours');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=800');
  const [newSubIncluded, setNewSubIncluded] = useState(true);

  // Coupon Creator States
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(50);
  const [couponStatus, setCouponStatus] = useState('');

  // Status Alerts
  const [alertMsg, setAlertMsg] = useState('');

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}` };

  const loadAdminMetrics = async () => {
    try {
      const [cRes, uRes, pRes, cpRes] = await Promise.all([
        fetch('/api/admin/courses', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/payments', { headers }),
        fetch('/api/admin/coupons', { headers })
      ]);

      if (cRes.ok) setCourses(await cRes.json());
      if (uRes.ok) setStudents(await uRes.json());
      if (pRes.ok) setPayments(await pRes.json());
      if (cpRes.ok) setCoupons(await cpRes.json());
    } catch (e) {
      console.error('Error fetching admin workspace data:', e);
    }
  };

  useEffect(() => {
    loadAdminMetrics();
  }, [activeTab]);

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}`
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          shortDescription: newShortDesc,
          description: newDesc,
          price: Number(newPrice),
          originalPrice: Number(newOriginalPrice),
          instructor: newInstructor,
          level: newLevel,
          duration: newDuration,
          thumbnail: newThumbnail,
          subscriptionIncluded: newSubIncluded
        })
      });

      if (response.ok) {
        setAlertMsg('New Masterclass syllabus successfully injected into the library!');
        setTimeout(() => setAlertMsg(''), 3000);
        setShowAddCourse(false);
        setNewTitle('');
        setNewShortDesc('');
        setNewDesc('');
        loadAdminMetrics();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to inject course.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course and its sections?')) return;
    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setAlertMsg('Course successfully deleted.');
        setTimeout(() => setAlertMsg(''), 3000);
        loadAdminMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}`
        },
        body: JSON.stringify({
          code: newCouponCode.toUpperCase(),
          discountType: newCouponType,
          discountValue: Number(newCouponValue),
          minPurchaseAmount: 0
        })
      });

      if (response.ok) {
        setCouponStatus('Coupon issued!');
        setTimeout(() => setCouponStatus(''), 3000);
        setNewCouponCode('');
        loadAdminMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        loadAdminMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const activeSubsCount = students.filter(s => s.isSubscribed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAFCFA] text-[#17221B] min-h-screen font-sans" id="admin_control_desk">
      {editingCourseId && (
        <AdminCurriculumEditor 
          courseId={editingCourseId} 
          onClose={() => setEditingCourseId(null)} 
        />
      )}
      
      {/* Page Header */}
      <div className="mb-8 border-b border-[#E5ECE7] pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl sm:text-2xl font-black text-[#17221B] flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#79C99A]" />
            LMS Academic Director Desk
          </h1>
          <p className="text-xs text-[#66736B] mt-1 font-light">
            Monitor gross platform revenues, coordinate student registries, inject new masterclass lessons, and publish discount coupons.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded-xl border border-[#E5ECE7] bg-[#FAFCFA] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#17221B] hover:bg-[#F1F8F3] transition-all"
        >
          Student Hub
        </button>
      </div>

      {alertMsg && (
        <div className="mb-6 rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 p-4 text-xs font-bold text-green-850 flex items-center gap-2 uppercase tracking-wide">
          <CheckCircle2 className="h-4 w-4 text-[#79C99A]" />
          {alertMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5ECE7] pb-3 mb-8" id="admin_tabs">
        {[
          { id: 'analytics', name: 'Analytics Monitor', icon: <LayoutDashboard className="h-4 w-4" /> },
          { id: 'courses', name: 'Syllabus Manager', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'students', name: 'Student Directory', icon: <User className="h-4 w-4" /> },
          { id: 'payments', name: 'Global Ledger', icon: <CreditCard className="h-4 w-4" /> },
          { id: 'coupons', name: 'Coupons & Promos', icon: <Tag className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setShowAddCourse(false); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-[#79C99A] text-[#17221B] shadow-sm'
                : 'text-[#66736B] hover:bg-[#F1F8F3] hover:text-[#17221B]'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* WORKSPACE: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6" id="admin_analytics_tab">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: 'Gross Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, desc: 'Total transaction value' },
              { label: 'Active Subscribers', value: activeSubsCount, desc: 'Recurring monthly learners' },
              { label: 'Enrolled Students', value: students.length, desc: 'Registered platform profiles' },
              { label: 'Available Courses', value: courses.length, desc: 'Active masterclasses in catalog' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-[#E5ECE7] rounded-2xl p-5 shadow-sm space-y-1">
                <p className="text-[9px] font-black tracking-widest text-[#66736B] uppercase">{stat.label}</p>
                <p className="font-sans text-2xl font-black text-[#17221B]">{stat.value}</p>
                <p className="text-[10px] text-[#66736B] font-light">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales log visual summary */}
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Weekly Financial Progress</h3>
              <div className="h-44 flex items-end gap-3 pt-6 px-4">
                {[
                  { label: 'W1', value: '40%' },
                  { label: 'W2', value: '65%' },
                  { label: 'W3', value: '55%' },
                  { label: 'W4', value: '85%' },
                  { label: 'W5', value: '100%' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#79C99A] hover:opacity-80 rounded-t-lg transition-all duration-500" style={{ height: bar.value }} />
                    <span className="text-[9px] font-black tracking-widest uppercase text-[#66736B]">{bar.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#66736B] text-center uppercase tracking-wider font-bold">Sandbox financial records map progress flawlessly</p>
            </div>

            {/* Popular categories layout */}
            <div className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Subject Popularity</h3>
              <div className="space-y-4">
                {[
                  { name: 'Core AI & Neural Systems', ratio: 45, color: 'bg-[#79C99A]' },
                  { name: 'Generative Prompt Engineering', ratio: 30, color: 'bg-[#79C99A]/80' },
                  { name: 'Business Workflow Automation', ratio: 15, color: 'bg-[#79C99A]/60' },
                  { name: 'Creative UI Engineering', ratio: 10, color: 'bg-[#79C99A]/40' }
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-[#66736B]">
                      <span>{cat.name}</span>
                      <span className="text-[#17221B] font-bold">{cat.ratio}%</span>
                    </div>
                    <div className="w-full bg-[#FAFCFA] h-2 rounded-full overflow-hidden border border-[#E5ECE7]">
                      <div className={`h-full ${cat.color}`} style={{ width: `${cat.ratio}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fade-in" id="admin_courses_tab">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E5ECE7] shadow-sm">
            <p className="text-xs text-[#66736B]">
              Active Syllabus count: <strong className="text-[#17221B]">{courses.length}</strong> masterclasses
            </p>
            <button
              onClick={() => setShowAddCourse(!showAddCourse)}
              className="rounded-xl bg-[#79C99A] px-4 py-2 text-xs font-black text-[#17221B] uppercase tracking-widest transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {showAddCourse ? 'Close Creator' : 'Add New Course'}
            </button>
          </div>

          {/* Add Course Form Panel */}
          {showAddCourse && (
            <form onSubmit={handleAddCourseSubmit} className="bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm space-y-4 max-w-2xl text-[#17221B]">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Course Academic Syllabus Form</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Deep Reinforcement Learning"
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Academic Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  >
                    <option value="Core AI">Core AI</option>
                    <option value="Generative AI">Generative AI</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Automation">Automation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Short Catchy Summary</label>
                <input
                  type="text"
                  required
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                  placeholder="e.g., Master deep neural architectures through Python hands-on notebooks."
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Comprehensive Overview</label>
                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide deep curriculum objectives..."
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Original Price</label>
                  <input
                    type="number"
                    required
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Membership?</label>
                  <select
                    value={String(newSubIncluded)}
                    onChange={(e) => setNewSubIncluded(e.target.value === 'true')}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No (Buy Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Instructor Identity</label>
                  <input
                    type="text"
                    required
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Duration</label>
                  <input
                    type="text"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={newThumbnail}
                  onChange={(e) => setNewThumbnail(e.target.value)}
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#79C99A] text-[#17221B] px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
              >
                Inject Course to Database
              </button>
            </form>
          )}

          {/* Courses List Table */}
          <div className="bg-white border border-[#E5ECE7] rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left text-[#66736B] min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E5ECE7] bg-[#F1F8F3] text-[9px] uppercase font-black tracking-widest text-[#66736B]">
                  <th className="p-3">Course / Slug</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3 text-right">Coordinate Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[#FAFCFA]">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={course.thumbnail} alt={course.title} className="h-8 w-12 rounded object-cover shrink-0 border border-[#E5ECE7]" />
                        <div>
                          <strong className="text-[#17221B] block font-sans text-xs leading-snug">{course.title}</strong>
                          <span className="text-[10px] text-[#66736B] font-mono">{course.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-[#17221B]">{course.category}</td>
                    <td className="p-3 font-bold text-[#17221B]">₹{course.price.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        course.subscriptionIncluded 
                          ? 'bg-[#F1F8F3] text-green-800 border border-[#79C99A]/30' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {course.subscriptionIncluded ? 'Subscription' : 'Buy Only'}
                      </span>
                    </td>
                    <td className="p-3 text-[#66736B]">{course.instructor}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingCourseId(course.id)}
                        className="text-[#66736B] hover:text-[#79C99A] transition-colors p-1 mr-2"
                        title="Manage Curriculum"
                      >
                        <BookOpen className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-[#66736B] hover:text-red-600 transition-colors p-1"
                        title="Delete course"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WORKSPACE: STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white border border-[#E5ECE7] rounded-2xl shadow-sm overflow-hidden animate-fade-in" id="admin_students_tab">
          <table className="w-full text-xs text-left text-[#66736B] min-w-[500px]">
            <thead>
              <tr className="border-b border-[#E5ECE7] bg-[#F1F8F3] text-[9px] uppercase font-black tracking-widest text-[#66736B]">
                <th className="p-3">Student Profile</th>
                <th className="p-3">Contact Handset</th>
                <th className="p-3">Membership status</th>
                <th className="p-3">Global Role</th>
                <th className="p-3">Account State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECE7]">
              {students.map((stud) => (
                <tr key={stud.id} className="hover:bg-[#FAFCFA]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={stud.avatar} alt={stud.name} className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#E5ECE7]" />
                      <div>
                        <strong className="text-[#17221B] block font-semibold">{stud.name}</strong>
                        <span className="text-[10px] text-[#66736B] block">{stud.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-[#66736B] font-mono">{stud.phone || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${
                      stud.isSubscribed 
                        ? 'bg-[#F1F8F3] text-green-850 border border-[#79C99A]/30' 
                        : 'bg-[#FAFCFA] text-[#66736B] border border-[#E5ECE7]'
                    }`}>
                      {stud.isSubscribed ? 'Active Subscriber' : 'No Active Pass'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="capitalize font-semibold text-[#17221B]">{stud.role}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-green-800 font-bold text-[9px] uppercase tracking-widest">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WORKSPACE: PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="bg-white border border-[#E5ECE7] rounded-2xl shadow-sm overflow-hidden animate-fade-in" id="admin_payments_tab">
          <table className="w-full text-xs text-left text-[#66736B] min-w-[500px]">
            <thead>
              <tr className="border-b border-[#E5ECE7] bg-[#F1F8F3] text-[9px] uppercase font-black tracking-widest text-[#66736B]">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">User Student</th>
                <th className="p-3">Assigned Asset</th>
                <th className="p-3">Final Gross Amount</th>
                <th className="p-3">Gateway</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECE7]">
              {payments.map((p) => {
                const userObj = students.find(s => s.id === p.userId);
                const courseObj = courses.find(c => c.id === p.courseId);
                return (
                  <tr key={p.id} className="hover:bg-[#FAFCFA]">
                    <td className="p-3 font-mono text-[10px] font-bold text-[#17221B]">{p.id}</td>
                    <td className="p-3">
                      <div>
                        <strong className="text-[#17221B] block">{userObj?.name || 'Academic Student'}</strong>
                        <span className="text-[10px] text-[#66736B] font-mono block">{userObj?.email}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-[#17221B]">{courseObj?.title || p.planId || 'LMS Membership Access'}</td>
                    <td className="p-3 font-bold text-[#17221B]">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#FAFCFA] border border-[#E5ECE7] text-[#17221B] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {p.provider}
                      </span>
                    </td>
                    <td className="p-3 text-[#66736B] font-mono text-[10px]">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* WORKSPACE: COUPONS & PROMOS */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in" id="admin_coupons_tab">
          {/* Coupon Form */}
          <div className="md:col-span-4 bg-white border border-[#E5ECE7] rounded-3xl p-6 shadow-sm h-fit space-y-4">
            <h3 className="font-sans text-xs font-black uppercase tracking-widest text-[#17221B] border-b border-[#E5ECE7] pb-3">Issue New Coupon</h3>
            {couponStatus && (
              <div className="rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 p-3 text-xs text-green-800 font-bold uppercase tracking-wider">
                {couponStatus}
              </div>
            )}

            <form onSubmit={handleCreateCouponSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., BLACKFRIDAY"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] uppercase placeholder-[#66736B]/55"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Discount Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Flat INR (₹)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Discount Value</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#E5ECE7] px-3 py-2 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#79C99A] hover:opacity-90 py-3 text-xs font-black text-[#17221B] uppercase tracking-widest transition-all shadow-sm"
              >
                Issue Coupon Code
              </button>
            </form>
          </div>

          {/* Coupon Directory Table */}
          <div className="md:col-span-8 bg-white border border-[#E5ECE7] rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left text-[#66736B]">
              <thead>
                <tr className="border-b border-[#E5ECE7] bg-[#F1F8F3] text-[9px] uppercase font-black tracking-widest text-[#66736B]">
                  <th className="p-3">Coupon Code</th>
                  <th className="p-3">Discount Matrix</th>
                  <th className="p-3">Verification state</th>
                  <th className="p-3 text-right">Banish Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]">
                {coupons.map((cp) => (
                  <tr key={cp.id} className="hover:bg-[#FAFCFA]">
                    <td className="p-3 font-mono font-bold text-[#17221B]">{cp.code}</td>
                    <td className="p-3 font-semibold text-[#17221B]">
                      {cp.discountType === 'percentage' ? `${cp.discountValue}% Off` : `₹${cp.discountValue.toLocaleString('en-IN')} Flat Off`}
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#F1F8F3] text-green-800 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest border border-[#79C99A]/30">
                        Active Code
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(cp.id)}
                        className="text-[#66736B] hover:text-red-600 transition-colors p-1"
                        title="Delete coupon"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
