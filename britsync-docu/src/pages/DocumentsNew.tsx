import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Upload, ArrowLeft, RefreshCw, FileText, AlertCircle } from 'lucide-react';

export const DocumentsNew: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (selected.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setFile(null);
                return;
            }
            setError('');
            setFile(selected);
            if (!name) {
                setName(selected.name.replace('.pdf', ''));
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name) return;

        setUploading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('docu_token');
            const apiBase = import.meta.env.DEV ? 'http://localhost:5003' : '';
            const url = `${apiBase}/api/docu/documents/upload`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errData.message || 'File upload failed');
            }

            const uploadResult = await res.json();
            
            // Create Document record
            const newDoc = await apiCall('documents', {
                method: 'POST',
                body: {
                    document_name: name,
                    original_file_url: uploadResult.url,
                    original_hash: uploadResult.original_hash
                }
            });

            navigate(`/documents/${newDoc._id}/editor`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error uploading document.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <DashboardLayout title="New Document">
            <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => navigate('/documents')}>
                <ArrowLeft size={16} /> Back
            </button>

            <div style={{ maxWidth: '600px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Upload a PDF</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>Import any PDF document to map sign boundaries and dispatch signature links.</p>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', padding: '0.75rem', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <label className="form-label">Document Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Employment Agreement"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={uploading}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Select PDF Document *</label>
                        <label style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: '8px',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            background: '#f8fafc',
                            transition: 'border-color 0.2s ease'
                        }}>
                            <Upload size={32} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                            {file ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.9rem' }}>
                                    <FileText size={16} style={{ color: '#2563eb' }} />
                                    <span>{file.name}</span>
                                </div>
                            ) : (
                                <>
                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>Click to browse file</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Only PDF format, max 15MB</span>
                                </>
                            )}
                            <input type="file" className="file-input" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} required />
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={uploading || !file || !name}>
                        {uploading ? (
                            <>
                                <RefreshCw className="spinner" size={16} style={{ marginRight: '0.5rem' }} /> Processing PDF...
                            </>
                        ) : (
                            'Upload & Continue'
                        )}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default DocumentsNew;
