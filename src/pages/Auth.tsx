/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  initialView: 'login' | 'signup';
  onAuthSuccess: (user: UserType, token: string) => void;
  onNavigate: (view: string) => void;
}

export default function Auth({ initialView, onAuthSuccess, onNavigate }: AuthProps) {
  const [view, setView] = useState<'login' | 'signup' | 'otp' | 'forgot'>(initialView);
  
  // Registration State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP State
  const [tempUserId, setTempUserId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Common UI State
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await response.json();
      if (response.ok && data.userId) {
        setTempUserId(data.userId);
        setView('otp');
        setInfo(`Account created! A simulated 6-digit OTP has been sent to your email (Use ${data.otpCode}).`);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      setError('Connection failure during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tempUserId, code: otpCode })
      });
      const data = await response.json();
      if (response.ok && data.user && data.token) {
        onAuthSuccess(data.user, data.token);
      } else {
        setError(data.error || 'OTP verification failed.');
      }
    } catch (err) {
      setError('Connection failed during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok && data.user && data.token) {
        onAuthSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection failed during authorization check.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setForgotSent(true);
        setInfo('Simulated password reset link dispatched to your inbox.');
      } else {
        setError(data.error || 'Failed to trigger forgot-password routine.');
      }
    } catch (err) {
      setError('Network lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFCFA] text-[#17221B] px-4 py-12 sm:px-6 lg:px-8 font-sans" id="auth_page_container">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl border border-[#E5ECE7] shadow-sm" id="auth_card">
        
        {/* Header Visual */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B]">
            <Sparkles className="h-6 w-6 text-[#79C99A]" />
          </div>
          <h2 className="mt-4 font-sans text-xl sm:text-2xl font-black text-[#17221B] uppercase tracking-wider">
            {view === 'login' && 'Access Classroom'}
            {view === 'signup' && 'Create Student ID'}
            {view === 'otp' && 'Verify Account'}
            {view === 'forgot' && 'Reset Password'}
          </h2>
          <p className="mt-2 text-xs text-[#66736B] font-light">
            {view === 'login' && 'Sign in to access courses, track progress, and view certificates.'}
            {view === 'signup' && 'Get ready to unlock verified credentials and server-side AI tutors.'}
            {view === 'otp' && 'We sent a 6-digit verification code. Enter it below to start.'}
            {view === 'forgot' && 'Enter your email address and we will generate a simulated restore token.'}
          </p>
        </div>

        {/* Global Notifications Alert */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="rounded-xl bg-[#F1F8F3] border border-[#79C99A]/30 p-3.5 text-[11px] text-green-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#79C99A]" />
            <span>{info}</span>
          </div>
        )}

        {/* View: LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4" id="login_form">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="login_email"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#66736B]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Secure Password</label>
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-[10px] text-[#79C99A] hover:underline font-black uppercase tracking-wider"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="login_password"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#66736B]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#79C99A] text-[#17221B] py-3 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm"
              id="login_submit_btn"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#66736B]">
                New to the platform?{' '}
                <button
                  type="button"
                  onClick={() => { setView('signup'); setError(''); setInfo(''); }}
                  className="font-black text-[#79C99A] hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* View: SIGNUP */}
        {view === 'signup' && (
          <form onSubmit={handleRegister} className="space-y-4" id="register_form">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="register_name"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-[#66736B]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="register_email"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#66736B]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Phone Coordinate</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="register_phone"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#66736B]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 px-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="register_password"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Confirm</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5ECE7] py-2.5 px-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="register_confirm_password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#79C99A] text-[#17221B] py-3 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm"
              id="register_submit_btn"
            >
              {loading ? 'Submitting...' : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#66736B]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setView('login'); setError(''); setInfo(''); }}
                  className="font-black text-[#79C99A] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

        {/* View: OTP */}
        {view === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4" id="otp_form">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest text-center block">6-Digit Verification PIN</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g., 123456"
                  className="w-full rounded-xl border border-[#E5ECE7] py-3 pl-9 pr-3 text-sm font-black tracking-widest text-center focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                  id="otp_input"
                />
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-[#66736B]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#79C99A] text-[#17221B] py-3 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm"
              id="otp_submit_btn"
            >
              {loading ? 'Verifying...' : 'Confirm and Verify'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setView('login'); setError(''); setInfo(''); }}
                className="text-xs text-[#66736B] hover:underline hover:text-[#17221B]"
              >
                Return to Login screen
              </button>
            </div>
          </form>
        )}

        {/* View: FORGOT */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4" id="forgot_form">
            {!forgotSent ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#66736B] uppercase tracking-widest">Registered Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-[#E5ECE7] py-2.5 pl-9 pr-3 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
                      id="forgot_email_input"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-[#66736B]" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#79C99A] text-[#17221B] py-3 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm"
                  id="forgot_submit_btn"
                >
                  {loading ? 'Sending...' : 'Request reset token'}
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-[#66736B]">We generated a simulated password bypass in the database logs.</p>
              </div>
            )}

            <div className="text-center pt-2 border-t border-[#E5ECE7]">
              <button
                type="button"
                onClick={() => { setView('login'); setError(''); setInfo(''); setForgotSent(false); }}
                className="text-xs text-[#79C99A] font-black hover:underline uppercase tracking-wider"
              >
                Return to Log In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
