import React, { useEffect, useState } from 'react';

export default function CallLogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/call-logs');
        const data = await response.json();
        if (response.ok && data.success) {
          setLogs(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch call logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m} mins ${s} secs`;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Call Logs History</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Full database callback registry history</p>
      </div>
      
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 border-r border-slate-100/60">Date</th>
                <th className="p-4 border-r border-slate-100/60">Recipient</th>
                <th className="p-4 border-r border-slate-100/60">Number</th>
                <th className="p-4 border-r border-slate-100/60">Duration</th>
                <th className="p-4 border-r border-slate-100/60">Direction</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-semibold">Loading call history...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-semibold">No call history found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b border-slate-100/60 hover:bg-slate-50/50 font-semibold text-xs text-slate-600 transition-colors">
                    <td className="p-4 border-r border-slate-100/60 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4 border-r border-slate-100/60 font-bold text-slate-800">{log.recipient}</td>
                    <td className="p-4 border-r border-slate-100/60 font-mono text-[11px] text-slate-500">{log.phoneNumber}</td>
                    <td className="p-4 border-r border-slate-100/60 text-slate-500">{formatDuration(log.duration)}</td>
                    <td className={`p-4 border-r border-slate-100/60 font-bold ${log.direction === 'Inbound' ? 'text-purple-500' : 'text-sky-500'}`}>{log.direction}</td>
                    <td className="p-4 text-emerald-600">{log.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
