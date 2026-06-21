import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import './TrustSection.css'; // Shared stylesheet for grid cards

const TrustCard = ({ name, role, quote, icon: TechIcon, index, isHovered, onMouseEnter, onMouseLeave }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            className={`testimonial-card glass ${isHovered ? 'is-active' : ''}`}
            variants={cardVariants}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            whileHover={{ y: -8 }}
        >
            {/* Corner Bracket lines */}
            <div className="card-bracket br-tl" />
            <div className="card-bracket br-tr" />
            <div className="card-bracket br-bl" />
            <div className="card-bracket br-br" />

            <div className="card-head-area">
                <div className="tech-icon-box">
                    <TechIcon size={18} className="tech-icon" />
                </div>
                <div className="quote-icon-box">
                    <Quote size={24} />
                </div>
            </div>

            <div className="quote-area">
                <p className="quote-text">“{quote}”</p>
            </div>

            <div className="client-footer">
                <div className="client-meta">
                    <h4 className="client-name">{name}</h4>
                    <span className="client-role monospace">{role}</span>
                </div>
                <div className="encrypted-badge">
                    <span className="badge-glow-dot active" />
                    <span className="badge-text monospace">ENCRYPTED</span>
                </div>
            </div>
        </motion.div>
    );
};

export default TrustCard;
