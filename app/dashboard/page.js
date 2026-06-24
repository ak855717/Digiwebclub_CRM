'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import DashboardOverview from '../components/dashboard-overview';
import LeadsManager from '../components/leads-manager';
import DialerConsole from '../components/dialer-console';
import CallLogsView from '../components/call-logs-view';
import FollowUpsView from '../components/follow-ups-view';
import ReportsView from '../components/reports-view';
import SettingsView from '../components/settings-view';
import UserManagement from '../components/user-management';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dialer State
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [dialStatus, setDialStatus] = useState('Idle');
  const [activeCallSid, setActiveCallSid] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [activeLead, setActiveLead] = useState(null);
  const timerRef = useRef(null);
  
  // Interactive Leads State with complete fields
  const [leads, setLeads] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const data = await response.json();
      if (data.success) {
        const formattedLeads = data.leads.map(l => ({ ...l, id: l._id }));
        setLeads(formattedLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/followups');
      const data = await response.json();
      if (data.success) {
        const formattedTodos = data.followUps.map(f => ({
          id: f._id,
          text: f.description || `Follow up with ${f.leadName || 'client'}`,
          completed: f.status === 'Completed'
        }));
        setTodos(formattedTodos);
      }
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  // Keep a ref to the latest handleEndCall so interval can access current state
  const handleEndCallRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    fetchLeads();
    fetchFollowUps();
  }, []);

  // Poll Twilio call status if activeCallSid is present
  useEffect(() => {
    let statusInterval;
    
    if (activeCallSid) {
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/call-status/${activeCallSid}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const status = data.status;
              // If Twilio reports the call is completed, busy, failed, or canceled, end it in UI
              if (['completed', 'busy', 'failed', 'no-answer', 'canceled'].includes(status)) {
                console.log(`Call automatically ended due to status: ${status}`);
                if (handleEndCallRef.current) {
                  handleEndCallRef.current(); // Re-use handleEndCall which also saves logs
                }
              }
            }
          }
        } catch (err) {
          console.error("Polling call status failed:", err);
        }
      }, 3000); // Check every 3 seconds
    }
    
    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [activeCallSid]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  // Redirect non-admins away from user management tab
  useEffect(() => {
    if (activeTab === 'users' && user && user.role !== 'admin') {
      setActiveTab('dashboard');
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <main className="flex min-h-screen bg-slate-50 items-center justify-center font-sans text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verifying Credentials...
          </span>
        </div>
      </main>
    );
  }

  // Dialer handlers
  const handleDialerClick = (num) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleDialerClear = () => {
    setPhoneNumber('+91');
    setDialStatus('Idle');
    setActiveLead(null);
  };

  const handleInitiateCall = (lead) => {
    if (lead.phone) {
      // Pre-fill phone number logic: if it doesn't start with '+91', maybe prefix it, but assuming it does based on component
      const numberToDial = lead.phone.startsWith('+') ? lead.phone : `+91${lead.phone.replace(/^0+/, '')}`;
      setPhoneNumber(numberToDial);
      setActiveLead(lead);
      setActiveTab('calling');
    } else {
      alert('This lead does not have a phone number recorded.');
    }
  };

  const handleDialerBackspace = () => {
    setPhoneNumber((prev) => prev.length > 3 ? prev.slice(0, -1) : prev);
  };

  const handleMakeCall = async () => {
    if (!phoneNumber) return;
    
    if (!phoneNumber.startsWith('+91')) {
      alert('Only numbers starting with +91 are allowed.');
      return;
    }
    
    setDialStatus('Dialing...');
    
    try {
      const response = await fetch('http://localhost:5000/api/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: phoneNumber }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDialStatus(`Connected (SID: ${data.callSid.substring(0, 10)}...)`);
        setActiveCallSid(data.callSid);
        
        // Start Call Timer
        setCallDuration(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

        console.log(`Twilio Call Triggered. SID: ${data.callSid}`);
      } else {
        setDialStatus('Failed');
        alert(data.error || 'VoIP Dialing failed.');
      }
    } catch (error) {
      console.error('VoIP Dialer Error:', error);
      setDialStatus('Error');
      alert('Could not connect to the calling server.');
    }
  };

  const handleEndCall = async () => {
    if (!activeCallSid) {
      setDialStatus('Call Cut');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/end-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callSid: activeCallSid })
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Non-JSON response from server:', textResponse);
        alert('Backend server route not found. Did you restart the backend server after adding the end-call route?');
        return;
      }

      if (response.ok && data.success) {
        setDialStatus('Call Cut');
        setActiveCallSid(null);
        
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Save Call Log
        try {
          await fetch('http://localhost:5000/api/call-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: 'Unknown', // We can match with leads later
              phoneNumber: phoneNumber,
              duration: callDuration,
              direction: 'Outbound',
              status: 'Completed',
              callSid: activeCallSid
            })
          });
        } catch (logErr) {
          console.error('Failed to save call log:', logErr);
        }

      } else {
        alert('Failed to end call: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error ending call:', error);
      alert('Could not connect to the server to end the call.');
    }
  };

  // Todo handlers
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: 'Manual Task',
          description: newTodoText.trim(),
          status: 'Pending',
          scheduledAt: new Date()
        })
      });
      const data = await response.json();
      if (data.success) {
        setTodos((prev) => [
          ...prev,
          { id: data.followUp._id, text: data.followUp.description, completed: false }
        ]);
        setNewTodoText('');
      }
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newStatus = todo.completed ? 'Pending' : 'Completed';
    
    // Optimistic update
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    
    try {
      await fetch(`http://localhost:5000/api/followups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Error updating todo:', err);
      // Revert on error
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  };

  const deleteTodo = async (id) => {
    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));
    
    try {
      await fetch(`http://localhost:5000/api/followups/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting todo:', err);
      fetchFollowUps(); // Refresh from server on error
    }
  };

  // Assign the ref on every render so the polling interval always sees the latest state
  handleEndCallRef.current = handleEndCall;

  // Rendering Helper for active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            todos={todos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            newTodoText={newTodoText}
            setNewTodoText={setNewTodoText}
            handleAddTodo={handleAddTodo}
            leads={leads}
            setActiveTab={setActiveTab}
          />
        );
      case 'leads':
        return (
          <LeadsManager
            leads={leads}
            setLeads={setLeads}
            onInitiateCall={handleInitiateCall}
          />
        );
      case 'calling':
        return (
          <DialerConsole
            phoneNumber={phoneNumber}
            dialStatus={dialStatus}
            handleDialerClick={handleDialerClick}
            handleDialerClear={handleDialerClear}
            handleDialerBackspace={handleDialerBackspace}
            handleMakeCall={handleMakeCall}
            handleEndCall={handleEndCall}
            callDuration={callDuration}
            activeLead={activeLead}
          />
        );
      case 'call-logs':
        return <CallLogsView />;
      case 'follow-ups':
        return <FollowUpsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView user={user} />;
      case 'users':
        return <UserManagement user={user} />;
      default:
        return <div className="text-slate-500 text-xs font-semibold">Tab page not found.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-700">
      {/* Top Navbar */}
      <Navbar user={user} />

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          onLogout={handleLogout} 
        />

        {/* Scrollable Main Console */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}