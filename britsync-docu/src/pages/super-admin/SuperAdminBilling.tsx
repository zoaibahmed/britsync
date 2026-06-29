import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { CreditCard, ExternalLink } from 'lucide-react';

export const SuperAdminBilling: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await apiCall('super-admin/billing');
                setSubscriptions(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBilling();
    }, []);

    return (
        <SuperAdminLayout title="Billing & Subscriptions">
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="empty-state">
                        <CreditCard className="empty-state-icon" size={48} />
                        <h3>No subscriptions found</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Workspace Name</th>
                                <th>Owner</th>
                                <th>Plan Tier</th>
                                <th>Status</th>
                                <th>Stripe Cust ID</th>
                                <th>Stripe Sub ID</th>
                                <th>Period Ending</th>
                                <th style={{ textAlign: 'right' }}>Stripe Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub._id}>
                                    <td style={{ fontWeight: 700 }}>{sub.workspaceName}</td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{sub.owner?.full_name || 'N/A'}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{sub.owner?.email}</div>
                                        </div>
                                    </td>
                                    <td style={{ textTransform: 'uppercase', fontWeight: 800 }}>{sub.plan}</td>
                                    <td>
                                        <span className={`badge ${sub.status === 'active' ? 'badge-completed' : 'badge-viewed'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{sub.stripe_customer_id}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{sub.stripe_subscription_id}</td>
                                    <td>{new Date(sub.current_period_end).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <a 
                                            href={`https://dashboard.stripe.com/subscriptions/${sub.stripe_subscription_id}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            Stripe Portal <ExternalLink size={12} />
                                        </a>
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

export default SuperAdminBilling;
