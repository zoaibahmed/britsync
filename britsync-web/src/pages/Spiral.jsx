import React, { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Button from '../components/ui/Button';
import './Spiral.css';

const projects = [
    {
        id: 1,
        title: 'Luxury Estate',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1600596542815-2a4fe04dc521?auto=format&fit=crop&q=80&w=800',
        description: 'A premium real estate platform featuring virtual tours and AI valuation.',
        challenge: 'Create a seamless high-end experience for demanding global buyers.',
        solution: 'Used WebGL for 3D tours and Next.js for speed, with a custom CRM integration.',
        client: 'Estate Global',
        duration: '4 Months',
        technologies: ['React', 'Next.js', 'Three.js', 'Node.js'],
        stats: { label: 'User Engagement', value: '+150%' }
    },
    {
        id: 2,
        title: 'FinTech App',
        category: 'app',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        description: 'Banking reimagined for the Gen Z demographic.',
        challenge: 'Simplify complex financial data while maintaining strict security.',
        solution: 'Custom data visualization libraries and biometric authentication.',
        client: 'NeoBank',
        duration: '6 Months',
        technologies: ['React Native', 'Firebase', 'D3.js', 'Redux'],
        stats: { label: 'New Users', value: '+85k' }
    },
    {
        id: 3,
        title: 'Neon Brand',
        category: 'design',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
        description: 'Rebranding a cyberpunk-themed energy drink.',
        challenge: 'Stand out in a saturated energy drink market.',
        solution: 'Bold neon aesthetics and holographic motion graphics.',
        client: 'Volt Energy',
        duration: '2 Months',
        technologies: ['After Effects', 'Figma', 'Blender', 'Photoshop'],
        stats: { label: 'Market Share', value: '+12%' }
    },
    {
        id: 4,
        title: 'Eco Commerce',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        description: 'Sustainable shopping marketplace.',
        challenge: 'Calculate and visualize carbon footprint in real-time during checkout.',
        solution: 'Custom carbon-tracking algorithm integrated with multi-vendor logistics.',
        client: 'GreenLife',
        duration: '5 Months',
        technologies: ['Vue.js', 'PostgreSQL', 'Python', 'AWS'],
        stats: { label: 'Sales Growth', value: '+210%' }
    },
    {
        id: 5,
        title: 'Health Dashboard',
        category: 'app',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        description: 'Patient monitoring system for hospitals.',
        challenge: 'Real-time data synchronization across multiple hospital departments.',
        solution: 'WebSockets for instant updates and HIPAA-compliant encryption.',
        client: 'City Health',
        duration: '8 Months',
        technologies: ['React', 'TypeScript', 'Socket.io', 'Node.js'],
        stats: { label: 'Efficiency', value: '+30%' }
    },
    {
        id: 6,
        title: 'Future Tech',
        category: 'design',
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800',
        description: 'Concept design for autonomous vehicles.',
        challenge: 'Visualize the invisible UI of the future of transportation.',
        solution: 'AR overlays and gesture control interface design.',
        client: 'Horizon Auto',
        duration: '3 Months',
        technologies: ['Unreal Engine', 'C++', 'Lidar Tech', 'UI/UX'],
        stats: { label: 'Presale Interest', value: '4k+' }
    },
];

const SpiralCard = ({ project, index, total, scrollYProgress, isMobile, isTablet, onClick }) => {
    // Basic spiral parameters
    const baseRotation = (index / total) * Math.PI * 6; // More coiling for "rolling" feel

    // Transform scroll progress to rotation
    const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 8]);

    // Vortex Effect: Radius changes based on vertical position
    // We calculate a "progress radius" that peaks in the middle
    const yPos = useTransform(scrollYProgress, [0, 1], [1000, -1000]);

    const radius = useTransform(yPos, [-1000, 0, 1000], [
        isMobile ? 80 : 200,
        isMobile ? 140 : isTablet ? 300 : 500,
        isMobile ? 80 : 200
    ]);

    // Calculate 3D position
    const x = useTransform([scrollRotation, radius], ([r, rad]) => {
        const angle = baseRotation + r;
        return Math.cos(angle) * rad;
    });

    const z = useTransform([scrollRotation, radius], ([r, rad]) => {
        const angle = baseRotation + r;
        return Math.sin(angle) * rad;
    });

    // "Rolling" effect: Rotate card on its own axis as it moves
    const rotateX = useTransform(z, [-500, 0, 500], [20, 0, -20]);
    const rotateY = useTransform(x, [-500, 0, 500], [-30, 0, 30]);

    // Optimized focal point logic - removed expensive blur animation
    const scale = useTransform(z, [-500, 0, 500], [0.5, 0.8, 1.25]);
    const opacity = useTransform(z, [-500, -200, 0, 500], [0.1, 0.3, 0.7, 1]);

    // Instead of animating blur which is heavy, we use a static or simpler approach
    // For now, let's keep it static or remove it to significantly boost FPS
    const blur = 0;

    return (
        <motion.div
            className="spiral-card-wrapper"
            style={{
                x,
                y: yPos,
                z,
                rotateX,
                rotateY,
                scale,
                opacity,
                zIndex: Math.round(z.get() + 1000),
                willChange: 'transform, opacity'
            }}
            onClick={() => onClick(project)}
            whileHover={!isMobile ? {
                scale: 1.3,
                rotateX: 0,
                rotateY: 0,
                transition: { duration: 0.4, ease: "easeOut" }
            } : {}}
        >
            <div className="spiral-card">
                <div className="spiral-card-image-wrapper">
                    <img src={project.image} alt={project.title} className="spiral-card-image" />
                    <div className="card-shine" />
                </div>
                <div className="spiral-card-info">
                    <div>
                        <p className="card-category">{project.category}</p>
                        <h3 className="card-title">{project.title}</h3>
                    </div>
                    <div className="card-line" />
                </div>
                <div className="spiral-card-overlay">
                    <Button width="100%">Explore Case Study</Button>
                </div>
            </div>
        </motion.div >
    );
};

