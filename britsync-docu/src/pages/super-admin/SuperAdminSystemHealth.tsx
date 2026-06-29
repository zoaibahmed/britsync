import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Heart } from 'lucide-react';

export const SuperAdminSystemHealth: React.FC = () => {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await apiCall('super-admin/system-health');
                setHealth(res.health);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHealth();
    }, []);

    if (loading) {
        return (
            <SuperAdminLayout title="System Status Diagnostics">
                <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            </SuperAdminLayout>
        );
    }

    return (
        <SuperAdminLayout title="System Status Diagnostics">
            <div style={{ maxWidth: '600px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={18} style={{ color: '#ef4444' }} /> Telemetry Health Check
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>Platform API Engine:</span>
                        <strong style={{ color: '#10b981' }}>{health?.api}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>MongoDB Database State:</span>
                        <strong style={{ color: health?.database === 'CONNECTED' ? '#10b981' : '#ef4444' }}>{health?.database}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>Nodemailer SMTP Transporter:</span>
                        <strong style={{ color: '#10b981' }}>{health?.emailService}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>Stripe API Signature Key:</span>
                        <strong style={{ color: health?.stripeWebhookStatus === 'CONFIGURED' ? '#10b981' : '#ef4444' }}>{health?.stripeWebhookStatus}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>PDF Compiler Engine:</span>
                        <strong style={{ color: '#10b981' }}>{health?.pdfGeneration}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>Active Server Uptime:</span>
                        <strong>{Math.floor(health?.serverUptime / 3600)}h {Math.floor((health?.serverUptime % 3600) / 60)}m</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Platform Build:</span>
                        <strong style={{ fontFamily: 'monospace' }}>{health?.buildVersion} ({health?.deploymentDate})</strong>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminSystemHealth;
