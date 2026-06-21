import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Info, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../utils/api';
import Button from '../ui/Button';

const InitiativeCard = ({ initiative, isMiddle, onClick }) => {
    if (!initiative) return null;
    const { title, description, image, url, type } = initiative;

    return (
        <motion.div
            className={`initiative-card glass ${isMiddle ? 'middle-card' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
            <div className="card-tech-overlay" />
            <div className="card-image-wrapper">
                {image ? (
                    <img src={getImageUrl(image)} alt={title} className="card-image" />
                ) : (
                    <div className="card-image-placeholder">
                        <Zap size={40} className="text-gradient" />
                    </div>
                )}
                <div className="card-type-tag">{type?.toUpperCase()}</div>
            </div>

            <div className="card-content">
                <h3 className="card-title text-gradient">{title}</h3>
                <p className="card-description">{description}</p>
                
                <div className="card-actions">
                    <button className="info-btn" onClick={() => onClick(initiative)}>
                        <Info size={18} />
                        <span>Learn More</span>
                    </button>
                    {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="visit-link">
                            <ExternalLink size={18} />
                        </a>
                    )}
                </div>
            </div>

            <div className="card-glow" />
            <div className="card-border-trace" />
        </motion.div>
    );
};

export const LocalInitiativeCard = ({ projects, onClick }) => {
    return (
        <motion.div
            className="initiative-card glass local-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            onClick={onClick}
        >
            <div className="card-tech-overlay" />
            <div className="card-content">
                <div className="local-icon">📍</div>
                <h3 className="card-title text-gradient">Local Initiative</h3>
                <p className="card-description">Developing high-impact digital solutions for our community and local businesses.</p>
                
                <div className="project-stack">
                    {projects.slice(0, 3).map((p, i) => (
                        <div key={p._id || i} className="mini-project-tag">
                            {p.title}
                        </div>
                    ))}
                    {projects.length > 3 && <div className="mini-project-tag">+{projects.length - 3} more</div>}
                </div>

                <div className="card-actions mt-auto">
                    <Button className="glass-btn w-full justify-between">
                        View Local Projects <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
            <div className="card-glow" />
        </motion.div>
    );
};

export default InitiativeCard;
