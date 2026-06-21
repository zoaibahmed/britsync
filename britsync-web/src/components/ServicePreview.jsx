import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ServicePreview.css';

const SERVICES_DATA = [
    {
        title: "Web Development",
        description: "High-performance web apps, Next.js setups, and scalable frontend engines.",
        icon: (
            <svg className="svc-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        delay: 0.1
    },
    {
        title: "AI & Machine Learning",
        description: "Intelligent agent systems, custom LLM fine-tuning, and vector pipelines.",
        icon: (
            <svg className="svc-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        delay: 0.2
    },
    {
        title: "Automation",
        description: "Robotic workflow triggers, automatic APIs integration, and scraper setups.",
        icon: (
            <svg className="svc-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        delay: 0.3
    },
    {
        title: "UI/UX Design",
        description: "Premium user journeys, high-fidelity mockups, and glassmorphic designs.",
        icon: (
            <svg className="svc-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        delay: 0.4
    },
    {
        title: "Cloud Infrastructure",
        description: "Serverless deployments, Docker/AWS clustering, and absolute network security.",
        icon: (
            <svg className="svc-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        delay: 0.5
    }
];

const ServicePreview = () => {
    return (
        <section className="service-preview-section">
            <div className="preview-container">
                <motion.div 
                    className="preview-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="preview-subtitle monospace">// OUR CAPABILITIES</span>
                    <h2 className="preview-title">Next-Gen Digital Solutions</h2>
                </motion.div>

                <div className="preview-grid">
                    {SERVICES_DATA.map((svc, idx) => (
                        <motion.div
                            key={idx}
                            className="svc-card glass"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                            transition={{ duration: 0.6, delay: svc.delay }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        >
                            <Link to="/services" className="svc-link-wrapper">
                                <div className="svc-icon-box">
                                    {svc.icon}
                                    <div className="icon-glow" />
                                </div>
                                <h3 className="svc-card-title">{svc.title}</h3>
                                <p className="svc-card-desc">{svc.description}</p>
                                <div className="svc-learn-more monospace">
                                    <span>LEARN MORE</span>
                                    <svg className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicePreview;
