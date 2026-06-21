
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const AdminToast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />
    };

    const colors = {
        success: 'var(--color-success, #22c55e)',
        error: 'var(--color-error, #ef4444)',
        info: 'var(--color-blue, #3b82f6)'
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--bg-card, #1e1e1e)',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
            borderLeft: `4px solid ${colors[type] || colors.info}`,
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ color: colors[type] || colors.info }}>
                {icons[type] || icons.info}
            </div>
            <p style={{ margin: 0, color: 'var(--text-main, #fff)', fontSize: '0.95rem' }}>{message}</p>
            <button 
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted, #999)',
                    cursor: 'pointer',
                    padding: '4px',
                    marginLeft: '8px'
                }}
            >
                <X size={16} />
            </button>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AdminToast;
