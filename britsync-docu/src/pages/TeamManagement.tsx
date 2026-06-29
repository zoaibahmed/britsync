import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Users, Plus, Trash2, Mail, X, Send, Link, Copy, CheckCircle } from 'lucide-react';
import { Select } from '../components/ui/Select';

export const TeamManagement: React.FC = () => {
    const [members, setMembers] = useState<any[]>([]);
    const [joinRequests, setJoinRequests] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(localStorage.getItem('docu_user_role') || 'member');
    const [activeTab, setActiveTab] = useState<'members' | 'invites'>('members');
    const canManageTeam = userRole === 'admin' || userRole === 'owner';

    // Invite User Modal
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [inviting, setInviting] = useState(false);

    // Create Invite Link Modal
    const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
    const [linkRole, setLinkRole] = useState('sender');
    const [linkRequireApproval, setLinkRequireApproval] = useState(false);
    const [linkMaxUses, setLinkMaxUses] = useState(0);
    const [linkExpiry, setLinkExpiry] = useState('');
    const [creatingLink, setCreatingLink] = useState(false);

    // Copy Feedback
    const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

    const fetchJoinRequests = async (workspaceId: string) => {
        try {
            const list = await apiCall(`workspaces/${workspaceId}/admin/join-requests`);
            setJoinRequests(list || []);
        } catch (err) {
            console.error('Failed to fetch join requests:', err);
        }
    };

    const fetchInvites = async (workspaceId: string) => {
        try {
            const list = await apiCall(`workspaces/${workspaceId}/invites`);
            setInvites(list || []);
        } catch (err) {
            console.error('Failed to fetch invites:', err);
        }
    };

    const fetchTeam = async () => {
        try {
            const list = await apiCall('team');
            setMembers(list);
            
            const meRes = await apiCall('auth/me');
            setActiveWorkspace(meRes.workspace);
            if (meRes.workspace && (meRes.role === 'admin' || meRes.role === 'owner')) {
                await fetchJoinRequests(meRes.workspace._id);
                await fetchInvites(meRes.workspace._id);
            }
            
            const role = localStorage.getItem('docu_user_role') || 'member';
            setUserRole(role);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleResolveRequest = async (requestId: string, action: 'approve' | 'reject') => {
        if (!activeWorkspace) return;
        try {
            await apiCall(`workspaces/${activeWorkspace._id}/admin/join-requests/${requestId}/resolve`, {
                method: 'POST',
                body: { action, role: 'member' }
            });
            await fetchJoinRequests(activeWorkspace._id);
            await fetchTeam();
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setInviting(true);
        try {
            await apiCall('team/invite', {
                method: 'POST',
                body: { email: inviteEmail, role: inviteRole }
            });
            setShowInviteModal(false);
            setInviteEmail('');
            setInviteRole('member');
            fetchTeam();
            alert('Invitation sent successfully!');
        } catch (err: any) {
            alert(err.message || 'Invitation failed');
        } finally {
            setInviting(false);
        }
    };

    const handleCreateInviteLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeWorkspace) return;

        setCreatingLink(true);
        try {
            await apiCall(`workspaces/${activeWorkspace._id}/invites`, {
                method: 'POST',
                body: {
                    default_role: linkRole,
                    require_approval: linkRequireApproval,
                    max_uses: linkMaxUses,
                    expires_at: linkExpiry || undefined
                }
            });
            setShowCreateLinkModal(false);
            setLinkRole('sender');
            setLinkRequireApproval(false);
            setLinkMaxUses(0);
            setLinkExpiry('');
            await fetchInvites(activeWorkspace._id);
            alert('Invite link generated successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to generate invite link');
        } finally {
            setCreatingLink(false);
        }
    };

    const handleToggleInviteStatus = async (inviteId: string, currentStatus: string) => {
        if (!activeWorkspace) return;
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        try {
            await apiCall(`workspaces/${activeWorkspace._id}/invites/${inviteId}`, {
                method: 'PATCH',
                body: { status: newStatus }
            });
            await fetchInvites(activeWorkspace._id);
        } catch (err: any) {
            alert(err.message || 'Failed to update invite link status');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!window.confirm('Remove this member from the workspace?')) return;
        try {
            await apiCall(`team/${memberId}`, { method: 'DELETE' });
            fetchTeam();
        } catch (err: any) {
            alert(err.message || 'Failed to remove member');
        }
    };

    const handleChangeRole = async (memberId: string, role: string) => {
        try {
            await apiCall(`team/${memberId}/role`, {
                method: 'PATCH',
                body: { role }
            });
            fetchTeam();
        } catch (err: any) {
            alert(err.message || 'Failed to change role');
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedInviteId(id);
        setTimeout(() => setCopiedInviteId(null), 2000);
    };

    return (
        <DashboardLayout title="Team Management">
            {/* Tabs Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', gap: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('members')}
                    style={{
                        padding: '0.75rem 0.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'members' ? '2px solid #3b82f6' : '2px solid transparent',
                        color: activeTab === 'members' ? '#3b82f6' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                >
                    Team Members
                </button>
                {canManageTeam && (
                    <button
                        onClick={() => setActiveTab('invites')}
                        style={{
                            padding: '0.75rem 0.5rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'invites' ? '2px solid #3b82f6' : '2px solid transparent',
                            color: activeTab === 'invites' ? '#3b82f6' : '#64748b',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        Invite Links
                    </button>
                )}
            </div>

            {/* Header Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        {activeTab === 'members' ? 'Workspace Members' : 'Shareable Invite Links'}
                    </h2>
                </div>
                {canManageTeam && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {activeTab === 'members' ? (
                            <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
                                <Plus size={16} /> Invite Member
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setShowCreateLinkModal(true)}>
                                <Link size={16} style={{ marginRight: '6px' }} /> Create Invite Link
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Members View */}
            {activeTab === 'members' && (
                <>
                    {/* Pending Join Requests Section */}
                    {canManageTeam && joinRequests.length > 0 && (
                        <div style={{
                            background: '#fffbe6',
                            border: '1px solid #ffe58f',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2.5rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#d46b08', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>⏳ Pending Join Requests ({joinRequests.length})</span>
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {joinRequests.map((req) => (
                                    <div 
                                        key={req._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: '1rem',
                                            padding: '1rem',
                                            background: '#ffffff',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1f1f1f', fontSize: '0.9rem' }}>{req.user_id?.full_name}</div>
                                            <div style={{ color: '#8c8c8c', fontSize: '0.8rem', marginTop: '2px' }}>{req.user_id?.email}</div>
                                            <div style={{ color: '#bfbfbf', fontSize: '0.72rem', marginTop: '4px' }}>
                                                Requested: {new Date(req.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => handleResolveRequest(req._id, 'reject')}
                                                className="btn btn-secondary"
                                                style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', color: '#ff4d4f', borderColor: '#ff4d4f', background: 'transparent' }}
                                            >
                                                Reject
                                            </button>
                                            <button 
                                                onClick={() => handleResolveRequest(req._id, 'approve')}
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', background: '#52c41a', borderColor: '#52c41a' }}
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="card-table-wrapper" style={{ margin: 0 }}>
                        {loading ? (
                            <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="empty-state">
                                <Users className="empty-state-icon" size={48} />
                                <h3>No team members</h3>
                            </div>
                        ) : (
                            <table className="docu-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member._id}>
                                            <td style={{ fontWeight: 700 }}>{member.user_id?.full_name || 'Invited User'}</td>
                                            <td>{member.user_id?.email}</td>
                                            <td>
                                                {member.role === 'owner' ? (
                                                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Owner</span>
                                                ) : !canManageTeam ? (
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{member.role}</span>
                                                ) : (
                                                    <div style={{ width: '120px' }}>
                                                        <Select
                                                            value={member.role}
                                                            onChange={(val) => handleChangeRole(member._id, val)}
                                                            options={[
                                                                { value: 'admin', label: 'Admin' },
                                                                { value: 'member', label: 'Member' },
                                                                { value: 'viewer', label: 'Viewer' }
                                                            ]}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${member.status === 'joined' ? 'badge-completed' : 'badge-viewed'}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {canManageTeam && member.role !== 'owner' && (
                                                    <button className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }} onClick={() => handleRemoveMember(member._id)} title="Remove Team Member">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {/* Invite Links View */}
            {activeTab === 'invites' && (
                <div className="card-table-wrapper" style={{ margin: 0 }}>
                    {loading ? (
                        <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : invites.length === 0 ? (
                        <div className="empty-state">
                            <Link className="empty-state-icon" size={48} />
                            <h3>No active invite links</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Generate a shareable join URL for your team.</p>
                        </div>
                    ) : (
                        <table className="docu-table">
                            <thead>
                                <tr>
                                    <th>Invite Link URL</th>
                                    <th>Default Role</th>
                                    <th>Security Guard</th>
                                    <th>Uses count</th>
                                    <th>Expires On</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Disable/Enable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invites.map((invite) => {
                                    const shareUrl = `${window.location.origin}/join/${invite.invite_code}`;
                                    return (
                                        <tr key={invite._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input 
                                                        type="text" 
                                                        readOnly 
                                                        value={shareUrl}
                                                        style={{
                                                            padding: '0.35rem 0.5rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #cbd5e1',
                                                            background: '#f8fafc',
                                                            fontSize: '0.8rem',
                                                            fontFamily: 'monospace',
                                                            width: '260px'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => copyToClipboard(shareUrl, invite._id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.4rem' }}
                                                        title="Copy Share Link"
                                                    >
                                                        {copiedInviteId === invite._id ? <CheckCircle size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ textTransform: 'capitalize', fontWeight: 600 }}>{invite.default_role}</td>
                                            <td>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                    {invite.require_approval ? 'Approval Required' : 'Auto Join'}
                                                </span>
                                            </td>
                                            <td>
                                                {invite.used_count} {invite.max_uses > 0 ? `/ ${invite.max_uses}` : 'uses'}
                                            </td>
                                            <td>{invite.expires_at ? new Date(invite.expires_at).toLocaleDateString() : 'Never'}</td>
                                            <td>
                                                <span className={`badge ${invite.status === 'active' ? 'badge-completed' : 'badge-viewed'}`}>
                                                    {invite.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleToggleInviteStatus(invite._id, invite.status)}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
                                                >
                                                    {invite.status === 'active' ? 'Disable' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Invite User Modal */}
            {showInviteModal && (
                <div className="modal-overlay" style={{ zIndex: 10000 }}>
                    <form onSubmit={handleInvite} className="modal-container" style={{ maxWidth: '420px' }}>
                        <div className="modal-header">
                            <h2>Invite Workspace Member</h2>
                            <button type="button" className="close-btn" onClick={() => setShowInviteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="colleague@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                    <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <Select
                                    label="Role"
                                    value={inviteRole}
                                    onChange={(val) => setInviteRole(val)}
                                    options={[
                                        { value: 'admin', label: 'Admin (Manage documents, templates, contacts)' },
                                        { value: 'member', label: 'Member (Create and send documents)' },
                                        { value: 'viewer', label: 'Viewer (Read-only access)' }
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={inviting}>
                                <Send size={16} /> {inviting ? 'Inviting...' : 'Send Invite'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Create Invite Link Modal */}
            {showCreateLinkModal && (
                <div className="modal-overlay" style={{ zIndex: 10000 }}>
                    <form onSubmit={handleCreateInviteLink} className="modal-container" style={{ maxWidth: '420px' }}>
                        <div className="modal-header">
                            <h2>Generate Invite Link</h2>
                            <button type="button" className="close-btn" onClick={() => setShowCreateLinkModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <Select
                                    label="Default Role for New Joinees"
                                    value={linkRole}
                                    onChange={(val) => setLinkRole(val)}
                                    options={[
                                        { value: 'admin', label: 'Admin Role' },
                                        { value: 'member', label: 'Member Role' },
                                        { value: 'viewer', label: 'Viewer Role' }
                                    ]}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={linkRequireApproval} 
                                        onChange={(e) => setLinkRequireApproval(e.target.checked)} 
                                    />
                                    <span>Require Approval from Administrator</span>
                                </label>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Uses limit (0 = unlimited)</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    value={linkMaxUses} 
                                    onChange={(e) => setLinkMaxUses(parseInt(e.target.value) || 0)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expiration Date (Optional)</label>
                                <input 
                                    type="date" 
                                    className="form-input" 
                                    value={linkExpiry} 
                                    onChange={(e) => setLinkExpiry(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateLinkModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={creatingLink}>
                                <Plus size={16} /> {creatingLink ? 'Generating...' : 'Generate URL'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TeamManagement;
