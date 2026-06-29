import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Save } from 'lucide-react';

export const SuperAdminPricing: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    // Editing states
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [monthlyPrice, setMonthlyPrice] = useState(0);
    const [monthlyPriceId, setMonthlyPriceId] = useState('');
    
    // Limits
    const [limitDocs, setLimitDocs] = useState(0);
    const [limitTeam, setLimitTeam] = useState(0);
    const [limitTemplates, setLimitTemplates] = useState(0);
    const [limitStorage, setLimitStorage] = useState(0);
    const [limitBulk, setLimitBulk] = useState(0);

    // Features
    const [featCustomBranding, setFeatCustomBranding] = useState(false);
    const [featSignerOtp, setFeatSignerOtp] = useState(false);
    const [featBulkSend, setFeatBulkSend] = useState(false);
    const [featWebhooks, setFeatWebhooks] = useState(false);
    const [featReports, setFeatReports] = useState(false);

    const fetchPlans = async () => {
        try {
            const list = await apiCall('super-admin/pricing');
            setPlans(list);
            if (list.length > 0 && !selectedPlan) {
                handlePlanSelect(list[0]);
            } else if (selectedPlan) {
                const updated = list.find((p: any) => p.plan_key === selectedPlan.plan_key);
                if (updated) handlePlanSelect(updated);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handlePlanSelect = (plan: any) => {
        setSelectedPlan(plan);
        setDisplayName(plan.display_name);
        setDescription(plan.description || '');
        setMonthlyPrice(plan.monthly_price_display);
        setMonthlyPriceId(plan.stripe_monthly_price_id || '');
        
        // Limits
        setLimitDocs(plan.limits.documents_per_month);
        setLimitTeam(plan.limits.team_members);
        setLimitTemplates(plan.limits.templates);
        setLimitStorage(plan.limits.storage_mb);
        setLimitBulk(plan.limits.bulk_sends);

        // Features
        setFeatCustomBranding(!!plan.features.custom_branding);
        setFeatSignerOtp(!!plan.features.signer_otp);
        setFeatBulkSend(!!plan.features.bulk_send);
        setFeatWebhooks(!!plan.features.webhooks);
        setFeatReports(!!plan.features.reports);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiCall(`super-admin/pricing/${selectedPlan.plan_key}`, {
                method: 'PATCH',
                body: {
                    display_name: displayName,
                    description: description,
                    monthly_price_display: monthlyPrice,
                    stripe_monthly_price_id: monthlyPriceId,
                    limits: {
                        documents_per_month: limitDocs,
                        team_members: limitTeam,
                        templates: limitTemplates,
                        storage_mb: limitStorage,
                        bulk_sends: limitBulk
                    },
                    features: {
                        custom_branding: featCustomBranding,
                        signer_otp: featSignerOtp,
                        bulk_send: featBulkSend,
                        webhooks: featWebhooks,
                        reports: featReports
                    }
                }
            });
            alert('Pricing plan configuration saved successfully!');
            fetchPlans();
        } catch (err: any) {
            alert(err.message || 'Failed to save config');
        }
    };

    return (
        <SuperAdminLayout title="Pricing & Feature Limits">
            {loading ? (
                <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
                    {/* Left tabs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {plans.map((p) => (
                            <button
                                key={p.plan_key}
                                onClick={() => handlePlanSelect(p)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: selectedPlan?.plan_key === p.plan_key ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                                    background: selectedPlan?.plan_key === p.plan_key ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.88rem',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {p.display_name}
                            </button>
                        ))}
                    </div>

                    {/* Right form panel */}
                    {selectedPlan && (
                        <form onSubmit={handleSave} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>
                                Edit {selectedPlan.plan_key} Plan Configuration
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Tier Display Name</label>
                                    <input type="text" className="form-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <input type="text" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Monthly Price (INR)</label>
                                    <input type="number" step="0.01" className="form-input" value={monthlyPrice} onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stripe Monthly Price ID</label>
                                    <input type="text" className="form-input" placeholder="price_123abc..." value={monthlyPriceId} onChange={(e) => setMonthlyPriceId(e.target.value)} />
                                </div>
                            </div>

                            <hr style={{ border: 0, borderTop: '1px solid #e2e8f0' }} />

                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155' }}>Resource Limits</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Documents/mo</label>
                                    <input type="number" className="form-input" value={limitDocs} onChange={(e) => setLimitDocs(parseInt(e.target.value) || 0)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Team Members</label>
                                    <input type="number" className="form-input" value={limitTeam} onChange={(e) => setLimitTeam(parseInt(e.target.value) || 0)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Templates</label>
                                    <input type="number" className="form-input" value={limitTemplates} onChange={(e) => setLimitTemplates(parseInt(e.target.value) || 0)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Storage (MB)</label>
                                    <input type="number" className="form-input" value={limitStorage} onChange={(e) => setLimitStorage(parseInt(e.target.value) || 0)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bulk Sends</label>
                                    <input type="number" className="form-input" value={limitBulk} onChange={(e) => setLimitBulk(parseInt(e.target.value) || 0)} required />
                                </div>
                            </div>

                            <hr style={{ border: 0, borderTop: '1px solid #e2e8f0' }} />

                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155' }}>Feature Toggles</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={featCustomBranding} onChange={(e) => setFeatCustomBranding(e.target.checked)} />
                                    <span>Enable Custom Workspace Branding & Highlight Colors</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={featSignerOtp} onChange={(e) => setFeatSignerOtp(e.target.checked)} />
                                    <span>Enable Multi-factor SMS / Email OTP Signer Authentication</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={featBulkSend} onChange={(e) => setFeatBulkSend(e.target.checked)} />
                                    <span>Enable Bulk Delivery to CSV signer lists</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={featWebhooks} onChange={(e) => setFeatWebhooks(e.target.checked)} />
                                    <span>Enable Real-time developer webhook routing</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={featReports} onChange={(e) => setFeatReports(e.target.checked)} />
                                    <span>Enable Telemetry dashboard & CSV exports</span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                                <Save size={16} style={{ marginRight: '6px' }} /> Save Changes
                            </button>
                        </form>
                    )}
                </div>
            )}
        </SuperAdminLayout>
    );
};

export default SuperAdminPricing;
