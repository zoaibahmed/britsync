import React, { useState } from 'react';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Megaphone, Send } from 'lucide-react';

export const SuperAdminAnnouncements: React.FC = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState('ALL');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            // Simulate platform broadcast and note administrative audit log
            alert(`Platform broadcast sent to audience [${targetAudience}]: "${title}"!`);
            setTitle('');
            setMessage('');
        } catch (err: any) {
            alert(err.message || 'Broadcast failed');
        } finally {
            setSending(false);
        }
    };

    return (
        <SuperAdminLayout title="Platform Broadcasts">
            <div style={{ maxWidth: '600px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Megaphone size={18} style={{ color: '#3b82f6' }} /> Send Platform Announcement
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#475569' }}>Target Audience</label>
                        <select 
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="form-input"
                        >
                            <option value="ALL">All Users (Free & Paid)</option>
                            <option value="PAID">Paid Workspace Users Only</option>
                            <option value="FREE">Free Workspace Users Only</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: '#475569' }}>Announcement Title *</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Planned Server Maintenance Notice"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: '#475569' }}>Message Body *</label>
                        <textarea 
                            rows={5}
                            className="form-input" 
                            placeholder="Provide details about feature releases, maintenance hours, or terms updates..."
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            required 
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={sending}>
                        <Send size={14} style={{ marginRight: '6px' }} /> {sending ? 'Broadcasting...' : 'Broadcast Announcement'}
                    </button>
                </form>
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminAnnouncements;
