import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Search, ShieldAlert, Key, UserCheck, Users, Mail, X } from 'lucide-react';

export const SuperAdminUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Drawer / Detail modal
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [details, setDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [changeRole, setChangeRole] = useState('');
    const [suspendReason, setSuspendReason] = useState('');
    const [showSuspendModal, setShowSuspendModal] = useState(false);

    const fetchUsers = async () => {
        try {
            const list = await apiCall(`super-admin/users?search=${encodeURIComponent(searchQuery)}&filter=${statusFilter}`);
            setUsers(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        fetchUsers();
    };

    const fetchUserDetails = async (userId: string) => {
        setLoadingDetails(true);
        try {
            const res = await apiCall(`super-admin/users/${userId}`);
            setDetails(res);
            setChangeRole(res.user.platform_role);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleUserSelect = (user: any) => {
        setSelectedUser(user);
        fetchUserDetails(user._id);
    };

    const handleCloseDrawer = () => {
        setSelectedUser(null);
        setDetails(null);
        setNoteText('');
        setSuspendReason('');
    };

    const handleSuspend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!suspendReason.trim()) return;

        const isCurrentlyActive = details.user.status === 'ACTIVE';
        const targetStatus = isCurrentlyActive ? 'SUSPENDED' : 'ACTIVE';

        try {
            await apiCall(`super-admin/users/${selectedUser._id}/status`, {
                method: 'PATCH',
                body: { status: targetStatus, reason: suspendReason }
            });
            alert(`User account has been successfully ${targetStatus.toLowerCase()}!`);
            setShowSuspendModal(false);
            setSuspendReason('');
            fetchUserDetails(selectedUser._id);
            fetchUsers();
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    const handleVerifyEmail = async () => {
        if (!window.confirm('Manually verify this user\'s email address?')) return;
        try {
            await apiCall(`super-admin/users/${selectedUser._id}/verify-email`, { method: 'POST' });
            alert('Email verified successfully!');
            fetchUserDetails(selectedUser._id);
            fetchUsers();
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    const handleSendResetPassword = async () => {
        if (!window.confirm('Simulate and log password reset request?')) return;
        try {
            await apiCall(`super-admin/users/${selectedUser._id}/reset-password`, { method: 'POST' });
            alert('Password reset successfully simulated and logged!');
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    const handleChangePlatformRole = async (role: string) => {
        try {
            await apiCall(`super-admin/users/${selectedUser._id}/platform-role`, {
                method: 'PATCH',
                body: { platform_role: role }
            });
            alert('Platform role updated successfully!');
            setChangeRole(role);
            fetchUserDetails(selectedUser._id);
            fetchUsers();
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim()) return;

        try {
            await apiCall('super-admin/notes', {
                method: 'POST',
                body: { target_type: 'USER', target_id: selectedUser._id, note: noteText }
            });
            setNoteText('');
            fetchUserDetails(selectedUser._id);
        } catch (err: any) {
            alert(err.message || 'Failed to save note');
        }
    };

    const handleImpersonate = async () => {
        if (!window.confirm(`WARNING: Are you sure you want to impersonate ${selectedUser.full_name}? All actions you perform will be logged.`)) return;
        try {
            const data = await apiCall(`super-admin/users/${selectedUser._id}/impersonate`, { method: 'POST' });
            if (data.token) {
                // Stash original token to easily exit later
                const originalToken = localStorage.getItem('docu_token') || '';
                localStorage.setItem('admin_original_token', originalToken);
                
                // Set impersonated token
                localStorage.setItem('docu_token', data.token);
                localStorage.setItem('docu_user_role', 'owner'); // Default to owner context
                
                alert(`Impersonation started successfully! Redirecting you to the dashboard as ${selectedUser.full_name}...`);
                window.location.href = '/docu/dashboard';
            }
        } catch (err: any) {
            alert(err.message || 'Impersonation failed');
        }
    };

    return (
        <SuperAdminLayout title="Users Directory">
            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '2.2rem' }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => { setStatusFilter(e.target.value); setLoading(true); }}
                        style={{
                            padding: '0.5rem 2rem 0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                        }}
                    >
                        <option value="">All Account Statuses</option>
                        <option value="suspended">Suspended Accounts</option>
                        <option value="unverified">Email Unverified</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        <Users className="empty-state-icon" size={48} />
                        <h3>No users found</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Workspaces</th>
                                <th>Docs Sent</th>
                                <th>Joined Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td 
                                        style={{ fontWeight: 700, color: '#3b82f6', cursor: 'pointer' }}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        {user.full_name}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', color: '#475569' }}>
                                            {user.platform_role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.status === 'ACTIVE' ? 'badge-completed' : 'badge-viewed'}`} style={{ background: user.status === 'SUSPENDED' ? '#fef2f2' : undefined, color: user.status === 'SUSPENDED' ? '#ef4444' : undefined }}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.workspacesCount}</td>
                                    <td>{user.docsSent}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            Manage Account
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Inspect User Drawer */}
            {selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '460px',
                    background: '#ffffff',
                    boxShadow: '-4px 0 30px rgba(0,0,0,0.1)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid #e2e8f0',
                    fontFamily: '"Inter", sans-serif'
                }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{selectedUser.full_name}</h3>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{selectedUser.email}</div>
                        </div>
                        <button onClick={handleCloseDrawer} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {loadingDetails ? (
                            <div style={{ display: 'flex', padding: '3rem', justifyContent: 'center' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : details && (
                            <>
                                {/* Account actions block */}
                                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>Operator Controls</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        
                                        <button 
                                            onClick={handleImpersonate}
                                            className="btn btn-primary" 
                                            style={{ background: '#3b82f6', justifyContent: 'center', width: '100%' }}
                                        >
                                            <UserCheck size={14} style={{ marginRight: '6px' }} /> Impersonate for Support
                                        </button>

                                        <button 
                                            onClick={() => setShowSuspendModal(true)}
                                            className="btn btn-secondary" 
                                            style={{ color: '#ef4444', borderColor: '#ef4444', justifyContent: 'center', background: 'transparent' }}
                                        >
                                            <ShieldAlert size={14} style={{ marginRight: '6px' }} /> 
                                            {details.user.status === 'SUSPENDED' ? 'Unsuspend Account' : 'Suspend Account'}
                                        </button>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={handleSendResetPassword} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem', justifyContent: 'center' }}>
                                                <Key size={12} style={{ marginRight: '4px' }} /> Reset Pass
                                            </button>
                                            {!details.user.email_verified && (
                                                <button onClick={handleVerifyEmail} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem', justifyContent: 'center' }}>
                                                    <Mail size={12} style={{ marginRight: '4px' }} /> Verify Email
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Platform role configure */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Platform Role</label>
                                    <select 
                                        value={changeRole}
                                        onChange={(e) => handleChangePlatformRole(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    >
                                        <option value="USER">User (Standard)</option>
                                        <option value="SUPER_ADMIN">Super Admin (All permissions)</option>
                                        <option value="SUPPORT_ADMIN">Support Admin (Read & Support Notes)</option>
                                        <option value="BILLING_ADMIN">Billing Admin (Billing/Subscriptions Only)</option>
                                        <option value="READ_ONLY_ADMIN">Read-Only Admin (No modifications)</option>
                                    </select>
                                </div>

                                {/* Workspace list */}
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.75rem' }}>Workspaces Membership</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {details.workspaces.map((m: any) => (
                                            <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.workspace_id?.name}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Plan: {m.workspace_id?.plan || 'free'}</div>
                                                </div>
                                                <span style={{ fontWeight: 600, color: '#64748b', textTransform: 'capitalize' }}>{m.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Internal Notes list */}
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.75rem' }}>Internal Admin Notes</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {details.notes.length === 0 ? (
                                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No notes logged yet.</div>
                                        ) : (
                                            details.notes.map((n: any) => (
                                                <div key={n._id} style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.75rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                                                    <p style={{ margin: 0, color: '#451a03' }}>{n.note}</p>
                                                    <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '4px' }}>
                                                        Logged by: {n.created_by?.full_name} | {new Date(n.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Write internal note..."
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            required
                                            style={{ fontSize: '0.82rem' }}
                                        />
                                        <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Add</button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Suspend/Unsuspend Confirmation Modal */}
            {showSuspendModal && (
                <div className="modal-overlay" style={{ zIndex: 100000 }}>
                    <form onSubmit={handleSuspend} className="modal-container" style={{ maxWidth: '400px', background: '#ffffff', color: '#0f172a', padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            {details?.user.status === 'SUSPENDED' ? 'Confirm Account Reactivation' : 'Confirm Account Suspension'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            Please provide a brief reason or reference code for changing the status of this user account. This event will be logged.
                        </p>
                        <div className="form-group">
                            <label className="form-label" style={{ color: '#475569' }}>Reason / Explanation *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Terms violations, support request case #102"
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowSuspendModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-danger" style={{ background: details?.user.status === 'SUSPENDED' ? '#10b981' : '#ef4444' }}>
                                {details?.user.status === 'SUSPENDED' ? 'Activate Account' : 'Suspend Account'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </SuperAdminLayout>
    );
};

export default SuperAdminUsers;
