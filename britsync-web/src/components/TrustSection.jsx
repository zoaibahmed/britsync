import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, ShieldCheck } from 'lucide-react';
import VerificationGridBackground from './VerificationGridBackground';
import TrustCard from './TrustCard';
import './TrustSection.css';

const TECH_ICONS = [Cpu, Activity, ShieldCheck];

const DEFAULT_TESTIMONIALS = [
    {
        name: "Sarah Connor",
        role: "CMO, TECHGLOBAL",
        quote: "BritSync transformed our digital presence. The motion design is unparalleled."
    },
    {
        name: "James Wright",
        role: "FOUNDER, WRIGHT & CO.",
        quote: "Professional, fast, and incredibly creative. They understood our vision perfectly."
    },
    {
        name: "Emily Chen",
        role: "DIRECTOR, ARTSTREAM",
        quote: "The best development team we’ve worked with. The site performs flawlessly."
    }
];

const TrustSection = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const title = data?.title || "Trust";
    const subtitle = data?.subtitle || "AI-Driven Partnerships";
    const testimonials = data?.testimonials || DEFAULT_TESTIMONIALS;

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <section className="trust-section">
            {/* Background Grid Floor and Data Streams */}
            <VerificationGridBackground />

            <div className="trust-container">
                {/* Header Area */}
                <div className="trust-header">
                    <motion.div
                        className="trust-label monospace"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Activity size={14} className="label-pulse-icon" />
                        <span>DATA VERIFICATION</span>
                    </motion.div>
                    
                    <motion.div 
                        className="title-glow-wrap"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <h2 className="trust-title-text">{title}</h2>
                        <div className="header-glow-spot" />
                    </motion.div>

                    <motion.p
                        className="trust-subtitle-text"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <motion.div
                    className="trust-cards-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {testimonials.map((t, idx) => (
                        <TrustCard
                            key={idx}
                            name={t.name}
                            role={t.role}
                            quote={t.quote}
                            icon={TECH_ICONS[idx % TECH_ICONS.length]}
                            index={idx}
                            isHovered={hoveredIndex === idx}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TrustSection;
