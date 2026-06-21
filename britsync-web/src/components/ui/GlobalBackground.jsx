import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './GlobalBackground.css';

const GlobalBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const glowX = useSpring(mouseX, springConfig);
    const glowY = useSpring(mouseY, springConfig);

    // Secondary glow for the "Amazing" effect (Red/Burgundy)
    const glowRedX = useSpring(mouseX, { ...springConfig, damping: 40, stiffness: 150 });
    const glowRedY = useSpring(mouseY, { ...springConfig, damping: 40, stiffness: 150 });

    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 900);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        let rafId;
        let lastTime = 0;
        const throttleMs = 33; // ~30fps instead of 60fps for better performance

        const handleMouseMove = (e) => {
            if (isMobile) return;
            const now = performance.now();
            // Throttle to ~30fps for better scroll performance
            if (now - lastTime < throttleMs) return;
            lastTime = now;

            // Use requestAnimationFrame to batch updates
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            });
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [mouseX, mouseY, isMobile]);

    return (
        <div className="global-bg-container">
            {/* Global Mouse Glow - Only for Desktop */}
            {!isMobile && (
                <>
                    <motion.div
                        className="global-mouse-glow-outer"
                        style={{
                            x: glowX,
                            y: glowY,
                            translateX: '-50%',
                            translateY: '-50%',
                        }}
                    />
                    <motion.div
                        className="global-mouse-glow-inner"
                        style={{
                            x: glowX,
                            y: glowY,
                            translateX: '-50%',
                            translateY: '-50%',
                        }}
                    />
                    <motion.div
                        className="global-mouse-glow-red"
                        style={{
                            x: glowRedX,
                            y: glowRedY,
                            translateX: '-50%',
                            translateY: '-50%',
                        }}
                    />
                </>
            )}

            <div className="global-grid-overlay" />

            {/* New background layers for depth - Static for performance */}
            <div className="noise-overlay-fine" />
            <div className="ambient-cluster" style={{ top: '20%', left: '10%' }} />
            <div className="ambient-cluster" style={{ bottom: '20%', right: '10%' }} />

            {/* Static Luxury Spots - Moving blurs are expensive and cause hanging */}
            <div className="luxury-spot spot-1" />
            <div className="luxury-spot spot-2" />
            <div className="luxury-spot spot-3" />

            <div className="noise-overlay" />
            <div className="vignette" />
        </div>
    );
};

export default GlobalBackground;
