import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Mail, RotateCcw } from 'lucide-react';

export const SuperAdminEmails: React.FC = () => {
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEmails = async () => {
        try {
            const list = await apiCall('super-admin/emails');
            setEmails(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const handleRetry = async (id: string) => {
        try {
            await apiCall(`super-admin/emails/${id}/retry`, { method: 'POST' });
            alert('Email delivery retried successfully!');
            fetchEmails();
        } catch (err: any) {
            alert(err.message || 'Retry failed');
        }
    };

    return (
        <SuperAdminLayout title="Email Delivery Logs">
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : emails.length === 0 ? (
                    <div className="empty-state">
                        <Mail className="empty-state-icon" size={48} />
                        <h3>No emails sent yet</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Sent At</th>
                                <th>Recipient</th>
                                <th>Subject</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Provider Message ID</th>
                                <th>Error / Reason</th>
                                <th style={{ textAlign: 'right' }}>Retry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails.map((e) => (
                                <tr key={e._id}>
                                    <td style={{ fontSize: '0.78rem' }}>{new Date(e.createdAt).toLocaleString()}</td>
                                    <td style={{ fontWeight: 700 }}>{e.recipient_email}</td>
                                    <td>{e.subject}</td>
                                    <td>
                                        <span style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', textTransform: 'capitalize' }}>
                                            {e.email_type.toLowerCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${e.status === 'SENT' ? 'badge-completed' : 'badge-viewed'}`} style={{ background: e.status === 'FAILED' ? '#fef2f2' : undefined, color: e.status === 'FAILED' ? '#ef4444' : undefined }}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{e.provider_message_id || 'N/A'}</td>
                                    <td style={{ fontSize: '0.78rem', color: '#ef4444' }}>{e.error_message || 'N/A'}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {e.status === 'FAILED' && (
                                            <button 
                                                className="btn btn-secondary" 
                                                style={{ padding: '0.4rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                onClick={() => handleRetry(e._id)}
                                            >
                                                <RotateCcw size={12} /> Retry
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

export default SuperAdminEmails;
