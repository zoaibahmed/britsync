import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import {
    Briefcase, Tag, Layout, Home, Zap, Database, Info, Heart, Plus, Monitor,
    Code, HelpCircle, Lock, Mail, Settings, FileText, PenTool, Upload, Trash2,
    Eye, Download, History, Send, Calendar, Clock, RefreshCw, X, Check,
    FileCheck, ArrowRight, ArrowLeft, LogOut, Copy, Search
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { apiCall } from '../utils/api';
import './BritsyncDocuAdmin.css';

// Loader helper for PDFJS CDN
const loadPdfJs = () => {
    return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
            resolve(window.pdfjsLib);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
            resolve(window.pdfjsLib);
        };
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

const BritsyncDocuAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Layout States
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pendingProposalsCount, setPendingProposalsCount] = useState(0);

    // Document & Audit States
    const [activeDocs, setActiveDocs] = useState([]);
    const [archivedDocs, setArchivedDocs] = useState([]);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedDocLogs, setSelectedDocLogs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showLogsModal, setShowLogsModal] = useState(false);

    // Resend States
    const [showResendModal, setShowResendModal] = useState(false);
    const [resendDocId, setResendDocId] = useState('');
    const [resendExpiresAt, setResendExpiresAt] = useState('');
    const [resendRecipientEmail, setResendRecipientEmail] = useState('');
    const [selectedResendDoc, setSelectedResendDoc] = useState(null);

    // Wizard States
    const [showWizard, setShowWizard] = useState(false);
    const [wizardStep, setWizardStep] = useState(1); // 1: Upload, 2: Place Fields, 3: Pre-Sign, 4: Send
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);

    // Currently creating document states
    const [currentDocName, setCurrentDocName] = useState('');
    const [originalFileUrl, setOriginalFileUrl] = useState('');
    const [createdDocId, setCreatedDocId] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [activeTool, setActiveTool] = useState('text'); // 'text', 'user_signature', 'admin_signature'

    // PDF Load state
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);

    // Pre-Signing Pad States
    const [showSigModal, setShowSigModal] = useState(false);
    const [signingFieldId, setSigningFieldId] = useState(null);
    const sigPadRef = useRef(null);

    // Dispatch Details States
    const [recipientEmail, setRecipientEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [expiresAtDate, setExpiresAtDate] = useState('');

    // Password Gate States
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('admin_token'));
    const [passwordInput, setPasswordInput] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    // Sidebar config list matching AdminDashboard
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
        { id: 'proposals', label: 'Proposals', icon: <FileText size={20} /> },
        { id: 'docu', label: 'BritSync Docu', icon: <PenTool size={20} /> }
    ];

    useEffect(() => {
        if (isAuthenticated) {
            fetchDocuments();
            fetchCounts();
            const interval = setInterval(fetchCounts, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordInput) return;
        setAuthLoading(true);
        setAuthError('');
        try {
            const data = await apiCall('auth/login', {
                method: 'POST',
                body: { password: passwordInput }
            });
            sessionStorage.setItem('admin_token', data.token);
            setIsAuthenticated(true);
        } catch (err) {
            console.error('Password authentication failed:', err);
            setAuthError(err.message || 'Invalid password. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    const fetchCounts = async () => {
        try {
            const msgRes = await apiCall('messages?filter=unread&page=1&limit=1');
            setUnreadCount(msgRes.total || 0);

            const propRes = await apiCall('proposals?status=pending&page=1&limit=1');
            setPendingProposalsCount(propRes.total || 0);
        } catch (err) {
            console.error("Docu admin counts fetch failed:", err);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const [activeData, archivedData] = await Promise.all([
                apiCall('britsync-docu/admin/documents'),
                apiCall('britsync-docu/admin/documents?status=archived')
            ]);
            setActiveDocs(activeData || []);
            setArchivedDocs(archivedData || []);
        } catch (err) {
            console.error('Failed to load documents:', err);
            alert('Error loading documents. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSectionChange = (sectionId) => {
        if (sectionId === 'docu') return;
        navigate('/admin/dashboard', { state: { section: sectionId } });
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        setIsAuthenticated(false);
    };

    const handleCopyLink = (token) => {
        const link = `${window.location.origin}/britsync-docu/${token}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setToastMessage('Link copied to clipboard!');
                setTimeout(() => setToastMessage(''), 3000);
            })
            .catch(err => {
                console.error('Failed to copy link:', err);
                alert('Failed to copy link.');
            });
    };

    const isNearExpiry = (doc) => {
        if (!doc.expires_at || doc.status === 'completed' || doc.status === 'draft') return false;
        const diffMs = new Date(doc.expires_at) - new Date();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours > 0 && diffHours <= 24; // expiring in next 24 hours
    };

    // PDF Upload handling
    const handlePdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
            const apiBase = import.meta.env.DEV ? 'http://localhost:5003' : (import.meta.env.VITE_API_BASE_URL || '');
            const url = `${apiBase}/api/britsync-docu/upload`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: formData
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errJson.message || 'Server error uploading PDF');
            }

            const data = await res.json();
            setCurrentDocName(data.filename.replace('.pdf', ''));
            setOriginalFileUrl(data.url);

            // Load PDF for Editor
            const pdfjs = await loadPdfJs();
            const loadedPdf = await pdfjs.getDocument(data.url).promise;
            setPdfDoc(loadedPdf);
            setNumPages(loadedPdf.numPages);

            setWizardStep(2);
        } catch (err) {
            console.error('Pdf upload error:', err);
            alert(err.message || 'Error uploading file.');
        } finally {
            setUploading(false);
        }
    };

    // Wizard Flow operations
    const openWizard = () => {
        setCurrentDocName('');
        setOriginalFileUrl('');
        setCreatedDocId('');
        setFields([]);
        setSelectedFieldId(null);
        setPdfDoc(null);
        setNumPages(0);
        setRecipientEmail('');
        setEmailMessage('');
        const defaultExpiry = new Date();
        defaultExpiry.setDate(defaultExpiry.getDate() + 7);
        setExpiresAtDate(defaultExpiry.toISOString().split('T')[0]);

        setWizardStep(1);
        setShowWizard(true);
    };

    const handleCloseWizard = () => {
        if (window.confirm('Are you sure you want to close? Any unsaved progress will be lost.')) {
            setShowWizard(false);
        }
    };

    // Save fields draft to backend
    const handleSaveFieldsDraft = async () => {
        if (!originalFileUrl || !currentDocName) return;

        setSaving(true);
        try {
            const payload = {
                document_name: currentDocName,
                original_file_url: originalFileUrl,
                fields: fields.map(({ _id, ...rest }) => ({
                    ...rest,
                    // If it is newly created on frontend and has a temporary string ID, strip it for MongoDB validation
                    ...(_id.toString().length === 24 ? { _id } : {})
                }))
            };

            let doc;
            if (createdDocId) {
                doc = await apiCall(`britsync-docu/admin/documents/${createdDocId}`, {
                    method: 'PATCH',
                    body: payload
                });
            } else {
                doc = await apiCall('britsync-docu/admin/documents', {
                    method: 'POST',
                    body: payload
                });
                setCreatedDocId(doc._id);
            }

            // Sync saved fields back (getting backend standard IDs)
            setFields(doc.fields || []);
            alert('Progress saved successfully!');
        } catch (err) {
            console.error('Draft save failed:', err);
            alert('Failed to save progress.');
        } finally {
            setSaving(false);
        }
    };

    const handleWizardNext = async () => {
        if (wizardStep === 2) {
            // Validate there's at least one user signature field
            const hasUserSig = fields.some(f => f.field_type === 'user_signature');
            if (!hasUserSig) {
                alert('Please place at least one User Signature field for the recipient.');
                return;
            }

            // Save state before advancing
            setSaving(true);
            try {
                const payload = {
                    document_name: currentDocName,
                    original_file_url: originalFileUrl,
                    fields: fields.map(({ _id, ...rest }) => ({
                        ...rest,
                        ...(_id.toString().length === 24 ? { _id } : {})
                    }))
                };

                let doc;
                if (createdDocId) {
                    doc = await apiCall(`britsync-docu/admin/documents/${createdDocId}`, {
                        method: 'PATCH',
                        body: payload
                    });
                } else {
                    doc = await apiCall('britsync-docu/admin/documents', {
                        method: 'POST',
                        body: payload
                    });
                    setCreatedDocId(doc._id);
                }
                setFields(doc.fields || []);

                // Determine next step: if there are admin signature fields, go to Step 3, else jump to Step 4
                const hasAdminSig = fields.some(f => f.field_type === 'admin_signature');
                if (hasAdminSig) {
                    setWizardStep(3);
                } else {
                    setWizardStep(4);
                }
            } catch (err) {
                console.error(err);
                alert('Failed to auto-save document configuration.');
            } finally {
                setSaving(false);
            }
        } else if (wizardStep === 3) {
            // Validate admin pre-signing. Check that all admin fields have signatures.
            const adminFields = fields.filter(f => f.field_type === 'admin_signature');
            const unsignedAdmin = adminFields.some(f => !f.signature_data);
            if (unsignedAdmin) {
                if (!window.confirm('Some Admin Signature fields are not signed yet. Continue anyway?')) {
                    return;
                }
            }
            setWizardStep(4);
        }
    };

    const handleWizardPrev = () => {
        if (wizardStep === 4) {
            const hasAdminSig = fields.some(f => f.field_type === 'admin_signature');
            if (hasAdminSig) {
                setWizardStep(3);
            } else {
                setWizardStep(2);
            }
        } else {
            setWizardStep(wizardStep - 1);
        }
    };

    // Final Dispatch
    const handleSendDocument = async () => {
        if (!recipientEmail || !recipientEmail.includes('@')) {
            alert('Please enter a valid recipient email address.');
            return;
        }

        setSending(true);
        try {
            // First update document metadata (expiry date, final fields list)
            const payload = {
                document_name: currentDocName,
                expires_at: expiresAtDate,
                fields: fields.map(({ _id, ...rest }) => ({
                    ...rest,
                    ...(_id.toString().length === 24 ? { _id } : {})
                }))
            };

            await apiCall(`britsync-docu/admin/documents/${createdDocId}`, {
                method: 'PATCH',
                body: payload
            });

            // Trigger SMTP dispatch
            await apiCall(`britsync-docu/admin/documents/${createdDocId}/send`, {
                method: 'POST',
                body: {
                    recipient_email: recipientEmail,
                    expires_at: expiresAtDate,
                    email_message: emailMessage
                }
            });

            alert('Document dispatched to recipient successfully!');
            setShowWizard(false);
            fetchDocuments();
        } catch (err) {
            console.error('Dispatch failed:', err);
            alert('Failed to dispatch document. Check server settings.');
        } finally {
            setSending(false);
        }
    };

    // Document Management
    const handleDeleteDocument = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this document and all related audit logs?')) return;

        try {
            await apiCall(`britsync-docu/admin/documents/${id}`, {
                method: 'DELETE'
            });
            fetchDocuments();
        } catch (err) {
            console.error(err);
            alert('Failed to delete document.');
        }
    };

    const handleArchiveDocument = async (id) => {
        if (!window.confirm('Archive this document? It will hide from active tables.')) return;

        try {
            await apiCall(`britsync-docu/admin/documents/${id}/archive`, {
                method: 'POST'
            });
            fetchDocuments();
        } catch (err) {
            console.error(err);
            alert('Failed to archive document.');
        }
    };

    const handleUnarchiveDocument = async (id) => {
        if (!window.confirm('Restore this document to the active list?')) return;

        try {
            await apiCall(`britsync-docu/admin/documents/${id}/unarchive`, {
                method: 'POST'
            });
            alert('Document restored successfully.');
            setActiveTab('active');
            fetchDocuments();
        } catch (err) {
            console.error(err);
            alert('Failed to restore document.');
        }
    };

    // Resend management
    const openResendModal = (doc) => {
        setSelectedResendDoc(doc);
        setResendDocId(doc._id);
        const dateStr = doc.expires_at ? new Date(doc.expires_at).toISOString().split('T')[0] : '';
        setResendExpiresAt(dateStr);
        setResendRecipientEmail(doc.recipient_email || '');
        setShowResendModal(true);
    };

    const handleResend = async () => {
        if (!resendRecipientEmail || !resendRecipientEmail.includes('@')) {
            alert('Please enter a valid recipient email address.');
            return;
        }
        setSending(true);
        try {
            await apiCall(`britsync-docu/admin/documents/${resendDocId}/send`, {
                method: 'POST',
                body: { 
                    recipient_email: resendRecipientEmail, 
                    expires_at: resendExpiresAt 
                }
            });
            alert('Signature request sent successfully!');
            setShowResendModal(false);
            fetchDocuments();
        } catch (err) {
            console.error(err);
            alert('Failed to send request.');
        } finally {
            setSending(false);
        }
    };

    const editDocumentInWizard = async (doc) => {
        if (!doc) return;
        
        setCurrentDocName(doc.document_name || '');
        setOriginalFileUrl(doc.original_file_url || '');
        setCreatedDocId(doc._id);
        setFields(doc.fields || []);
        setSelectedFieldId(null);
        setPdfDoc(null);
        setNumPages(0);
        setRecipientEmail(doc.recipient_email || '');
        setEmailMessage(doc.email_message || '');
        const dateStr = doc.expires_at ? new Date(doc.expires_at).toISOString().split('T')[0] : '';
        setExpiresAtDate(dateStr);

        setWizardStep(2); // directly go to Place Fields step!
        setShowWizard(true);
        setUploading(true);

        try {
            const pdfjs = await loadPdfJs();
            const loadedPdf = await pdfjs.getDocument(doc.original_file_url).promise;
            setPdfDoc(loadedPdf);
            setNumPages(loadedPdf.numPages);
        } catch (err) {
            console.error("Error loading PDF in edit mode:", err);
            alert("Failed to load PDF for editing.");
        } finally {
            setUploading(false);
        }
    };

    // Audit logs modal
    const viewAuditLogs = async (doc) => {
        setSelectedDoc(doc);
        try {
            const logs = await apiCall(`britsync-docu/admin/documents/${doc._id}/audit-logs`);
            setSelectedDocLogs(logs || []);
            setShowLogsModal(true);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch audit logs.');
        }
    };

    // Field Placement Handlers (Admin Step 2)
    const handleAddField = (newField) => {
        setFields(prev => [...prev, newField]);
        setSelectedFieldId(newField._id);
    };

    const handleUpdateField = (fieldId, updates) => {
        setFields(prev => prev.map(f => f._id === fieldId ? { ...f, ...updates } : f));
    };

    const handleDeleteField = (fieldId) => {
        setFields(prev => prev.filter(f => f._id !== fieldId));
        if (selectedFieldId === fieldId) setSelectedFieldId(null);
    };

    // Pre-Signing operations (Step 3)
    const openPreSignPad = (fieldId) => {
        setSigningFieldId(fieldId);
        setShowSigModal(true);
    };

    const handleSaveAdminSig = () => {
        if (sigPadRef.current.isEmpty()) {
            alert('Please draw your signature before saving.');
            return;
        }
        const dataUrl = sigPadRef.current.getCanvas().toDataURL('image/png');
        handleUpdateField(signingFieldId, { signature_data: dataUrl });
        setShowSigModal(false);
        setSigningFieldId(null);
    };

    const handleClearAdminSig = () => {
        sigPadRef.current.clear();
    };

    // Summary calculations for cards (based on activeDocs)
    const draftCount = activeDocs.filter(d => d.status === 'draft').length;
    const pendingCount = activeDocs.filter(d => ['sent', 'viewed'].includes(d.status)).length;
    const completedCount = activeDocs.filter(d => d.status === 'completed').length;
    const totalTrackedCount = activeDocs.length + archivedDocs.length;

    const documents = activeTab === 'active' ? activeDocs : archivedDocs;

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (doc.recipient_email && doc.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'awaiting') return matchesSearch && ['sent', 'viewed'].includes(doc.status);
        return matchesSearch && doc.status === statusFilter;
    });

    // Field configuration details
    const selectedField = fields.find(f => f._id === selectedFieldId);

    if (!isAuthenticated) {
        return (
            <div className="docu-login-container">
                <form onSubmit={handlePasswordSubmit} className="docu-login-card glass">
                    <div className="docu-login-header">
                        <div className="docu-login-icon">
                            <PenTool size={36} />
                        </div>
                        <h2>BritSync Docu</h2>
                        <p>Internal secure document signing and management system</p>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '500' }}>Admin Password</label>
                        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                            <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                        </div>
                    </div>
                    {authError && (
                        <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                            {authError}
                        </div>
                    )}
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={authLoading}>
                        {authLoading ? (
                            <>
                                <RefreshCw className="spinner" size={16} style={{ marginRight: '0.5rem' }} /> Authenticating...
                            </>
                        ) : (
                            <>
                                Unlock Portal <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="docu-admin-container standalone">
            <header className="standalone-docu-header">
                <div className="docu-logo">
                    <h2>BritSync Docu</h2>
                    <span className="docu-badge">Console</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Logout
                </button>
            </header>

            <div className="standalone-docu-content">
                <main className="docu-admin-main" data-lenis-prevent style={{ padding: 0, maxHeight: 'none', overflowY: 'visible' }}>
                    <div className="docu-header">
                        <div>
                            <h1>BritSync Docu</h1>
                            <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0' }}>Internal secure document management & digital signing</p>
                        </div>
                        <button className="btn-primary" onClick={openWizard}>
                            <Plus size={18} />
                            Upload & Prepare PDF
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="docu-summary-grid">
                        <div className="summary-card">
                            <h3>Draft Documents</h3>
                            <div className="value">{draftCount}</div>
                        </div>
                        <div className="summary-card" style={{ borderLeft: '3px solid #3b82f6' }}>
                            <h3>Awaiting Signatures</h3>
                            <div className="value">{pendingCount}</div>
                        </div>
                        <div className="summary-card" style={{ borderLeft: '3px solid #10b981' }}>
                            <h3>Completed</h3>
                            <div className="value">{completedCount}</div>
                        </div>
                        <div className="summary-card">
                            <h3>Total Tracked</h3>
                            <div className="value">{totalTrackedCount}</div>
                        </div>
                    </div>

                    {/* Active Documents List */}
                    <div className="docu-table-card">
                        <div className="docu-table-header">
                            <h2>Managed Documents</h2>
                            <button className="btn-icon" onClick={fetchDocuments} title="Refresh Table">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="docu-tabs">
                            <button 
                                className={`docu-tab ${activeTab === 'active' ? 'active' : ''}`}
                                onClick={() => setActiveTab('active')}
                            >
                                Active Documents ({activeDocs.length})
                            </button>
                            <button 
                                className={`docu-tab ${activeTab === 'archived' ? 'active' : ''}`}
                                onClick={() => setActiveTab('archived')}
                            >
                                Archived Documents ({archivedDocs.length})
                            </button>
                        </div>

                        <div className="docu-filter-bar">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by document name or recipient email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="draft">Draft</option>
                                <option value="awaiting">Awaiting Signatures</option>
                                <option value="completed">Completed</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="uploading-spinner">
                                <div className="spinner"></div>
                                <p style={{ color: '#9ca3af' }}>Fetching documents...</p>
                            </div>
                        ) : documents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                <FileText size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                                <p>No documents found. Click "Upload & Prepare PDF" to get started.</p>
                            </div>
                        ) : filteredDocuments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                <Search size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                                <p>No documents match your search filters.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="docu-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Recipient</th>
                                            <th>Status</th>
                                            <th>Sent Date</th>
                                            <th>Expiry Date</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDocuments.map((doc) => (
                                            <tr key={doc._id}>
                                                <td style={{ fontWeight: '600' }}>{doc.document_name}</td>
                                                <td>{doc.recipient_email || <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Not sent</span>}</td>
                                                <td>
                                                    <span className={`badge ${doc.status}`}>{doc.status}</span>
                                                </td>
                                                <td>{doc.sent_at ? new Date(doc.sent_at).toLocaleDateString('en-GB') : '-'}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {doc.expires_at ? new Date(doc.expires_at).toLocaleDateString('en-GB') : '-'}
                                                        {isNearExpiry(doc) && (
                                                            <Clock 
                                                                size={14} 
                                                                title="Expiring soon (under 24 hours!)" 
                                                                style={{ color: '#fbbf24', animation: 'pulse 2s infinite' }}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                                                        <a 
                                                            href={doc.status === 'completed' && doc.final_file_url ? doc.final_file_url : `/britsync-docu/${doc.secure_token}?mode=preview`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="btn-icon" 
                                                            title={doc.status === 'completed' ? "Download Signed PDF" : "Preview Document"}
                                                        >
                                                            <Eye size={16} />
                                                        </a>

                                                        {doc.status === 'draft' && (
                                                            <button className="btn-icon" onClick={() => editDocumentInWizard(doc)} title="Resume Preparing / Send">
                                                                <PenTool size={16} />
                                                            </button>
                                                        )}

                                                        {['sent', 'viewed', 'expired'].includes(doc.status) && (
                                                            <>
                                                                <button className="btn-icon" onClick={() => handleCopyLink(doc.secure_token)} title="Copy Signature Link">
                                                                    <Copy size={16} />
                                                                </button>
                                                                <button className="btn-icon" onClick={() => openResendModal(doc)} title="Resend Link / Update Expiry">
                                                                    <Send size={16} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {doc.status === 'completed' && doc.final_file_url && (
                                                            <a href={doc.final_file_url} target="_blank" rel="noopener noreferrer" className="btn-icon download" title="Download Signed PDF">
                                                                <Download size={16} />
                                                            </a>
                                                        )}

                                                        <button className="btn-icon" onClick={() => viewAuditLogs(doc)} title="View Audit Logs">
                                                            <History size={16} />
                                                        </button>

                                                        {doc.status !== 'archived' && (
                                                            <button className="btn-icon" onClick={() => handleArchiveDocument(doc._id)} title="Archive Document">
                                                                <Lock size={16} />
                                                            </button>
                                                        )}

                                                        {doc.status === 'archived' && (
                                                            <button className="btn-icon" onClick={() => handleUnarchiveDocument(doc._id)} title="Restore / Unarchive Document">
                                                                <RefreshCw size={16} />
                                                            </button>
                                                        )}

                                                        <button className="btn-icon delete" onClick={() => handleDeleteDocument(doc._id)} title="Delete Permanently">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ----------------- WIZARD FLOW DIALOG ----------------- */}
            {showWizard && (
                <div className="modal-overlay">
                    <div className="modal-content wizard-modal-content">
                        <div className="modal-header">
                            <h2>Prepare BritSync Document</h2>
                            <button className="modal-close" onClick={handleCloseWizard}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Steps Indicator */}
                        <div className="wizard-steps">
                            <div className={`step-indicator ${wizardStep === 1 ? 'active' : ''} ${wizardStep > 1 ? 'completed' : ''}`}>
                                <div className="step-num">{wizardStep > 1 ? <Check size={12} /> : '1'}</div>
                                Upload PDF
                            </div>
                            <div className={`step-indicator ${wizardStep === 2 ? 'active' : ''} ${wizardStep > 2 ? 'completed' : ''}`}>
                                <div className="step-num">{wizardStep > 2 ? <Check size={12} /> : '2'}</div>
                                Place Fields
                            </div>
                            {fields.some(f => f.field_type === 'admin_signature') && (
                                <div className={`step-indicator ${wizardStep === 3 ? 'active' : ''} ${wizardStep > 3 ? 'completed' : ''}`}>
                                    <div className="step-num">{wizardStep > 3 ? <Check size={12} /> : '3'}</div>
                                    Pre-Sign
                                </div>
                            )}
                            <div className={`step-indicator ${wizardStep === 4 ? 'active' : ''}`}>
                                <div className="step-num">4</div>
                                Dispatch Details
                            </div>
                        </div>

                        {/* Step 1: Upload Dropzone */}
                        {wizardStep === 1 && (
                            <div className="modal-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {uploading ? (
                                    <div className="uploading-spinner">
                                        <div className="spinner"></div>
                                        <p style={{ color: '#d1d5db' }}>Processing and rendering PDF pages...</p>
                                    </div>
                                ) : (
                                    <label className="upload-dropzone" style={{ width: '100%', maxWidth: '500px' }}>
                                        <div className="upload-icon">
                                            <Upload size={48} />
                                        </div>
                                        <p>Click to browse or drag PDF here</p>
                                        <span>Max file size: 10MB (PDF formats only)</span>
                                        <input type="file" className="file-input" accept=".pdf" onChange={handlePdfUpload} />
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Step 2: Editor Placement Canvas */}
                        {wizardStep === 2 && (
                            uploading ? (
                                <div className="modal-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
                                    <div className="uploading-spinner">
                                        <div className="spinner"></div>
                                        <p style={{ color: '#d1d5db' }}>Processing and rendering PDF pages...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="editor-workspace">
                                    <div className="editor-toolbar">
                                        <div>
                                            <h3>Place Fields</h3>
                                            <div className="toolbar-buttons">
                                                <button className={`btn-tool ${activeTool === 'text' ? 'active' : ''}`} onClick={() => setActiveTool('text')}>
                                                    <FileText size={18} />
                                                    Text Field
                                                </button>
                                                <button className={`btn-tool ${activeTool === 'user_signature' ? 'active' : ''}`} onClick={() => setActiveTool('user_signature')}>
                                                    <PenTool size={18} />
                                                    User Signature
                                                </button>
                                                <button className={`btn-tool ${activeTool === 'admin_signature' ? 'active' : ''}`} onClick={() => setActiveTool('admin_signature')}>
                                                    <Lock size={18} />
                                                    Admin Signature
                                                </button>
                                            </div>
                                        </div>

                                        {selectedField && (
                                            <div className="field-settings-panel">
                                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase' }}>Field Configurations</h4>
                                                <div className="form-group">
                                                    <label>Field Name / Label</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={selectedField.label}
                                                        onChange={(e) => handleUpdateField(selectedField._id, { label: e.target.value })}
                                                    />
                                                </div>
                                                {selectedField.field_type === 'text' && (
                                                    <div className="form-group">
                                                        <label>Placeholder</label>
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            value={selectedField.placeholder}
                                                            onChange={(e) => handleUpdateField(selectedField._id, { placeholder: e.target.value })}
                                                        />
                                                    </div>
                                                )}
                                                <label className="checkbox-group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedField.required}
                                                        onChange={(e) => handleUpdateField(selectedField._id, { required: e.target.checked })}
                                                    />
                                                    Mark as Required
                                                </label>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                                    onClick={() => handleDeleteField(selectedField._id)}
                                                >
                                                    <Trash2 size={14} /> Delete Field
                                                </button>
                                            </div>
                                        )}

                                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <button className="btn-secondary" onClick={handleSaveFieldsDraft} disabled={saving}>
                                                {saving ? 'Saving...' : 'Save Progress Draft'}
                                            </button>
                                            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={handleWizardNext}>
                                                Continue
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pdf-viewer-scroll">
                                        <div style={{ background: '#f87171', padding: '0.5rem 1rem', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', width: '100%', maxWidth: '800px', textAlign: 'center', fontWeight: '500', marginBottom: '0.5rem' }}>
                                            💡 Instructions: Select a tool on the left, then click and drag on the PDF page below to draw a box. You can drag fields to reposition, or drag bottom-right corners to resize.
                                        </div>
                                        {Array.from({ length: numPages }).map((_, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>Page {index + 1}</h4>
                                                <PdfPageContainer
                                                    pageNum={index + 1}
                                                    pdfDoc={pdfDoc}
                                                    activeTool={activeTool}
                                                    fields={fields}
                                                    onAddField={handleAddField}
                                                    onUpdateField={handleUpdateField}
                                                    onDeleteField={handleDeleteField}
                                                    selectedFieldId={selectedFieldId}
                                                    onSelectField={setSelectedFieldId}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Step 3: Optional Admin Pre-Signing */}
                        {wizardStep === 3 && (
                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <div className="presign-container">
                                    <h2>Admin Signature Required</h2>
                                    <p>You have placed Admin Signature fields on this document. You need to pre-sign these fields now before sending the document to the recipient.</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', marginTop: '1.5rem' }}>
                                        {fields.filter(f => f.field_type === 'admin_signature').map((field, idx) => (
                                            <div key={field._id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 1.5rem', borderRadius: '10px', width: '100%', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                <div style={{ textAlign: 'left', flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>{field.label || `Admin Signature ${idx + 1}`}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Placed on Page {field.page_number}</div>
                                                </div>

                                                {field.signature_data ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                                            <img src={field.signature_data} alt="Signature Preview" style={{ height: '35px', filter: 'invert(1)' }} />
                                                        </div>
                                                        <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => openPreSignPad(field._id)}>
                                                            Redraw
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: 'none' }} onClick={() => openPreSignPad(field._id)}>
                                                        Sign Field
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-footer" style={{ borderTop: 'none' }}>
                                    <button className="btn-secondary" onClick={handleWizardPrev}>
                                        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back
                                    </button>
                                    <button className="btn-primary" onClick={handleWizardNext}>
                                        Continue <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Dispatch Details */}
                        {wizardStep === 4 && (
                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <div className="dispatch-form-container">
                                    <h2>Dispatch Signature Request</h2>

                                    <div className="form-group">
                                        <label>Recipient Email Address *</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="recipient@example.com"
                                            required
                                            value={recipientEmail}
                                            onChange={(e) => setRecipientEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Document Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            required
                                            value={currentDocName}
                                            onChange={(e) => setCurrentDocName(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Custom Email Message (Optional)</label>
                                        <textarea
                                            className="form-input"
                                            rows={4}
                                            placeholder="Hello, please sign this contract..."
                                            value={emailMessage}
                                            onChange={(e) => setEmailMessage(e.target.value)}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Link Expiration Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            required
                                            value={expiresAtDate}
                                            onChange={(e) => setExpiresAtDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer" style={{ borderTop: 'none' }}>
                                    <button className="btn-secondary" onClick={handleWizardPrev} disabled={sending}>
                                        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back
                                    </button>
                                    <button className="btn-primary" onClick={handleSendDocument} disabled={sending}>
                                        {sending ? (
                                            <>Dispatched...</>
                                        ) : (
                                            <>
                                                Send Request <Send size={16} style={{ marginLeft: '0.5rem' }} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ----------------- ADMIN SIGNATURE MODAL ----------------- */}
            {showSigModal && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="modal-content signature-pad-modal">
                        <div className="modal-header">
                            <h2>Draw Your Signature</h2>
                            <button className="modal-close" onClick={() => setShowSigModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ paddingBottom: '0.5rem' }}>
                            <p style={{ color: '#9ca3af', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Use your mouse, trackpad, or touch screen to draw your signature in the space below.</p>
                            <div className="sig-pad-wrapper">
                                <SignatureCanvas
                                    ref={sigPadRef}
                                    penColor="black"
                                    canvasProps={{
                                        width: 450,
                                        height: 200,
                                        className: 'sig-canvas'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={handleClearAdminSig}>
                                Clear Pad
                            </button>
                            <button className="btn-primary" onClick={handleSaveAdminSig}>
                                Save Signature
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------- AUDIT LOGS MODAL ----------------- */}
            {showLogsModal && selectedDoc && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div>
                                <h2>Audit Trail</h2>
                                <span style={{ color: '#6b7280', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>{selectedDoc.document_name}</span>
                            </div>
                            <button className="modal-close" onClick={() => setShowLogsModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedDocLogs.length === 0 ? (
                                <div className="audit-log-empty">No logged events for this document.</div>
                            ) : (
                                <div className="audit-log-list">
                                    {selectedDocLogs.map((log) => (
                                        <div className="audit-log-item" key={log._id}>
                                            <div className="audit-log-meta">
                                                <span>{new Date(log.createdAt).toLocaleString('en-GB')}</span>
                                                {log.ip_address && (
                                                    <span className="audit-log-ip">IP: {log.ip_address}</span>
                                                )}
                                            </div>
                                            <div className="audit-log-event">{log.event_type.replace(/_/g, ' ')}</div>
                                            {log.recipient_email && (
                                                <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
                                                    Target: <strong>{log.recipient_email}</strong>
                                                </div>
                                            )}
                                            {log.user_agent && (
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    UA: {log.user_agent}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-primary" onClick={() => setShowLogsModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------- RESEND / UPDATE EXPIRES MODAL ----------------- */}
            {showResendModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '650px' }}>
                        <div className="modal-header">
                            <h2>Resend Options</h2>
                            <button className="modal-close" onClick={() => setShowResendModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                                Choose whether you want to just resend the signature request directly (with the option to update the recipient's email address), or edit the document layout and fields first.
                            </p>
                            <div className="resend-options-wrapper">
                                <div className="resend-option-card">
                                    <h3>Just Resend</h3>
                                    <p>Send a direct signature request reminder. You can update the recipient email and extend the link validity date.</p>
                                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                                        <label>Recipient Email Address *</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            required
                                            value={resendRecipientEmail}
                                            onChange={(e) => setResendRecipientEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={resendExpiresAt}
                                            onChange={(e) => setResendExpiresAt(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        className="btn-primary" 
                                        onClick={handleResend}
                                        disabled={sending}
                                        style={{ justifyContent: 'center', marginTop: 'auto' }}
                                    >
                                        {sending ? 'Sending...' : 'Send Reminder'}
                                    </button>
                                </div>
                                <div className="resend-option-card">
                                    <h3>Edit & Resend</h3>
                                    <p>Load the document back into the editor to modify fields/areas, pre-sign as admin again, and then send a new request.</p>
                                    <div className="resend-note">
                                        Note: This will allow you to change the placement of signature pads and text fields on the original PDF.
                                    </div>
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => {
                                            setShowResendModal(false);
                                            editDocumentInWizard(selectedResendDoc);
                                        }}
                                        style={{ justifyContent: 'center', marginTop: 'auto' }}
                                    >
                                        Edit Layout
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowResendModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toastMessage && (
                <div className="docu-toast glass">
                    <Check size={16} style={{ color: '#10b981' }} />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
};

// Subcomponent: PDF Page Canvas & Overlay Editor
const PdfPageContainer = ({
    pageNum,
    pdfDoc,
    activeTool,
    fields,
    onAddField,
    onUpdateField,
    onDeleteField,
    selectedFieldId,
    onSelectField
}) => {
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const [dimensions, setDimensions] = useState(null);

    // Drawing box state
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [drawBox, setDrawBox] = useState(null);

    // Drag move/resize state
    const [activeDragId, setActiveDragId] = useState(null);
    const [dragMode, setDragMode] = useState(null); // 'move' or 'resize'
    const [dragField, _setDragField] = useState(null);

    // Refs to avoid listener teardowns during dragging
    const activeDragIdRef = useRef(null);
    const dragModeRef = useRef(null);
    const dragStartOffsetRef = useRef({ x: 0, y: 0 });
    const dragFieldRef = useRef(null);
    const fieldsRef = useRef(fields);

    useEffect(() => {
        fieldsRef.current = fields;
    }, [fields]);

    const setDragField = (val) => {
        if (typeof val === 'function') {
            _setDragField(prev => {
                const next = val(prev);
                dragFieldRef.current = next;
                return next;
            });
        } else {
            dragFieldRef.current = val;
            _setDragField(val);
        }
    };

    // Phase 1: Load page dimensions
    useEffect(() => {
        let active = true;
        if (pdfDoc) {
            const loadDimensions = async () => {
                try {
                    const page = await pdfDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.3 }); // Sized for editing screen
                    if (active) {
                        setDimensions({ width: viewport.width, height: viewport.height });
                    }
                } catch (err) {
                    console.error('Pdf page dimension load error:', err);
                }
            };
            loadDimensions();
        }
        return () => { active = false; };
    }, [pdfDoc, pageNum]);

    // Phase 2: Render page content once canvas is ready with correct dimensions
    useEffect(() => {
        let active = true;
        if (pdfDoc && dimensions && canvasRef.current) {
            const renderPage = async () => {
                try {
                    const page = await pdfDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.3 });
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    await page.render(renderContext).promise;
                } catch (err) {
                    console.error('Pdf page render error:', err);
                }
            };
            renderPage();
        }
        return () => { active = false; };
    }, [pdfDoc, pageNum, dimensions]);

    // Track move/resize globally on window
    useEffect(() => {
        const handleMouseMove = (e) => {
            const activeId = activeDragIdRef.current;
            const mode = dragModeRef.current;
            if (!activeId || !mode) return;

            const activeField = fieldsRef.current.find(f => f._id === activeId);
            if (!activeField) return;

            const overlay = overlayRef.current;
            if (!overlay) return;
            const rect = overlay.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            const startOffset = dragStartOffsetRef.current;

            if (mode === 'move') {
                const newX = currentX - startOffset.x;
                const newY = currentY - startOffset.y;
                const x_percent = Math.max(0, Math.min(100 - activeField.width_percent, (newX / rect.width) * 100));
                const y_percent = Math.max(0, Math.min(100 - activeField.height_percent, (newY / rect.height) * 100));
                setDragField(prev => ({
                    ...prev,
                    x_percent,
                    y_percent
                }));
            } else if (mode === 'resize') {
                const startX = (activeField.x_percent / 100) * rect.width;
                const startY = (activeField.y_percent / 100) * rect.height;
                const newW = currentX - startX;
                const newH = currentY - startY;
                const width_percent = Math.max(5, Math.min(100 - activeField.x_percent, (newW / rect.width) * 100));
                const height_percent = Math.max(3, Math.min(100 - activeField.y_percent, (newH / rect.height) * 100));
                setDragField(prev => ({
                    ...prev,
                    width_percent,
                    height_percent
                }));
            }
        };

        const handleMouseUp = () => {
            const activeId = activeDragIdRef.current;
            if (activeId && dragFieldRef.current) {
                onUpdateField(activeId, {
                    x_percent: dragFieldRef.current.x_percent,
                    y_percent: dragFieldRef.current.y_percent,
                    width_percent: dragFieldRef.current.width_percent,
                    height_percent: dragFieldRef.current.height_percent
                });
            }
            activeDragIdRef.current = null;
            dragModeRef.current = null;
            dragStartOffsetRef.current = { x: 0, y: 0 };
            dragFieldRef.current = null;

            setActiveDragId(null);
            setDragMode(null);
            setDragField(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onUpdateField]);

    const handleMouseDown = (e) => {
        // Only trigger drawing if clicked directly on overlay and not an existing item
        if (e.target !== overlayRef.current) return;
        if (e.button !== 0) return; // Only left click

        const rect = overlayRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x: startX, y: startY });
        setDrawBox({ x: startX, y: startY, w: 0, h: 0 });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !drawBox) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        setDrawBox({
            x: startPos.x,
            y: startPos.y,
            w: currentX - startPos.x,
            h: currentY - startPos.y
        });
    };

    const handleMouseUp = (e) => {
        if (!isDrawing || !drawBox) return;
        setIsDrawing(false);

        const rect = overlayRef.current.getBoundingClientRect();
        const x_pixels = Math.min(drawBox.x, drawBox.x + drawBox.w);
        const y_pixels = Math.min(drawBox.y, drawBox.y + drawBox.h);
        const w_pixels = Math.abs(drawBox.w);
        const h_pixels = Math.abs(drawBox.h);

        const x_percent = (x_pixels / rect.width) * 100;
        const y_percent = (y_pixels / rect.height) * 100;
        const width_percent = (w_pixels / rect.width) * 100;
        const height_percent = (h_pixels / rect.height) * 100;

        // Prevent tiny boxes (accidental clicks)
        if (width_percent > 2 && height_percent > 1.5) {
            const newField = {
                _id: 'temp-' + Math.random().toString(36).substring(2, 9),
                page_number: pageNum,
                field_type: activeTool,
                assigned_to: activeTool === 'admin_signature' ? 'admin' : 'user',
                x_percent,
                y_percent,
                width_percent,
                height_percent,
                label: activeTool === 'text' ? 'Text Box' : (activeTool === 'admin_signature' ? 'Admin Signature' : 'User Signature'),
                placeholder: activeTool === 'text' ? 'Type text here' : '',
                required: true,
                value: '',
                signature_data: ''
            };
            onAddField(newField);
        }

        setDrawBox(null);
    };

    const handleFieldMouseDown = (e, field) => {
        e.stopPropagation();
        onSelectField(field._id);

        const overlay = overlayRef.current;
        if (!overlay) return;
        const rect = overlay.getBoundingClientRect();
        const fieldRectX = (field.x_percent / 100) * rect.width;
        const fieldRectY = (field.y_percent / 100) * rect.height;

        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        activeDragIdRef.current = field._id;
        dragModeRef.current = 'move';
        dragStartOffsetRef.current = {
            x: cursorX - fieldRectX,
            y: cursorY - fieldRectY
        };
        setDragField({
            _id: field._id,
            x_percent: field.x_percent,
            y_percent: field.y_percent,
            width_percent: field.width_percent,
            height_percent: field.height_percent
        });

        setActiveDragId(field._id);
        setDragMode('move');
    };

    const handleResizeMouseDown = (e, field) => {
        e.stopPropagation();
        e.preventDefault();
        const overlay = overlayRef.current;
        if (!overlay) return;
        const rect = overlay.getBoundingClientRect();

        activeDragIdRef.current = field._id;
        dragModeRef.current = 'resize';
        dragStartOffsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        setDragField({
            _id: field._id,
            x_percent: field.x_percent,
            y_percent: field.y_percent,
            width_percent: field.width_percent,
            height_percent: field.height_percent
        });

        setActiveDragId(field._id);
        setDragMode('resize');
    };

    const pageFields = fields.filter(f => f.page_number === pageNum);

    if (!dimensions) {
        return (
            <div 
                className="pdf-page-placeholder" 
                style={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    height: '500px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}
            >
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div 
            className="pdf-page-container" 
            style={{ 
                width: '100%', 
                maxWidth: dimensions.width, 
                aspectRatio: `${dimensions.width} / ${dimensions.height}` 
            }}
        >
            <canvas 
                ref={canvasRef} 
                className="pdf-canvas-element" 
                width={dimensions.width} 
                height={dimensions.height} 
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div
                ref={overlayRef}
                className={`pdf-overlay-layer ${isDrawing ? 'drawing-active' : ''} ${activeDragId ? 'drag-active' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ width: '100%', height: '100%' }}
            >
                {/* Temporary dragging selection box */}
                {drawBox && (
                    <div
                        className="drag-selection-box"
                        style={{
                            left: Math.min(drawBox.x, drawBox.x + drawBox.w),
                            top: Math.min(drawBox.y, drawBox.y + drawBox.h),
                            width: Math.abs(drawBox.w),
                            height: Math.abs(drawBox.h)
                        }}
                    />
                )}

                {/* Placed Fields */}
                {pageFields.map((field) => {
                    const isDragging = dragField && dragField._id === field._id;
                    const displayField = isDragging ? { ...field, ...dragField } : field;
                    return (
                        <div
                            key={field._id}
                            className={`placed-field-element ${field.field_type} ${selectedFieldId === field._id ? 'selected' : ''}`}
                            style={{
                                left: `${displayField.x_percent}%`,
                                top: `${displayField.y_percent}%`,
                                width: `${displayField.width_percent}%`,
                                height: `${displayField.height_percent}%`
                            }}
                            onMouseDown={(e) => handleFieldMouseDown(e, field)}
                        >
                            <div className="field-label-text">
                                {displayField.label}
                                {displayField.required && ' *'}
                            </div>
                            <div className="field-type-tag">{displayField.field_type.replace(/_/g, ' ')}</div>

                            {displayField.field_type === 'admin_signature' && displayField.signature_data && (
                                <img src={displayField.signature_data} alt="Admin Signature Preview" className="admin-sig-rendered" />
                            )}

                            <button
                                className="field-btn-delete"
                                onMouseDown={(e) => e.stopPropagation()} // Stop selection/dragging click propagation
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteField(field._id);
                                }}
                                title="Delete Field"
                            >
                                <X size={10} />
                            </button>

                            <div
                                className="field-resize-handle"
                                onMouseDown={(e) => handleResizeMouseDown(e, field)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BritsyncDocuAdmin;
