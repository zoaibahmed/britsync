import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { ShieldAlert } from 'lucide-react';

export const SuperAdminSecurity: React.FC = () => {
    const [suspendedUsers, setSuspendedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSuspended = async () => {
        try {
            const list = await apiCall('super-admin/users?filter=suspended');
            setSuspendedUsers(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuspended();
    }, []);

    return (
        <SuperAdminLayout title="Security Control Center">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={18} /> Active Suspended Users List ({suspendedUsers.length})
            </h3>

            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : suspendedUsers.length === 0 ? (
                    <div className="empty-state">
                        <ShieldAlert className="empty-state-icon" style={{ color: '#10b981' }} size={48} />
                        <h3>No suspended accounts on the platform</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Platform Role</th>
                                <th>Suspended Date</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suspendedUsers.map((u) => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: 700 }}>{u.full_name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.platform_role}</td>
                                    <td>{new Date(u.updatedAt).toLocaleString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className="badge" style={{ background: '#fef2f2', color: '#ef4444' }}>
                                            SUSPENDED
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

export default SuperAdminSecurity;
