import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import './ServiceDetailModal.css';

const ServiceDetailModal = ({ service, onClose }) => {
    if (!service) return null;

    // Split process string into steps if it exists
    const processSteps = typeof service.process === 'string'
        ? service.process.split(',').map(s => s.trim()).filter(s => s)
        : Array.isArray(service.process) ? service.process : [];

    const safeFeatures = Array.isArray(service.detailed_features) ? service.detailed_features
        : Array.isArray(service.features) ? service.features
            : typeof service.detailed_features === 'string' ? service.detailed_features.split(',').map(s => s.trim())
                : [];

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: 0.3 }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.4 + (i * 0.1),
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <AnimatePresence>
            <motion.div
                className="service-modal-overlay-v2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="service-modal-container-v2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close-v2" onClick={onClose} aria-label="Close modal">
                        <X size={24} />
                    </button>

                    <div className="modal-background-fx" />

                    <div className="modal-scroll-area">
                        <section className="modal-hero-v2">
                            <div className="hero-content-v2">
                                <motion.div
                                    className="modal-icon-v2"
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                >
                                    {service.icon}
                                </motion.div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    style={{ position: 'relative' }}
                                >
                                    <h2>{service.title}</h2>
                                    <span className="meta-status-label">SYS_ID: {service._id?.slice(-8) || 'GLOBAL'}</span>
                                </motion.div>
                                <motion.p
                                    className="hero-tagline"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {service.pricing || "Secure Data Transmission"}
                                </motion.p>
                            </div>
                        </section>

                        <div className="modal-grid-v2">
                            <motion.div className="modal-main-v2" custom={0} variants={contentVariants}>
                                <section className="info-section-v2">
                                    <h3 className="section-label-v2">System Overview</h3>
                                    <p className="detailed-desc-v2">
                                        {service.detailed_desc || service.description || "Deploying advanced neural architecture to optimize persistent data streams and provide absolute synchronization across all business nodes."}
                                    </p>
                                </section>

                                {processSteps.length > 0 && (
                                    <section className="info-section-v2">
                                        <h3 className="section-label-v2">The Sync Process</h3>
                                        <div className="process-timeline-v2">
                                            {processSteps.map((step, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className="timeline-step-v2"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.6 + (idx * 0.1) }}
                                                    viewport={{ once: true }}
                                                >
                                                    <span className="step-count-v2">{idx + 1}</span>
                                                    <p>{step}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </motion.div>

                            <motion.aside className="modal-sidebar-v2" custom={1} variants={contentVariants}>
                                {safeFeatures.length > 0 && (
                                    <div className="sidebar-box-v2">
                                        <h3 className="sidebar-label-v2">Module Specs</h3>
                                        <ul className="feature-list-v2">
                                            {safeFeatures.map((feature, idx) => (
                                                <li key={idx}>
                                                    <Check size={16} className="check-icon-v2" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="sidebar-box-v2 cta-box-v2">
                                    <h3 className="sidebar-label-v2">Initiate Connect</h3>
                                    <p>Ready to deploy this module into your existing infrastructure?</p>
                                    <button className="modal-cta-btn-v2" onClick={onClose}>
                                        Launch System <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.aside>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ServiceDetailModal;

