import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Layers, Plus, Play, Trash2, Search, Copy, Edit, X } from 'lucide-react';
import { Select } from '../components/ui/Select';

export const Templates: React.FC = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Edit settings modal states
    const [editingTemplate, setEditingTemplate] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editCategory, setEditCategory] = useState('General');

    const fetchTemplates = async () => {
        try {
            const data = await apiCall('templates');
            setTemplates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleUseTemplate = async (id: string) => {
        try {
            const doc = await apiCall(`templates/${id}/use`, { method: 'POST' });
            navigate(`/documents/${doc._id}/editor`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        if (!window.confirm('Delete this template?')) return;
        try {
            await apiCall(`templates/${id}`, { method: 'DELETE' });
            fetchTemplates();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDuplicateTemplate = async (id: string) => {
        try {
            await apiCall(`templates/${id}/duplicate`, { method: 'POST' });
            fetchTemplates();
        } catch (err) {
            console.error(err);
            alert('Failed to duplicate template');
        }
    };

    const handleOpenEdit = (t: any) => {
        setEditingTemplate(t);
        setEditName(t.template_name);
        setEditDesc(t.description || '');
        setEditCategory(t.category || 'General');
    };

    const handleSaveTemplateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;
        try {
            await apiCall(`templates/${editingTemplate._id}`, {
                method: 'PATCH',
                body: {
                    template_name: editName,
                    description: editDesc,
                    category: editCategory
                }
            });
            setEditingTemplate(null);
            fetchTemplates();
        } catch (err) {
            console.error(err);
            alert('Failed to save template settings');
        }
    };

    const filteredTemplates = templates.filter(t => 
        t.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Templates">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Document Templates</h2>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/documents/new')}>
                    <Plus size={16} /> Create Template
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search templates by title or category..."
                    className="form-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>

            {loading ? (
                <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center' }}>
                    <div className="spinner"></div>
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="empty-state">
                    <Layers className="empty-state-icon" size={48} />
                    <h3>No templates found</h3>
                    <p>Get started by uploading a layout and selecting "Save as Template" inside the PDF Editor.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredTemplates.map((t) => (
                        <div key={t._id} style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    textTransform: 'uppercase'
                                }}>{t.category}</span>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.75rem', color: '#0f172a' }}>{t.template_name}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.4 }}>{t.description || 'No description provided'}</p>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }} onClick={() => handleDeleteTemplate(t._id)} title="Delete Template">
                                        <Trash2 size={14} />
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} onClick={() => handleDuplicateTemplate(t._id)} title="Duplicate Template">
                                        <Copy size={14} />
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} onClick={() => handleOpenEdit(t)} title="Edit Template Settings">
                                        <Edit size={14} />
                                    </button>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => handleUseTemplate(t._id)}>
                                    <Play size={12} /> Use Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Template Settings Modal */}
            {editingTemplate && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div className="modal-container" style={{
                        background: 'white',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '460px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Edit Template Settings</h3>
                            <button onClick={() => setEditingTemplate(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                <X size={20} style={{ color: '#64748b' }} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveTemplateSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Template Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={2}
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    placeholder="Enter short description..."
                                />
                            </div>
                            <div className="form-group">
                                <Select
                                    label="Template Category *"
                                    value={editCategory}
                                    onChange={val => setEditCategory(val)}
                                    options={[
                                        { value: 'HR', label: 'HR' },
                                        { value: 'Legal', label: 'Legal' },
                                        { value: 'Sales', label: 'Sales' },
                                        { value: 'Finance', label: 'Finance' },
                                        { value: 'Client Onboarding', label: 'Client Onboarding' },
                                        { value: 'Agreements', label: 'Agreements' },
                                        { value: 'Consent Forms', label: 'Consent Forms' },
                                        { value: 'Internal Approval', label: 'Internal Approval' },
                                        { value: 'Custom', label: 'Custom' },
                                        { value: 'General', label: 'General' }
                                    ]}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditingTemplate(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Templates;
