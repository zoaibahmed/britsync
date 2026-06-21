import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import SplitText from '../components/ui/SplitText';
import Button from '../components/ui/Button';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useProjects } from '../hooks/useProjects';
import { useWorkPageData } from '../hooks/useWorkPageData';
import { useCategories } from '../hooks/useCategories';
import { getImageUrl, ensureAbsoluteUrl } from '../utils/api';
import WorkBackground from './WorkBackground';
import { Activity, Shield, Terminal, Zap } from 'lucide-react';
import './WorkPage.css';

const CaseStudyOverlay = ({ project, onClose }) => {
    useLockBodyScroll();

    // Safe defaults for optional fields
    const safeProject = {
        title: project.title || 'Untitled Project',
        category: project.category || '',
        image: getImageUrl(project?.image),
        challenge: project.challenge || project.description || 'No challenge description available.',
        solution: project.solution || project.description || 'No solution description available.',
        description: project.description || 'No description available.',
        client: project.client || 'Not specified',
        duration: project.duration || 'Not specified',
        technologies: Array.isArray(project.technologies) ? project.technologies : [],
        stats: project.stats || { label: 'Impact', value: 'N/A' },
        liveUrl: project.liveUrl || null
    };

    return (
        <motion.div
            className="case-study-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="overlay-glass" onClick={onClose} />
            <button className="close-btn" onClick={onClose}>
                <X size={32} />
            </button>

            <motion.div
                className="case-study-content"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                    mass: 1
                }}
                onWheel={(e) => e.stopPropagation()}
            >
                <div className="case-study-hero" style={{ backgroundImage: `url("${safeProject.image}")` }}>
                    <div className="case-study-hero-overlay">
                        <div className="hud-hero-top">
                            <motion.div
                                className="hud-hero-tag"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                [ PROJECT_ARCHIVE_{project.id || '000'} ]
                            </motion.div>
                            <span className="hud-system-time">T_MINUS_{new Date().getFullYear()}_SYNC</span>
                        </div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {safeProject.title}
                        </motion.h1>
                        <div className="hud-hero-meta">
                            <span className="hud-meta-item"><Activity size={14} /> STATUS: DEPLOYED</span>
                            <span className="hud-meta-sep">/</span>
                            <span className="hud-meta-item"><Shield size={14} /> SECURE_V3</span>
                        </div>
                    </div>
                    <div className="hero-scanline" />
                    <div className="hero-vignette" />
                </div>

                <div className="case-study-details">
                    <div className="case-study-main">
                        <motion.div
                            className="detail-section"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="hud-label-small">ANALYSIS_01</div>
                            <h3><Shield size={20} /> THE CHALLENGE</h3>
                            <p>{safeProject.challenge}</p>
                        </motion.div>
                        <motion.div
                            className="detail-section"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="hud-label-small">ANALYSIS_02</div>
                            <h3><Zap size={20} /> THE SOLUTION</h3>
                            <p>{safeProject.solution}</p>
                        </motion.div>

                        <div className="case-study-grid-preview">
                            <div className="preview-box tech-stack">
                                <h4>CORE_STACK</h4>
                                <div className="stack-items">
                                    {safeProject.technologies.slice(0, 4).map((tech, i) => (
                                        <div key={i} className="stack-item">{tech}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="preview-box impact-metric">
                                <h4>SYSTEM_IMPACT</h4>
                                <div className="metric-val">{safeProject.stats?.value || '99.9%'}</div>
                                <div className="metric-label">{safeProject.stats?.label || 'EFFICIENCY'}</div>
                            </div>
                        </div>
                    </div>

                    <aside className="case-study-sidebar">
                        <div className="sidebar-hud-header">
                            <Terminal size={20} />
                            <span>SPECIFICATIONS</span>
                        </div>
                        <div className="sidebar-spec-group">
                            <div className="sidebar-section">
                                <h4>CLIENT_ENTITY</h4>
                                <p>{safeProject.client}</p>
                            </div>
                            <div className="sidebar-section">
                                <h4>PROJECT_DURATION</h4>
                                <p>{safeProject.duration}</p>
                            </div>
                            <div className="sidebar-section">
                                <h4>SECTOR_TAG</h4>
                                <p>{safeProject.category}</p>
                            </div>
                        </div>

                        {safeProject.technologies.length > 4 && (
                            <div className="sidebar-section full-tech">
                                <h4>ADDITIONAL_DATA</h4>
                                <div className="tech-tags">
                                    {safeProject.technologies.slice(4).map((tech, idx) => (
                                        <span key={idx} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="sidebar-footer-hud">
                            <div className="hud-border-top" />
                            {safeProject.liveUrl ? (
                                <a href={ensureAbsoluteUrl(safeProject.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <Button width="100%">EXTERNAL_DEPLOYMENT <ArrowRight size={16} /></Button>
                                </a>
                            ) : (
                                <Button width="100%" disabled style={{ opacity: 0.5 }}>ACCESS_RESTRICTED</Button>
                            )}
                            <div className="hud-security-flag">AUTHENTICATED_ACCESS_ONLY</div>
                        </div>
                    </aside>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ProjectCardRefined = ({ project, variants, onClick }) => {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const gradient = useTransform(
        [mouseX, mouseY],
        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 191, 255, 0.15), transparent 40%)`
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="project-card-refined"
            onMouseMove={handleMouseMove}
            onClick={onClick}
            ref={cardRef}
        >
            <motion.div
                className="magnetic-glow"
                style={{ background: gradient }}
            />
            <div className="project-card-inner-refined">
                <div className="card-hud-header">
                    <div className="hud-id">[ NODE_ID_{String(project.id).padStart(3, '0')} ]</div>
                    <div className="hud-status"><Zap size={10} className="status-icon" /> ONLINE</div>
                </div>
                <div className="project-image-wrapper-refined">
                    <img
                        src={getImageUrl(project?.image) || '/placeholder-image.jpg'}
                        alt={project.title || 'Project'}
                        className="project-img-refined"
                    />
                    <div className="project-overlay-refined">
                        <div className="overlay-content">
                            <div className="card-cat-tag">{project.category}</div>
                            <h3>{project.title}</h3>
                            <p>{project.description?.substring(0, 100)}...</p>
                        </div>
                        <div className="card-footer-refined">
                            <span className="view-case">VIEW_CASE_STUDY <ArrowRight size={14} /></span>
                        </div>
                    </div>
                </div>
                <div className="card-tech-detail">
                    <Terminal size={12} /> <span>{project.technologies?.[0] || 'SYNC_v4'}</span>
                </div>
            </div>
            <div className="card-corners">
                <div className="corner tl" />
                <div className="corner tr" />
                <div className="corner bl" />
                <div className="corner br" />
            </div>
        </motion.div>
    );
};

const Work = () => {
    const { projects } = useProjects();
    const { categories } = useCategories();
    const { workPageData } = useWorkPageData();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const tabsRef = React.useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Sort categories by order
    const sortedCategories = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Combine 'all' with fetched categories
    const filters = ['all', ...sortedCategories.map(c => c.slug)];

    useEffect(() => {
        const queryFilter = searchParams.get('filter');
        if (queryFilter) {
            setFilter(queryFilter);
        }
    }, [searchParams]);

    const handleScroll = () => {
        if (tabsRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = 200;
            tabsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Support multiple active filters (e.g. "web,app")
    const activeFilters = filter === 'all' ? ['all'] : filter.split(',').map(f => f.trim().toLowerCase());

    const safeProjects = projects || [];

    const filteredProjects = filter === 'all'
        ? safeProjects
        : safeProjects.filter(p => {
            const cat = (p.category || '').toLowerCase();
            return activeFilters.some(f => cat.includes(f) || f.includes(cat));
        });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 100
            }
        }
    };

    return (
        <PageTransition>
            <div style={{ paddingTop: '80px', position: 'relative' }}>
                <WorkBackground />
                <section className="work-page-section">
                    <div className="work-container">
                        <div className="work-header">
                            <SplitText text={workPageData?.header?.title || "Selected Work"} className="section-title" />
                            <p className="section-desc">{workPageData?.header?.description || "We build digital products that reshape industries."}</p>
                        </div>

                        <div className="filter-carousel-wrapper">
                            <AnimatePresence>
                                {showLeftArrow && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="nav-arrow left"
                                        onClick={() => scroll('left')}
                                    >
                                        <ChevronLeft size={20} />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <div
                                className="filter-tabs-scroll"
                                ref={tabsRef}
                                onScroll={handleScroll}
                            >
                                {filters.map(f => {
                                    const isActive = activeFilters.includes(f) || (filter === 'all' && f === 'all');
                                    // Find category name for display
                                    const catObj = categories.find(c => c.slug === f);
                                    const displayName = f === 'all' ? 'All' : (catObj ? catObj.name : f.charAt(0).toUpperCase() + f.slice(1));

                                    return (
                                        <button
                                            key={f}
                                            onClick={() => {
                                                setFilter(f);
                                                setSearchParams({ filter: f });
                                            }}
                                            className={`filter-btn ${isActive ? 'active' : ''}`}
                                        >
                                            {displayName}
                                            {isActive && (
                                                <motion.div layoutId="activeFilter" className="filter-active-bg" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {showRightArrow && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="nav-arrow right"
                                        onClick={() => scroll('right')}
                                    >
                                        <ChevronRight size={20} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.div
                            layout
                            className="work-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <ProjectCardRefined
                                            key={project.id}
                                            project={project}
                                            onClick={() => setSelectedProject(project)}
                                        />
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                        <h3>No projects found for {filter === 'all' ? 'this category' : filter}</h3>
                                        <Button onClick={() => { setFilter('all'); setSearchParams({}); }} style={{ marginTop: '1rem' }}>
                                            View All Projects
                                        </Button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>
                <div className="glow-divider" />

                {/* New CTA Section */}
                <section className="cta-section" style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'transparent',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                        {workPageData?.cta?.title || "Ready to Start?"}
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: '2.5rem',
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem'
                    }}>
                        {workPageData?.cta?.subtitle || "Let's build something extraordinary together."}
                    </p>
                    <Link to="/contact">
                        <Button>{workPageData?.cta?.btnText || "Get Started"}</Button>
                    </Link>
                </section>

                <AnimatePresence>
                    {selectedProject && (
                        <CaseStudyOverlay
                            project={selectedProject}
                            onClose={() => setSelectedProject(null)}
                        />
                    )}
                </AnimatePresence>
            </div >
        </PageTransition >
    );
};

export default Work;
