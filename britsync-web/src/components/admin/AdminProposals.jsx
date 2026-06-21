import React, { useState, useEffect } from 'react';
import { FileText, Send, CheckCircle, Clock, Trash2, Search, Loader2, User, Mail, Phone, ExternalLink, Edit3, Sparkles, X, Plus, Target, Layers, Cpu, Zap, ArrowRight, ShieldCheck, ChevronRight, ChevronLeft, Layout, Eye, Rocket } from 'lucide-react';
import { apiCall } from '../../utils/api';
import './AdminProposals.css';

const PAGE_SIZE = 20;

export default function AdminProposals() {
  const [proposals, setProposals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [activeStep, setActiveStep] = useState(1); // 1 to 4
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await response.json();
        if (data.url) {
            setSelected({ ...selected, detailedProposalUrl: data.url });
            setSuccess('Detailed Document uploaded and linked successfully!');
        }
    } catch (err) {
        setError('Upload failed. Ensure the file is a PDF/Doc and under 5MB.');
    } finally {
        setIsUploadingFile(false);
    }
  };

  // Scroll Lock for Proposal Modal
  useEffect(() => {
    if (selected) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selected]);

  useEffect(() => {
    fetchProposals();
  }, [search, filter, page]);

  const fetchProposals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiCall(`proposals?search=${encodeURIComponent(search)}&status=${filter}&page=${page}&limit=${PAGE_SIZE}`);
      setProposals(res.proposals || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAndSend = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    setError('');
    
    try {
      await apiCall(`proposals/${selected._id}`, {
          method: 'PATCH',
          body: selected
      });
      await apiCall(`proposals/${selected._id}/send`, { method: 'POST' });
      
      const isRevision = selected.status === 'sent' || selected.status === 'signed';
      setSuccess(isRevision 
        ? 'PROPOSAL REVISED & RE-SENT! 🚀 The client has been notified of the updates.'
        : 'PROPOSAL DISPATCHED! 🚀 The client has been notified via Email & WhatsApp.');
      setSelected(null);
      setActiveStep(1);
      fetchProposals();
      setTimeout(() => setSuccess(''), 10000);
    } catch (err) {
      setError('CRITICAL: Email Dispatch Failed. Check server terminal for exact error.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const applyWaveTemplate = (currentProposal) => {
    return {
        ...currentProposal,
        executiveSummary: currentProposal.executiveSummary || "",
        objectives: (currentProposal.objectives && currentProposal.objectives.length > 0) ? currentProposal.objectives : [],
        scopeModules: (currentProposal.scopeModules && currentProposal.scopeModules.length > 0) ? currentProposal.scopeModules : [],
        executionModels: (currentProposal.executionModels && currentProposal.executionModels.length > 0) ? currentProposal.executionModels : [],
        timelinePhases: (currentProposal.timelinePhases && currentProposal.timelinePhases.length > 0) ? currentProposal.timelinePhases : [],
        pricingOptions: (currentProposal.pricingOptions && currentProposal.pricingOptions.length === 1) ? currentProposal.pricingOptions : [
            { name: "Project Build", price: 15000, description: "" }
        ],
        discount: currentProposal.discount || {
            enabled: false,
            type: "percentage",
            value: 0
        }
    };
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    const currentObjectives = Array.isArray(selected.objectives) ? selected.objectives : [];
    setSelected({ ...selected, objectives: [...currentObjectives, newObjective.trim()] });
    setNewObjective('');
  };

  const handleRemoveObjective = (index) => {
    const updated = selected.objectives.filter((_, i) => i !== index);
    setSelected({ ...selected, objectives: updated });
  };

  const handlePhaseChange = (index, field, value) => {
    const updated = [...(selected.timelinePhases || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSelected({ ...selected, timelinePhases: updated });
  };

  const handleAddPhase = () => {
    const currentPhases = Array.isArray(selected.timelinePhases) ? selected.timelinePhases : [];
    setSelected({
      ...selected,
      timelinePhases: [
        ...currentPhases,
        { phase: `Month ${currentPhases.length + 1}`, title: '', description: '' }
      ]
    });
  };

  const handleRemovePhase = (index) => {
    const updated = (selected.timelinePhases || []).filter((_, i) => i !== index);
    setSelected({ ...selected, timelinePhases: updated });
  };

  const handleScopeChange = (index, field, value) => {
    const updated = [...(selected.scopeModules || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSelected({ ...selected, scopeModules: updated });
  };

  const handleScopeFeaturesChange = (index, value) => {
    const updated = [...(selected.scopeModules || [])];
    updated[index] = { 
      ...updated[index], 
      featuresInput: value,
      features: value.split(',').map(f => f.trim()).filter(Boolean)
    };
    setSelected({ ...selected, scopeModules: updated });
  };

  const handleAddScopeModule = () => {
    const currentScope = Array.isArray(selected.scopeModules) ? selected.scopeModules : [];
    setSelected({
      ...selected,
      scopeModules: [
        ...currentScope,
        { title: '', details: '', features: [] }
      ]
    });
  };

  const handleRemoveScopeModule = (index) => {
    const updated = (selected.scopeModules || []).filter((_, i) => i !== index);
    setSelected({ ...selected, scopeModules: updated });
  };

  const handleSaveAndContinue = async () => {
    setIsUpdating(true);
    setError('');
    try {
        const res = await apiCall(`proposals/${selected._id}`, {
            method: 'PATCH',
            body: selected
        });
        setProposals(prev => prev.map(p => p._id === selected._id ? res : p));
        setSelected(res);
        setActiveStep(activeStep + 1);
    } catch (err) {
        setError('Failed to auto-save proposal draft.');
        console.error(err);
    } finally {
        setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setSelected(null);
    fetchProposals();
  };

  const handlePreviewProposal = async () => {
    setIsPreviewing(true);
    setError('');
    try {
        const res = await apiCall(`proposals/${selected._id}`, {
            method: 'PATCH',
            body: selected
        });
        setProposals(prev => prev.map(p => p._id === selected._id ? res : p));
        setSelected(res);
        window.open(`/proposal/${selected._id}?mode=preview`, '_blank');
    } catch (err) {
        setError('Failed to save proposal draft for preview.');
        console.error(err);
    } finally {
        setIsPreviewing(false);
    }
  };

  const handlePricingChange = (field, value) => {
    const updated = [...(selected.pricingOptions || [])];
    if (updated.length === 0) {
      updated.push({ name: 'Project Build', price: 0, description: '' });
    }
    updated[0] = { ...updated[0], [field]: value };
    setSelected({ ...selected, pricingOptions: updated });
  };

  const handleDiscountChange = (field, value) => {
    setSelected({
      ...selected,
      discount: {
        ...(selected.discount || { enabled: false, type: 'percentage', value: 0 }),
        [field]: value
      }
    });
  };

  const handleDelete = async (id) => {
      if (!window.confirm('WARNING: Permanent deletion of proposal record. Proceed?')) return;
      try {
          await apiCall(`proposals/${id}`, { method: 'DELETE' });
          setProposals(prev => prev.filter(p => p._id !== id));
          setSuccess('Proposal record purged.');
          setTimeout(() => setSuccess(''), 3000);
      } catch {
          setError('Failed to delete proposal.');
      }
  };

  return (
    <div className="admin-proposals">
      <div className="section-header">
        <h2 className="section-title"><Layout size={48} /> Strategy Registry</h2>
        <div className="search-bar">
          <Search size={22} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {(error || success) && (
        <div className={`status-alert ${error ? 'error' : 'success'}`}>
          <div className="alert-content">
            {error ? <Zap size={18} /> : <CheckCircle size={18} />}
            <span>{error || success}</span>
          </div>
          <button className="alert-close" onClick={() => { setError(''); setSuccess(''); }}>×</button>
        </div>
      )}

      <div className="table-container">
        <table className="proposals-table">
          <thead>
            <tr>
              <th>PARTNER IDENTIFIER</th>
              <th>WORKFLOW DESCRIPTION</th>
              <th>SUBMISSION LOG</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center loading-cell"><Loader2 className="spin" size={32} /></td></tr>
            ) : proposals.length === 0 ? (
                <tr><td colSpan="5" className="text-center empty-cell">Registry clear.</td></tr>
            ) : proposals.map(p => (
              <tr key={p._id}>
                <td>
                  <div className="client-info">
                    <span className="client-name">{p.userName}</span>
                    <span className="client-meta"><Mail size={12} /> {p.email}</span>
                  </div>
                </td>
                <td>
                    <p className="ov-text">{p.projectDescription?.slice(0, 60)}...</p>
                </td>
                <td>
                  <div className="timeline-info">
                    <Clock size={16} /> 
                    <span className="date-text">{new Date(p.createdAt || p.startDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${p.status}`}>{p.status.toUpperCase()}</span>
                </td>
                <td>
                  <div className="table-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button className="enrich-send-btn" onClick={() => { 
                      const templated = applyWaveTemplate(p);
                      setSelected(templated); 
                      setActiveStep(1); 
                    }}>
                      <Edit3 size={14} /> {p.status === 'sent' || p.status === 'signed' ? 'EDIT & RESEND' : 'ENRICH'}
                    </button>
                    <button className="icon-action-btn" style={{ background: '#eee', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.open(`/proposal/${p._id}?mode=preview`, '_blank')}>
                        <Eye size={16} />
                    </button>
                    <button className="icon-action-btn danger" style={{ background: '#fee', color: '#f55', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleDelete(p._id)}>
                        <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && handleCloseModal()}>
          <div className="enrich-modal-v4">
            <div className="stepper-header-v4">
               {[1, 2, 3, 4].map(s => (
                   <div key={s} className={`step-indicator ${activeStep === s ? 'active' : activeStep > s ? 'completed' : ''}`} onClick={() => setActiveStep(s)}>
                      <div className="step-num-v4">{s}</div>
                      <span className="step-label-v4">Step 0{s}</span>
                   </div>
               ))}
            </div>

            <div className="step-viewport-v4" data-lenis-prevent>
               {activeStep === 1 && (
                  <div className="modal-grid-v5">
                    <div className="form-field-v4">
                        <label className="field-label-v4"><Zap size={20} color="#00d5ff" /> Strategic Vision</label>
                        <span className="field-hint-v4">High-level industrial potential.</span>
                        <textarea 
                           className="v4-textarea xl"
                           value={selected.executiveSummary || ''} 
                           onChange={e => setSelected({...selected, executiveSummary: e.target.value})}
                           placeholder="Describe the executive summary, vision, and project background here..."
                        />
                    </div>
                    <div className="form-field-v4">
                        <label className="field-label-v4"><Target size={20} color="#00d5ff" /> Core Objectives</label>
                        <span className="field-hint-v4">Targeted list of project outcomes.</span>
                        <div className="objectives-list-v5">
                            {(Array.isArray(selected.objectives) ? selected.objectives : []).map((obj, idx) => (
                                <div key={idx} className="objective-item-v5" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.02)', marginBottom: '10px', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{obj}</span>
                                    <button onClick={() => handleRemoveObjective(idx)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={14} /></button>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    className="v4-textarea" 
                                    style={{ padding: '0.8rem' }}
                                    value={newObjective} 
                                    onChange={e => setNewObjective(e.target.value)} 
                                    placeholder="Enter a project goal/objective and press Enter..." 
                                    onKeyPress={e => e.key === 'Enter' && handleAddObjective()}
                                />
                                <button className="nav-btn-v4 primary" onClick={handleAddObjective}>+</button>
                            </div>
                        </div>
                    </div>
                  </div>
               )}

               {activeStep === 2 && (
                  <div className="modal-grid-v5" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="form-field-v4">
                        <label className="field-label-v4"><Layers size={20} color="#00d5ff" /> Technical Scope</label>
                        <span className="field-hint-v4">Configure architecture modules, descriptions, and features.</span>
                        
                        <div className="scope-edit-list-v5" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
                            {(selected.scopeModules || []).map((m, i) => (
                                <div key={i} className="scope-module-card-v5" style={{ padding: '20px', background: 'var(--prop-card)', border: '1px solid var(--prop-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '900', color: 'var(--prop-accent)', fontSize: '0.9rem' }}>MODULE {i + 1}</span>
                                        <button 
                                            onClick={() => handleRemoveScopeModule(i)} 
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ff5555', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Module Title</label>
                                            <input 
                                                type="text"
                                                className="v4-textarea"
                                                style={{ padding: '10px 15px', borderRadius: '8px' }}
                                                value={m.title || ''}
                                                onChange={e => handleScopeChange(i, 'title', e.target.value)}
                                                placeholder="e.g. User Application"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Key Features (comma-separated)</label>
                                            <input 
                                                type="text"
                                                className="v4-textarea"
                                                style={{ padding: '10px 15px', borderRadius: '8px' }}
                                                value={typeof m.featuresInput !== 'undefined' ? m.featuresInput : (m.features ? m.features.join(', ') : '')}
                                                onChange={e => handleScopeFeaturesChange(i, e.target.value)}
                                                placeholder="e.g. Auth, Wallet Interface, Transactions"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Module Details / Description</label>
                                        <textarea 
                                            className="v4-textarea"
                                            style={{ padding: '10px 15px', borderRadius: '8px', minHeight: '60px', fontSize: '0.9rem' }}
                                            value={m.details || ''}
                                            onChange={e => handleScopeChange(i, 'details', e.target.value)}
                                            placeholder="Describe the details and technical specs of this module..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            className="nav-btn-v4 primary" 
                            onClick={handleAddScopeModule}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', cursor: 'pointer', alignSelf: 'flex-start' }}
                        >
                            <Plus size={16} /> Add Scope Module
                        </button>
                    </div>

                    <div className="form-field-v4" style={{ marginTop: '20px' }}>
                        <label className="field-label-v4"><Clock size={20} color="#00d5ff" /> Project Meta & Pricing</label>
                        <span className="field-hint-v4">Client metadata and standard contract pricing.</span>
                        <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', marginBottom: '25px' }}>
                            <p><strong>Client:</strong> {selected.userName}</p>
                            <p><strong>Email:</strong> {selected.email}</p>
                            <p><strong>Duration:</strong> {selected.duration?.value} {selected.duration?.type}</p>
                        </div>

                        <label className="field-label-v4" style={{ marginTop: '30px' }}>💰 Project Pricing</label>
                        <span className="field-hint-v4">Configure financial investment for client review.</span>
                        
                        <div className="price-option-form-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--prop-border)', borderRadius: '16px', marginBottom: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Pricing Plan Name</label>
                                    <input 
                                        type="text"
                                        className="v4-textarea"
                                        style={{ padding: '10px 15px', borderRadius: '8px' }}
                                        value={selected.pricingOptions?.[0]?.name || ''}
                                        onChange={e => handlePricingChange('name', e.target.value)}
                                        placeholder="e.g. Full Build Project"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Price ($)</label>
                                    <input 
                                        type="number"
                                        className="v4-textarea"
                                        style={{ padding: '10px 15px', borderRadius: '8px' }}
                                        value={selected.pricingOptions?.[0]?.price || 0}
                                        onChange={e => handlePricingChange('price', parseFloat(e.target.value) || 0)}
                                        placeholder="15000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea 
                                    className="v4-textarea"
                                    style={{ padding: '10px 15px', borderRadius: '8px', minHeight: '80px', fontSize: '0.9rem' }}
                                    value={selected.pricingOptions?.[0]?.description || ''}
                                    onChange={e => handlePricingChange('description', e.target.value)}
                                    placeholder="Enter details of what's included in this build..."
                                />
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="discount-form-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--prop-border)', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <input 
                                    type="checkbox"
                                    id="enable-discount"
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    checked={selected.discount?.enabled || false}
                                    onChange={e => handleDiscountChange('enabled', e.target.checked)}
                                />
                                <label htmlFor="enable-discount" style={{ fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>🏷️</span> Apply Discount to Options?
                                </label>
                            </div>

                            {selected.discount?.enabled && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Discount Type</label>
                                        <select 
                                            className="v4-textarea"
                                            style={{ padding: '10px 15px', borderRadius: '8px', height: '45px' }}
                                            value={selected.discount?.type || 'percentage'}
                                            onChange={e => handleDiscountChange('type', e.target.value)}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="flat">Flat Amount ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>
                                            {selected.discount?.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                                        </label>
                                        <input 
                                            type="number"
                                            className="v4-textarea"
                                            style={{ padding: '10px 15px', borderRadius: '8px', height: '45px' }}
                                            value={selected.discount?.value || 0}
                                            onChange={e => handleDiscountChange('value', parseFloat(e.target.value) || 0)}
                                            placeholder="10"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
               )}

               {activeStep === 3 && (
                  <div className="modal-grid-v5" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="form-field-v4">
                        <label className="field-label-v4"><Rocket size={20} color="#00d5ff" /> Execution Roadmap</label>
                        <span className="field-hint-v4">Phase delivery milestones. Add, remove, and configure phases/weeks/months.</span>
                        
                        <div className="roadmap-edit-list-v5" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
                            {(selected.timelinePhases || []).map((p, i) => (
                                <div key={i} className="roadmap-phase-card-v5" style={{ padding: '20px', background: 'var(--prop-card)', border: '1px solid var(--prop-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '900', color: 'var(--prop-accent)', fontSize: '0.9rem' }}>PHASE {i + 1}</span>
                                        <button 
                                            onClick={() => handleRemovePhase(i)} 
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ff5555', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Timeframe (e.g. Week 1, Month 2)</label>
                                            <input 
                                                type="text"
                                                className="v4-textarea"
                                                style={{ padding: '10px 15px', borderRadius: '8px' }}
                                                value={p.phase || ''}
                                                onChange={e => handlePhaseChange(i, 'phase', e.target.value)}
                                                placeholder="e.g. Month 1"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Phase Title</label>
                                            <input 
                                                type="text"
                                                className="v4-textarea"
                                                style={{ padding: '10px 15px', borderRadius: '8px' }}
                                                value={p.title || ''}
                                                onChange={e => handlePhaseChange(i, 'title', e.target.value)}
                                                placeholder="e.g. Structural Architecture"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--prop-text-muted)', display: 'block', marginBottom: '5px' }}>Description</label>
                                        <textarea 
                                            className="v4-textarea"
                                            style={{ padding: '10px 15px', borderRadius: '8px', minHeight: '60px', fontSize: '0.9rem' }}
                                            value={p.description || ''}
                                            onChange={e => handlePhaseChange(i, 'description', e.target.value)}
                                            placeholder="e.g. Design foundation and core engine setup..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            className="nav-btn-v4 primary" 
                            onClick={handleAddPhase}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', cursor: 'pointer' }}
                        >
                            <Plus size={16} /> Add Roadmap Phase
                        </button>
                    </div>
                  </div>
               )}

               {activeStep === 4 && (
                  <div className="modal-grid-v5">
                    <div className="form-field-v4">
                        <label className="field-label-v4"><ExternalLink size={20} color="#00d5ff" /> Strategic Assets</label>
                        <span className="field-hint-v4">Upload deep-dive detailed proposal (PDF or Word).</span>
                        <div className="upload-zone-v4" style={{ position: 'relative' }}>
                            <input 
                                type="file"
                                id="asset-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                            />
                            <label htmlFor="asset-upload" className="v4-textarea" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '15px' }}>
                                {isUploadingFile ? <Loader2 className="spin" size={20} /> : <FileText size={20} color="#00d5ff" />}
                                {selected.detailedProposalUrl ? (
                                    <span style={{ color: '#00ff88', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.detailedProposalUrl.split('/').pop()}</span>
                                ) : (
                                    <span>Select Strategic Document...</span>
                                )}
                            </label>
                            {selected.detailedProposalUrl && (
                                <button 
                                    className="nav-btn-v4" 
                                    onClick={() => setSelected({ ...selected, detailedProposalUrl: '' })}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '5px 10px', border: 'none', background: 'transparent' }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="form-field-v4">
                        <label className="field-label-v4"><ShieldCheck size={20} color="#00d5ff" /> Final Dispatch</label>
                        <span className="field-hint-v4">Verify strategy integrity & notify client.</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button 
                                className="nav-btn-v4" 
                                onClick={handlePreviewProposal} 
                                disabled={isPreviewing} 
                                style={{ 
                                    width: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '8px', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    border: '1px solid var(--prop-border)',
                                    color: 'var(--prop-text-main)',
                                    cursor: 'pointer',
                                    height: '60px',
                                    fontSize: '1rem',
                                    fontWeight: '800',
                                    borderRadius: '12px'
                                }}
                            >
                                {isPreviewing ? <Loader2 className="spin" size={20} /> : <Eye size={20} />}
                                {isPreviewing ? 'SAVING DRAFT...' : 'PREVIEW PROPOSAL'}
                            </button>

                            <button 
                                className="nav-btn-v4 dispatch" 
                                onClick={handleUpdateAndSend} 
                                disabled={isUpdating} 
                                style={{ 
                                    width: '100%', 
                                    textAlign: 'center', 
                                    justifyContent: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: 0,
                                    height: '60px'
                                }}
                            >
                                {isUpdating ? <Loader2 className="spin" size={24} /> : <Send size={24} />}
                                {isUpdating ? 'PREPARING...' : 'PATCH & DISPATCH'}
                            </button>
                        </div>
                    </div>
                  </div>
               )}
            </div>

            <div className="v4-footer-nav">
               <button className="nav-btn-v4" onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : handleCloseModal()}>
                  {activeStep === 1 ? 'Cancel' : 'Previous Step'}
               </button>
                {activeStep < 4 && (
                    <button className="nav-btn-v4 primary" onClick={handleSaveAndContinue} disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="spin" size={16} /> : 'Save & Continue'} <ArrowRight size={20} />
                    </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
