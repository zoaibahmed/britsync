import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, ShieldCheck, ShieldAlert, FileText, Calendar, CheckCircle2, User, Globe } from 'lucide-react';

export const AuditVerification: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setResult(null);
            setError('');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setVerifying(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const apiBase = import.meta.env.DEV ? 'http://localhost:5003' : '';
            const url = `${apiBase}/api/docu/public/verify`;

            const res = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ message: 'Verification failed' }));
                throw new Error(errData.message || 'File verification failed');
            }

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error occurred while verifying file.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            {/* Top Header */}
            <header style={{
                height: '70px',
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        BritSync <span style={{ color: '#2563eb' }}>Docu</span> Verification Portal
                    </span>
                </div>
            </header>

            {/* Content Body */}
            <main style={{ flex: 1, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Verify Document Authenticity</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Upload any signed PDF to verify its digital cryptographic signatures and ensure it has not been modified since completion.</p>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Upload Drop Zone Card */}
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <label style={{
                                border: '2px dashed #2563eb',
                                borderRadius: '10px',
                                padding: '3rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: '#f8fafc',
                                transition: 'border-color 0.2s ease'
                            }}>
                                <Upload size={36} style={{ color: '#2563eb', marginBottom: '1rem' }} />
                                {file ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.95rem' }}>
                                        <FileText size={18} style={{ color: '#2563eb' }} />
                                        <span>{file.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <span style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>Choose signed PDF file to verify</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Drop file here or click to browse</span>
                                    </>
                                )}
                                <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} required />
                            </label>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }} disabled={verifying || !file}>
                                {verifying ? 'Calculating Checksums & Verifying...' : 'Verify Document Integrity'}
                            </button>
                        </form>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <ShieldAlert size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Result details card */}
                    {result && (
                        <div style={{
                            background: 'white',
                            border: `1px solid ${result.verified ? '#10b981' : '#ef4444'}`,
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            {/* Verification Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                                <div style={{
                                    background: result.verified ? '#ecfdf5' : '#fef2f2',
                                    color: result.verified ? '#10b981' : '#ef4444',
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {result.verified ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                                        {result.verified ? 'Verification Succeeded' : 'Verification Failed'}
                                    </h2>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                                        {result.verified ? 'This document is authentic and unmodified.' : result.message}
                                    </p>
                                </div>
                            </div>

                            {result.verified && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {/* General Stats */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Document Title</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{result.document_name}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Workspace Issuer</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{result.workspace_name}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Date Fully Signed</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                                                {new Date(result.completed_at).toLocaleString('en-GB')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Hashing info */}
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SHA-256 Document Fingerprint (Hash)</div>
                                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0f172a', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                                            {result.hash}
                                        </div>
                                    </div>

                                    {/* Signer Audit Log list */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <CheckCircle2 size={16} style={{ color: '#10b981' }} /> E-Signatures Verification Audit Trail
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {result.recipients?.map((rec: any, idx: number) => (
                                                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#f8fafc' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        <div>
                                                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                                <User size={14} style={{ color: '#2563eb' }} /> {rec.name}
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.email}</div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{
                                                                fontSize: '0.65rem',
                                                                fontWeight: 800,
                                                                background: '#ecfdf5',
                                                                color: '#10b981',
                                                                padding: '2px 8px',
                                                                borderRadius: '999px',
                                                                textTransform: 'uppercase'
                                                            }}>{rec.status}</span>
                                                        </div>
                                                    </div>

                                                    {rec.signed_at && (
                                                        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.75rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: '#64748b' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                <Calendar size={12} /> Signed: {new Date(rec.signed_at).toLocaleString('en-GB')}
                                                            </span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                <Globe size={12} /> IP: {rec.ip_address || 'N/A'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AuditVerification;
