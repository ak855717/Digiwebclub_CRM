import React from 'react';

export default function ReportsView() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Reports & Analytics</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Full database connection performance indexes</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analytics chart box */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Target KPI metrics</h3>
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Target Answer Rate</span>
                <span>72%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Lead Conversion Rate</span>
                <span>18.5%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: '18.5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Outbound Campaigns</h3>
          <div className="flex flex-col gap-3 font-semibold text-xs text-slate-600">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <span>Direct Outreach</span>
              <span className="font-bold text-slate-800">140 calls</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <span>Web Demo Campaign</span>
              <span className="font-bold text-slate-800">94 calls</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <span>Inbound Lead Callback</span>
              <span className="font-bold text-slate-800">230 calls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
