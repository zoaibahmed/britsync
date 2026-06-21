import React from 'react';
import { motion } from 'framer-motion';
import { useSections } from '../../hooks/useSections';
import SplitText from '../ui/SplitText';
import './DynamicSections.css';

const DynamicSections = () => {
    const { sections } = useSections();

    if (!sections || sections.length === 0) return null;

    return (
        <div className="dynamic-sections-wrapper">
            {sections.map((section, sectionIndex) => (
                <section key={section.id} className="dynamic-section" id={section.slug}>
                    <div className="section-container">
                        <div className="section-header">
                            <SplitText text={section.title} className="section-title" />
                            {section.description && (
                                <p className="section-desc">{section.description}</p>
                            )}
                        </div>

                        <div className="dynamic-grid">
                            {section.content?.map((item, itemIndex) => (
                                <motion.div
                                    key={item.id}
                                    className="dynamic-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: itemIndex * 0.1 }}
                                >
                                    {item.image && (
                                        <div className="card-image">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                    )}
                                    <div className="card-content">
                                        <h3>{item.title}</h3>
                                        <p>{item.content}</p>
                                        {item.link && (
                                            <a href={item.link} className="card-link">
                                                Learn More <span>→</span>
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default DynamicSections;
