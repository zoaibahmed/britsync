import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '../ui/SplitText';
import './Work.css';

const projects = [
    { id: 1, title: 'Luxury Estate', category: 'web', image: 'https://images.unsplash.com/photo-1600596542815-2a4fe04dc521?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'FinTech App', category: 'app', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Neon Brand', category: 'design', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Eco Commerce', category: 'web', image: 'https://images.unsplash.com/photo-1472851294608-415522f963t2?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Health Dashboard', category: 'app', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Future Tech', category: 'design', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800' },
];

const Work = () => {
    const [filter, setFilter] = useState('all');

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    const filters = ['all', 'web', 'app', 'design'];

    return (
        <section id="work" className="work-section">
            <div className="work-container">
                <div className="work-header">
                    <SplitText text="Selected Work" className="section-title" />

                    <div className="filter-tabs">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {filter === f && (
                                    <motion.div layoutId="activeFilter" className="filter-active-bg" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="work-grid">
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                className="project-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="project-image-wrapper">
                                    <img src={project.image} alt={project.title} className="project-img" />
                                    <div className="project-overlay">
                                        <h3>{project.title}</h3>
                                        <p>{project.category}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default React.memo(Work);
