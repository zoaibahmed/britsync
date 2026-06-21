import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const { settings } = useSiteSettings();

    // Optimized mouse tracking without React rerenders
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth the movement slightly
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    // Procedural gradient string
    const background = useTransform(
        [smoothX, smoothY],
        ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(0, 191, 255, 0.06), transparent 80%)`
    );

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <footer className="footer" onMouseMove={handleMouseMove}>
            {/* Interactive Background Glow - Optimized */}
            <motion.div
                className="footer-mouse-glow"
                style={{ background }}
            />

            {/* Cinematic Background Branding */}
            <div className="footer-bg-branding">BRITSYNC</div>

            <div className="footer-content">
                <div className="footer-hud-top">
                    <div className="hud-metric">
                        <span className="metric-label">STATION:</span>
                        <span className="metric-value">LONDON_CORE // 01</span>
                    </div>
                    <div className="hud-metric">
                        <span className="metric-label">STATUS:</span>
                        <div className="status-indicator">
                            <span className="pulse-dot" />
                            <span className="metric-value">SYSTEM_OPTIMAL</span>
                        </div>
                    </div>
                </div>

                <div className="footer-grid">
                    <div className="footer-brand-sect">
                        <Link to="/" className="footer-logo">
                            BRIT<span>SYNC</span>
                        </Link>
                        <p className="brand-desc">{settings.siteDescription}</p>
                        <div className="social-links-v2">
                            <a href={settings.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-pill">
                                <Linkedin size={18} />
                                <span>LinkedIn</span>
                            </a>
                            <a href={settings.socials.github} target="_blank" rel="noopener noreferrer" className="social-pill">
                                <Github size={18} />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-nav-groups">
                        <div className="nav-col">
                            <h4 className="col-title">NAVIGATION</h4>
                            <ul className="nav-list">
                                <li><Link to="/">Architecture</Link></li>
                                <li><Link to="/services">Capabilities</Link></li>
                                <li><Link to="/work">Deployments</Link></li>
                                <li><Link to="/about">Protocol</Link></li>
                            </ul>
                        </div>
                        <div className="nav-col">
                            <h4 className="col-title">GOVERNANCE</h4>
                            <ul className="nav-list">
                                <li><Link to="/privacy-policy">Privacy</Link></li>
                                <li><Link to="/terms-of-service">Terms</Link></li>
                                <li><Link to="/contact">Interface</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-newsletter">
                        <h4 className="col-title">COMMUNICATION</h4>
                        <p>Join the next generation of digital synchronization.</p>
                        <div className="newsletter-box-v2">
                            <input type="email" placeholder="ENCRYPTED_EMAIL" />
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'var(--color-blue)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowUpRight size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-v2">
                    <div className="bottom-left">
                        <p>&copy; {new Date().getFullYear()} BRITSYNC_COALITION // ALL_RIGHTS_RETAINED</p>
                    </div>
                    <div className="bottom-right">
                        <p>ENGINEERED_WITH_PRECISION // V2026.04</p>
                    </div>
                </div>
            </div>

            {/* Background Gradient Decorative Elements */}
            <div className="footer-aurora" />
        </footer>
    );
};

export default Footer;
