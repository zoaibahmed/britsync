import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import UpgradeModal from '../components/ui/UpgradeModal';
import { FileText, Plus, Copy, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';

export const PublicWebForms: React.FC = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Limits & gating
    const [workspacePlan, setWorkspacePlan] = useState('free');
    const [isGated, setIsGated] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [copiedFormId, setCopiedFormId] = useState<string | null>(null);

    const fetchForms = async () => {
        try {
            // Check workspace details for plan gating
            const meRes = await apiCall('auth/me');
            const plan = meRes.workspace?.plan || 'free';
            setWorkspacePlan(plan);
            
            // Gating: Web Forms is a Business/Enterprise plan feature
            if (plan !== 'business' && plan !== 'enterprise') {
                setIsGated(true);
                setLoading(false);
                return;
            }

            const list = await apiCall('forms');
            setForms(list || []);
        } catch (err) {
            console.error('Failed to fetch web forms:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormId(id);
        setTimeout(() => setCopiedFormId(null), 2000);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this web form?')) return;
        try {
            await apiCall(`forms/${id}`, { method: 'DELETE' });
            fetchForms();
        } catch (err: any) {
            alert(err.message || 'Delete failed');
        }
    };

    if (isGated) {
        return (
            <DashboardLayout title="Public Web Forms">
                <div className="empty-state" style={{ padding: '3.5rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <FileText size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Public Web Forms</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: '0.5rem auto 1.5rem auto', lineHeight: 1.5 }}>
                        Generate standalone shareable links from templates so anyone can sign and submit documents instantly. This feature is unlocked on the Business Plan.
                    </p>
                    <button 
                        onClick={() => setShowUpgrade(true)}
                        className="btn btn-primary"
                        style={{ background: '#10b981', border: 'none' }}
                    >
                        Upgrade to Business Plan
                    </button>
                    <UpgradeModal 
                        isOpen={showUpgrade}
                        onClose={() => setShowUpgrade(false)}
                        lockedFeature="Public Web Forms"
                        requiredPlan="business"
                        currentPlan={workspacePlan}
                    />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Public Web Forms">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Workspace Forms</h2>
                </div>
                <button 
                    onClick={() => navigate('/forms/new')}
                    className="btn btn-primary"
                    style={{ background: '#10b981', border: 'none' }}
                >
                    <Plus size={16} /> Create Web Form
                </button>
            </div>

            <div className="card-table-wrapper" style={{ margin: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : forms.length === 0 ? (
                    <div className="empty-state">
                        <FileText className="empty-state-icon" size={48} />
                        <h3>No public web forms created</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Create your first form link from a saved template.</p>
                    </div>
                ) : (
                    <table className="docu-table">
                        <thead>
                            <tr>
                                <th>Form Title</th>
                                <th>Public Link</th>
                                <th>Submissions</th>
                                <th>Created Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forms.map((form) => {
                                const publicUrl = `${window.location.origin}/public/forms/${form.slug}`;
                                return (
                                    <tr key={form._id}>
                                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{form.form_title}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input 
                                                    type="text" 
                                                    readOnly 
                                                    value={publicUrl}
                                                    style={{
                                                        padding: '0.35rem 0.5rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #cbd5e1',
                                                        background: '#f8fafc',
                                                        fontSize: '0.8rem',
                                                        fontFamily: 'monospace',
                                                        width: '260px'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => copyToClipboard(publicUrl, form._id)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem' }}
                                                    title="Copy Share Link"
                                                >
                                                    {copiedFormId === form._id ? <CheckCircle size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                                                </button>
                                                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700 }}>{form.submission_count}</span>
                                            {form.submission_limit > 0 && ` / ${form.submission_limit}`}
                                        </td>
                                        <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${form.is_active ? 'badge-completed' : 'badge-viewed'}`}>
                                                {form.is_active ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={() => navigate(`/forms/${form._id}/submissions`)}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                                                >
                                                    Submissions
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/forms/${form._id}/edit`)}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(form._id)}
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.4rem', borderRadius: '6px' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PublicWebForms;
