import React, { useState, useEffect } from 'react';

export default function UserManagement({ user: currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Track inline updating states per user ID: { [userId]: 'idle' | 'updating' | 'success' | 'error' }
  const [updateStates, setUpdateStates] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
      });
      const res = await response.json();
      if (response.ok && res.success) {
        setUsers(res.users);
      } else {
        setError(res.error || 'Failed to fetch users.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server to retrieve users.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Prevent updating current user role to avoid locking oneself out
    if (userId === currentUser.id) {
      setError("You cannot change your own role to prevent administrator lockout.");
      return;
    }

    // Set updating state for this user
    setUpdateStates(prev => ({ ...prev, [userId]: 'updating' }));
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const res = await response.json();
      if (response.ok && res.success) {
        // Update user local state list
        setUsers(prev =>
          prev.map(u => (u._id === userId ? { ...u, role: newRole } : u))
        );
        // Show success status
        setUpdateStates(prev => ({ ...prev, [userId]: 'success' }));
        setSuccessMsg(`Successfully updated role of ${res.user.name} to ${newRole}.`);
        
        // Reset success state after a few seconds
        setTimeout(() => {
          setUpdateStates(prev => ({ ...prev, [userId]: 'idle' }));
        }, 3000);
      } else {
        setUpdateStates(prev => ({ ...prev, [userId]: 'error' }));
        setError(res.error || 'Failed to update user role.');
      }
    } catch (err) {
      console.error(err);
      setUpdateStates(prev => ({ ...prev, [userId]: 'error' }));
      setError('Could not connect to the backend server to update user role.');
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Helper to choose initials avatar background color
  const getAvatarBg = (name) => {
    const colors = [
      'bg-blue-100 text-blue-600 border-blue-200/50',
      'bg-emerald-100 text-emerald-600 border-emerald-200/50',
      'bg-indigo-100 text-indigo-600 border-indigo-200/50',
      'bg-purple-100 text-purple-600 border-purple-200/50',
      'bg-pink-100 text-pink-600 border-pink-200/50',
      'bg-amber-100 text-amber-600 border-amber-200/50',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">User Authorization</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Admin-only console to view registration queue and assign corporate roles
          </p>
        </div>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs uppercase rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Refresh Users
        </button>
      </div>

      {/* Dynamic Alerts */}
      <div className="w-full flex flex-col gap-3">
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2 shadow-sm animate-fade-in">
            <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs font-semibold text-emerald-700 flex items-center gap-2 shadow-sm animate-fade-in">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 outline-none transition-all"
          />
        </div>

        {/* Role Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all cursor-pointer min-w-[130px]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="user">User (Default)</option>
          </select>
        </div>

      </div>

      {/* Users Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <svg className="animate-spin h-7 w-7 text-sky-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Loading Users Database...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <svg className="w-10 h-10 text-slate-300 mb-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="font-bold text-slate-800 text-xs">No users found</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search filters.' 
                : 'No users exist in the database.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 border-r border-slate-100/60">User Identity</th>
                  <th className="p-4 border-r border-slate-100/60">Registration Date</th>
                  <th className="p-4 border-r border-slate-100/60 text-center">Auth Status Badge</th>
                  <th className="p-4 text-center">Modify Authorization Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userObj) => {
                  const isSelf = userObj._id === currentUser.id;
                  const currentRole = userObj.role;
                  const rowState = updateStates[userObj._id] || 'idle';
                  const avatarClass = getAvatarBg(userObj.name);
                  
                  return (
                    <tr 
                      key={userObj._id} 
                      className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/50 font-semibold text-xs text-slate-600 transition-colors"
                    >
                      {/* Column 1: Identity */}
                      <td className="p-4 border-r border-slate-100/60">
                        <div className="flex items-center gap-3">
                          <div className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center font-extrabold text-xs uppercase shadow-sm shrink-0 ${avatarClass}`}>
                            {userObj.name.substring(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              {userObj.name}
                              {isSelf && (
                                <span className="bg-sky-100 text-sky-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">{userObj.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Date */}
                      <td className="p-4 border-r border-slate-100/60 text-slate-500 font-mono text-[11px]">
                        {userObj.createdAt 
                          ? new Date(userObj.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Pre-existing Account'}
                      </td>

                      {/* Column 3: Current Badge */}
                      <td className="p-4 border-r border-slate-100/60 text-center select-none">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                          currentRole === 'admin' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                          currentRole === 'manager' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          currentRole === 'employee' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {currentRole}
                        </span>
                      </td>

                      {/* Column 4: Dropdown selector */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <select
                            value={currentRole}
                            disabled={isSelf || rowState === 'updating'}
                            onChange={(e) => handleRoleChange(userObj._id, e.target.value)}
                            className={`h-9 px-2.5 border rounded-lg text-xs font-semibold outline-none transition-all min-w-[130px] ${
                              isSelf 
                                ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-sky-500 cursor-pointer'
                            }`}
                          >
                            <option value="user">User (Default)</option>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>

                          {/* Saving Status Spinner/Checkmark */}
                          <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {rowState === 'updating' && (
                              <svg className="animate-spin h-3.5 w-3.5 text-sky-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            )}
                            {rowState === 'success' && (
                              <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {rowState === 'error' && (
                              <svg className="w-4.5 h-4.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
