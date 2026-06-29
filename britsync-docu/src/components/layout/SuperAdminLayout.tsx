import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import { 
    LayoutDashboard, Users, Building2, CreditCard, DollarSign, FileText, 
    BarChart3, ShieldCheck, Mail, LifeBuoy, Activity, Flag, Megaphone, 
    ShieldAlert, Download, LogOut, Shield, ChevronRight, UserCheck
} from 'lucide-react';

interface SuperAdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children, title }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [impersonator, setImpersonator] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await apiCall('auth/me');
                setUser(res.user);
                
                // Impersonation check
                const token = localStorage.getItem('docu_token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (payload.impersonatedBy) {
                            setImpersonator(payload.impersonatorName || 'Super Admin');
                        }
                    } catch (e) {}
                }

                const allowedRoles = ['SUPER_ADMIN', 'SUPPORT_ADMIN', 'BILLING_ADMIN', 'READ_ONLY_ADMIN'];
                if (allowedRoles.includes(res.user.platform_role)) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }
            } catch (err) {
                console.error('Super Admin Auth failed:', err);
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleExitImpersonation = () => {
        // Clear impersonated token and restore the original if cached, or just log out
        localStorage.removeItem('docu_token');
        localStorage.removeItem('docu_user_role');
        window.location.href = '/docu/login';
    };

    const handleLogout = () => {
        localStorage.removeItem('docu_token');
        localStorage.removeItem('docu_user_role');
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: '"Inter", sans-serif', padding: '2rem' }}>
                <div style={{ maxWidth: '400px', textAlign: 'center', background: 'white', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                    <ShieldCheck size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', margin: '0 auto' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Access Denied</h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                        Access denied. Super Admin access required.
                    </p>
                    <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                        Back to App Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const menuItems = [
        { name: 'Overview', path: '/docu/super-admin', icon: <LayoutDashboard size={18} /> },
        { name: 'Users', path: '/docu/super-admin/users', icon: <Users size={18} /> },
        { name: 'Workspaces', path: '/docu/super-admin/workspaces', icon: <Building2 size={18} /> },
        { name: 'Billing & Subs', path: '/docu/super-admin/billing', icon: <CreditCard size={18} /> },
        { name: 'Pricing Tiers', path: '/docu/super-admin/pricing', icon: <DollarSign size={18} /> },
        { name: 'Documents', path: '/docu/super-admin/documents', icon: <FileText size={18} /> },
        { name: 'Usage Counters', path: '/docu/super-admin/usage', icon: <BarChart3 size={18} /> },
        { name: 'Audit Logs', path: '/docu/super-admin/audit-logs', icon: <Shield size={18} /> },
        { name: 'Email Delivery', path: '/docu/super-admin/emails', icon: <Mail size={18} /> },
        { name: 'Support Center', path: '/docu/super-admin/support', icon: <LifeBuoy size={18} /> },
        { name: 'System Health', path: '/docu/super-admin/system-health', icon: <Activity size={18} /> },
        { name: 'Feature Flags', path: '/docu/super-admin/feature-flags', icon: <Flag size={18} /> },
        { name: 'Announcements', path: '/docu/super-admin/announcements', icon: <Megaphone size={18} /> },
        { name: 'Security Panel', path: '/docu/super-admin/security', icon: <ShieldAlert size={18} /> },
        { name: 'Data Exports', path: '/docu/super-admin/exports', icon: <Download size={18} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
            
            {/* Impersonation Banner */}
            {impersonator && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    background: '#f59e0b',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    zIndex: 99999,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck size={16} /> You are impersonating <strong>{user?.full_name}</strong> ({user?.email})
                    </span>
                    <button 
                        onClick={handleExitImpersonation}
                        style={{
                            background: '#ffffff',
                            color: '#d97706',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        Exit Impersonation
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: '#0f172a',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #1e293b',
                paddingTop: impersonator ? '40px' : '0',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 1000
            }}>
                {/* Sidebar Header */}
                <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #1e293b' }}>
                    <Shield size={20} style={{ color: '#3b82f6' }} />
                    <span style={{ fontWeight: 900, color: '#ffffff', fontSize: '1rem' }}>
                        BritSync <span style={{ color: '#3b82f6' }}>Admin</span>
                    </span>
                </div>

                {/* Sidebar Menu Items */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <Link to={item.path} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        color: isActive ? '#ffffff' : '#94a3b8',
                                        background: isActive ? '#1e293b' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                            {user?.full_name?.charAt(0)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.full_name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{user?.platform_role}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.6rem',
                            background: 'transparent',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                paddingTop: impersonator ? '60px' : '20px',
                paddingLeft: '2.5rem',
                paddingRight: '2.5rem',
                paddingBottom: '2.5rem',
                minHeight: '100vh',
                boxSizing: 'border-box'
            }}>
                {/* Header breadcrumb / Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                            <span>Super Admin</span> <ChevronRight size={10} /> <span>{title}</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{title}</h1>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
};

export default SuperAdminLayout;
