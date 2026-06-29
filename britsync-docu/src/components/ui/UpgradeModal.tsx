import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    lockedFeature: string;
    requiredPlan: 'pro' | 'business' | 'enterprise';
    currentPlan: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onClose,
    lockedFeature,
    requiredPlan,
    currentPlan
}) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const benefitsMap: Record<string, string[]> = {
        pro: [
            'Up to 50 documents executed monthly',
            'Add up to 5 team members to your corporate workspace',
            'Save document drafts as shareable Templates',
            'Workspace branding (custom logos and highlights)'
        ],
        business: [
            'Up to 500 documents executed monthly',
            'Add up to 50 team members to your corporate workspace',
            'Enable SMS & Email OTP signer authentication',
            'Send document link lists via Bulk Send uploads',
            'Developer webhooks integration & API keys'
        ],
        enterprise: [
            'Unlimited custom templates & volume',
            'Dedicated database instances & sandbox environments',
            'Priority 24/7 SLAs & custom training modules'
        ]
    };

    const benefits = benefitsMap[requiredPlan] || [];

    const handleUpgrade = () => {
        onClose();
        // Redirect to onboarding subscription choose page
        navigate('/onboarding?action=create');
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header glow banner */}
                <div style={{
                    background: requiredPlan === 'business' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    height: '6px'
                }}></div>

                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '4px',
                        borderRadius: '6px'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: requiredPlan === 'business' ? '#ecfdf5' : '#eff6ff',
                            color: requiredPlan === 'business' ? '#10b981' : '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                Upgrade to unlock {lockedFeature}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                                Requires a **{requiredPlan.toUpperCase()}** subscription (Current plan: {currentPlan.toUpperCase()})
                            </p>
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem' }}>
                            Features included in {requiredPlan.toUpperCase()} Plan:
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {benefits.map((benefit, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.8rem', color: '#334155' }}>
                                    <Check size={14} style={{ color: requiredPlan === 'business' ? '#10b981' : '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'transparent', borderColor: '#cbd5e1' }}
                        >
                            Maybe Later
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={handleUpgrade}
                            style={{ 
                                padding: '0.6rem 1.5rem', 
                                fontSize: '0.85rem', 
                                background: requiredPlan === 'business' ? '#10b981' : '#3b82f6',
                                border: 'none'
                            }}
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
