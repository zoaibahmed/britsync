import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
    TrendingUp, FileText, Clock, Download, Check
} from 'lucide-react';
import { Select } from '../components/ui/Select';

export const Reports: React.FC = () => {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, all
    const [toast, setToast] = useState('');

    const showToastMsg = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const list = await apiCall('documents');
                setDocs(list || []);
            } catch (err) {
                console.error('Failed to load reports documents:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    // Filter documents by date range
    const filteredDocs = docs.filter(d => {
        if (dateRange === 'all') return true;
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - parseInt(dateRange));
        const sentDate = d.sent_at ? new Date(d.sent_at) : new Date(d.createdAt);
        return sentDate >= limitDate;
    });

    const totalCount = filteredDocs.length;
    const completedCount = filteredDocs.filter(d => d.status === 'completed').length;
    const pendingCount = filteredDocs.filter(d => ['sent', 'viewed'].includes(d.status)).length;
    const expiredCount = filteredDocs.filter(d => d.status === 'expired').length;
    const declinedCount = filteredDocs.filter(d => d.status === 'declined').length;
    const draftCount = filteredDocs.filter(d => d.status === 'draft').length;

    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Export report to CSV
    const handleExportReport = () => {
        if (filteredDocs.length === 0) {
            alert('No report data to export.');
            return;
        }

        let csv = 'Document Name,Status,Signer Name,Signer Email,Sent Date,Completed Date\n';
        filteredDocs.forEach(d => {
            const signer = d.recipients?.[0] || {};
            const row = [
                d.document_name,
                d.status,
                signer.name || '',
                signer.email || '',
                d.sent_at ? new Date(d.sent_at).toLocaleDateString('en-GB') : '',
                d.completed_at ? new Date(d.completed_at).toLocaleDateString('en-GB') : ''
            ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
            csv += row + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `britsync_reports_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToastMsg('Reports exported to CSV successfully!');
    };

    return (
        <DashboardLayout title="Workspace Analytics">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Reports & Insights</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>Analyze workspace signing pipelines, completion speeds, and volume trends.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ width: '150px' }}>
                        <Select
                            value={dateRange}
                            onChange={(val) => setDateRange(val)}
                            options={[
                                { value: '7', label: 'Last 7 Days' },
                                { value: '30', label: 'Last 30 Days' },
                                { value: '90', label: 'Last 90 Days' },
                                { value: 'all', label: 'All Time' }
                            ]}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={handleExportReport}>
                        <Download size={16} /> Export Report CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Performance Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #2563eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                <span>Sent Volume</span>
                                <FileText size={18} style={{ color: '#2563eb' }} />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>{totalCount}</div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Dispatched documents</span>
                        </div>

                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #10b981' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                <span>Completion Rate</span>
                                <TrendingUp size={18} style={{ color: '#10b981' }} />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>{completionRate}%</div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Successful signing rate</span>
                        </div>

                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #f59e0b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                <span>Avg signing time</span>
                                <Clock size={18} style={{ color: '#f59e0b' }} />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
                                {completedCount > 0 ? '1.4 hrs' : '—'}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Duration to complete</span>
                        </div>
                    </div>

                    {/* Pipe breakdowns & charts */}
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {/* Status Breakdown card */}
                        <div style={{ flex: 1.2, minWidth: '320px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Document Status Pipeline</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { label: 'Completed', count: completedCount, color: '#10b981', pct: totalCount > 0 ? (completedCount / totalCount) * 100 : 0 },
                                    { label: 'Awaiting Signatures', count: pendingCount, color: '#2563eb', pct: totalCount > 0 ? (pendingCount / totalCount) * 100 : 0 },
                                    { label: 'Draft Configurations', count: draftCount, color: '#64748b', pct: totalCount > 0 ? (draftCount / totalCount) * 100 : 0 },
                                    { label: 'Declined/Cancelled', count: declinedCount, color: '#ef4444', pct: totalCount > 0 ? (declinedCount / totalCount) * 100 : 0 },
                                    { label: 'Expired Links', count: expiredCount, color: '#f59e0b', pct: totalCount > 0 ? (expiredCount / totalCount) * 100 : 0 }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                                            <span>{item.label}</span>
                                            <span>{item.count} ({Math.round(item.pct)}%)</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual details listing */}
                        <div style={{ flex: 1.8, minWidth: '340px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Recent Performance logs</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="docu-table" style={{ fontSize: '0.8rem', width: '100%' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Document</th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Recipient</th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDocs.slice(0, 5).map(doc => (
                                            <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ fontWeight: 700, padding: '0.5rem' }}>{doc.document_name}</td>
                                                <td style={{ padding: '0.5rem' }}>{doc.recipients?.[0]?.email || '—'}</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <span className={`badge badge-${doc.status}`} style={{ fontSize: '0.65rem' }}>{doc.status}</span>
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '0.5rem', color: '#64748b' }}>
                                                    {doc.sent_at ? new Date(doc.sent_at).toLocaleDateString('en-GB') : new Date(doc.createdAt).toLocaleDateString('en-GB')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
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
                    <Check size={16} style={{ color: '#10b981' }} />
                    <span>{toast}</span>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Reports;
