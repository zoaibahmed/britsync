import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import SplitText from '../ui/SplitText';
import './FAQ.css';

const FAQ = ({ data }) => {
    const section = data || {
        items: [
            { question: "How long does a typical project take?", answer: "Timelines vary by project scope. A standard website typically takes 4-6 weeks, while complex apps may take 3-6 months. We provide a detailed timeline during discovery." },
            { question: "Do you offer post-launch support?", answer: "Absolutely. We offer tailored maintenance packages to ensure your digital product remains secure, updated, and high-performing after launch." },
            { question: "How do you handle payments?", answer: "We usually work with a 50/50 or 40/30/30 payment structure based on project milestones. We accept bank transfers and major credit cards." },
            { question: "Can you help with rebranding?", answer: "Yes! Our design team specializes in creating complete brand identities, including logos, guidelines, and visual assets." },
            { question: "Do you build for mobile?", answer: "Everything we build is mobile-first. We ensure your site or app looks and functions perfectly on all devices." },
        ]
    };

    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (i) => {
        setActiveIndex(activeIndex === i ? null : i);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <SplitText text="Frequently Asked Questions" className="section-title" style={{ justifyContent: 'center' }} />

                <div className="faq-grid">
                    {(Array.isArray(section.items) ? section.items : []).map((faq, i) => {
                        if (!faq) return null;
                        return (
                            <motion.div
                                key={i}
                                className={`faq-item-3d ${activeIndex === i ? 'active' : ''}`}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => toggle(i)}
                                whileHover={{
                                    rotateX: -5,
                                    rotateY: 5,
                                    translateZ: 20,
                                    transition: { duration: 0.3 }
                                }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="faq-card-content" style={{ transform: 'translateZ(10px)' }}>
                                    <div className="faq-header">
                                        <h3>{faq.question || 'Question'}</h3>
                                        <span className="faq-icon">
                                            {activeIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                                        </span>
                                    </div>
                                    <AnimatePresence>
                                        {activeIndex === i && (
                                            <motion.div
                                                className="faq-body"
                                                initial={{ height: 0, opacity: 0, rotateX: -90 }}
                                                animate={{ height: 'auto', opacity: 1, rotateX: 0 }}
                                                exit={{ height: 0, opacity: 0, rotateX: -90 }}
                                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                            >
                                                <p>{faq.answer || ''}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
