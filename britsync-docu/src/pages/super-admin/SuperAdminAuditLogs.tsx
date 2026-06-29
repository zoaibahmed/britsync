import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Shield } from 'lucide-react';

export const SuperAdminAuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const list = await apiCall('super-admin/audit-logs');
                setLogs(list);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <SuperAdminLayout title="Platform Audit Trail">
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <Shield className="empty-state-icon" size={48} />
                        <h3>No audit events logged</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Admin User</th>
                                <th>Role</th>
                                <th>Action type</th>
                                <th>Target Category</th>
                                <th>Target ID</th>
                                <th>IP Address</th>
                                <th style={{ textAlign: 'right' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td style={{ fontSize: '0.78rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td style={{ fontWeight: 700 }}>{log.actor_admin_id?.full_name || 'System'}</td>
                                    <td style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>{log.actor_role}</td>
                                    <td>
                                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>{log.target_type}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{log.target_id || 'N/A'}</td>
                                    <td>{log.ip_address}</td>
                                    <td style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '0.78rem', color: '#64748b' }}>
                                        {log.reason || 'None'}
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

export default SuperAdminAuditLogs;
