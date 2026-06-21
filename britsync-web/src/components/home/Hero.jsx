import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import TypewriterReveal from '../ui/TypewriterReveal';
import Button from '../ui/Button';
import InteractiveParticles from '../ui/InteractiveParticles';
import TechBackground from '../ui/TechBackground';
import ThreeDBackground from '../ui/ThreeDBackground';
import './Hero.css';

const Hero = ({ data }) => {
    const { scrollY } = useScroll();

    const {
        title = "Crafting Digital\nRealities.",
        subtitle = "We merge aesthetic perfection with technical brilliance.",
        primaryBtnText = "Get Started",
        primaryBtnLink = "/contact",
        secondaryBtnText = "Explore Work",
        secondaryBtnLink = "/work"
    } = data || {};

    return (
        <section className="hero-section">
            <TechBackground />
            <InteractiveParticles />

            <div className="hero-hud-decorations">
                <motion.div
                    className="hud-marker marker-tl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ delay: 1 }}
                />
                <motion.div
                    className="hud-marker marker-br"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ delay: 1.2 }}
                />
            </div>

            <div className="hero-grid-container">
                {/* Left: Text & Actions Column */}
                <motion.div
                    className="hero-text-column"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15,
                                delayChildren: 0.4
                            }
                        }
                    }}
                >
                    <div className="hero-badge-container">
                        <motion.span
                            className="hero-badge"
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            AI-POWERED CONTRACTS
                        </motion.span>
                    </div>

                    <motion.div
                        className="hero-title-wrapper"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8 }}
                    >
                        <TypewriterReveal text={title} className="hero-title-main" delay={0.6} align="left" />
                    </motion.div>

                    <motion.p
                        className="hero-subtitle"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8 }}
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        className="hero-actions"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to={primaryBtnLink}>
                            <Button className="btn-primary-tech" isMagnetic={false}>
                                <span className="btn-glitch-content">{primaryBtnText}</span>
                            </Button>
                        </Link>
                        <Link to={secondaryBtnLink}>
                            <Button className="btn-secondary-tech" isMagnetic={false}>
                                {secondaryBtnText}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right: 3D Core Visual Column with Glass HUD overlays */}
                <div className="hero-visual-column">
                    <div className="hero-3d-wrapper">
                        <ThreeDBackground />
                    </div>

                    {/* Floating HUD Widget 1 */}
                    <motion.div 
                        className="floating-hud hud-card-left glass"
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="hud-line-header">
                            <span className="hud-glow-dot active"></span>
                            <span className="monospace">BRIT_CORE_v2.0</span>
                        </div>
                        <div className="hud-metric monospace">STATUS // SECURED</div>
                    </motion.div>

                    {/* Floating HUD Widget 2 */}
                    <motion.div 
                        className="floating-hud hud-card-right glass"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        <div className="hud-line-header">
                            <span className="hud-glow-dot pending"></span>
                            <span className="monospace">DECRYPT_LINK</span>
                        </div>
                        <div className="hud-metric monospace">AES-256 // ESTABLISHED</div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="scroll-indicator"
                style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
            >
                <div className="mouse">
                    <div className="wheel" />
                </div>
            </motion.div>
        </section>
    );
};


export default React.memo(Hero);
