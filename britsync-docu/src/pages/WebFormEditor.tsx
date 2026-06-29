import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Save, ArrowLeft } from 'lucide-react';
import { Select } from '../components/ui/Select';

export const WebFormEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEdit = !!id;

    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [templateId, setTemplateId] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [submissionLimit, setSubmissionLimit] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');

    useEffect(() => {
        const loadEditorData = async () => {
            try {
                // Fetch templates list for selection
                const tList = await apiCall('templates');
                setTemplates(tList || []);
                if (tList.length > 0 && !templateId) {
                    setTemplateId(tList[0]._id);
                }

                if (isEdit) {
                    const form = await apiCall(`forms/${id}`);
                    setTemplateId(form.template_id?._id || form.template_id || '');
                    setFormTitle(form.form_title);
                    setDescription(form.description || '');
                    setSlug(form.slug);
                    setIsActive(!!form.is_active);
                    setSubmissionLimit(form.submission_limit || 0);
                    setExpiryDate(form.expiry_date ? form.expiry_date.split('T')[0] : '');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadEditorData();
    }, [id, isEdit]);

    const handleFormTitleChange = (val: string) => {
        setFormTitle(val);
        // Auto-slugify title if creating new
        if (!isEdit) {
            const cleanSlug = val
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setSlug(cleanSlug);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateId) {
            alert('Please select or create a template first.');
            return;
        }

        setSaving(true);
        try {
            const body = {
                template_id: templateId,
                form_title: formTitle,
                description,
                slug,
                is_active: isActive,
                submission_limit: submissionLimit,
                expiry_date: expiryDate || undefined
            };

            if (isEdit) {
                await apiCall(`forms/${id}`, {
                    method: 'PATCH',
                    body
                });
                alert('Web Form updated successfully!');
            } else {
                await apiCall('forms', {
                    method: 'POST',
                    body
                });
                alert('Web Form generated successfully!');
            }
            navigate('/forms');
        } catch (err: any) {
            alert(err.message || 'Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout title={isEdit ? 'Edit Web Form' : 'Create Web Form'}>
            <div style={{ marginBottom: '1.5rem' }}>
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
                <form onSubmit={handleSave} style={{ maxWidth: '600px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        {isEdit ? 'Web Form Parameters' : 'New Web Form details'}
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Select Base Document Template *</label>
                        {templates.length === 0 ? (
                            <div style={{ fontSize: '0.82rem', color: '#ef4444', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                                No templates found in this workspace. Please create a Template before generating a Public Web Form.
                            </div>
                        ) : (
                            <Select 
                                value={templateId} 
                                onChange={(val) => setTemplateId(val)}
                                options={templates.map(t => ({ value: t._id, label: t.template_name }))}
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Form Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. New Vendor Onboarding Request"
                            value={formTitle}
                            onChange={(e) => handleFormTitleChange(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Form Description / Instructions</label>
                        <textarea
                            rows={3}
                            className="form-input"
                            placeholder="Provide guidelines for users filling out the document..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Public Access URL Slug *</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>
                                {window.location.origin}/public/forms/
                            </span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. vendor-agreement"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                required
                                style={{ fontFamily: 'monospace', flex: 1 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Submission count Limit (0 = unlimited)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={submissionLimit}
                                onChange={(e) => setSubmissionLimit(Math.max(0, parseInt(e.target.value) || 0))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Expiration Date (Optional)</label>
                            <input
                                type="date"
                                className="form-input"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            <span>This Form is currently active and public</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ alignSelf: 'flex-start', background: '#10b981', border: 'none', marginTop: '0.5rem' }}
                        disabled={saving || templates.length === 0}
                    >
                        <Save size={16} style={{ marginRight: '6px' }} /> {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </form>
            )}
        </DashboardLayout>
    );
};

export default WebFormEditor;
