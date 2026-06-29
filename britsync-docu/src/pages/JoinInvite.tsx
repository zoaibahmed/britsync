import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { ShieldCheck, AlertCircle, Clock } from 'lucide-react';

export const JoinInvite: React.FC = () => {
    const { inviteCode } = useParams<{ inviteCode: string }>();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joinedState, setJoinedState] = useState<'idle' | 'pending' | 'joined'>('idle');

    useEffect(() => {
        const verifyInvite = async () => {
            const token = localStorage.getItem('docu_token');
            if (!token) {
                // Store invite code in local storage and redirect to login
                localStorage.setItem('pending_invite_code', inviteCode || '');
                navigate('/login');
                return;
            }

            try {
                // Call join API directly to verify or join
                const res = await apiCall(`join/${inviteCode}`, { method: 'POST' });
                if (res.status === 'joined') {
                    setJoinedState('joined');
                    // Store new token if returned
                    if (res.token) localStorage.setItem('docu_token', res.token);
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else if (res.status === 'pending_approval') {
                    setJoinedState('pending');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to process invite link.');
            } finally {
                setLoading(false);
            }
        };

        verifyInvite();
    }, [inviteCode]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            fontFamily: '"Inter", sans-serif',
            padding: '1.5rem'
        }}>
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '2.5rem',
                maxWidth: '460px',
                width: '100%',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
                textAlign: 'center'
            }}>
                {loading ? (
                    <div style={{ padding: '2rem' }}>
                        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }}></div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Processing your invitation...</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Verifying security credentials and workspace access.</p>
                    </div>
                ) : error ? (
                    <div>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#fef2f2',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <AlertCircle size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.75rem' }}>Invite Verification Failed</h3>
                        <p style={{ fontSize: '0.88rem', color: '#7f1d1d', lineHeight: 1.5, marginBottom: '2rem' }}>{error}</p>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : joinedState === 'joined' ? (
                    <div>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#ecfdf5',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <ShieldCheck size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>Welcome to the Team!</h3>
                        <p style={{ fontSize: '0.88rem', color: '#047857', marginBottom: '1.5rem' }}>
                            You have successfully joined the workspace. Redirecting to your dashboard...
                        </p>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <Clock size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.75rem' }}>Join Request Submitted</h3>
                        <p style={{ fontSize: '0.88rem', color: '#1e40af', lineHeight: 1.5, marginBottom: '2rem' }}>
                            This workspace requires administrator approval before new members can enter. We have sent a join request to the workspace administrators.
                        </p>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JoinInvite;
