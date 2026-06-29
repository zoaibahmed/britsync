import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { 
    Users, Building, CreditCard, FileText, CheckCircle, AlertTriangle, 
    TrendingUp, Activity, Inbox, ShieldCheck, Calendar, ArrowUpRight
} from 'lucide-react';

export const SuperAdminOverview: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await apiCall('super-admin/dashboard');
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    if (loading) {
        return (
            <SuperAdminLayout title="Platform Telemetry Cockpit">
                <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            </SuperAdminLayout>
        );
    }

    const { metrics, recentActivity } = data || {};

    const cards = [
        { title: 'Total Users', value: metrics?.totalUsers, icon: <Users size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.05)' },
        { title: 'Active Users', value: metrics?.activeUsers, icon: <ShieldCheck size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.05)' },
        { title: 'Total Workspaces', value: metrics?.totalWorkspaces, icon: <Building size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.05)' },
        { title: 'Monthly Revenue', value: `${(metrics?.monthlyRevenue || 0).toFixed(2)} INR`, icon: <CreditCard size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.05)' },
        { title: 'Documents Sent', value: metrics?.totalDocs, icon: <FileText size={20} />, color: '#ec4899', bg: 'rgba(236,72,153,0.05)' },
        { title: 'Docs Completed', value: metrics?.docsCompleted, icon: <CheckCircle size={20} />, color: '#14b8a6', bg: 'rgba(20,184,166,0.05)' },
        { title: 'Docs Failed', value: metrics?.docsFailed, icon: <AlertTriangle size={20} />, color: '#ef4444', bg: 'rgba(239,68,68,0.05)' },
        { title: 'Active Subscriptions', value: metrics?.activeSubs, icon: <TrendingUp size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.05)' }
    ];

    // SVG Line Chart builder for Document Uploads (7 days trend)
    const docDataPoints = metrics?.dailyDocuments || [];
    const maxDocVal = Math.max(...docDataPoints.map((d: any) => d.value), 10);
    const linePathD = docDataPoints.map((d: any, idx: number) => {
        const x = 40 + (idx / 6) * 440;
        const y = 20 + 120 - (d.value / maxDocVal) * 120;
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const lineAreaD = docDataPoints.length > 0 ? `${linePathD} L ${40 + 440} 140 L 40 140 Z` : '';

    // SVG Bar Chart builder for User Registrations (7 days trend)
    const regDataPoints = metrics?.dailyRegistrations || [];
    const maxRegVal = Math.max(...regDataPoints.map((d: any) => d.value), 10);

    return (
        <SuperAdminLayout title="Platform Telemetry Cockpit">
            {/* Stats Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {cards.map((card) => (
                    <div 
                        key={card.title} 
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{card.title}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{card.value}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* UPGRADED: Telemetry Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                
                {/* 1. Line Chart: Document Upload Volume */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} style={{ color: '#ec4899' }} /> Document Sent Volume
                        </h3>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '2px', background: '#ecfdf5', padding: '2px 8px', borderRadius: '999px' }}>
                            <ArrowUpRight size={12} /> Active
                        </span>
                    </div>
                    
                    {docDataPoints.length === 0 ? (
                        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data logs recorded.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg viewBox="0 0 520 180" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="doc-glow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />
                                
                                {/* Glow Area */}
                                <path d={lineAreaD} fill="url(#doc-glow)" />

                                {/* Line Path */}
                                <path d={linePathD} fill="none" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                                {/* Points circles */}
                                {docDataPoints.map((d: any, idx: number) => {
                                    const x = 40 + (idx / 6) * 440;
                                    const y = 20 + 120 - (d.value / maxDocVal) * 120;
                                    return (
                                        <g key={idx}>
                                            <circle cx={x} cy={y} r="5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
                                            <text x={x} y={y - 8} fontSize="9" fontWeight="800" fill="#475569" textAnchor="middle">{d.value}</text>
                                            <text x={x} y="156" fontSize="9.5" fontWeight="700" fill="#64748b" textAnchor="middle">{d.label}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>

                {/* 2. Bar Chart: User Registration Trends */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={16} style={{ color: '#3b82f6' }} /> User Signups (7 Days)
                        </h3>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '2px', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px' }}>
                            <Calendar size={12} /> Week View
                        </span>
                    </div>

                    {regDataPoints.length === 0 ? (
                        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No signup logs tracked.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg viewBox="0 0 520 180" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                                {/* Grid lines */}
                                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

                                {/* Bars */}
                                {regDataPoints.map((d: any, idx: number) => {
                                    const barWidth = 28;
                                    const containerWidth = 440 / 7;
                                    const x = 40 + idx * containerWidth + (containerWidth - barWidth) / 2;
                                    
                                    const barHeight = (d.value / maxRegVal) * 120;
                                    const y = 20 + 120 - barHeight;

                                    return (
                                        <g key={idx}>
                                            <rect 
                                                x={x} 
                                                y={y} 
                                                width={barWidth} 
                                                height={barHeight} 
                                                rx="5" 
                                                fill="linear-gradient(to top, #2563eb, #3b82f6)" 
                                                style={{ fill: '#3b82f6' }}
                                            />
                                            <text x={x + barWidth / 2} y={y - 6} fontSize="9" fontWeight="800" fill="#475569" textAnchor="middle">{d.value}</text>
                                            <text x={x + barWidth / 2} y="156" fontSize="9.5" fontWeight="700" fill="#64748b" textAnchor="middle">{d.label}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>

            </div>

            {/* Layout Grid: Detailed Metrics & Timelines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                
                {/* Plans & Usage Breakdown */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Inbox size={16} style={{ color: '#3b82f6' }} /> Subscriptions & Plans
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                <span>Free Tier Workspace</span>
                                <span>{metrics?.freeUsers}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                                <div style={{ height: '100%', background: '#64748b', borderRadius: '3px', width: `${(metrics?.freeUsers / (metrics?.totalWorkspaces || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                <span>Pro Tier Workspace</span>
                                <span>{metrics?.proUsers}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                                <div style={{ height: '100%', background: '#3b82f6', borderRadius: '3px', width: `${(metrics?.proUsers / (metrics?.totalWorkspaces || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                <span>Business Tier Workspace</span>
                                <span>{metrics?.businessUsers}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                                <div style={{ height: '100%', background: '#10b981', borderRadius: '3px', width: `${(metrics?.businessUsers / (metrics?.totalWorkspaces || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <hr style={{ border: 0, borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }} />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Emails Delivered</div>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{metrics?.emailsSent}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Storage Occupied</div>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{metrics?.storageUsedMb} MB</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Administrative Activity Timeline */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={16} style={{ color: '#10b981' }} /> Recent Administrative Actions
                    </h3>
                    {recentActivity.length === 0 ? (
                        <div style={{ display: 'flex', padding: '2rem', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                            No admin operations performed yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.88rem' }}>
                            {recentActivity.map((log: any) => (
                                <div key={log._id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '4px' }}></div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{log.actor_admin_id?.full_name || 'Admin'}</span>
                                        <span style={{ color: '#64748b' }}> {log.action.replace(/_/g, ' ')}</span>
                                        {log.reason && <span style={{ fontStyle: 'italic', color: '#94a3b8' }}> ({log.reason})</span>}
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                            {new Date(log.createdAt).toLocaleString()} | IP: {log.ip_address}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminOverview;
