import React, { useState, useEffect } from 'react';
import { 
  Phone, X, Calendar, PhoneCall, Mail, MessageSquare, 
  Play, MoreVertical, ExternalLink, Settings, MicOff, 
  Pause, Grid, ArrowRightLeft, MoreHorizontal, UserPlus, ChevronDown
} from 'lucide-react';

export default function DialerConsole({
  phoneNumber,
  dialStatus,
  handleDialerClick,
  handleDialerClear,
  handleDialerBackspace,
  handleMakeCall,
  handleEndCall,
  callDuration = 0,
  activeLead
}) {
  const isCallActive = dialStatus === 'Dialing...' || dialStatus.startsWith('Connected');
  const [activeTab, setActiveTab] = useState('activities');
  const [rightTab, setRightTab] = useState('dialer');

  const [activities, setActivities] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const [logsRes, followupsRes] = await Promise.all([
          fetch('http://localhost:5000/api/call-logs').catch(() => null),
          fetch('http://localhost:5000/api/followups').catch(() => null)
        ]);
        
        let allLogs = [];
        if (logsRes && logsRes.ok) {
          const logsData = await logsRes.json();
          if (logsData.success) {
            allLogs = logsData.data.map(log => ({
              id: log._id,
              type: 'call',
              title: log.direction === 'Inbound' ? 'Call received' : 'Call logged',
              date: new Date(log.createdAt),
              contact: log.recipient || 'Unknown',
              phone: log.phoneNumber,
              duration: log.duration,
              description: log.direction === 'Inbound' ? 'Incoming call processed.' : 'Outbound call attempt.',
              status: log.status,
              recordingUrl: log.recordingUrl
            }));
          }
        }
        
        let allFollowups = [];
        if (followupsRes && followupsRes.ok) {
          const followupsData = await followupsRes.json();
          if (followupsData.success) {
            allFollowups = followupsData.followUps.map(f => ({
              id: f._id,
              type: 'followup',
              title: f.status === 'Completed' ? 'Follow-up completed' : 'Follow up call',
              date: new Date(f.scheduledAt),
              contact: f.leadName,
              phone: f.phoneNumber,
              description: f.description || 'No description provided.',
              status: f.status
            }));
          }
        }

        const upcomingItems = allFollowups
          .filter(f => f.status === 'Pending')
          .sort((a, b) => a.date - b.date);
          
        setUpcoming(upcomingItems);

        const recentItems = [...allLogs, ...allFollowups.filter(f => f.status === 'Completed')]
          .sort((a, b) => b.date - a.date);
          
        setActivities(recentItems);
      } catch (err) {
        console.error("Failed to fetch dynamic activities", err);
      } finally {
        setLoadingActivities(false);
      }
    };
    
    fetchDynamicData();
  }, []);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentDuration = isCallActive ? formatDuration(callDuration) : "00:00:00";
  const displayPhone = phoneNumber === '+91' ? '' : phoneNumber.replace('+91', '');

  const displayUpcoming = activeTab === 'activities' || activeTab === 'follow-ups' ? upcoming : [];
  let displayRecent = [];
  if (activeTab === 'activities') displayRecent = activities;
  else if (activeTab === 'call-logs') displayRecent = activities.filter(a => a.type === 'call');
  else if (activeTab === 'follow-ups') displayRecent = activities.filter(a => a.type === 'followup');

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 animate-fade-in font-sans h-full min-h-[700px]">
      
      {/* -------------------- COLUMN 1: Make a Call -------------------- */}
      <div className="flex flex-col gap-6 w-full lg:w-[320px] shrink-0">
        
        {/* Make a call card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full mb-4">
            <h2 className="text-base font-bold text-slate-800">Make a Call</h2>
            <p className="text-xs text-slate-400 mt-1">Enter number</p>
          </div>

          {/* Number Input Box */}
          <div className="w-full h-14 border border-slate-200 rounded-xl px-4 flex items-center mb-6 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 mr-3">
              <span className="text-lg leading-none">🇮🇳</span>
              <span className="text-sm font-semibold text-slate-600">+91</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <input 
              type="text"
              readOnly
              value={displayPhone}
              placeholder="98765 43210"
              className="w-full text-base font-bold text-slate-800 outline-none bg-transparent placeholder-slate-300 tracking-wider"
            />
            {displayPhone && (
              <button onClick={handleDialerBackspace} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dialpad */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-full mb-6">
            {[
              { num: '1', letters: '' }, { num: '2', letters: 'ABC' }, { num: '3', letters: 'DEF' },
              { num: '4', letters: 'GHI' }, { num: '5', letters: 'JKL' }, { num: '6', letters: 'MNO' },
              { num: '7', letters: 'PQRS' }, { num: '8', letters: 'TUV' }, { num: '9', letters: 'WXYZ' },
              { num: '*', letters: '' }, { num: '0', letters: '+' }, { num: '#', letters: '' }
            ].map((btn) => (
              <button
                key={btn.num}
                onClick={() => handleDialerClick(btn.num)}
                className="h-14 flex flex-col items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors active:scale-95"
              >
                <span className="text-xl font-bold text-slate-800 leading-none">{btn.num}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">{btn.letters || '\u00A0'}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleDialerClear}
              className="flex-1 h-12 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 font-bold text-sm rounded-xl transition-colors text-slate-600"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={handleMakeCall}
              disabled={isCallActive}
              className={`flex-1 h-12 flex items-center justify-center gap-2 font-bold text-sm rounded-xl transition-all text-white ${
                isCallActive 
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95'
              }`}
            >
              <Phone className="w-4 h-4 fill-current" />
              Call
            </button>
          </div>
        </div>

        {/* SIP Status Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Ready to call</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-slate-500">SIP Connected</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-0.5 h-4">
            <div className="w-1 bg-emerald-400 h-2 rounded-sm"></div>
            <div className="w-1 bg-emerald-400 h-3 rounded-sm"></div>
            <div className="w-1 bg-emerald-400 h-4 rounded-sm"></div>
            <div className="w-1 bg-slate-200 h-4 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* -------------------- COLUMN 2: Activities -------------------- */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-w-[300px]">
        
        {/* Tabs */}
        <div className="flex items-center border-b border-slate-100 mb-6 w-full">
          {['Activities', 'Call Logs', 'Follow-ups'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                activeTab === tab.toLowerCase().replace(' ', '-')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Activities */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
          
          {loadingActivities ? (
             <div className="flex justify-center items-center h-32">
               <span className="text-slate-400 text-sm font-semibold animate-pulse">Loading dynamic data...</span>
             </div>
          ) : (
            <>
              {/* Upcoming Card */}
              {(activeTab === 'activities' || activeTab === 'follow-ups') && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Upcoming</span>
                  </div>
                  {displayUpcoming.length > 0 ? (
                    displayUpcoming.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm mb-2 last:mb-0">
                        <div>
                          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {item.title} with {item.contact}
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded uppercase font-bold tracking-wider">Call</span>
                          </p>
                          <p className="text-xs font-semibold text-slate-400 mt-1">
                            {item.date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                            View task
                          </button>
                          <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 font-semibold p-2 text-center bg-white rounded-lg border border-slate-100">
                      No upcoming items scheduled.
                    </div>
                  )}
                </div>
              )}

              {/* Recent Activities */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-800">Recent Activities</h3>
                  <button className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1">
                    Filter: All activities <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {displayRecent.length > 0 ? (
                  displayRecent.map((item) => {
                    const isCall = item.type === 'call';
                    return (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCall ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                          {isCall ? <PhoneCall className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="text-sm font-bold text-slate-800">{item.title}</p>
                            <p className="text-xs font-semibold text-slate-400">
                              {item.date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-medium">with <span className="font-bold text-slate-700">{item.contact}</span></p>
                            {isCall && item.duration !== undefined && (
                              <p className="text-xs font-semibold text-slate-400">{formatDuration(item.duration)}</p>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-2 font-medium">{item.description}</p>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          {isCall && item.recordingUrl && (
                            <button onClick={() => window.open(item.recordingUrl, '_blank')} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600" title="Play Recording">
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          )}
                          <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-400 font-semibold p-4 text-center border border-dashed border-slate-200 rounded-xl">
                    No recent activities found for this tab.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* -------------------- COLUMN 3: Active Call -------------------- */}
      <div className={`w-full lg:w-[360px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col shrink-0 ${isCallActive ? '' : 'opacity-70 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Active Call</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              Available <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
              <Settings className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 uppercase">
              {activeLead?.name ? activeLead.name.substring(0, 2) : "AR"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{activeLead?.name || "Arjun Rao"}</h3>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">{phoneNumber || "+91 98765 43210"}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                {activeLead?.areaZone ? <span className="text-slate-500">📍</span> : <span className="text-[10px]">🇮🇳</span>} 
                {activeLead?.areaZone || "India"}
              </p>
              {activeLead?.businessName && (
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{activeLead.businessName}</p>
              )}
            </div>
          </div>
          <button className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 bg-slate-50/50 w-max px-3 py-1.5 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className="text-sm font-bold text-slate-700 tracking-wider font-mono">{currentDuration}</span>
          </div>
        </div>

        {/* Tabs for Active Call */}
        <div className="flex items-center border-b border-slate-100 px-5">
          {['Dialer', 'Call Log'].map((tab) => {
            const tabId = tab.toLowerCase().replace(' ', '-');
            return (
              <button
                key={tab}
                onClick={() => setRightTab(tabId)}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                  rightTab === tabId
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Active Dialer Numpad */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Dialer Input Display */}
          <div className="h-12 border border-slate-200 rounded-xl px-4 flex items-center justify-between mb-6 bg-slate-50/50">
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg leading-none shrink-0">🇮🇳</span>
              <span className="text-sm font-semibold text-slate-500 shrink-0">+91</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              <input 
                type="text" 
                readOnly
                value={displayPhone}
                placeholder="98765 43210"
                className="w-full bg-transparent outline-none font-bold text-slate-800 placeholder-slate-300 pl-2 tracking-wider" 
              />
            </div>
            <button className="text-slate-400 hover:text-slate-600 shrink-0">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Right Panel Numpad (Simplified) */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-full mb-8">
            {[
              { num: '1', letters: '' }, { num: '2', letters: 'ABC' }, { num: '3', letters: 'DEF' },
              { num: '4', letters: 'GHI' }, { num: '5', letters: 'JKL' }, { num: '6', letters: 'MNO' },
              { num: '7', letters: 'PQRS' }, { num: '8', letters: 'TUV' }, { num: '9', letters: 'WXYZ' },
              { num: '*', letters: '' }, { num: '0', letters: '+' }, { num: '#', letters: '' }
            ].map((btn) => (
              <button
                key={btn.num}
                onClick={() => handleDialerClick(btn.num)}
                className="h-12 flex flex-col items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors active:scale-95"
              >
                <span className="text-lg font-bold text-slate-800 leading-none">{btn.num}</span>
                <span className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase">{btn.letters || '\u00A0'}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto">
            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-full h-12 bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 mb-6"
            >
              <Phone className="w-5 h-5 fill-current transform rotate-[135deg]" />
              End Call
            </button>

            {/* Call Controls Grid */}
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-100">
                  <MicOff className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Mute</span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-100">
                  <Pause className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Hold</span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-100">
                  <Grid className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Keypad</span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-100">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Transfer</span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-100">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">More</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

