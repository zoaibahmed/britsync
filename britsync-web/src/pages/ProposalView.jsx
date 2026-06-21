import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { apiCall } from '../utils/api';
import PageTransition from '../components/layout/PageTransition';
import { useTheme } from '../context/ThemeContext';
import {
    FileText,
    CheckCircle,
    Target,
    Layers,
    Rocket,
    ShieldCheck,
    X,
    PenTool,
    Download,
    Eye,
    FileSignature,
    Briefcase,
    Mail,
    Globe
} from 'lucide-react';
import './ProposalView.css';

const ProposalView = () => {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isPreviewMode = queryParams.get('mode') === 'preview';

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const sigPad = useRef();
    const documentRef = useRef();

    useEffect(() => {
        fetchProposal();
    }, [id]);

    const fetchProposal = async () => {
        try {
            const data = await apiCall(`proposals/${id}`);
            setProposal(data);
        } catch (err) {
            console.error('Failed to fetch proposal', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => sigPad.current.clear();

    const handleAccept = async () => {
        if (sigPad.current.isEmpty()) {
            alert('Please provide a signature first.');
            return;
        }

        setIsSubmitting(true);
        try {
            const signatureData = sigPad.current.getCanvas().toDataURL('image/png');
            await apiCall(`proposals/${id}/accept`, {
                method: 'PATCH',
                body: { signature: signatureData }
            });
            await fetchProposal();
            setShowSignatureModal(false);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } catch (err) {
            console.error('Signature submission error:', err);
            alert(`Failed to save signature: ${err.message || 'Unknown Error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPDF = async () => {
        if (!documentRef.current) return;
        setIsExporting(true);
        try {
            window.scrollTo(0, 0);
            const canvas = await html2canvas(documentRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#E6F0F8',
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.querySelector('.proposal-document');
                    if (el) {
                        el.style.position = 'static';
                        el.style.left = '0';
                        el.style.opacity = '1';
                        el.style.visibility = 'visible';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`BritSync_Proposal_${proposal._id.slice(-6).toUpperCase()}.pdf`);
        } catch (err) {
            console.error('PDF Export Error:', err);
            alert('PDF capture failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const openPreviewTab = () => {
        window.open(window.location.pathname + "?mode=preview", "_blank");
    };

    if (loading) return (
        <div className="proposal-loading-screen">
            <div className="loader"></div>
            <p>Authenticating Strategic Document...</p>
        </div>
    );

    if (!proposal) return (
        <div className="proposal-error-screen">
            <h2>Registry Unavailable</h2>
            <p>This proposal record is not accessible.</p>
        </div>
    );

    const isSigned = proposal.status === 'signed';

    const renderDocument = (captureMode = false) => (
        <div className={`proposal-document dynamic-height ${captureMode ? 'off-screen-capture' : ''}`} ref={captureMode ? documentRef : null}>
            <div className="document-page-content">

                <div className="doc-logo-container">
                    <img src="/vite.svg" alt="BritSync Logo" className="doc-logo-v11" style={{ height: '160px', display: 'block', margin: '0 auto' }} />
                </div>

                <div className="doc-cover-meta">
                    <div className="doc-id-badge">PROJECT REFERENCE: #BS-{proposal._id.slice(-6).toUpperCase()}</div>
                    <h1>OFFICIAL STRATEGIC PROPOSAL</h1>
                </div>

                {/* --- CV MODULAR CONTENT --- */}
                <div className="cv-modular-layout">

                    {/* SIDEBAR */}
                    <div className="cv-sidebar">
                        <div className="cv-sidebar-section">
                            <h3><Briefcase size={16} /> Strategy Registry</h3>
                            <div style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                                <strong>PREPARED BY:</strong> BRITSYNC INTL.<br />
                                <strong>FOR:</strong> {proposal.userName?.toUpperCase()}<br />
                                <strong>DATE:</strong> {new Date(proposal.createdAt).toLocaleDateString()}<br />
                                <strong>REF:</strong> #BS-{proposal._id.slice(-6).toUpperCase()}
                            </div>
                        </div>

                        <div className="cv-sidebar-section">
                            <h3><Target size={16} /> Objective Library</h3>
                            {proposal.objectives?.map((obj, i) => (
                                <div key={i} className="cv-objective-card">
                                    <span style={{ color: '#1A2A40', fontWeight: '900', marginRight: '5px' }}>{i + 1}.</span>
                                    <span>{obj}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="cv-main-content">
                        <div className="cv-content-block">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} /> Executive Summary</h2>
                            <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: '1.6' }}>{proposal.executiveSummary || proposal.projectDescription}</p>
                        </div>

                        <div className="cv-content-block">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={18} /> Architecture Matrix</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {proposal.scopeModules?.map((mod, i) => (
                                    <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid rgba(26,42,64,0.05)' }}>
                                        <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#1A2A40' }}>{mod.title}</div>
                                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6 }}>{mod.features?.join(' • ')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cv-content-block">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Rocket size={18} /> Operational Roadmap</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {proposal.timelinePhases?.map((p, i) => (
                                    <div key={i} style={{ borderLeft: '3px solid #1A2A40', paddingLeft: '15px' }}>
                                        <div style={{ fontWeight: '900', fontSize: '0.9rem' }}>{p.phase}: {p.title}</div>
                                        <p style={{ fontSize: '0.75rem', color: '#555' }}>{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {proposal.pricingOptions && proposal.pricingOptions.length > 0 && (
                            <div className="cv-content-block pricing-section-block">
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>💰</span> Financial Investment
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: proposal.pricingOptions.length === 1 ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                    {proposal.pricingOptions.map((opt, i) => {
                                        const hasDiscount = proposal.discount?.enabled && proposal.discount?.value > 0;
                                        let finalPrice = opt.price;
                                        if (hasDiscount) {
                                            if (proposal.discount.type === 'percentage') {
                                                finalPrice = opt.price * (1 - (proposal.discount.value / 100));
                                            } else {
                                                finalPrice = Math.max(0, opt.price - proposal.discount.value);
                                            }
                                        }
                                        return (
                                            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid rgba(26,42,64,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
                                                {i === 1 && (
                                                    <div style={{ position: 'absolute', top: '10px', right: '-35px', background: '#00d5ff', color: 'black', padding: '4px 35px', transform: 'rotate(45deg)', fontSize: '0.6rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                        Recommended
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1A2A40', marginBottom: '8px' }}>{opt.name}</div>
                                                    <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: '1.4', marginBottom: '15px' }}>{opt.description}</p>
                                                </div>
                                                <div style={{ borderTop: '1px solid rgba(26,42,64,0.05)', paddingTop: '15px', marginTop: '10px' }}>
                                                    {hasDiscount ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem', fontWeight: '500' }}>
                                                                ${opt.price.toLocaleString()}
                                                            </span>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0099ff' }}>
                                                                    ${finalPrice.toLocaleString()}
                                                                </span>
                                                                <span style={{ background: '#E6FDF4', color: '#00B87A', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                                                                    Save {proposal.discount.type === 'percentage' ? `${proposal.discount.value}%` : `$${proposal.discount.value.toLocaleString()}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1A2A40' }}>
                                                            ${opt.price.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- AUTHORIZATION (RESTORED TO LEFT/RIGHT) --- */}
                <div className="cert-authorization">
                    <div className="sig-column client-side" style={{ textAlign: 'left' }}>
                        <div className="cert-signature-box" style={{ justifyContent: 'flex-start' }}>
                            {proposal.signature ? (
                                <img src={proposal.signature} alt="Client Signature" />
                            ) : (
                                <ShieldCheck size={32} opacity={0.1} color="#1A2A40" />
                            )}
                        </div>
                        <div style={{ borderBottom: '2px solid #1A2A40', width: '220px', marginBottom: '8px' }}></div>
                        <div className="sig-info">
                            <strong>{proposal.userName}</strong>
                            <div className="sig-label">Digital Client Signatory</div>
                        </div>
                    </div>

                    <div className="sig-column bs-side" style={{ textAlign: 'right' }}>
                        <div className="cert-signature-box" style={{ justifyContent: 'flex-end' }}>
                            <img src="/bs-signature.png" alt="AUTHENTIC REPRESENTATIVE" style={{ height: '80px', opacity: 0.95, mixBlendMode: 'multiply' }} />
                        </div>
                        <div style={{ borderBottom: '2px solid #1A2A40', width: '220px', marginLeft: 'auto', marginBottom: '8px' }}></div>
                        <div className="sig-info">
                            <strong>BritSync Intl. Operations</strong>
                            <div className="sig-label">AUTHENTIC REPRESENTATIVE</div>
                        </div>
                    </div>
                </div>

                <div className="floral-sketch"></div>
            </div>
        </div>
    );

    const renderSuccessHub = () => (
        <div className="success-hub-v14" style={{ marginTop: '120px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success-card-v14">
                <div style={{ color: '#4facfe', marginBottom: '30px' }}><CheckCircle size={100} /></div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '10px' }}>Agreement Authenticated</h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Strategic partnership with <strong>{proposal.userName}</strong> successfully recorded.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '40px' }}>
                    <button className="download-btn-v5" onClick={downloadPDF} disabled={isExporting}>
                        {isExporting ? 'PREPARING PDF...' : 'Download Official Certificate'}
                    </button>

                </div>

                {/* --- PERSISTENT AUTHORIZATION UNIT --- */}
                <div className="hub-auth-signature" style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', width: '100%' }}>
                    <div className="cert-authorization" style={{ background: 'transparent', padding: '0', display: 'flex', justifyContent: 'space-between' }}>
                        <div className="sig-column client-side" style={{ textAlign: 'left', flex: 1 }}>
                            <div className="cert-signature-box">
                                {proposal.signature && <img src={proposal.signature} alt="Client Sign" style={{ height: '80px', filter: 'invert(1) brightness(1.5)' }} />}
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', width: '160px', marginBottom: '8px' }}></div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6 }}>Digital Client Signatory</div>
                        </div>

                        <div className="sig-column bs-side" style={{ textAlign: 'right', flex: 1 }}>
                            <div className="cert-signature-box" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <img src="/bs-signature.png" alt="Authority Sign" style={{ height: '80px', filter: 'invert(1) brightness(1.5)' }} />
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', width: '160px', marginLeft: 'auto', marginBottom: '8px' }}></div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6 }}>Authentic Representative</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="hub-footer-v14">
                <div className="hub-footer-row">
                    <span>© 2026 BRITSYNC INTL.</span>
                    <span>SECURITY: AES-256 ENCRYPTED</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <Globe size={16} /><Mail size={16} />
                </div>
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div className={`proposal-certificate-wrapper ${isPreviewMode ? 'preview-mode' : ''}`}>
                {isPreviewMode ? (
                    <div style={{ padding: '60px 0' }}>{renderDocument()}</div>
                ) : (
                    <>
                        {isSigned ? renderSuccessHub() : (
                            <>
                                <div style={{ padding: '40px 0' }}>{renderDocument()}</div>
                                <div className="proposal-actions-panel" style={{ textAlign: 'center', padding: '40px' }}>
                                    <button className="accept-btn-premium" onClick={() => setShowSignatureModal(true)}>
                                        <FileSignature size={24} /> Authenticate & Sign Proposal
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* --- OFF-SCREEN PDF CAPTURE TARGET --- */}
                <div style={{ position: 'fixed', left: '-9999px', top: '0', pointerEvents: 'none', opacity: 0 }}>
                    {renderDocument(true)}
                </div>

                <AnimatePresence>
                    {showSignatureModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sig-modal-overlay">
                            <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }} className="sig-modal-content">
                                <div className="modal-header">
                                    <PenTool size={32} color="#1A2A40" />
                                    <h3>Authorization Signature</h3>
                                    <p>Draw your signature clearly to authorize the project roadmap.</p>
                                </div>
                                <div className="sig-pad-v5">
                                    <SignatureCanvas
                                        ref={sigPad}
                                        penColor="#1A2A40"
                                        canvasProps={{ className: 'sigCanvas' }}
                                    />
                                </div>
                                <div className="modal-btns">
                                    <button className="btn-clear" onClick={handleClear}>Reset Board</button>
                                    <button className="btn-done" onClick={handleAccept} disabled={isSubmitting}>
                                        {isSubmitting ? 'Authenticating...' : 'Confirm Authentication'}
                                    </button>
                                </div>
                                <button className="modal-close-icon" onClick={() => setShowSignatureModal(false)}><X size={24} /></button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default ProposalView;
