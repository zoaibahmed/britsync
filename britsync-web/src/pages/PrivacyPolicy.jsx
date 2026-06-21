import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import './Legal.css';

const PrivacyPolicy = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <div className="legal-page">
            <div className="legal-container">
                <motion.div
                    initial={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="legal-header"
                >
                    <h1>Privacy Policy</h1>
                    <p>Last updated: January 28, 2026</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="legal-content"
                >
                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><Shield size={24} /></div>
                        <div className="section-text">
                            <h2>1. Introduction</h2>
                            <p>Welcome to BritSync. We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, and share your data when you visit our website or use our services.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><Eye size={24} /></div>
                        <div className="section-text">
                            <h2>2. Information We Collect</h2>
                            <p>We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include:</p>
                            <ul>
                                <li><strong>Personal Data:</strong> Name, email address, phone number.</li>
                                <li><strong>Usage Data:</strong> Pages visited, time spent on site, device information.</li>
                            </ul>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><Lock size={24} /></div>
                        <div className="section-text">
                            <h2>3. How We Use Your Information</h2>
                            <p>We use the information we collect to operate, maintain, and improve our services. Specifically, we use your data to:</p>
                            <ul>
                                <li>Process transactions and manage your account.</li>
                                <li>Send you technical notices, updates, and support messages.</li>
                                <li>Analyze trends and usage to improve user experience.</li>
                            </ul>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><FileText size={24} /></div>
                        <div className="section-text">
                            <h2>4. Data Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-text">
                            <h2>5. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                            <a href="mailto:legal@britsync.com" className="contact-email">legal@britsync.com</a>
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
