import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

const ServicePopup = ({ service, onClose }) => {
    useLockBodyScroll();
    return (
        <motion.div
            className="popup-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="popup-content"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
            >
                <button className="popup-close" onClick={onClose}>
                    <X />
                </button>

                <div className="popup-header">
                    <div className="popup-icon-large text-gradient">{service.icon}</div>
                    <div>
                        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{service.title}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>{service.description}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        {service.popupInfo ? (
                            <>
                                <div className="info-item" style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ color: 'var(--color-blue)', marginBottom: '0.5rem' }}>Starting From</h4>
                                    <div style={{ fontSize: '2.4rem', fontWeight: 'bold', className: "text-gradient" }}>{service.popupInfo.pricing}</div>
                                </div>
                                <div className="info-item">
                                    <h4 style={{ color: 'var(--color-blue)', marginBottom: '0.5rem' }}>What's Included</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{service.popupInfo.whatWeDo}</p>
                                </div>
                                <div style={{ marginTop: '1.5rem', fontStyle: 'italic', color: 'var(--color-burgundy)', fontWeight: 'bold' }}>
                                    "{service.popupInfo.catch}"
                                </div>
                            </>
                        ) : (
                            <>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--color-blue)' }}>Key Features</h4>
                                <ul className="popup-features">
                                    {[1, 2, 3].map((i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                        >
                                            <Check size={16} color="var(--color-blue)" />
                                            Feature Point {i} for {service.title}
                                        </motion.li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Simulated Animated Graph */}
                    <div style={{ flex: 1, minWidth: '250px', background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>Projected Impact</h4>
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '10px' }}>
                            {[30, 50, 40, 70, 60, 90].map((h, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(to top, var(--color-burgundy), var(--color-blue))',
                                        borderRadius: '4px',
                                        opacity: 0.8
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: 0.3 + (i * 0.1), type: "spring" }}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                        </div>
                    </div>
                </div>

                <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {service.details || "Our comprehensive approach ensures that every aspect of the project is optimized for maximum performance and user engagement."}
                </p>

                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose}>Get Started</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ServicePopup;
