import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Video, Target, LineChart, Cpu, ArrowRight, ExternalLink, X, LayoutTemplate, BriefcaseBusiness, Globe, Terminal, ShieldCheck } from 'lucide-react';
import SplitText from '../ui/SplitText';
import { apiCall, getImageUrl } from '../../utils/api';

const InitiativesSection = ({ projects = [] }) => {
    const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [initiatives, setInitiatives] = useState([]);

    useEffect(() => {
        const fetchInitiatives = async () => {
            try {
                const data = await apiCall('initiatives');
                if (Array.isArray(data) && data.length > 0) {
                    setInitiatives(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
                }
            } catch (err) {
                console.error('Failed to fetch initiatives:', err);
            }
        };
        fetchInitiatives();
    }, []);

    // Aggressive Full-Page Scroll Lock
    useEffect(() => {
        if (showEnterpriseModal || selectedProject) {
            document.documentElement.style.setProperty('overflow', 'hidden', 'important');
            document.body.style.setProperty('overflow', 'hidden', 'important');
            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [showEnterpriseModal, selectedProject]);

    const globalInitiative = initiatives.find(i => i.type === 'global') || {
        title: 'Global AI Olympiad',
        description: 'Forging the sovereign digital infrastructure for worldwide competitive excellence. We are actively identifying and nurturing the world\'s most elite technical talent to redefine the absolute boundaries of machine intelligence.',
        image: '/gaio-logo.png',
        url: ''
    };

    const cooperativeInitiative = initiatives.find(i => i.type === 'cooperative') || {
        title: 'Talent Bridge Platform',
        description: 'Operating under our Community Cooperative, Talent Bridge is a specialized digital ecosystem. It empowers individuals to craft elite professional profiles, highlight distinct skillsets, and seamlessly connect with exclusive, high-value career opportunities.',
        image: '/talent-bridge-bg.png',
        url: ''
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <>
        <section className="initiatives-section" style={{ padding: '100px 0', background: 'var(--bg-color)' }}>
            <div className="container">
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <motion.div
                        className="heading-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="title-tag">OUR IMPACT</h2>
                        <SplitText text="Strategic Initiatives" className="text-gradient large-title" style={{ justifyContent: 'center' }} />
                    </motion.div>
                </div>

                <div className="initiatives-stacked-layout" style={{ display: 'flex', flexDirection: 'column', gap: '120px', maxWidth: '1400px', margin: '0 auto' }}>
                    
                    {/* --- SECTION 1: GLOBAL AI OLYMPIAD --- */}
                    <motion.div 
                        variants={cardVariants}
                        className="card-global initiative-card-main"
                        style={{ position: 'relative' }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                        
                        <div style={{ flex: '1 1 500px', zIndex: 2, position: 'relative' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe', padding: '10px 24px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '30px', border: '1px solid rgba(79, 172, 254, 0.3)' }}>
                                <Cpu size={16} /> Global Initiative
                            </div>
                            <h3 className="text-gradient-custom initiative-title">
                                {globalInitiative.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '45px', maxWidth: '650px', fontWeight: 300 }}>
                                {globalInitiative.description}
                            </p>

                            {globalInitiative.url ? (
                                <a href={globalInitiative.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <button className="btn-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', padding: '20px 45px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '100px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#ffffff', border: 'none', boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)' }}>
                                        Explore Framework <ExternalLink size={20} />
                                    </button>
                                </a>
                            ) : (
                                <button className="btn-premium opacity-50 cursor-not-allowed" style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', padding: '20px 45px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '100px', background: '#1e293b', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.2)' }} title="Coming Soon">
                                    Platform Anchoring...
                                </button>
                            )}
                        </div>

                        <div className="initiative-img-box" style={{ flex: '1 1 500px', minHeight: '400px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
                             <img src={globalInitiative.image && !globalInitiative.image.startsWith('/') ? getImageUrl(globalInitiative.image) : '/gaio-logo.png'} alt={globalInitiative.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.02)' }} />
                        </div>
                    </motion.div>

                    {/* --- SECTION 2: COMMUNITY COOPERATIVE (TALENT BRIDGE) --- */}
                    <motion.div 
                        variants={cardVariants}
                        className="card-coop initiative-card-main"
                        style={{
                            position: 'relative',
                            flexWrap: 'wrap-reverse'
                        }}
                    >
                        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(232, 171, 190, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                        
                        <div className="initiative-img-box">
                             <img src={cooperativeInitiative.image && !cooperativeInitiative.image.startsWith('/') ? getImageUrl(cooperativeInitiative.image) : '/talent-bridge-bg.png'} alt={cooperativeInitiative.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }} />
                        </div>

                        <div style={{ flex: '1 1 500px', zIndex: 2 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(232, 171, 190, 0.1)', color: '#e8abbe', padding: '8px 20px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '30px', border: '1px solid rgba(232, 171, 190, 0.2)' }}>
                                <Users size={16} /> Community Cooperative
                            </div>
                            <h3 className="text-gradient-coop initiative-title">
                                {cooperativeInitiative.title.replace('Platform', '').trim()}<br/>Platform
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '30px', maxWidth: '600px' }}>
                                {cooperativeInitiative.description}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px 25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'rgba(232, 171, 190, 0.2)', padding: '8px', borderRadius: '10px', color: '#e8abbe' }}><Briefcase size={20}/></div>
                                    <span style={{ fontWeight: 800, letterSpacing: '1px' }}>Profile Architect</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px 25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                     <div style={{ background: 'rgba(232, 171, 190, 0.2)', padding: '8px', borderRadius: '10px', color: '#e8abbe' }}><Target size={20}/></div>
                                    <span style={{ fontWeight: 800, letterSpacing: '1px' }}>Career Matrix Match</span>
                                </div>
                            </div>
                            {cooperativeInitiative.url ? (
                                <a href={cooperativeInitiative.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <button className="btn-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 40px', fontSize: '1.1rem', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(232, 171, 190, 0.5)', color: 'white' }}>
                                        Enter Hub <ExternalLink size={20} />
                                    </button>
                                </a>
                            ) : (
                                <button className="btn-premium opacity-50 cursor-not-allowed" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 40px', fontSize: '1.1rem', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(232, 171, 190, 0.5)', color: 'white' }}>
                                    Entering Network...
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* --- SECTION 3: LOCAL STRATEGIC INITIATIVES --- */}
                    <motion.div 
                        variants={cardVariants}
                        className="card-local initiative-card-main"
                        style={{
                            position: 'relative',
                            textAlign: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(79, 172, 254, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />
                        
                        <div style={{ marginBottom: '80px', position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe', padding: '8px 20px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', border: '1px solid rgba(79, 172, 254, 0.2)' }}>
                                <ShieldCheck size={16} /> Local Strategic Initiatives
                            </div>
                            <h3 className="initiative-title">Local Impact Framework</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '800px', margin: '0 auto', fontWeight: 300 }}>
                                Deploying a powerful arsenal of proprietary digital tools across localized ecosystems. We enable strategic market dominance through automated engagement and instant operational scale.
                            </p>
                        </div>
                        
                        {/* THE 3 PREMIUM TOOL CARDS */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', position: 'relative', zIndex: 2 }}>
                            
                            {/* TOOL 1: CRM */}
                            <div className="expertise-item" style={{ padding: '60px 40px', minHeight: 'auto' }}>
                                <div className="local-tool-icon-box crm-icon-box">
                                    <Users size={40} />
                                </div>
                                <h4 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px' }}>Intelligent CRM</h4>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>Deploy our full-scale customer relationship matrix. Monitor pipelines, automate follow-ups, and convert sophisticated enterprise leads effortlessly.</p>
                            </div>
                            
                            {/* TOOL 2: LEAD HUNTER */}
                            <div className="expertise-item" style={{ padding: '60px 40px', minHeight: 'auto' }}>
                                <div className="local-tool-icon-box hunter-icon-box">
                                    <Target size={40} />
                                </div>
                                <h4 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px' }}>Lead Hunter Pro</h4>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>Leverage our advanced scraping and acquisition algorithms. We hunt and aggregate high-value, strictly localized targets tailored to your exact niche.</p>
                            </div>
                            
                            {/* TOOL 3: VIDEO GENERATOR */}
                            <div className="expertise-item" style={{ padding: '60px 40px', minHeight: 'auto' }}>
                                <div className="local-tool-icon-box video-icon-box">
                                    <Video size={40} />
                                </div>
                                <h4 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px' }}>AI Video Engine</h4>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>Generate continuous, high-converting marketing collateral leveraging our proprietary neural engine to completely dominate localized social channels.</p>
                            </div>
 
                        </div>
 
                        {/* ENTERPRISE CTA / SEE MORE */}
                        <div style={{ marginTop: '50px', position: 'relative', zIndex: 2 }}>
                            <button className="capabilities-btn" onClick={() => setShowEnterpriseModal(true)}>
                                View Full Capabilities <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>

        {/* --- ENTERPRISE WORKS MODAL (MOVED OUTSIDE SECTION TO PREVENT CSS TRAPPING) --- */}
        <AnimatePresence>
            {showEnterpriseModal && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={() => setShowEnterpriseModal(false)}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -30 }}
                        className="modal-premium"
                        style={{ 
                            borderRadius: '24px', 
                            borderTop: '2px solid #4facfe',
                            padding: '0', 
                            maxWidth: '1100px', 
                            width: '100%', 
                            maxHeight: '90vh', 
                            overflowY: 'auto',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        data-lenis-prevent
                    >
                        {/* High-Tech Background Elements */}
                        <div className="scanning-grid" />
                        <div className="scanning-line" />
                        
                        {/* High-Tech Modal Header */}
                        <div style={{ padding: '40px 50px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981, 0 0 20px #10b981' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>SYSTEMS ACTIVE</span>
                                </div>
                                <h2 className="text-gradient-custom" style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.02em', margin: 0 }}>Command Index</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px', lineHeight: 1.6 }}>Accessing core operational framework database. Displaying all active, scalable projects and enterprise configurations.</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowEnterpriseModal(false)} 
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.3s', zIndex: 100 }}
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        {/* Dense Grid of Project Modules */}
                        <div className="command-index-grid">
                            
                            {projects && projects.length > 0 ? projects.map((project, idx) => (
                                <motion.div 
                                    key={project._id || idx} 
                                    layoutId={`project-card-${project._id || idx}`}
                                    onClick={() => setSelectedProject(project)} 
                                    className="command-card hover:border-blue-500 hover:bg-white/5 group"
                                >
                                    {/* Tech Card Header */}
                                    <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(79, 172, 254, 0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>MODULE_0{idx + 1}</div>
                                        <Terminal size={16} color="#4facfe" />
                                    </div>
                                    
                                    {/* Tech Card Body */}
                                    <div style={{ padding: '30px' }}>
                                        <motion.h4 layoutId={`project-title-${project._id || idx}`} style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '4px', height: '18px', background: '#4facfe', borderRadius: '4px' }}></div>
                                            {project.title}
                                        </motion.h4>
                                        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description || project.challenge}</p>

                                        
                                        {/* Dynamic Metric Bar */}
                                        <div style={{ marginBottom: '25px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(79, 172, 254, 0.6)', fontWeight: 800, marginBottom: '8px' }}>
                                                <span>OPERATIONAL STATUS</span>
                                                <span>{85 + (idx % 15)}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${85 + (idx % 15)}%` }}
                                                    className="metric-bar-fill"
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>ACTIVE</span>
                                            </div>
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4facfe', fontWeight: 800, textDecoration: 'none', background: 'rgba(79,172,254,0.1)', padding: '8px 16px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    EXECUTE <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hover border glow */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #4facfe, transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100"></div>
                                </motion.div>
                            ))
 : (
                                <div style={{ padding: '80px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', gridColumn: '1 / -1', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <div className="animate-spin" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid rgba(79, 172, 254, 0.2)', borderTopColor: '#4facfe', margin: '0 auto 20px' }}></div>
                                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.1em' }}>SYNCHRONIZING DATABANKS...</p>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Individual Project Detail Popup - STICKY LEFT IMAGE, SCROLLABLE RIGHT TEXT */}
            {selectedProject && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(30px)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={() => setSelectedProject(null)}
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="modal-premium"
                        style={{ 
                            borderRadius: '24px', 
                            padding: '0', 
                            maxWidth: '1200px', 
                            width: '100%',
                            height: '85vh',      // Fixed height for internal scrolling
                            display: 'flex',     // Row layout
                            overflow: 'hidden',  // Hide main container scroll
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        data-lenis-prevent
                    >
                        {/* High-Tech Background Elements */}
                        <div className="scanning-grid" />
                        {/* Close Button - Absolute over everything */}
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedProject(null)} 
                            className="dossier-close-btn"
                        >
                            <X size={24} />
                        </motion.button>
 
                        <div className="initiative-modal-split" style={{ height: '100%', position: 'relative' }}>
                            {/* LEFT SIDE: Floating Browser Mockup */}
                            <div className="initiative-pane-left">
                                <div className="scanning-grid" style={{ opacity: 0.05 }} />
                                <div className="browser-mockup">
                                    <div className="browser-header">
                                        <div className="browser-dots">
                                            <span className="dot dot-red"></span>
                                            <span className="dot dot-yellow"></span>
                                            <span className="dot dot-green"></span>
                                        </div>
                                        <div className="browser-address">
                                            {selectedProject.liveUrl ? selectedProject.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'britsync.co.uk'}
                                        </div>
                                    </div>
                                    <div className="browser-content">
                                        <img 
                                            src={selectedProject.image && !selectedProject.image.startsWith('/') ? getImageUrl(selectedProject.image) : selectedProject.image} 
                                            alt={selectedProject.title} 
                                            className="browser-screenshot"
                                        />
                                    </div>
                                </div>
                            </div>
 
                            {/* RIGHT SIDE: Y-Axis Scrollable Content */}
                            <div className="initiative-pane-right" data-lenis-prevent>
                                {/* Background HUD Decorative */}
                                <div className="dossier-hud-decor">
                                    COORD_X: 40.7128<br/>
                                    COORD_Y: 74.0060<br/>
                                    SYS_AUTH: VERIFIED
                                </div>
 
                                {/* Header Section */}
                                <div className="dossier-header-section">
                                    <div className="dossier-tag-wrapper">
                                        <div className="dossier-tag-line" />
                                        <div className="dossier-tag-text">PROJECT DOSSIER</div>
                                    </div>
                                    <h2 className="dossier-title">
                                        {selectedProject.title}
                                    </h2>
                                    {selectedProject.description && (
                                        <p className="dossier-desc">
                                            {selectedProject.description}
                                        </p>
                                    )}
                                </div>
 
                                <div className="dossier-divider" />
 
                                {/* Detailed Info Frame */}
                                {(selectedProject.challenge || selectedProject.solution || selectedProject.result) && (
                                    <motion.div 
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                                            }
                                        }}
                                        className="dossier-cards-container"
                                    >
                                        
                                        {selectedProject.challenge && (
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0 }
                                                }}
                                                className="dossier-card"
                                            >
                                                <div className="dossier-card-glow-bar glow-blue" />
                                                <div className="dossier-card-header">
                                                    <div className="dossier-card-icon-box">
                                                        <Target size={18} /> 
                                                    </div>
                                                    Strategic Challenge
                                                </div>
                                                <p className="dossier-card-text">
                                                    {selectedProject.challenge}
                                                </p>
                                            </motion.div>
                                        )}
 
                                        {selectedProject.solution && (
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0 }
                                                }}
                                                className="dossier-card"
                                            >
                                                <div className="dossier-card-glow-bar glow-blue" />
                                                <div className="dossier-card-header">
                                                    <div className="dossier-card-icon-box">
                                                        <Cpu size={18} /> 
                                                    </div>
                                                    Execution Protocol
                                                </div>
                                                <p className="dossier-card-text">
                                                    {selectedProject.solution}
                                                </p>
                                            </motion.div>
                                        )}
 
                                        {selectedProject.result && (
                                            <motion.div 
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0 }
                                                }}
                                                className="dossier-outcome-card"
                                            >
                                                <div className="dossier-card-glow-bar glow-green" />
                                                <div className="dossier-card-header">
                                                    <div className="dossier-outcome-icon-box">
                                                        <LineChart size={18} /> 
                                                    </div>
                                                    Strategic Outcome
                                                </div>
                                                <p className="dossier-outcome-text">
                                                    {selectedProject.result}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
 
                                {selectedProject.liveUrl && (
                                    <div className="dossier-cta-wrapper">
                                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="dossier-cta-btn">
                                            Access Live Deployment <ExternalLink size={18} />
                                        </a>
                                    </div>
                                )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
);
};

export default InitiativesSection;

