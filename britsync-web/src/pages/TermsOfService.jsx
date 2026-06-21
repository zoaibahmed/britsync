import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import './Legal.css';

const TermsOfService = () => {
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
                    <h1>Terms of Service</h1>
                    <p>Effective Date: January 28, 2026</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="legal-content"
                >
                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><Scale size={24} /></div>
                        <div className="section-text">
                            <h2>1. Agreement to Terms</h2>
                            <p>By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, including the mandatory arbitration provision and class action waiver in Section 10, you may not access or use our services.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><CheckCircle size={24} /></div>
                        <div className="section-text">
                            <h2>2. Intellectual Property Rights</h2>
                            <p>The service and its original content, features, and functionality are and will remain the exclusive property of BritSync and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of BritSync.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><AlertTriangle size={24} /></div>
                        <div className="section-text">
                            <h2>3. User Responsibilities</h2>
                            <p>You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, impairs, or renders the Service less efficient. You are responsible for maintaining the confidentiality of your account and password.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-icon"><HelpCircle size={24} /></div>
                        <div className="section-text">
                            <h2>4. Termination</h2>
                            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <div className="section-text">
                            <h2>5. Governing Law</h2>
                            <p>These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.</p>
                            <a href="mailto:legal@britsync.com" className="contact-email">legal@britsync.com</a>
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
