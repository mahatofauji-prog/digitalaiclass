/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Subscription from './pages/Subscription';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CoursePlayer from './components/CoursePlayer';

// Types
import { User, Course, Notification } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentExtra, setCurrentExtra] = useState<any>(null);
  
  // Data State
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<(Course & { rating?: number; reviewsCount?: number; studentCount?: number })[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Sync session on Mount
  const fetchSession = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        setWishlistCount(data.user.wishlist?.length || 0);
      } else {
        localStorage.removeItem('session_token');
        setUser(null);
      }
    } catch (e) {
      console.error('Session sync error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch general Courses catalog
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && data.courses) {
          setCourses(data.courses);
        }
      }
    } catch (e) {
      console.error('Courses fetch error:', e);
    }
  };

  // Fetch notices
  const fetchNotifications = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) return;
    try {
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, currentView]);

  const handleNavigate = (view: string, extra: any = null) => {
    setCurrentView(view);
    setCurrentExtra(extra);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (authenticatedUser: User, token: string) => {
    localStorage.setItem('session_token', token);
    setUser(authenticatedUser);
    setWishlistCount(authenticatedUser.wishlist?.length || 0);
    handleNavigate('dashboard', { tab: 'overview' });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}` }
      });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
      setNotifications([]);
      setWishlistCount(0);
      handleNavigate('home');
    }
  };

  const handleToggleRole = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/toggle-role', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        alert(`Simulator Role switched to: ${data.user.role === 'admin' ? 'Academic Admin' : 'Student'}`);
        if (data.user.role === 'admin') {
          handleNavigate('admin-dashboard');
        } else {
          handleNavigate('dashboard', { tab: 'overview' });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnrollIndividual = async (courseId: string, finalAmount: number, couponCode?: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, amount: finalAmount, couponCode })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Class registration transaction approved! You now have permanent lifetime access.');
        fetchSession();
        handleNavigate('dashboard', { tab: 'my-courses' });
      } else {
        alert(data.error || 'Checkout transaction failed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubscribe = async (planId: string, paymentProvider: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId, paymentProvider })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Premium membership activated! All subscription-inclusive courses are now fully unlocked.');
        fetchSession();
        handleNavigate('dashboard', { tab: 'overview' });
      } else {
        alert(data.error || 'Subscription registration failed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/enrollments/cancel/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Simulator unenroll approved.');
        fetchSession();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveWishlist = async (courseId: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/wishlist`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ courseId })
      });
      if (response.ok) {
        fetchSession();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelSub = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    if (!window.confirm('Are you sure you want to cancel your recurring membership pass?')) return;

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Your recurring membership renewal has been canceled.');
        fetchSession();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (name: string, phone: string, avatar: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, avatar })
      });
      if (response.ok) {
        fetchSession();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#050505] space-y-4" id="app_bootstrap_loading">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-sans">Digital AI Class</span>
      </div>
    );
  }

  // Get student enrollments IDs to highlight matching list icons
  const userEnrollments = user ? (user.enrollments || []).map(e => e.courseId) : [];

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden flex-col bg-[#050505] text-white font-sans leading-normal selection:bg-indigo-600 selection:text-white" id="lms_root">
      
      {/* Universal Navbar */}
      <Navbar
        user={user}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onToggleRole={handleToggleRole}
        wishlistCount={wishlistCount}
      />

      {/* View Switch Router Engine */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <Home 
            courses={courses} 
            onNavigate={handleNavigate} 
            userEnrollments={userEnrollments} 
            user={user}
          />
        )}
        {currentView === 'courses' && (
          <Courses 
            courses={courses} 
            onNavigate={handleNavigate} 
            userEnrollments={userEnrollments} 
          />
        )}
        {currentView === 'course-details' && (
          <CourseDetails
            slug={currentExtra?.slug || ''}
            onNavigate={handleNavigate}
            isLoggedIn={!!user}
            isSubscribed={user?.isSubscribed || false}
            isEnrolled={userEnrollments.includes(courses.find(c => c.slug === currentExtra?.slug)?.id || '')}
            
          />
        )}
        {currentView === 'subscription' && (
          <Subscription
            onNavigate={handleNavigate}
            isLoggedIn={!!user}
            onSubscribe={handleSubscribe}
            activePlanId={user?.isSubscribed ? 'sub_monthly' : undefined} // demo mapping
          />
        )}
        {currentView === 'about' && <About />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'faq' && <FAQ />}
        
        {(currentView === 'login' || currentView === 'signup') && (
          <Auth
            initialView={currentView}
            onAuthSuccess={handleAuthSuccess}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'dashboard' && user && (
          <Dashboard
            user={user}
            courses={courses}
            initialTab={currentExtra?.tab || 'overview'}
            onNavigate={handleNavigate}
            onUnenroll={handleUnenroll}
            onRemoveWishlist={handleRemoveWishlist}
            onCancelSub={handleCancelSub}
            onUpdateProfile={handleUpdateProfile}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        )}
        
        {currentView === 'admin-dashboard' && user?.role === 'admin' && (
          <AdminDashboard 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'course-player' && user && (
          <CoursePlayer
            courseId={currentExtra?.courseId || ''}
            initialLessonId={currentExtra?.activeLessonId}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
