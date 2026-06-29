import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { FileText, Eye, ShieldAlert, X } from 'lucide-react';

export const SuperAdminDocuments: React.FC = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [privacyOverride, setPrivacyOverride] = useState(false);
    const [privacyReason, setPrivacyReason] = useState('');
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const fetchDocuments = async () => {
        try {
            const list = await apiCall('super-admin/documents');
            setDocuments(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleOpenDocument = (doc: any) => {
        setSelectedDoc(doc);
        setPrivacyOverride(false);
        setPrivacyReason('');
    };

    const handleAccessContent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!privacyReason.trim()) return;

        // Log privacy override event to audit logs
        apiCall('super-admin/notes', {
            method: 'POST',
            body: { 
                target_type: 'DOCUMENT', 
                target_id: selectedDoc._id, 
                note: `PRIVACY_CONTENT_OVERRIDE_ACCESS: ${privacyReason}` 
            }
        }).then(() => {
            setPrivacyOverride(true);
            setShowPrivacyModal(false);
        }).catch(err => alert(err.message || 'Failed to authenticate request'));
    };

    return (
        <SuperAdminLayout title="Platform Documents">
            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="empty-state">
                        <FileText className="empty-state-icon" size={48} />
                        <h3>No documents found</h3>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Workspace</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Recipients</th>
                                <th>File Size</th>
                                <th>Created At</th>
                                <th style={{ textAlign: 'right' }}>Inspect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc._id}>
                                    <td style={{ fontWeight: 700 }}>{doc.file_name}</td>
                                    <td>{doc.workspaceName}</td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{doc.owner?.full_name || 'N/A'}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.owner?.email}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${doc.status === 'completed' ? 'badge-completed' : 'badge-viewed'}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td>{doc.recipients?.length || 0}</td>
                                    <td>{(doc.file_size / 1024).toFixed(1)} KB</td>
                                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            onClick={() => handleOpenDocument(doc)}
                                        >
                                            Metadata
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Document Drawer */}
            {selectedDoc && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '460px',
                    background: '#ffffff',
                    boxShadow: '-4px 0 30px rgba(0,0,0,0.1)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid #e2e8f0',
                    fontFamily: '"Inter", sans-serif'
                }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{selectedDoc.file_name}</h3>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>ID: {selectedDoc._id}</div>
                        </div>
                        <button onClick={() => setSelectedDoc(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Status detail */}
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ color: '#64748b' }}>Current Status:</span>
                                <strong style={{ textTransform: 'uppercase' }}>{selectedDoc.status}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Created Date:</span>
                                <strong>{new Date(selectedDoc.createdAt).toLocaleString()}</strong>
                            </div>
                        </div>

                        {/* Recipients */}
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem' }}>Signers / Recipients ({selectedDoc.recipients?.length || 0})</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedDoc.recipients?.map((r: any, idx: number) => (
                                    <div key={idx} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                                        <div style={{ color: '#64748b' }}>{r.email}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <span style={{ color: '#64748b' }}>Status:</span>
                                            <span style={{ color: r.signed ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                                                {r.signed ? 'SIGNED' : 'PENDING'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Privacy Override Block */}
                        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ShieldAlert size={14} /> Document Privacy Gate
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#7f1d1d', lineHeight: 1.4, marginBottom: '1rem' }}>
                                To comply with strict security audits, super admins are prohibited from opening actual document sheets without an explicit administrative reason.
                            </p>

                            {privacyOverride ? (
                                <a 
                                    href={selectedDoc.final_file_url || selectedDoc.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-primary"
                                    style={{ background: '#ef4444', border: 'none', width: '100%', justifyContent: 'center' }}
                                >
                                    <Eye size={14} style={{ marginRight: '6px' }} /> View Live File Content
                                </a>
                            ) : (
                                <button 
                                    onClick={() => setShowPrivacyModal(true)}
                                    className="btn btn-secondary"
                                    style={{ borderColor: '#ef4444', color: '#ef4444', width: '100%', justifyContent: 'center', background: 'transparent' }}
                                >
                                    Request Authorization
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Privacy Override Modal */}
            {showPrivacyModal && (
                <div className="modal-overlay" style={{ zIndex: 100000 }}>
                    <form onSubmit={handleAccessContent} className="modal-container" style={{ maxWidth: '400px', background: '#ffffff', color: '#0f172a', padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#991b1b' }}>Privacy Override Authorization</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            Please state the support ticket reference or reason for overriding this privacy gate. All content views will be permanently logged.
                        </p>
                        <div className="form-group">
                            <label className="form-label" style={{ color: '#475569' }}>Justification Reason *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Debugging signatures rendering - ticket #405"
                                value={privacyReason}
                                onChange={(e) => setPrivacyReason(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowPrivacyModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ background: '#ef4444' }}>Decrypt & Open</button>
                        </div>
                    </form>
                </div>
            )}
        </SuperAdminLayout>
    );
};

export default SuperAdminDocuments;
