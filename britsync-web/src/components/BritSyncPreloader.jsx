import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BritSyncPreloader.css';

const LOADING_STEPS = [
    "Initializing Interface...",
    "Syncing Systems...",
    "Building Experience...",
    "Preparing Digital Framework...",
    "Launching BritSync..."
];

const BritSyncPreloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
    const [isVisible, setIsVisible] = useState(true);
    const canvasRef = useRef(null);

    // Lock and unlock scroll
    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        // Animate progress and loading text
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 4) + 2; // 2-5% steps
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                sessionStorage.setItem('britsync_preloader_shown', 'true');
                setTimeout(() => {
                    setIsVisible(false);
                    if (onComplete) onComplete();
                    // Restore scroll
                    document.body.style.overflow = '';
                    document.body.style.height = '';
                }, 400); // Wait at 100%
            }
            setProgress(currentProgress);

            // Update text based on progress
            const index = Math.min(
                Math.floor((currentProgress / 100) * LOADING_STEPS.length),
                LOADING_STEPS.length - 1
            );
            setLoadingText(LOADING_STEPS[index]);
        }, 40);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [onComplete]);

    // Particles and Network line animations on background canvas
    useEffect(() => {
        if (!isVisible) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId;
        const particles = [];
        const lines = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Populate particles
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        // Populate vertical/horizontal data lines
        for (let i = 0; i < 6; i++) {
            lines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 120 + 80,
                speed: Math.random() * 1.5 + 0.5,
                direction: Math.random() > 0.5 ? 'horizontal' : 'vertical',
                opacity: Math.random() * 0.15 + 0.05
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce bounds
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 191, 255, ${p.alpha})`; // Cyan neon tint
                ctx.fill();
            });

            // Draw data flow lines
            lines.forEach((l) => {
                ctx.beginPath();
                if (l.direction === 'horizontal') {
                    l.x += l.speed;
                    if (l.x > canvas.width) l.x = -l.length;
                    ctx.moveTo(l.x, l.y);
                    ctx.lineTo(l.x + l.length, l.y);
                    ctx.strokeStyle = `rgba(0, 191, 255, ${l.opacity})`;
                } else {
                    l.y += l.speed;
                    if (l.y > canvas.height) l.y = -l.length;
                    ctx.moveTo(l.x, l.y);
                    ctx.lineTo(l.x, l.y + l.length);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${l.opacity})`; // Purple tint
                }
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="britsync-preloader-overlay"
                initial={{ opacity: 1 }}
                exit={{ 
                    opacity: 0,
                    y: "-100%",
                    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                }}
            >
                {/* Background grid canvas */}
                <canvas ref={canvasRef} className="preloader-bg-canvas" />

                {/* Animated gradient glow backdrop */}
                <div className="preloader-gradient-glow" />

                {/* Main preloader container */}
                <div className="preloader-glass-card">
                    {/* Glowing Logo Circle */}
                    <div className="preloader-logo-ring">
                        <div className="ring-pulse" />
                        <svg className="preloader-logo-svg" viewBox="0 0 100 100">
                            {/* Futuristic Chevron Logo */}
                            <path 
                                d="M35 25 L65 50 L35 75" 
                                fill="none" 
                                stroke="url(#logoGrad)" 
                                strokeWidth="8" 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path 
                                d="M50 25 L80 50 L50 75" 
                                fill="none" 
                                stroke="url(#logoGrad)" 
                                strokeWidth="3" 
                                opacity="0.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00bfff" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Brand Name Text with letters reveal */}
                    <div className="preloader-brand-title">
                        {"BRITSYNC".split("").map((letter, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ 
                                    delay: 0.08 * idx, 
                                    duration: 0.4,
                                    ease: "easeOut"
                                }}
                                className="brand-char"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    {/* Glowing Progress bar */}
                    <div className="preloader-progress-track">
                        <motion.div 
                            className="preloader-progress-bar"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Boot Log Info Text */}
                    <div className="preloader-boot-log monospace">
                        <span className="cursor-blink">&gt;</span> {loadingText}
                    </div>

                    {/* Numerical Percentage */}
                    <div className="preloader-percent monospace">
                        [ {progress.toString().padStart(3, '0')}% ]
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BritSyncPreloader;
