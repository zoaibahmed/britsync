
import React, { useState } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { getImageUrl } from '../../utils/api';

const AdminItemForm = ({
    activeSection,
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isEditing,
    data // passed to populate dropdowns like categories
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || '';
            // Add admin token to upload request (server requires auth)
            const token = localStorage.getItem('admin_token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiBase}/api/upload`, {
                method: 'POST',
                body: formDataUpload,
                headers
            });

            if (!res.ok) {
                // Provide clearer error messages for common cases
                if (res.status === 401) throw new Error('Unauthorized. Please login again.');
                const errBody = await res.json().catch(() => null);
                throw new Error(errBody?.message || 'Upload failed');
            }

            const result = await res.json();
            if (result.url) {
                setFormData(prev => ({ ...prev, image: result.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const renderField = (label, field, type = 'text', options = {}) => {
        return (
            <div className={`form-group ${options.fullWidth ? 'full-width' : ''}`}>
                <label>{label}</label>
                {type === 'textarea' ? (
                    <textarea
                        className="admin-input"
                        value={formData[field] || ''}
                        onChange={e => handleChange(field, e.target.value)}
                        rows={options.rows || 3}
                    />
                ) : type === 'select' ? (
                    <select
                        className="admin-input"
                        value={formData[field] || ''}
                        onChange={e => handleChange(field, e.target.value)}
                    >
                        {options.choices.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="admin-input"
                        type={type}
                        value={formData[field] || ''}
                        onChange={e => handleChange(field, e.target.value)}
                        placeholder={options.placeholder}
                    />
                )}
            </div>
        );
    };

    // Dynamic field rendering based on section
    const renderFormFields = () => {
        switch (activeSection) {
            case 'projects':
                return (
                    <>
                        <div className="form-section">
                            <h4>Basic Info</h4>
                            <div className="form-grid">
                                {renderField('Title', 'title')}
                                {renderField('Category', 'category', 'select', {
                                    choices: data.categories?.map(c => ({ value: c.slug, label: c.name })) || [{ value: 'web', label: 'Web' }, { value: 'app', label: 'App' }]
                                })}
                                {renderField('Client', 'client')}
                                {renderField('Duration', 'duration')}
                            </div>
                        </div>
                        <div className="form-section">
                            <h4>Details</h4>
                            {renderField('Short Description', 'description', 'textarea')}
                            {renderField('Technologies (comma sep)', 'technologies')}
                            {renderField('Live URL', 'liveUrl')}
                            {renderField('Challenge', 'challenge', 'textarea')}
                            {renderField('Solution', 'solution', 'textarea')}
                        </div>
                        <div className="form-section">
                            <h4>Stats</h4>
                            <div className="form-grid">
                                {renderField('Stat Label', 'statLabel', 'text', { placeholder: 'ROI' })}
                                {renderField('Stat Value', 'statValue', 'text', { placeholder: '200%' })}
                            </div>
                            {/* Note: handling nested stats object in parent or transforming here. 
                                For simplicity, we assume flattened keys or Parent handles nesting on submit.
                                We'll assume parent flattens for form and restructures on submit for now to keep this generic
                                OR we can handle nested state here. Let's handle simple flat keys and mapping in parent.
                             */}
                        </div>
                        <div className="form-section">
                            <label>Image</label>
                            <div className="image-upload-preview">
                                <input type="file" onChange={handleFileUpload} />
                                {isUploading && <span>Uploading...</span>}
                                {formData.image && <img src={getImageUrl(formData.image)} alt="preview" />}
                            </div>
                        </div>
                    </>
                );
            case 'services':
                return (
                    <>
                        <div className="form-grid">
                            {renderField('Title', 'title')}
                            {renderField('Type', 'type', 'select', {
                                choices: [{ value: 'main', label: 'Main' }, { value: 'secondary', label: 'Secondary' }]
                            })}
                            {renderField('Icon (Lucide name)', 'icon')}
                            {renderField('Pricing', 'pricing')}
                            {renderField('Order', 'order', 'number')}
                        </div>
                        {renderField('Description', 'description', 'textarea')}
                        {renderField('Detailed Desc', 'detailed_desc', 'textarea')}
                        {renderField('Features (comma sep)', 'features', 'textarea')}
                        {renderField('Process (comma sep)', 'process', 'textarea')}
                        {formData.type === 'main' && (
                            <div className="form-grid">
                                {renderField('Filter Slug', 'filter_slug')}
                                {renderField('Gradient Color', 'color')}
                            </div>
                        )}
                    </>
                );
            case 'faqs':
                return (
                    <>
                        {renderField('Question', 'question', 'text', { fullWidth: true })}
                        {renderField('Answer', 'answer', 'textarea', { fullWidth: true })}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'team': // about_team
            case 'about_team':
                return (
                    <>
                        {renderField('Name', 'name')}
                        {renderField('Role', 'role')}
                        {renderField('Description (Bio)', 'bio', 'textarea')}
                        {renderField('Order', 'order', 'number')}
                        <div className="form-section">
                            <label>Photo</label>
                            <div className="image-upload-preview">
                                <input type="file" onChange={handleFileUpload} />
                                {isUploading && <span>Uploading...</span>}
                                {formData.image && <img src={getImageUrl(formData.image)} alt="preview" />}
                            </div>
                        </div>
                    </>
                );
            case 'categories':
                return (
                    <>
                        <div className="form-grid">
                            {renderField('Name', 'name')}
                            {renderField('Slug', 'slug')}
                            {renderField('Order', 'order', 'number')}
                        </div>
                    </>
                );
            case 'about_values':
                return (
                    <>
                        {renderField('Title', 'title')}
                        {renderField('Description', 'description', 'textarea')}
                        {renderField('Icon', 'icon')}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'about_phases':
                return (
                    <>
                        {renderField('Phase Number', 'phaseNumber', 'number')}
                        {renderField('Title', 'title')}
                        {renderField('Description', 'description', 'textarea')}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'why_us':
                return (
                    <>
                        {renderField('Title', 'title')}
                        {renderField('Description', 'desc', 'textarea')}
                        {renderField('Icon', 'icon')}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'site_stats':
                return (
                    <>
                        {renderField('Label', 'label')}
                        {renderField('Value', 'value')}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'clients':
                return (
                    <>
                        {renderField('Name', 'name')}
                        {renderField('Order', 'order', 'number')}
                        <div className="form-section">
                            <label>Logo / Image</label>
                            <div className="image-upload-preview">
                                <input type="file" onChange={handleFileUpload} />
                                {isUploading && <span>Uploading...</span>}
                                {formData.image && <img src={getImageUrl(formData.image)} alt="preview" />}
                            </div>
                        </div>
                    </>
                );
            case 'tech_stack':
                return (
                    <>
                        {renderField('Name', 'name')}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'home':
                return (
                    <>
                        {renderField('Title', 'title')}
                        {renderField('Description', 'description', 'textarea')}
                        {renderField('Icon', 'icon')}
                        {renderField('Order', 'order', 'number')}
                    </>
                );
            case 'settings':
                return (
                    <>
                        {renderField('Key', 'key', 'text', { placeholder: 'e.g., work_header_title' })}
                        {renderField('Value', 'value', 'textarea', { placeholder: 'Value for this setting' })}
                    </>
                );
            case 'initiatives':
                return (
                    <>
                        <div className="form-grid">
                            {renderField('Title', 'title')}
                            {renderField('Type', 'type', 'select', {
                                choices: [{ value: 'global', label: 'Global' }, { value: 'cooperative', label: 'Cooperative' }]
                            })}
                            {renderField('URL', 'url')}
                            {renderField('Order', 'order', 'number')}
                        </div>
                        {renderField('Short Description', 'description', 'textarea')}
                        {renderField('What It Is', 'whatItIs', 'textarea', { rows: 5 })}
                        {renderField('Why It\'s Needed', 'whyItsNeeded', 'textarea', { rows: 5 })}
                        <div className="form-section">
                            <label>Card Image / Icon</label>
                            <div className="image-upload-preview">
                                <input type="file" onChange={handleFileUpload} />
                                {isUploading && <span>Uploading...</span>}
                                {formData.image && <img src={getImageUrl(formData.image)} alt="preview" />}
                            </div>
                        </div>
                    </>
                );
            // ... Add other cases as needed (values, phases, etc) - defaulting to generic
            default:
                return (
                    <>
                        <div className="form-grid">
                            {(formData.hasOwnProperty('title') || !formData.hasOwnProperty('name')) && renderField('Title', 'title')}
                            {(formData.hasOwnProperty('name')) && renderField('Name', 'name')}
                            {formData.hasOwnProperty('order') && renderField('Order', 'order', 'number')}
                        </div>
                        {(formData.hasOwnProperty('description') || formData.hasOwnProperty('desc')) &&
                            renderField('Description', 'description', 'textarea')}

                        {(formData.hasOwnProperty('image')) && (
                            <div className="form-section">
                                <label>Image</label>
                                <div className="image-upload-preview">
                                    <input type="file" onChange={handleFileUpload} />
                                    {isUploading && <span>Uploading...</span>}
                                    {formData.image && <img src={getImageUrl(formData.image)} alt="preview" />}
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content item-form-modal" data-lenis-prevent>
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit' : 'Add'} {activeSection.replace(/_/g, ' ')}</h2>
                    <button className="close-btn" onClick={onCancel}><X size={20} /></button>
                </div>

                <form onSubmit={onSubmit} className="admin-form">
                    {renderFormFields()}

                    <div className="form-actions sticky-footer">
                        <Button type="button" onClick={onCancel} className="cancel-btn">Cancel</Button>
                        <Button type="submit" className="submit-btn">
                            <Save size={18} /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminItemForm;
