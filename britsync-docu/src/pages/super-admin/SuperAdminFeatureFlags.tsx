import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Flag } from 'lucide-react';

export const SuperAdminFeatureFlags: React.FC = () => {
    const [flags, setFlags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const defaultFlags = [
        { key: 'smart_field_suggestions', name: 'Smart Field Suggestions', description: 'Enables automatic text block and signature field suggestion placement using optical margins.' },
        { key: 'public_web_forms', name: 'Public Web Forms', description: 'Enables standalone document link creation for self-signing generic templates.' },
        { key: 'bulk_send', name: 'Bulk Send List Uploads', description: 'Enables signers file upload lists parsing.' },
        { key: 'signer_otp', name: 'SMS Signer Verification', description: 'Enables OTP verification codes delivery before signature approval.' }
    ];

    const fetchFlags = async () => {
        try {
            const list = await apiCall('super-admin/feature-flags');
            // Merge defaults with loaded list to guarantee they exist in UI
            const merged = defaultFlags.map(df => {
                const found = list.find((f: any) => f.key === df.key);
                return found ? found : { ...df, enabled: false, rollout_percentage: 100 };
            });
            setFlags(merged);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlags();
    }, []);

    const handleToggle = async (key: string, enabled: boolean) => {
        try {
            await apiCall(`super-admin/feature-flags/${key}`, {
                method: 'PATCH',
                body: { enabled, rollout_percentage: 100 }
            });
            alert('Feature flag state updated successfully!');
            fetchFlags();
        } catch (err: any) {
            alert(err.message || 'Toggle failed');
        }
    };

    return (
        <SuperAdminLayout title="Feature Flags Control">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : flags.map((flag) => (
                    <div 
                        key={flag.key} 
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ flex: 1, paddingRight: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <Flag size={16} style={{ color: flag.enabled ? '#3b82f6' : '#94a3b8' }} />
                                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{flag.name}</strong>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b' }}>({flag.key})</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{flag.description}</p>
                        </div>
                        <div>
                            <button 
                                className="btn" 
                                style={{
                                    background: flag.enabled ? '#10b981' : '#ffffff',
                                    color: flag.enabled ? '#ffffff' : '#64748b',
                                    border: '1px solid ' + (flag.enabled ? '#10b981' : '#cbd5e1'),
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                }}
                                onClick={() => handleToggle(flag.key, !flag.enabled)}
                            >
                                {flag.enabled ? 'ENABLED' : 'DISABLED'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminFeatureFlags;
