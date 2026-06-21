import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Code, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Process.css';

const Process = ({ data }) => {
    const section = data || {
        title: "How We Deliver",
        description: "A proven workflow that transforms ideas into scalable digital products.",
        steps: [
            { icon: 'Search', title: "Discovery", desc: "We dive deep into your goals to understand the core problem." },
            { icon: 'PenTool', title: "Strategy & Design", desc: "Crafting a roadmap and visual identity that aligns with your vision." },
            { icon: 'Code', title: "Development", desc: "Building robust, scalable solutions using cutting-edge tech." },
            { icon: 'Rocket', title: "Launch & Scale", desc: "Deploying to production and optimizing for growth." },
        ]
    };

    const getIcon = (name) => {
        switch (name) {
            case 'Search': return <Search size={28} />;
            case 'PenTool': return <PenTool size={28} />;
            case 'Code': return <Code size={28} />;
            case 'Rocket': return <Rocket size={28} />;
            default: return <Search size={28} />;
        }
    };

    return (
        <section className="process-section">
            {/* Background Animations */}
            <div className="process-bg-blob blob-1"></div>
            <div className="process-bg-blob blob-2"></div>

            <div className="process-container">
                {/* Left Column: Title & Description */}
                <div className="process-left">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="section-title text-gradient" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                            {section.title}
                        </h2>
                        <p className="process-description">
                            {section.description || "Our streamlined process ensures we deliver high-quality results on time, every time."}
                        </p>

                        <Link to="/contact" className="process-cta-btn">
                            Start Your Project <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>

                {/* Right Column: 3D Holographic Timeline */}
                <div className="process-right-3d">
                    <div className="perspective-container">
                        <div className="timeline-3d-path">
                            <div className="path-glow-animation"></div>
                        </div>

                        <div className="process-steps-stack">
                            {(Array.isArray(section.steps) ? section.steps : []).map((step, i) => {
                                if (!step) return null;
                                return (
                                    <motion.div
                                        key={i}
                                        className="step-item-3d"
                                        initial={{ opacity: 0, z: -100, x: 100 }}
                                        whileInView={{ opacity: 1, z: 0, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.15,
                                            type: "spring",
                                            stiffness: 80,
                                            damping: 15
                                        }}
                                    >
                                        <div className="step-orb-node">
                                            <div className="orb-inner">
                                                {getIcon(step.icon)}
                                                <div className="orb-pulse"></div>
                                            </div>
                                        </div>

                                        <div className="step-card-3d">
                                            <div className="step-number">0{i + 1}</div>
                                            <h3 className="step-title-3d">{step.title}</h3>
                                            <p className="step-desc-3d">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
