'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: loginUserId, password: loginPassword }),
      });
      const res = await response.json();

      if (response.ok && res.success) {
        setSuccess(`Logged in successfully as ${res.user.name}!`);
        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // Redirect to dashboard page
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setError(res.error || 'Failed to log in.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the authentication server.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50 px-4 py-12 font-sans text-slate-800">
      
      {/* Container Card */}
      <div className="w-full max-w-[400px] flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-8 select-none">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-sky-500/20">
            W3
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight uppercase leading-none text-slate-900">
              CRM
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              Client Call Portal
            </span>
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="w-full min-h-[48px] mb-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs font-semibold text-rose-700 text-center flex items-center justify-center gap-2 shadow-sm animate-fade-in">
              <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs font-semibold text-emerald-700 text-center flex items-center justify-center gap-2 shadow-sm animate-fade-in">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}
        </div>


        {/* Login Card Wrapper */}
        <div className="w-full h-[390px]">
          <div className="w-full h-full bg-white border border-slate-200/80 shadow-xl shadow-slate-100/60 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h2>
                <p className="text-xs text-slate-500 mb-6 font-semibold">Enter your credentials to access your CRM</p>
                
                <form className="flex flex-col gap-4 w-full" onSubmit={handleLoginSubmit}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">User ID</label>
                    <input 
                      className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 outline-none transition-all" 
                      placeholder="user123" 
                      type="text" 
                      value={loginUserId}
                      onChange={(e) => setLoginUserId(e.target.value)}
                      required 
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Password</label>
                    <input 
                      className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 outline-none transition-all" 
                      placeholder="••••••••" 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required 
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 w-full h-11 rounded-lg bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-sky-500/15 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : "Sign In to CRM"}
                  </button>
                </form>
              </div>
              
              <div className="text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  SECURE END-TO-END CONNECTION
                </span>
              </div>
          </div>
        </div>

      </div>
    </main>
  );
}

