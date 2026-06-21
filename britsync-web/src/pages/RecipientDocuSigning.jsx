import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import {
    PenTool, X, Check, FileCheck, Calendar, Download, Eye, AlertCircle, RefreshCw
} from 'lucide-react';
import { apiCall } from '../utils/api';
import './RecipientDocuSigning.css';

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

const RecipientDocuSigning = () => {
    const { token } = useParams();
    const isPreview = new URLSearchParams(window.location.search).get('mode') === 'preview';

    // Loading & Error States
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(true);
    const [error, setError] = useState('');

    // Document States
    const [documentData, setDocumentData] = useState(null);
    const [fields, setFields] = useState([]);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);

    // Signature Canvas Modal States
    const [showSigModal, setShowSigModal] = useState(false);
    const [signingFieldId, setSigningFieldId] = useState(null);
    const sigPadRef = useRef(null);

    // Validation & Submit states
    const [validationErrors, setValidationErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try {
                // Get document metadata using secure token
                const doc = await apiCall(`britsync-docu/sign/${token}`);
                setDocumentData(doc);
                setFields(doc.fields || []);

                if (doc.status === 'completed') {
                    setCompleted(true);
                    setLoading(false);
                    return;
                }

                // Load PDFJS library
                const pdfjs = await loadPdfJs();
                const loadedPdf = await pdfjs.getDocument(doc.original_file_url).promise;
                setPdfDoc(loadedPdf);
                setNumPages(loadedPdf.numPages);
                setPdfLoading(false);
            } catch (err) {
                console.error('Failed to load document metadata:', err);
                setError(err.message || 'The signature request was not found or has expired.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDocument();
        }
    }, [token]);

    const handleFieldUpdate = (fieldId, valueOrAction) => {
        if (valueOrAction === 'trigger_modal') {
            setSigningFieldId(fieldId);
            setShowSigModal(true);
            return;
        }

        // Update local text inputs
        setFields(prev => prev.map(f => f._id === fieldId ? { ...f, value: valueOrAction } : f));
        // Clear validation error when recipient types
        setValidationErrors(prev => prev.filter(id => id !== fieldId));
    };

    const handleSaveSignature = () => {
        if (sigPadRef.current.isEmpty()) {
            alert('Please draw your signature before saving.');
            return;
        }
        const dataUrl = sigPadRef.current.getCanvas().toDataURL('image/png');
        setFields(prev => prev.map(f => f._id === signingFieldId ? { ...f, signature_data: dataUrl } : f));
        setValidationErrors(prev => prev.filter(id => id !== signingFieldId));
        setShowSigModal(false);
        setSigningFieldId(null);
    };

    const handleClearSignature = () => {
        sigPadRef.current.clear();
    };

    const handleCompleteDocument = async () => {
        // Find missing required fields
        const missingFieldIds = [];
        fields.forEach((field) => {
            if (field.assigned_to === 'user' && field.required) {
                if (field.field_type === 'text' && (!field.value || !field.value.trim())) {
                    missingFieldIds.push(field._id);
                } else if (field.field_type === 'user_signature' && !field.signature_data) {
                    missingFieldIds.push(field._id);
                }
            }
        });

        if (missingFieldIds.length > 0) {
            setValidationErrors(missingFieldIds);
            alert('Please complete all required fields (highlighted in red) before completing.');
            
            // Scroll to the first invalid field for better UX
            const firstErrorEl = document.getElementById(`field-box-${missingFieldIds[0]}`);
            if (firstErrorEl) {
                firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiCall(`britsync-docu/sign/${token}/complete`, {
                method: 'POST',
                body: { fields }
            });
            setDocumentData(res);
            setCompleted(true);
        } catch (err) {
            console.error('Submit sign failure:', err);
            alert(err.message || 'Failed to complete signing.');
        } finally {
            setSubmitting(false);
        }
    };

    // Render loading screen
    if (loading) {
        return (
            <div className="status-screen-container">
                <div className="uploading-spinner">
                    <div className="spinner"></div>
                    <p style={{ color: '#9ca3af' }}>Retrieving signature request details...</p>
                </div>
            </div>
        );
    }

    // Render error screen (Expired link or not found)
    if (error) {
        return (
            <div className="status-screen-container">
                <div className="status-card">
                    <div className="status-icon-wrapper error">
                        <AlertCircle size={40} />
                    </div>
                    <h1>Link Unusable</h1>
                    <p>{error}</p>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                        If you believe this is in error, please contact the BritSync support team.
                    </div>
                </div>
            </div>
        );
    }

    // Render completion success screen
    if (completed && documentData) {
        // Direct absolute download link
        const downloadUrl = documentData.final_file_url || `${import.meta.env.DEV ? 'http://localhost:5003' : ''}/api/britsync-docu/sign/${token}/download`;

        return (
            <div className="status-screen-container">
                <div className="status-card" style={{ maxWidth: '550px' }}>
                    <div className="status-icon-wrapper success">
                        <FileCheck size={40} />
                    </div>
                    <h1>Document Completed</h1>
                    <p>Thank you! You have successfully reviewed, completed, and digitally signed <strong>{documentData.document_name}</strong>.</p>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#9ca3af' }}>Recipient:</span>
                            <span style={{ fontWeight: '600' }}>{documentData.recipient_email}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af' }}>Completed on:</span>
                            <span style={{ fontWeight: '600' }}>{new Date(documentData.completed_at || Date.now()).toLocaleString('en-GB')}</span>
                        </div>
                    </div>
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-download-big">
                        <Download size={20} />
                        Download Signed Document
                    </a>
                </div>
            </div>
        );
    }

    // Expiry date format
    const expiryFormatted = documentData?.expires_at ? new Date(documentData.expires_at).toLocaleDateString('en-GB') : '';

    return (
        <div className="signing-container">
            {/* Custom Signing header */}
            <header className="signing-header">
                <div className="signing-logo">
                    <h2>BritSync Docu</h2>
                    <span style={{ color: '#4b5563' }}>|</span>
                    <span className="signing-doc-name">{documentData?.document_name}</span>
                </div>

                <div className="signing-header-actions">
                    {expiryFormatted && (
                        <div className="expiry-countdown">
                            <Calendar size={14} />
                            Expires: {expiryFormatted}
                        </div>
                    )}
                    {isPreview ? (
                        <div style={{ background: '#f59e0b', color: '#0f172a', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            Preview Mode (Read Only)
                        </div>
                    ) : (
                        <button className="btn-complete" onClick={handleCompleteDocument} disabled={submitting}>
                            {submitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Check size={16} /> Done / Complete Document
                                </>
                            )}
                        </button>
                    )}
                </div>
            </header>

            {/* Document Pages Workspace */}
            {pdfLoading ? (
                <div className="signing-workspace" style={{ justifyContent: 'center' }}>
                    <div className="uploading-spinner">
                        <div className="spinner"></div>
                        <p style={{ color: '#9ca3af' }}>Rendering document layout...</p>
                    </div>
                </div>
            ) : (
                <div className="signing-workspace">
                    {isPreview ? (
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1.5px solid #f59e0b', color: '#f59e0b', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', width: '100%', maxWidth: '800px', textAlign: 'center', fontWeight: '500' }}>
                            👁️ You are viewing this document in Preview Mode. Placed fields and signatures are read-only.
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1.5px solid #3b82f6', color: '#60a5fa', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', width: '100%', maxWidth: '800px', textAlign: 'center', fontWeight: '500' }}>
                            ℹ️ Instructions: Click inside the blue field boxes to enter your text. Click the purple signature boxes to open drawing pads and write your digital signature. Once finished, click the green "Done / Complete" button in the top right.
                        </div>
                    )}
                    {Array.from({ length: numPages }).map((_, index) => (
                        <div key={index}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>Page {index + 1}</h4>
                            <SigningPage
                                pageNum={index + 1}
                                pdfDoc={pdfDoc}
                                fields={fields}
                                onFieldUpdate={handleFieldUpdate}
                                validationErrors={validationErrors}
                                isPreview={isPreview}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* ----------------- RECIPIENT SIGNATURE MODAL ----------------- */}
            {showSigModal && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="modal-content signature-pad-modal">
                        <div className="modal-header">
                            <h2>Write Your Digital Signature</h2>
                            <button className="modal-close" onClick={() => setShowSigModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ paddingBottom: '0.5rem' }}>
                            <p style={{ color: '#9ca3af', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Use your cursor, trackpad, or screen touch to write your digital e-signature below.</p>
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
                            <button className="btn-secondary" onClick={handleClearSignature}>
                                Clear Pad
                            </button>
                            <button className="btn-primary" onClick={handleSaveSignature}>
                                Lock & Save Signature
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Subcomponent: Individual Document Page with interactive field overlays
const SigningPage = ({ pageNum, pdfDoc, fields, onFieldUpdate, validationErrors, isPreview }) => {
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState(null);

    // Phase 1: Load page dimensions from PDF viewport
    useEffect(() => {
        let active = true;
        if (pdfDoc) {
            const loadDimensions = async () => {
                try {
                    const page = await pdfDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.3 }); // Sized matches admin
                    if (active) {
                        setDimensions({ width: viewport.width, height: viewport.height });
                    }
                } catch (err) {
                    console.error('Signing pdf page dimension load error:', err);
                }
            };
            loadDimensions();
        }
        return () => { active = false; };
    }, [pdfDoc, pageNum]);

    // Phase 2: Render PDF page content when canvas is ready with correct dimensions
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
                    console.error('Signing pdf page render error:', err);
                }
            };
            renderPage();
        }
        return () => { active = false; };
    }, [pdfDoc, pageNum, dimensions]);

    const pageFields = fields.filter(f => f.page_number === pageNum);

    if (!dimensions) {
        return (
            <div 
                className="signing-page-placeholder" 
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
            className="signing-page-wrapper"
            style={{
                width: '100%',
                maxWidth: dimensions.width,
                aspectRatio: `${dimensions.width} / ${dimensions.height}`
            }}
        >
            <canvas 
                ref={canvasRef} 
                className="signing-canvas-element" 
                width={dimensions.width} 
                height={dimensions.height} 
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div className="signing-overlay-layer">
                {pageFields.map((field) => {
                    const isEmpty = field.field_type === 'text' ? !field.value?.trim() : !field.signature_data;
                    const isError = validationErrors.includes(field._id);

                    return (
                        <div
                            key={field._id}
                            className="signing-input-box"
                            id={`field-box-${field._id}`}
                            style={{
                                left: `${field.x_percent}%`,
                                top: `${field.y_percent}%`,
                                width: `${field.width_percent}%`,
                                height: `${field.height_percent}%`
                            }}
                        >
                            {field.field_type === 'text' && field.assigned_to === 'user' && (
                                <input
                                    type="text"
                                    className={`signing-text-input ${isError && isEmpty ? 'required-empty' : ''}`}
                                    placeholder={field.placeholder || (field.required ? 'Required *' : 'Optional')}
                                    value={field.value || ''}
                                    onChange={(e) => onFieldUpdate(field._id, e.target.value)}
                                    readOnly={isPreview}
                                    style={isPreview ? { cursor: 'not-allowed', backgroundColor: 'rgba(0,0,0,0.03)', color: '#555' } : {}}
                                />
                            )}

                            {field.field_type === 'user_signature' && field.assigned_to === 'user' && (
                                <div
                                    className={`signing-sig-placeholder ${isError && isEmpty ? 'required-empty' : ''}`}
                                    onClick={() => !isPreview && onFieldUpdate(field._id, 'trigger_modal')}
                                    style={isPreview ? { cursor: 'not-allowed' } : {}}
                                >
                                    {field.signature_data ? (
                                        <img src={field.signature_data} alt="Your Signature" className="signing-sig-preview" />
                                    ) : (
                                        <>
                                            <PenTool size={16} />
                                            <span>{field.label} {field.required && '*'}</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {field.field_type === 'admin_signature' && (
                                <div className="signing-sig-locked">
                                    <span className="locked-label">{field.label}</span>
                                    {field.signature_data ? (
                                        <img src={field.signature_data} alt="Admin Signature Preview" className="signing-sig-preview" />
                                    ) : (
                                        <span style={{ fontSize: '10px', color: '#f59e0b', fontStyle: 'italic' }}>Unsigned</span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecipientDocuSigning;
