import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ArrowLeft, FileText, Download } from 'lucide-react';

export const FormSubmissions: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                const fInfo = await apiCall(`forms/${id}`);
                setForm(fInfo);

                const list = await apiCall(`forms/${id}/submissions`);
                setSubmissions(list || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadSubmissions();
    }, [id]);

    return (
        <DashboardLayout title="Form Submissions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate('/forms')}
                    className="btn btn-secondary"
                    style={{ background: 'transparent', borderColor: '#cbd5e1', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                    <ArrowLeft size={14} /> Back to Forms
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {/* Header info */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{form?.form_title}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
                            Total submissions: <strong>{submissions.length}</strong> {form?.submission_limit > 0 && `(Limit: ${form.submission_limit})`}
                        </p>
                    </div>

                    {/* Table */}
                    <div className="card-table-wrapper" style={{ margin: 0 }}>
                        {submissions.length === 0 ? (
                            <div className="empty-state">
                                <FileText className="empty-state-icon" size={48} />
                                <h3>No submissions yet</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Share your public link to collect digital signatures.</p>
                            </div>
                        ) : (
                            <table className="docu-table">
                                <thead>
                                    <tr>
                                        <th>Signer Name</th>
                                        <th>Email Address</th>
                                        <th>Document Status</th>
                                        <th>Submitted At</th>
                                        <th style={{ textAlign: 'right' }}>Document Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => {
                                        const recipient = sub.recipients?.[0] || {};
                                        return (
                                            <tr key={sub._id}>
                                                <td style={{ fontWeight: 700 }}>{recipient.name || 'Anonymous'}</td>
                                                <td>{recipient.email || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${sub.status === 'completed' ? 'badge-completed' : 'badge-viewed'}`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {sub.status === 'completed' ? (
                                                        <a 
                                                            href={sub.final_file_url || sub.original_file_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="btn btn-secondary"
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                        >
                                                            Download PDF <Download size={12} />
                                                        </a>
                                                    ) : (
                                                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                                                            Awaiting completion
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default FormSubmissions;
