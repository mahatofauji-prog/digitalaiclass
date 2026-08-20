/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, User, LogOut, LayoutDashboard, Shield, Bell, Heart, Menu, X, Search } from 'lucide-react';
import { User as UserType, Notification } from '../types';

interface NavbarProps {
  user: UserType | null;
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onToggleRole: () => void;
  wishlistCount: number;
}

export default function Navbar({
  user,
  currentView,
  onNavigate,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onToggleRole,
  wishlistCount
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleNotifClick = (n: Notification) => {
    onMarkNotificationRead(n.id);
    setIsNotifOpen(false);
    onNavigate('dashboard', { tab: 'notifications' });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E5ECE7] bg-white/95 backdrop-blur-md" id="app_navbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-shrink-0 items-center gap-2.5 font-sans text-base sm:text-lg font-black tracking-tight text-[#17221B] focus:outline-none transition-all min-w-0"
              id="brand_logo_btn"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#79C99A] text-[#17221B] font-extrabold">
                A
              </div>
              <span className="hidden sm:inline font-sans font-black tracking-tight text-[#17221B] truncate">Digital AI Class</span>
            </button>
            
            {/* Desktop Center Navigation */}
            <div className="hidden md:flex space-x-5">
              {[
                { name: 'Home', view: 'home' },
                { name: 'Courses', view: 'courses' },
                { name: 'Subscription', view: 'subscription' },
                { name: 'About', view: 'about' },
                { name: 'Contact', view: 'contact' },
                { name: 'FAQ', view: 'faq' }
              ].map((link) => (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none h-16 ${
                    currentView === link.view
                      ? 'border-[#79C99A] text-[#17221B]'
                      : 'border-transparent text-[#66736B] hover:text-[#17221B] hover:border-[#79C99A]/50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Area */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Role Switcher */}
            {user && (
              <div className="hidden lg:flex items-center gap-1 bg-[#F1F8F3] p-1 rounded-lg border border-[#E5ECE7]">
                <button
                  onClick={onToggleRole}
                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold transition-all ${
                    user.role === 'admin'
                      ? 'bg-[#79C99A] text-[#17221B]'
                      : 'text-[#66736B] hover:text-[#17221B]'
                  }`}
                  title="Toggle Admin/Student simulator"
                  id="navbar_role_toggle"
                >
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="h-3 w-3 text-[#17221B]" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      Student
                    </>
                  )}
                </button>
              </div>
            )}

            {user ? (
              <>
                {/* Wishlist Link */}
                <button
                  onClick={() => onNavigate('dashboard', { tab: 'wishlist' })}
                  className="relative p-2 text-[#66736B] hover:text-[#17221B] transition-colors"
                  id="navbar_wishlist_btn"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#79C99A] text-[9px] font-black text-[#17221B]">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Notifications Panel */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 text-[#66736B] hover:text-[#17221B] transition-colors focus:outline-none"
                    id="navbar_notif_btn"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#79C99A] ring-2 ring-white" />
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#E5ECE7] bg-white p-2 shadow-xl z-50">
                      <div className="flex items-center justify-between border-b border-[#E5ECE7] px-3 py-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736B]">Notifications</span>
                        <button 
                          onClick={() => {
                            setIsNotifOpen(false);
                            onNavigate('dashboard', { tab: 'notifications' });
                          }}
                          className="text-xs font-bold text-[#79C99A] hover:opacity-80"
                        >
                          View all
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#66736B]">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => handleNotifClick(n)}
                              className={`w-full text-left rounded-lg p-2.5 transition hover:bg-[#F1F8F3] flex flex-col gap-0.5 ${
                                !n.read ? 'bg-[#F1F8F3] font-medium' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#17221B]">{n.title}</span>
                                <span className="text-[9px] text-[#66736B]">{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-[#66736B] line-clamp-2">{n.message}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full p-1 hover:bg-[#F1F8F3] transition-colors focus:outline-none"
                    id="navbar_profile_btn"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full border border-[#E5ECE7] bg-[#F1F8F3] object-cover"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-[#E5ECE7] bg-white p-1.5 shadow-2xl z-50">
                      <div className="px-3 py-2 border-b border-[#E5ECE7]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#66736B]">Signed in as</p>
                        <p className="text-xs font-bold text-[#17221B] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#66736B] truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigate('dashboard', { tab: 'overview' });
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#66736B] hover:bg-[#F1F8F3] hover:text-[#17221B]"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#79C99A]" />
                          Dashboard
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              onNavigate('admin-dashboard');
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#17221B] bg-[#F1F8F3] hover:bg-[#79C99A]/20"
                          >
                            <Shield className="h-4 w-4 text-[#79C99A]" />
                            Admin Panel
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigate('dashboard', { tab: 'profile' });
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#66736B] hover:bg-[#F1F8F3] hover:text-[#17221B]"
                        >
                          <User className="h-4 w-4 text-[#79C99A]" />
                          My Profile
                        </button>
                        <div className="h-px bg-[#E5ECE7] my-1" />
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onLogout();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="rounded-lg px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#66736B] hover:text-[#17221B] transition-colors"
                  id="navbar_login_btn"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="rounded-lg bg-[#79C99A] text-[#17221B] px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all shadow-sm"
                  id="navbar_signup_btn"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="inline sm:hidden">Start</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#66736B] hover:text-[#17221B] md:hidden"
              id="navbar_mobile_toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#E5ECE7] bg-white px-2 py-3 space-y-1 shadow-lg">
          {[
            { name: 'Home', view: 'home' },
            { name: 'Courses', view: 'courses' },
            { name: 'Subscription', view: 'subscription' },
            { name: 'About', view: 'about' },
            { name: 'Contact', view: 'contact' },
            { name: 'FAQ', view: 'faq' }
          ].map((link) => (
            <button
              key={link.view}
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate(link.view);
              }}
              className={`block w-full text-left rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                currentView === link.view
                  ? 'bg-[#F1F8F3] text-[#17221B]'
                  : 'text-[#66736B] hover:bg-[#F1F8F3] hover:text-[#17221B]'
              }`}
            >
              {link.name}
            </button>
          ))}
          {user && (
            <div className="border-t border-[#E5ECE7] pt-3 mt-3 px-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#66736B]">Simulation Role</span>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleRole();
                  }}
                  className="text-xs font-bold text-[#79C99A] hover:opacity-80"
                >
                  Switch to {user.role === 'admin' ? 'Student' : 'Admin'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
