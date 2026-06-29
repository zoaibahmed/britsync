import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Search, ShieldAlert, Building, RefreshCw, X } from 'lucide-react';

export const SuperAdminWorkspaces: React.FC = () => {
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [planFilter, setPlanFilter] = useState('');

    // Details drawer
    const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
    const [details, setDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [overridePlan, setOverridePlan] = useState('');
    const [overrideReason, setOverrideReason] = useState('');
    const [showOverrideModal, setShowOverrideModal] = useState(false);

    const fetchWorkspaces = async () => {
        try {
            const list = await apiCall(`super-admin/workspaces?search=${encodeURIComponent(searchQuery)}&filter=${planFilter}`);
            setWorkspaces(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, [planFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        fetchWorkspaces();
    };

    const fetchWorkspaceDetails = async (workspaceId: string) => {
        setLoadingDetails(true);
        try {
            const res = await apiCall(`super-admin/workspaces/${workspaceId}`);
            setDetails(res);
            setOverridePlan(res.workspace.plan || 'free');
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleWorkspaceSelect = (ws: any) => {
        setSelectedWorkspace(ws);
        fetchWorkspaceDetails(ws._id);
    };

    const handleCloseDrawer = () => {
        setSelectedWorkspace(null);
        setDetails(null);
        setNoteText('');
        setOverrideReason('');
    };

    const handleOverridePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!overrideReason.trim()) return;

        try {
            await apiCall(`super-admin/workspaces/${selectedWorkspace._id}/plan-override`, {
                method: 'POST',
                body: { plan: overridePlan, reason: overrideReason }
            });
            alert('Workspace plan has been successfully overridden!');
            setShowOverrideModal(false);
            setOverrideReason('');
            fetchWorkspaceDetails(selectedWorkspace._id);
            fetchWorkspaces();
        } catch (err: any) {
            alert(err.message || 'Override failed');
        }
    };

    const handleRecalculateUsage = async () => {
        try {
            await apiCall(`super-admin/workspaces/${selectedWorkspace._id}/recalculate-usage`, { method: 'POST' });
            alert('Workspace usage counters successfully recalculated!');
            fetchWorkspaceDetails(selectedWorkspace._id);
        } catch (err: any) {
            alert(err.message || 'Counter reset failed');
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim()) return;

        try {
            await apiCall('super-admin/notes', {
                method: 'POST',
                body: { target_type: 'WORKSPACE', target_id: selectedWorkspace._id, note: noteText }
            });
            setNoteText('');
            fetchWorkspaceDetails(selectedWorkspace._id);
        } catch (err: any) {
            alert(err.message || 'Failed to save note');
        }
    };

    return (
        <SuperAdminLayout title="Workspaces List">
            {/* Search & Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by name or code..."
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
                        value={planFilter} 
                        onChange={(e) => { setPlanFilter(e.target.value); setLoading(true); }}
                        style={{
                            padding: '0.5rem 2rem 0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                        }}
                    >
                        <option value="">All Tiers</option>
                        <option value="personal">Personal Workspaces</option>
                        <option value="company">Company Workspaces</option>
                        <option value="pro">Pro Plan Tiers</option>
                        <option value="business">Business Plan Tiers</option>
                    </select>
                </div>
            </div>

            {/* Workspaces Table */}
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : workspaces.length === 0 ? (
                    <div className="empty-state">
                        <Building className="empty-state-icon" size={48} />
                        <h3>No workspaces found</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Workspace Name</th>
                                <th>Type</th>
                                <th>Code</th>
                                <th>Owner</th>
                                <th>Current Plan</th>
                                <th>Members</th>
                                <th>Docs Sent</th>
                                <th>Created Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workspaces.map((ws) => (
                                <tr key={ws._id}>
                                    <td 
                                        style={{ fontWeight: 700, color: '#3b82f6', cursor: 'pointer' }}
                                        onClick={() => handleWorkspaceSelect(ws)}
                                    >
                                        {ws.name}
                                    </td>
                                    <td>
                                        <span className={`badge ${ws.workspace_type === 'COMPANY' ? 'badge-completed' : 'badge-viewed'}`}>
                                            {ws.workspace_type}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ws.workspace_code}</td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{ws.owner?.full_name || 'System'}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ws.owner?.email}</div>
                                        </div>
                                    </td>
                                    <td style={{ textTransform: 'capitalize', fontWeight: 700 }}>{ws.plan || 'free'}</td>
                                    <td>{ws.membersCount}</td>
                                    <td>{ws.docsSent}</td>
                                    <td>{new Date(ws.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                                            onClick={() => handleWorkspaceSelect(ws)}
                                        >
                                            View Metrics
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Inspect Drawer */}
            {selectedWorkspace && (
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
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{selectedWorkspace.name}</h3>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Code: {selectedWorkspace.workspace_code}</div>
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
                                {/* Quick statistics counters */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Plan quota count</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                                            {details.usage?.document_count || 0} docs
                                        </div>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Stripe status</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: details.subscription?.status === 'active' ? '#10b981' : '#f59e0b', marginTop: '4px', textTransform: 'uppercase' }}>
                                            {details.subscription?.status || 'No billing'}
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>SaaS Actions</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        
                                        <button 
                                            onClick={() => setShowOverrideModal(true)}
                                            className="btn btn-primary" 
                                            style={{ background: '#6366f1', justifyContent: 'center', width: '100%' }}
                                        >
                                            <ShieldAlert size={14} style={{ marginRight: '6px' }} /> Override Subscription Tier
                                        </button>

                                        <button 
                                            onClick={handleRecalculateUsage}
                                            className="btn btn-secondary" 
                                            style={{ justifyContent: 'center', background: 'transparent', borderColor: '#cbd5e1' }}
                                        >
                                            <RefreshCw size={14} style={{ marginRight: '6px' }} /> Recalculate Quotas
                                        </button>
                                    </div>
                                </div>

                                {/* Stripe configuration metadata */}
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem' }}>Stripe Customer Details</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                                        <div>
                                            <span style={{ color: '#64748b' }}>Stripe Cust ID:</span> <strong style={{ fontFamily: 'monospace' }}>{details.subscription?.stripe_customer_id || 'N/A'}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#64748b' }}>Stripe Sub ID:</span> <strong style={{ fontFamily: 'monospace' }}>{details.subscription?.stripe_subscription_id || 'N/A'}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#64748b' }}>Period Ends:</span> <strong>{details.subscription?.current_period_end ? new Date(details.subscription.current_period_end).toLocaleDateString() : 'N/A'}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Members table */}
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.75rem' }}>Active Team Members ({details.members.length})</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                                        {details.members.map((m: any) => (
                                            <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.user_id?.full_name}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{m.user_id?.email}</div>
                                                </div>
                                                <span style={{ fontWeight: 600, color: '#64748b', textTransform: 'capitalize' }}>{m.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes panel */}
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

            {/* Override Tier Confirmation Modal */}
            {showOverrideModal && (
                <div className="modal-overlay" style={{ zIndex: 100000 }}>
                    <form onSubmit={handleOverridePlan} className="modal-container" style={{ maxWidth: '400px', background: '#ffffff', color: '#0f172a', padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Override Workspace Plan</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            You are overriding the billing settings for this workspace. Enter the plan and provide a reason.
                        </p>
                        
                        <div className="form-group">
                            <label className="form-label" style={{ color: '#475569' }}>Workspace Plan Tier *</label>
                            <select 
                                value={overridePlan}
                                onChange={(e) => setOverridePlan(e.target.value)}
                                className="form-input"
                            >
                                <option value="free">Free Tier</option>
                                <option value="pro">Pro Company</option>
                                <option value="business">Business Company</option>
                                <option value="enterprise">Enterprise Contract</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label" style={{ color: '#475569' }}>Reason for override *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Sales comp plan, manual bank billing"
                                value={overrideReason}
                                onChange={(e) => setOverrideReason(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowOverrideModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ background: '#6366f1' }}>Confirm Override</button>
                        </div>
                    </form>
                </div>
            )}
        </SuperAdminLayout>
    );
};

export default SuperAdminWorkspaces;
