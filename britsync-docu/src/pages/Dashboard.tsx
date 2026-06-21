import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
    FileText, CheckCircle2, Clock, Layers, Users, Plus, UserPlus, 
    FileUp, Activity, Eye, Download, ShieldCheck, Sparkles, 
    AlertCircle, CheckSquare, Send, Check
} from 'lucide-react';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [allDocs, setAllDocs] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [contactsCount, setContactsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [toast, setToast] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, docsRes, activitiesRes, contactsRes] = await Promise.all([
                    apiCall('dashboard/stats'),
                    apiCall('documents'),
                    apiCall('dashboard/activity'),
                    apiCall('contacts')
                ]);
                setStats(statsRes);
                setAllDocs(docsRes || []);
                setActivities(activitiesRes || []);
                setContactsCount(contactsRes?.length || 0);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const showToastMsg = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleResendReminder = async (id: string) => {
        try {
            await apiCall(`documents/${id}/resend`, { method: 'POST' });
            showToastMsg('Reminder notification email dispatched!');
        } catch (err: any) {
            alert(err.message || 'Failed to dispatch reminder');
        }
    };

    // Calculate dynamic stats
    const totalDocs = allDocs.length;
    const completedDocs = allDocs.filter(d => d.status === 'completed').length;
    const pendingDocs = allDocs.filter(d => ['sent', 'viewed'].includes(d.status)).length;
    // Completion rate
    const completionRate = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;
    
    // Recent Documents filtering
    const filteredDocs = allDocs.filter(doc => {
        const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.recipients?.[0]?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.recipients?.[0]?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedStatusFilter === 'all') return matchesSearch;
        if (selectedStatusFilter === 'waiting') return matchesSearch && ['sent', 'viewed'].includes(doc.status);
        return matchesSearch && doc.status === selectedStatusFilter;
    });

    // Onboarding checklist calculations
    const onboardingChecklist = [
        { id: 'upload', text: 'Upload your first PDF', checked: totalDocs > 0 },
        { id: 'place', text: 'Place configuration fields', checked: allDocs.some(d => d.fields?.length > 0) },
        { id: 'recipient', text: 'Add recipient details', checked: allDocs.some(d => d.recipients?.length > 0) },
        { id: 'send', text: 'Send secure signature link', checked: allDocs.some(d => d.status !== 'draft') },
        { id: 'download', text: 'Download signed PDF document', checked: completedDocs > 0 }
    ];
    const completedOnboardingCount = onboardingChecklist.filter(item => item.checked).length;

    // Detailed Stats Cards configuration
    const cardItems = [
        { title: 'Total Documents', value: totalDocs, icon: <FileText size={16} />, color: '#3b82f6', bg: '#eff6ff' },
        { title: 'Awaiting Signature', value: pendingDocs, icon: <Clock size={16} />, color: '#f59e0b', bg: '#fffbeb' },
        { title: 'Completed Documents', value: completedDocs, icon: <CheckCircle2 size={16} />, color: '#10b981', bg: '#ecfdf5' },
        { title: 'Completion Rate', value: `${completionRate}%`, icon: <CheckSquare size={16} />, color: '#8b5cf6', bg: '#f5f3ff' },
        { title: 'Templates', value: stats?.templates || 0, icon: <Layers size={16} />, color: '#ec4899', bg: '#fdf2f8' },
        { title: 'Contacts Directory', value: contactsCount, icon: <Users size={16} />, color: '#06b6d4', bg: '#ecfeff' }
    ];

    // Find documents that need reminders (Awaiting signature and not completed)
    const pendingReminders = allDocs.filter(d => ['sent', 'viewed'].includes(d.status)).slice(0, 3);

    if (loading) {
        return (
            <DashboardLayout title="Dashboard">
                <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Dashboard">
            {/* Welcoming header and actions */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
                borderRadius: '16px',
                padding: '2.25rem',
                color: 'white',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
            }}>
                {/* Abstract graphic decoration */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '320px',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0) 70%)',
                    filter: 'blur(30px)',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, width: 'max-content', marginBottom: '0.85rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <Sparkles size={12} style={{ color: '#60a5fa' }} /> BritSync Docu Command Center
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.75px', margin: 0 }}>
                            Welcome back to your Workspace
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem', maxWidth: '500px', lineHeight: 1.5 }}>
                            Manage your legal contracts, design reusable templates, and dispatch secure signature links from a single page.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }} onClick={() => navigate('/contacts')}>
                            <UserPlus size={15} /> Add Contact
                        </button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }} onClick={() => navigate('/templates')}>
                            <Layers size={15} /> Templates
                        </button>
                        <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }} onClick={() => navigate('/documents/new')}>
                            <Plus size={15} /> New Document
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Onboarding Checklist & Analytics Graph Row */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Onboarding Checklist Card */}
                    <div style={{ flex: 1.1, minWidth: '320px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <ShieldCheck size={16} style={{ color: '#2563eb' }} /> Getting Started Checklist
                                </h3>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>
                                    {completedOnboardingCount}/5 Completed
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                                Follow these quick steps to fully configure your workspace and verify e-sign setups.
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {onboardingChecklist.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: item.checked ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                                            background: item.checked ? '#ecfdf5' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#10b981',
                                            flexShrink: 0
                                        }}>
                                            {item.checked && <Check size={11} strokeWidth={3} />}
                                        </div>
                                        <span style={{ color: item.checked ? '#64748b' : '#334155', textDecoration: item.checked ? 'line-through' : 'none', fontWeight: item.checked ? 500 : 700 }}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* HSL Gradient SVG Dashboard Chart */}
                    <div style={{ flex: 1.9, minWidth: '340px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Document Volume Trends</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Overview of documents sent and successfully completed over the past months.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', fontWeight: 700 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }} />
                                    <span style={{ color: '#64748b' }}>Dispatched</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
                                    <span style={{ color: '#64748b' }}>Completed</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* SVG Responsive Area Trend Chart */}
                        <div style={{ flex: 1, minHeight: '120px', position: 'relative', borderBottom: '1px solid #f1f5f9', paddingTop: '10px' }}>
                            <svg viewBox="0 0 500 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="chartBlue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="chartGreen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Grid Lines */}
                                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />

                                {/* Sent documents area & line */}
                                <path d="M 0,110 L 0,85 L 100,55 L 200,65 L 300,35 L 400,20 L 500,10 L 500,120 L 0,120 Z" fill="url(#chartBlue)" />
                                <path d="M 0,85 L 100,55 L 200,65 L 300,35 L 400,20 L 500,10" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />

                                {/* Completed documents area & line */}
                                <path d="M 0,110 L 0,95 L 100,75 L 200,80 L 300,50 L 400,35 L 500,15 L 500,120 L 0,120 Z" fill="url(#chartGreen)" />
                                <path d="M 0,95 L 100,75 L 200,80 L 300,50 L 400,35 L 500,15" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                        </div>
                    </div>
                </div>

                {/* 6-Item High Fidelity Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
                    {cardItems.map((card, idx) => (
                        <div key={idx} style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = '#bfdbfe';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.25px' }}>{card.title}</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{card.value}</div>
                            </div>
                            <div style={{
                                background: card.bg,
                                color: card.color,
                                padding: '0.6rem',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {card.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pending Reminders Dashboard Card */}
                {pendingReminders.length > 0 && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309' }}>
                            <AlertCircle size={16} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Documents needing attention</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {pendingReminders.map(doc => (
                                <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(253, 230, 138, 0.4)', paddingBottom: '0.4rem', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={14} style={{ color: '#d97706' }} />
                                        <span style={{ fontWeight: 800, color: '#78350f' }}>{doc.document_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#92400e' }}>Awaiting: {doc.recipients?.[0]?.name}</span>
                                        <button className="btn" style={{ padding: '0.25rem 0.65rem', background: '#d97706', color: 'white', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleResendReminder(doc._id)}>
                                            <Send size={10} /> Remind
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Documents Table & Activity Timeline Split */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Recent Documents with filter/search */}
                    <div style={{ flex: 1.9, minWidth: '320px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>Recent Documents</h3>
                            <button className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => navigate('/documents')}>
                                View All
                            </button>
                        </div>

                        {/* Search & Filter chips */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', height: '34px', borderRadius: '6px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'draft', label: 'Drafts' },
                                    { id: 'waiting', label: 'Waiting' },
                                    { id: 'completed', label: 'Completed' }
                                ].map(chip => (
                                    <button
                                        key={chip.id}
                                        onClick={() => setSelectedStatusFilter(chip.id)}
                                        style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '0.35rem 0.8rem',
                                            borderRadius: '6px',
                                            border: selectedStatusFilter === chip.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                                            background: selectedStatusFilter === chip.id ? '#eff6ff' : 'white',
                                            color: selectedStatusFilter === chip.id ? '#2563eb' : '#64748b',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {chip.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            {filteredDocs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '10px' }}>
                                    <FileUp size={32} style={{ opacity: 0.5, margin: '0 auto 0.75rem auto', display: 'block' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>No matching documents found</span>
                                </div>
                            ) : (
                                <table className="docu-table" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem' }}>Name</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem' }}>Recipient</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem' }}>Status</th>
                                            <th style={{ textAlign: 'right', padding: '0.75rem 0.5rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDocs.slice(0, 6).map(doc => (
                                            <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ fontWeight: 800, padding: '0.75rem 0.5rem', color: '#0f172a' }}>{doc.document_name}</td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                                                    {doc.recipients?.[0] ? `${doc.recipients[0].name} (${doc.recipients[0].email})` : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>None</span>}
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span className={`badge badge-${doc.status}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{doc.status}</span>
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0.5rem' }}>
                                                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                                                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.55rem', borderRadius: '6px' }} onClick={() => navigate(`/documents/${doc._id}/editor`)} title="View/Edit">
                                                            <Eye size={13} />
                                                        </button>
                                                        {doc.status === 'completed' && doc.final_file_url && (
                                                            <a href={doc.final_file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.35rem 0.55rem', borderRadius: '6px' }} title="Download Signed PDF">
                                                                <Download size={13} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Timeline Log Activity */}
                    <div style={{ flex: 1.1, minWidth: '280px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem' }}>Timeline Activity</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                            {activities.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3.5rem 0', color: '#94a3b8', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '10px' }}>
                                    <Activity size={24} style={{ margin: '0 auto 0.75rem auto', display: 'block', opacity: 0.5 }} />
                                    No activity logs found.
                                </div>
                            ) : (
                                activities.slice(0, 5).map(act => (
                                    <div key={act._id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
                                        <div style={{
                                            background: '#eff6ff',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Activity size={13} style={{ color: '#2563eb' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontWeight: 800, color: '#1e293b' }}>
                                                {act.user_id?.full_name || 'Signer'}
                                            </span>{' '}
                                            <span style={{ color: '#64748b' }}>
                                                {act.event_type.replace(/_/g, ' ').toLowerCase()}
                                            </span>{' '}
                                            <strong style={{ color: '#334155' }}>
                                                {act.document_id?.document_name}
                                            </strong>
                                            <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                                {new Date(act.createdAt).toLocaleString('en-GB')}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast overlay feedback */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    background: '#1e293b',
                    color: 'white',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    zIndex: 2000
                }}>
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                    <span>{toast}</span>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Dashboard;
