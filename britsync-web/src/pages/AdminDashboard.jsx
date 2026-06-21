import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Briefcase, Tag, Layout, Home, Zap, Database, Info,
    Heart, Plus, Monitor, Code, HelpCircle, Lock, Mail, Settings, FileText, PenTool
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import ChangePasswordForm from '../components/admin/ChangePasswordForm';
import AdminSectionList from '../components/admin/AdminSectionList';
import AdminItemForm from '../components/admin/AdminItemForm';
import AdminToast from '../components/admin/AdminToast';
import AdminMessages from '../components/admin/AdminMessages';
import AdminProposals from '../components/admin/AdminProposals';
import { apiCall } from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('projects');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (location.state?.section) {
            setActiveSection(location.state.section);
        }
    }, [location.state]);

    // Data States
    const [data, setData] = useState({
        projects: [], services: [], faqs: [], team: [], values: [],
        expertise: [], phases: [], whyReasons: [], stats: [],
        clients: [], tech: [], categories: [], settings: {}
    });
    const [loading, setLoading] = useState(true);

    // UI States
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({});
    const [toast, setToast] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pendingProposalsCount, setPendingProposalsCount] = useState(0);

    // Fetch unread counts (Messages and Proposals)
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Messages unread count
                const msgRes = await apiCall('messages?filter=unread&page=1&limit=1');
                setUnreadCount(msgRes.total || 0);

                // Proposals pending count
                const propRes = await apiCall('proposals?status=pending&page=1&limit=1');
                setPendingProposalsCount(propRes.total || 0);
            } catch (err) {
                console.error("Dashboard counts fetch failed:", err);
            }
        };
        fetchCounts();
        const interval = setInterval(fetchCounts, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Sections Configuration
    const sections = [
        { id: 'projects', label: 'Work Projects', icon: <Briefcase size={20} /> },
        { id: 'services', label: 'Services', icon: <Layout size={20} /> },
        { id: 'categories', label: 'Categories', icon: <Tag size={20} /> },
        { id: 'home', label: 'Home Expertise', icon: <Home size={20} /> },
        { id: 'why_us', label: 'Why Us', icon: <Zap size={20} /> },
        { id: 'site_stats', label: 'Site Stats', icon: <Database size={20} /> },
        { id: 'about_phases', label: 'Phases', icon: <Info size={20} /> },
        { id: 'about_values', label: 'Values', icon: <Heart size={20} /> },
        { id: 'about_team', label: 'Team', icon: <Plus size={20} /> },
        { id: 'clients', label: 'Clients', icon: <Monitor size={20} /> },
        { id: 'tech_stack', label: 'Tech Stack', icon: <Code size={20} /> },
        { id: 'faqs', label: 'FAQs', icon: <HelpCircle size={20} /> },
        { id: 'messages', label: 'Messages', icon: <Mail size={20} /> },
        { id: 'change_password', label: 'Change Password', icon: <Lock size={20} /> },
        { id: 'settings', label: 'Global Settings', icon: <Settings size={20} /> },
        { id: 'initiatives', label: 'Initiatives', icon: <Zap size={20} /> },
        { id: 'proposals', label: 'Proposals', icon: <FileText size={20} /> }
    ];

    const sectionToKey = {
        'projects': 'projects', 'services': 'services', 'home': 'expertise',
        'about_phases': 'phases', 'about_values': 'values', 'about_team': 'team',
        'faqs': 'faqs', 'why_us': 'why-reasons', 'site_stats': 'stats',
        'clients': 'clients', 'tech_stack': 'tech', 'categories': 'categories',
        'settings': 'settings', 'initiatives': 'initiatives'
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const endpoints = ['projects', 'services', 'faqs', 'team', 'values', 'expertise', 'phases', 'why-reasons', 'stats', 'clients', 'tech', 'categories', 'settings', 'initiatives'];
            const results = await Promise.all(
                endpoints.map(async (e) => {
                    try {
                        return await apiCall(e);
                    } catch (err) {
                        console.error(err);
                        return [];
                    }
                })
            );

            const newData = {};
            endpoints.forEach((e, idx) => {
                const key = e === 'why-reasons' ? 'whyReasons' : (e === 'tech' ? 'tech' : e.replace(/-([a-z])/g, g => g[1].toUpperCase()));
                newData[key] = results[idx];
            });

            setData(prev => ({ ...prev, ...newData }));
        } catch (err) {
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin');
    };

    // --- CRUD Handlers ---

    const handleAdd = () => {
        // Provide sensible defaults so the Add form shows appropriate fields per section
        let template = {};
        switch (activeSection) {
            case 'projects':
                template = { title: '', category: 'web', image: '', description: '', client: '', duration: '', technologies: '', statLabel: '', statValue: '' };
                break;
            case 'services':
                template = { title: '', type: 'secondary', icon: '', pricing: '', description: '', detailed_desc: '', features: '', process: '', order: 0 };
                break;
            case 'categories':
                template = { name: '', slug: '', order: 0 };
                break;
            case 'home': // expertise
                template = { title: '', description: '', icon: '', order: 0 };
                break;
            case 'why_us':
                template = { title: '', desc: '', icon: '', order: 0 };
                break;
            case 'site_stats':
                template = { label: '', value: '', order: 0 };
                break;
            case 'about_phases':
                template = { phaseNumber: 1, title: '', description: '', order: 0 };
                break;
            case 'about_values':
                template = { title: '', description: '', icon: '', order: 0 };
                break;
            case 'about_team':
                template = { name: '', role: '', order: 0, image: '', bio: '' };
                break;
            case 'clients':
                template = { name: '', image: '', order: 0 };
                break;
            case 'tech_stack':
                template = { name: '', order: 0 };
                break;
            case 'faqs':
                template = { question: '', answer: '', order: 0 };
                break;
            case 'settings':
                template = { key: '', value: '' };
                break;
            case 'initiatives':
                template = { title: '', type: 'global', image: '', url: '', description: '', whatItIs: '', whyItsNeeded: '', order: 0 };
                break;
            default:
                template = {};
        }

        setFormData(template);
        setIsEditing(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setFormData({ ...item });
        // Handle transforms (arrays to strings) for form editing if needed
        // For simplicity, we'll let the form components handle simple conversions if they are strictly visual
        // But for things like comma-separated strings that come as arrays:
        const complexFields = ['technologies', 'features', 'detailed_features', 'process'];
        let prepared = { ...item };
        complexFields.forEach(field => {
            if (Array.isArray(item[field])) {
                prepared[field] = item[field].join(', ');
            }
        });

        setFormData(prepared);
        setIsEditing(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const endpoint = sectionToKey[activeSection];
            await apiCall(`${endpoint}/${id}`, { method: 'DELETE' });
            showToast('Item deleted successfully', 'success');
            fetchAllData(); // Refresh
        } catch (err) {
            showToast('Error deleting item', 'error');
        }
    };

    const handleReorder = async (id, direction) => {
        try {
            const list = (data.services || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(a.createdAt) - new Date(b.createdAt));
            const idx = list.findIndex(i => i._id === id);
            if (idx === -1) return;
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= list.length) return;
            const a = list[idx];
            const b = list[swapIdx];

            // Swap order values
            const aOrder = a.order || 0;
            const bOrder = b.order || 0;

            await Promise.all([
                apiCall(`services/${a._id}`, { method: 'PUT', body: { order: bOrder } }),
                apiCall(`services/${b._id}`, { method: 'PUT', body: { order: aOrder } })
            ]);

            showToast('Order updated', 'success');
            fetchAllData();
        } catch (err) {
            showToast('Failed to reorder items', 'error');
        }
    };

    // Bulk reorder removed — use edit Order input or up/down buttons

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = sectionToKey[activeSection];
            let url = endpoint;
            let method = isEditing ? 'PUT' : 'POST';

            if (activeSection === 'settings') {
                await apiCall('settings', {
                    method: 'POST',
                    body: { key: formData.key, value: formData.value }
                });
                showToast('Setting updated successfully', 'success');
                setShowForm(false);
                fetchAllData();
                return;
            }

            if (isEditing) url += `/${isEditing}`;

            // Prepare payload
            const payload = { ...formData };

            // Transform comma-separated strings back to arrays (only for fields that are arrays in the schema)
            const arrayFields = ['technologies', 'features', 'detailed_features'];
            arrayFields.forEach(field => {
                if (typeof payload[field] === 'string') {
                    payload[field] = payload[field].split(',').map(s => s.trim()).filter(s => s);
                }
            });

            // Ensure 'process' is a string for services (schema expects a string)
            if (payload.process && Array.isArray(payload.process)) {
                payload.process = payload.process.join(', ');
            }

            // Services: map 'features' form field to 'detailed_features' schema field
            if (activeSection === 'services') {
                if (payload.features && !payload.detailed_features) {
                    payload.detailed_features = payload.features;
                }
            }

            // Categories: if user provided 'title' field (generic form), map to 'name'
            if (activeSection === 'categories') {
                if (payload.title && !payload.name) {
                    payload.name = payload.title;
                }
            }

            // Auto-slug for categories
            if (activeSection === 'categories' && !payload.slug && payload.name) {
                payload.slug = payload.name.toLowerCase().replace(/\s+/g, '-');
            }

            await apiCall(url, {
                method,
                body: payload
            });
            showToast(`Item ${isEditing ? 'updated' : 'created'} successfully`, 'success');
            setShowForm(false);
            fetchAllData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    // --- Scroll Lock for Popups ---
    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showForm]);

    const getCurrentItems = () => {
        const key = sectionToKey[activeSection];
        const dataKey = key === 'why-reasons' ? 'whyReasons' : key;
        if (activeSection === 'settings') {
            const settings = data.settings || {};
            return Object.keys(settings).map(k => ({
                _id: k,
                key: k,
                value: settings[k],
                title: k,
                description: typeof settings[k] === 'string' ? settings[k] : JSON.stringify(settings[k])
            }));
        }
        return data[dataKey] || [];
    };

    const handleSectionChange = (sectionId) => {
        if (sectionId === 'docu') {
            navigate('/britsync-docu');
        } else {
            setActiveSection(sectionId);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminNavbar
                onMessagesClick={() => handleSectionChange('messages')}
                onProposalsClick={() => handleSectionChange('proposals')}
                unreadCount={unreadCount}
                pendingCount={pendingProposalsCount}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="admin-layout">
                <AdminSidebar
                    sections={sections}
                    activeSection={activeSection}
                    setActiveSection={handleSectionChange}
                    isOpen={sidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onLogout={handleLogout}
                />

                <main className="admin-main-content" data-lenis-prevent>
                    {activeSection === 'change_password' ? (
                        <ChangePasswordForm showToast={showToast} />
                    ) : activeSection === 'messages' ? (
                        <AdminMessages />
                    ) : activeSection === 'proposals' ? (
                        <AdminProposals />
                    ) : (
                        <AdminSectionList
                            activeSection={activeSection}
                            items={getCurrentItems()}
                            loading={loading}
                            onAdd={handleAdd}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                        />
                    )}
                </main>
            </div>

            {showForm && (
                <AdminItemForm
                    activeSection={activeSection}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                    isEditing={!!isEditing}
                    data={data}
                />
            )}

            {toast && (
                <AdminToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;

