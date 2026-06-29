import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { LifeBuoy, Check } from 'lucide-react';

export const SuperAdminSupport: React.FC = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const list = await apiCall('super-admin/support');
            setTickets(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleResolve = async (id: string) => {
        try {
            await apiCall(`super-admin/support/${id}`, {
                method: 'PATCH',
                body: { status: 'RESOLVED' }
            });
            alert('Ticket marked as resolved!');
            fetchTickets();
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    return (
        <SuperAdminLayout title="Support Center tickets">
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="empty-state">
                        <LifeBuoy className="empty-state-icon" size={48} />
                        <h3>No open support tickets</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((t) => (
                                <tr key={t._id}>
                                    <td style={{ fontWeight: 700 }}>{t.subject}</td>
                                    <td>{t.user_id?.full_name}</td>
                                    <td>{t.user_id?.email}</td>
                                    <td>
                                        <span className="badge" style={{ background: t.priority === 'URGENT' ? '#fef2f2' : '#fffbeb', color: t.priority === 'URGENT' ? '#ef4444' : '#d97706' }}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${t.status === 'RESOLVED' ? 'badge-completed' : 'badge-viewed'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {t.status !== 'RESOLVED' && (
                                            <button 
                                                className="btn btn-primary" 
                                                style={{ padding: '0.4rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#10b981', border: 'none' }}
                                                onClick={() => handleResolve(t._id)}
                                            >
                                                <Check size={12} /> Resolve
                                            </button>
                                        )}
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

export default SuperAdminSupport;
