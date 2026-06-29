import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { FileText, ArrowRight, AlertCircle } from 'lucide-react';

export const PublicFormSubmit: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [formDetails, setFormDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form inputs
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                // Call public details API
                const res = await apiCall(`public/forms/${slug}`);
                setFormDetails(res);
            } catch (err: any) {
                setError(err.message || 'The requested web form is invalid or has been deactivated.');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) return;

        setSubmitting(true);
        setError(null);
        try {
            const res = await apiCall(`public/forms/${slug}/submit`, {
                method: 'POST',
                body: { name: fullName, email: email }
            });

            // Redirect directly to signing page
            if (res.secure_token) {
                navigate(`/public/sign/${res.secure_token}`);
            } else {
                throw new Error('Failed to retrieve signing token');
            }
        } catch (err: any) {
            setError(err.message || 'Submission failed. Please check parameters.');
            setSubmitting(false);
        }
    };

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
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Loading web form...</h3>
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
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.75rem' }}>Unable to Open Form</h3>
                        <p style={{ fontSize: '0.88rem', color: '#7f1d1d', lineHeight: 1.5, marginBottom: '2rem' }}>{error}</p>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => navigate('/')}
                        >
                            Return to Home
                        </button>
                    </div>
                ) : formDetails && (
                    <div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.05)',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem auto'
                        }}>
                            <FileText size={24} />
                        </div>
                        
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{formDetails.form_title}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', marginBottom: '2rem', lineHeight: 1.5 }}>
                            {formDetails.description || 'Fill in your name and email to review and sign the document.'}
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ color: '#475569', fontSize: '0.82rem' }}>Your Full Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Jane Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: '#475569', fontSize: '0.82rem' }}>Email Address *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="jane.doe@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                style={{ background: '#10b981', border: 'none', justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}
                                disabled={submitting}
                            >
                                {submitting ? 'Preparing Document...' : 'Review & Sign'} <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicFormSubmit;
