import React, { useState } from 'react';
import { apiCall } from '../../utils/api';

const ChangePasswordForm = ({ showToast }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) return showToast('New password must be at least 6 characters', 'error');
        if (newPassword !== confirmPassword) return showToast('Passwords do not match', 'error');

        try {
            setLoading(true);
            await apiCall('auth/change-password', {
                method: 'POST',
                body: { currentPassword, newPassword }
            });
            showToast('Password changed successfully', 'success');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            showToast(err.message || 'Failed to change password', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 600 }}>
            <h3 style={{ marginBottom: '1rem' }}>Change Admin Password</h3>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="admin-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="admin-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="admin-input"
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Change Password'}</button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;