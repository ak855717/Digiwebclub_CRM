import React from 'react';

export default function SettingsView({ user }) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Account Settings</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Configure profile specifications</p>
      </div>
      
      <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm max-w-xl">
        <h3 className="text-sm font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Profile Configuration</h3>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md md:max-w-none">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Display Name</label>
              <input className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 outline-none" defaultValue={user?.name || 'N/A'} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">User ID</label>
              <input className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 outline-none" defaultValue={user?.userId || 'N/A'} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Employee ID</label>
              <input className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 outline-none" defaultValue={user?.employeeId || 'N/A'} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Registered Email</label>
              <input className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 outline-none" defaultValue={user?.email || 'N/A'} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Phone Number</label>
              <input className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 outline-none" defaultValue={user?.phonenumber || 'N/A'} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Role</label>
              <input className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 outline-none uppercase" defaultValue={user?.role || 'N/A'} disabled />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-0.5">Active Database</label>
            <input className="w-full max-w-md h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-500 font-mono" defaultValue="CRM_calling" disabled />
          </div>
        </form>
      </div>
    </div>
  );
}
