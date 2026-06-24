import React from 'react';

export default function DashboardOverview({
  todos,
  toggleTodo,
  deleteTodo,
  newTodoText,
  setNewTodoText,
  handleAddTodo,
  leads,
  setActiveTab
}) {
  // --- Dynamic Calculations based on leads ---
  const totalLeads = leads.length || 1;
  const contactedLeads = leads.filter(l => l.status === 'Contacted' || l.status === 'Active');
  const campaignProgress = Math.round((contactedLeads.length / totalLeads) * 100);
  
  // Total Deposits mock based on leads data
  const totalDeposits = leads.reduce((sum, l) => sum + (l.deposit || 0), 0) + (contactedLeads.length * 450) + 15000;
  
  // Daily Outbound Cost mock based on leads
  const dailyCost = 500 + (contactedLeads.length * 15);

  // Active Geographies
  const geoCounts = leads.reduce((acc, l) => {
    const geo = l.areaZone || 'India';
    acc[geo] = (acc[geo] || 0) + 1;
    return acc;
  }, {});
  
  const geoEntries = Object.entries(geoCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const geoTotal = geoEntries.reduce((sum, g) => sum + g[1], 0) || 1;
  const flags = { 'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'India': '🇮🇳' };
  const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
  let activeGeographies = geoEntries.map(([name, count], idx) => ({
    country: name,
    flag: flags[name] || '🌍',
    calls: (count * 15),
    pct: Math.round((count / geoTotal) * 100),
    color: colors[idx % colors.length]
  }));
  
  if (activeGeographies.length === 0) {
    activeGeographies = [
      { country: 'United States', flag: '🇺🇸', calls: 1420, pct: 60, color: 'bg-sky-500' },
      { country: 'United Kingdom', flag: '🇬🇧', calls: 620, pct: 28, color: 'bg-emerald-500' },
      { country: 'Canada', flag: '🇨🇦', calls: 310, pct: 15, color: 'bg-amber-500' },
      { country: 'Australia', flag: '🇦🇺', calls: 180, pct: 8, color: 'bg-purple-500' }
    ];
  }

  // Pending Callbacks
  const pendingTodosCount = todos.filter(t => !t.completed).length;
  const totalTodosCount = todos.length || 1;
  const todoCompletionPct = Math.round(((totalTodosCount - pendingTodosCount) / totalTodosCount) * 100);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top KPI Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Deposit */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Total Deposits</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">${totalDeposits.toLocaleString()}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {/* SVG Sparkline */}
          <div className="h-8 w-full mt-2">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,25 Q15,10 30,18 T60,5 T90,15 L100,15 L100,30 L0,30 Z" fill="url(#skyGrad)" />
              <path d="M0,25 Q15,10 30,18 T60,5 T90,15 L100,15" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: All Projects (Donut Chart) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between h-[135px]">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Campaign Progress</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{campaignProgress}%</span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              +4.3% this week
            </span>
          </div>
          {/* SVG Donut */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
              <circle cx="32" cy="32" r="26" stroke="#38bdf8" strokeWidth="6" fill="transparent" strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * campaignProgress / 100)} strokeLinecap="round" />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">{campaignProgress}%</span>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Daily Outbound Cost</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">${dailyCost.toLocaleString()}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {/* Red Sparkline */}
          <div className="h-8 w-full mt-2">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,5 Q20,28 40,15 T80,22 T100,8 L100,30 L0,30 Z" fill="url(#roseGrad)" />
              <path d="M0,5 Q20,28 40,15 T80,22 T100,8" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Pending Tasks */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Pending Callbacks</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {pendingTodosCount} / {todos.length}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2 w-full">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Task Completion</span>
              <span>{todoCompletionPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-500" 
                style={{ width: `${todoCompletionPct}%` }} 
              />
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row (Analytics Chart + Interactive To-Do + Earnings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Box: Call Volume SVG Bar Graph */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Outbound Volume Trends</h3>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Weekly</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-6">Total number of dialer connection attempts</p>
          </div>
          
          {/* SVG Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-3 px-2 h-44">
            {[
              { day: 'Mon', count: Math.round(totalLeads * 0.8), pct: `${Math.min(100, Math.round(totalLeads * 0.8 / 3))}%` },
              { day: 'Tue', count: Math.round(totalLeads * 1.2), pct: `${Math.min(100, Math.round(totalLeads * 1.2 / 3))}%` },
              { day: 'Wed', count: Math.round(totalLeads * 0.5), pct: `${Math.min(100, Math.round(totalLeads * 0.5 / 3))}%` },
              { day: 'Thu', count: Math.round(totalLeads * 1.5), pct: `${Math.min(100, Math.round(totalLeads * 1.5 / 3))}%` },
              { day: 'Fri', count: Math.round(totalLeads * 1.0), pct: `${Math.min(100, Math.round(totalLeads * 1.0 / 3))}%` },
              { day: 'Sat', count: Math.round(totalLeads * 0.3), pct: `${Math.min(100, Math.round(totalLeads * 0.3 / 3))}%` },
              { day: 'Sun', count: Math.round(totalLeads * 0.1), pct: `${Math.min(100, Math.round(totalLeads * 0.1 / 3))}%` }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-slate-50 hover:bg-slate-100 rounded-t-md relative h-40 flex items-end overflow-hidden">
                  <div 
                    className="w-full bg-sky-500 rounded-t-md group-hover:bg-sky-600 transition-all duration-500" 
                    style={{ height: item.pct }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive To-Do List */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">To-Do Checklist</h3>
            <p className="text-xs text-slate-400 font-semibold mb-4">Pending client follow-up calls</p>
            
            {/* Todo Items Container */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[195px] pr-1">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between bg-slate-55 border border-slate-100/60 p-2.5 rounded-lg text-xs font-semibold hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={todo.completed} 
                      onChange={() => toggleTodo(todo.id)}
                      className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/10 cursor-pointer"
                    />
                    <span className={`text-slate-700 select-none ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer p-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Todo Input form */}
          <form onSubmit={handleAddTodo} className="flex gap-2 border-t border-slate-100 pt-3">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add follow-up task..."
              className="flex-1 h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none transition-all"
            />
            <button
              type="submit"
              className="h-9 px-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase cursor-pointer transition-colors shadow-sm"
            >
              Add
            </button>
          </form>
        </div>

        {/* Total Earnings Trendline Graph */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Earnings Growth</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12.4%</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-6">Total monthly revenue performance</p>
          </div>
          
          {/* Revenue SVG Curve */}
          <div className="h-44 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 C30,70 60,90 90,40 C120,30 150,15 200,5 L200,100 L0,100 Z" fill="url(#lineGrad)" />
              <path d="M0,80 C30,70 60,90 90,40 C120,30 150,15 200,5" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              {/* Data Points */}
              <circle cx="90" cy="40" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="200" cy="5" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-50">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Active Leads Table + Active Geographies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Leads List */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Leads Overview</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Status of current inbound calling campaigns</p>
              </div>
              <button 
                onClick={() => setActiveTab('leads')}
                className="text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Manage Leads
                <span>→</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-2">Lead Name</th>
                    <th className="pb-3 pr-2">Contact Details</th>
                    <th className="pb-3 pr-2">Status</th>
                    <th className="pb-3 pr-2">Campaign Source</th>
                    <th className="pb-3">Warmth</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 4).map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/50 transition-colors font-semibold text-xs text-slate-600">
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-sky-600 border border-slate-200/50 flex items-center justify-center font-extrabold text-[10px] uppercase">
                            {lead.name.substring(0, 2)}
                          </div>
                          <span className="font-bold text-slate-800">{lead.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2">
                        <div className="flex flex-col">
                          <span>{lead.email}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          lead.status === 'Active' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                          lead.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          lead.status === 'New' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-slate-500">{lead.campaign}</td>
                      <td className="py-3.5">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full" style={{ width: `${lead.progress}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active Calling Geographies */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">Active Geographies</h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">Call campaign target countries</p>

            <div className="flex flex-col gap-4">
              {activeGeographies.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.flag}</span>
                      <span className="font-bold text-slate-800">{item.country}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{item.calls} leads ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
