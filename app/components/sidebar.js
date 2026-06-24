import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const companyItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'calling',
      label: 'Calling (Dialer)',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: 'call-logs',
      label: 'Call Logs',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const featureItems = [
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    ...(user?.role === 'admin' ? [
      {
        id: 'users',
        label: 'User Authorization',
        icon: (
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      }
    ] : []),
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-[calc(100vh-64px)] sticky top-16 select-none shrink-0 py-4">
      {/* Scrollable Navigation section */}
      <div className="flex-1 overflow-y-auto">
        
        {/* YOUR COMPANY SECTION */}
        <div className="px-4 mb-6">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-2 px-1">
            Your Company
          </span>
          <nav className="flex flex-col gap-0.5">
            {companyItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-all text-left cursor-pointer group ${
                    isActive
                      ? 'bg-sky-50/70 text-[#2d8cf0] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`transition-colors ${isActive ? 'text-[#2d8cf0]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[10px] transition-transform ${isActive ? 'text-[#2d8cf0]' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    ▶
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* OUR FEATURES SECTION */}
        <div className="px-4">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-2 px-1">
            Our Features
          </span>
          <nav className="flex flex-col gap-0.5">
            {featureItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-all text-left cursor-pointer group ${
                    isActive
                      ? 'bg-sky-50/70 text-[#2d8cf0] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`transition-colors ${isActive ? 'text-[#2d8cf0]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[10px] transition-transform ${isActive ? 'text-[#2d8cf0]' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    ▶
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Logout button at Sidebar bottom */}
      <div className="px-4 pt-4 border-t border-slate-100 mt-auto">
        <button
          onClick={onLogout}
          className="w-full py-2 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold uppercase rounded tracking-wide transition-colors cursor-pointer text-center"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;