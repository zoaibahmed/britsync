import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { ShieldCheck } from 'lucide-react';

export const SuperAdminUsage: React.FC = () => {
    const [usageAlerts, setUsageAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                // Fetch workspaces near limits
                const workspaces = await apiCall('super-admin/workspaces');
                const alerts: any[] = [];
                
                for (const ws of workspaces) {
                    const detail = await apiCall(`super-admin/workspaces/${ws._id}`);
                    const limit = ws.plan === 'pro' ? 50 : ws.plan === 'business' ? 500 : 5;
                    const used = detail.usage?.document_count || 0;
                    const percent = (used / limit) * 100;
                    
                    if (percent >= 80) {
                        alerts.push({
                            ...ws,
                            used,
                            limit,
                            percent: percent.toFixed(0)
                        });
                    }
                }
                setUsageAlerts(alerts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsage();
    }, []);

    return (
        <SuperAdminLayout title="Usage & Quota Monitoring">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#334155', marginBottom: '1.25rem' }}>
                Workspaces Near or Exceeding Subscription Limits (≥80%)
            </h3>

            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : usageAlerts.length === 0 ? (
                    <div className="empty-state">
                        <ShieldCheck className="empty-state-icon" style={{ color: '#10b981' }} size={48} />
                        <h3>All workspaces are within safe limits</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Workspace Name</th>
                                <th>Tier Plan</th>
                                <th>Documents Sent</th>
                                <th>Quota Limit</th>
                                <th>Usage Percentage</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usageAlerts.map((ws) => (
                                <tr key={ws._id}>
                                    <td style={{ fontWeight: 700 }}>{ws.name}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{ws.plan}</td>
                                    <td style={{ fontWeight: 600 }}>{ws.used}</td>
                                    <td>{ws.limit}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ flex: 1, minWidth: '80px', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                                                <div style={{ height: '100%', background: parseInt(ws.percent) >= 100 ? '#ef4444' : '#f59e0b', borderRadius: '3px', width: `${Math.min(parseInt(ws.percent), 100)}%` }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: parseInt(ws.percent) >= 100 ? '#ef4444' : '#f59e0b' }}>
                                                {ws.percent}%
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className="badge" style={{ background: parseInt(ws.percent) >= 100 ? '#fef2f2' : '#fffbeb', color: parseInt(ws.percent) >= 100 ? '#ef4444' : '#d97706' }}>
                                            {parseInt(ws.percent) >= 100 ? 'EXCEEDED' : 'WARNING'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminUsage;
