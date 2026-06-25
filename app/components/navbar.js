import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({ user, toggleSidebar }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const prevCountRef = useRef(0);

  const fetchFollowUps = async () => {
    try {
      const response = await fetch('/api/followups');
      const data = await response.json();
      if (data.success) {
        // Filter only pending follow-ups that are due in the next 24 hours or overdue
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const upcoming = data.followUps.filter(f => {
          if (f.status !== 'Pending') return false;
          const scheduled = new Date(f.scheduledAt);
          return scheduled < tomorrow;
        });

        const newFollowUps = upcoming.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        setFollowUps(newFollowUps);

        // Auto-open and close after 5 seconds if we have new notifications
        if (newFollowUps.length > prevCountRef.current) {
          setIsNotificationsOpen(true);
          setTimeout(() => {
            setIsNotificationsOpen(false);
          }, 5000);
        }
        prevCountRef.current = newFollowUps.length;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchFollowUps();
    // Poll every minute for new notifications
    const interval = setInterval(fetchFollowUps, 60000);
    return () => clearInterval(interval);
  }, []);


  const hasNotifications = followUps.length > 0;

  return (
    <header className="h-16 bg-[#1e293b] text-white px-6 flex items-center justify-between shadow-md border-b border-slate-800 select-none">
      {/* Left section: Brand & Search */}
      <div className="flex items-center gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-400 rounded flex items-center justify-center font-black text-white text-lg tracking-wider">
            W3
          </div>
          <span className="font-extrabold text-xl tracking-tight uppercase hidden sm:inline-block">
            CRM
          </span>
        </div>

        {/* Sidebar Collapse Toggle */}
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-9 bg-slate-800/80 rounded pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-400 border border-transparent focus:border-slate-700 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right section: Actions & User Info */}
      <div className="flex items-center gap-5">
        {/* Action icons */}
        <div className="flex items-center gap-3 text-slate-300">
          <button className="hover:text-white transition-colors p-1 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Notifications button with red indicator dot */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="hover:text-white transition-colors p-1 relative cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasNotifications && (
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full absolute top-1 right-1 animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in text-left cursor-default">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-2">
                    Notifications
                    {hasNotifications && (
                      <span className="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                        {followUps.length}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {!hasNotifications ? (
                    <div className="p-6 text-center">
                      <span className="text-2xl block mb-2">🎉</span>
                      <p className="text-xs font-semibold text-slate-500">You&apos;re all caught up!</p>
                      <p className="text-[10px] text-slate-400 mt-1">No upcoming follow-ups due.</p>
                    </div>
                  ) : (
                    followUps.map(f => {
                      const date = new Date(f.scheduledAt);
                      const isOverdue = date < new Date();

                      return (
                        <div key={f._id} className="p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors relative">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOverdue ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                          <div className="pl-2">
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-bold text-slate-800">Call {f.leadName}</p>
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${isOverdue ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                {isOverdue ? 'Overdue' : 'Upcoming'}
                              </span>
                            </div>
                            {f.phoneNumber && (
                              <p className="text-[10px] font-mono text-slate-500 mt-1">📞 {f.phoneNumber}</p>
                            )}
                            <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2">{f.description || 'No description provided.'}</p>
                            <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                              Due: {date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <a href="https://mail.google.com/" target='_blank' className="hover:text-white transition-colors p-1 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>

        </div>

        {/* User profile details */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-700 pl-5">
            <div className="flex flex-col text-right">
              <span className="font-bold text-xs leading-tight tracking-wide">{user.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 leading-tight">{user.email}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-extrabold text-sm uppercase text-sky-400 select-none shadow">
              {user.name?.substring(0, 2)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