const Spiral = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll-driven rotation for the background axis
    const axisRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <PageTransition>
            <div className="spiral-page-container" ref={containerRef}>
                <div className="spiral-viewport">
                    {/* Visual Axis / Path */}
                    <motion.div
                        className="spiral-axis"
                        style={{ rotate: axisRotation }}
                    >
                        <svg viewBox="0 0 100 100" className="axis-svg">
                            <circle cx="50" cy="50" r="48" className="axis-circle shadow" />
                            <circle cx="50" cy="50" r="48" className="axis-circle main" />
                        </svg>
                    </motion.div>

                    <div className="spiral-content">
                        {projects.map((project, index) => (
                            <SpiralCard
                                key={project.id}
                                project={project}
                                index={index}
                                total={projects.length}
                                scrollYProgress={scrollYProgress}
                                isMobile={isMobile}
                                isTablet={isTablet}
                                onClick={setSelectedProject}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            className="case-study-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <button className="close-btn" onClick={() => setSelectedProject(null)}>
                                <X size={32} />
                            </button>

                            <motion.div
                                className="case-study-content"
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                            >
                                <div className="case-study-hero" style={{ backgroundImage: `url(${selectedProject.image})` }}>
                                    <div className="case-study-hero-overlay">
                                        <motion.h1
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {selectedProject.title}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {selectedProject.category.toUpperCase()}
                                        </motion.p>
                                    </div>
                                </div>

                                <div className="case-study-details">
                                    <div className="case-study-main">
                                        <div className="detail-section">
                                            <h3>The Challenge</h3>
                                            <p>{selectedProject.challenge}</p>
                                        </div>
                                        <div className="detail-section">
                                            <h3>The Solution</h3>
                                            <p>{selectedProject.solution}</p>
                                        </div>
                                        <div className="detail-section">
                                            <h3>The Result</h3>
                                            <p>{selectedProject.description}</p>
                                        </div>
                                    </div>

                                    <aside className="case-study-sidebar">
                                        <div className="sidebar-section">
                                            <h4>Client</h4>
                                            <p>{selectedProject.client}</p>
                                        </div>
                                        <div className="sidebar-section">
                                            <h4>Duration</h4>
                                            <p>{selectedProject.duration}</p>
                                        </div>
                                        <div className="sidebar-section">
                                            <h4>Technologies</h4>
                                            <div className="tech-tags">
                                                {selectedProject.technologies.map(tech => (
                                                    <span key={tech} className="tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="sidebar-section stats-box">
                                            <h4>{selectedProject.stats.label}</h4>
                                            <p className="stat-value">{selectedProject.stats.value}</p>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                                            {selectedProject.liveUrl ? (
                                                <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                    <Button width="100%">View Live Project <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button>
                                                </a>
                                            ) : (
                                                <Button width="100%" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Coming Soon</Button>
                                            )}
                                        </div>
                                    </aside>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default Spiral;
