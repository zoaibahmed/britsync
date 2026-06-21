import React, { useEffect, useRef } from 'react';
import './NeuralConnect.css';

const NeuralConnect = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const isInView = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

        // Setup Resize
        const resize = () => {
            const rect = containerRef.current.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        // Performance Constants
        const TARGET_FPS = 30;
        const FRAME_DURATION = 1000 / TARGET_FPS;
        let lastTime = 0;

        // Particle System Configuration
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 60 : 120;
        const connectionDistance = 150;
        const color = getComputedStyle(document.documentElement).getPropertyValue('--color-blue') || '#00bfff';

        // Initialize Particles
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            pulse: Math.random() * Math.PI
        }));

        // Intersection Observer to stop when off-screen
        const observer = new IntersectionObserver(([entry]) => {
            isInView.current = entry.isIntersecting;
            if (isInView.current) animate(performance.now());
        }, { threshold: 0.1 });
        observer.observe(canvas);

        const animate = (time) => {
            if (!isInView.current) return;

            const delta = time - lastTime;
            if (delta < FRAME_DURATION) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            lastTime = time - (delta % FRAME_DURATION);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;
            const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-blue') || '#00bfff';

            // Draw Connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                let connections = 0;
                for (let j = i + 1; j < particles.length; j++) {
                    if (connections >= 2) break; // Optimization: limit connections

                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.35;
                        ctx.strokeStyle = themeColor.includes('rgba') ? themeColor : `${themeColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        connections++;
                    }
                }
            }

            // Update & Draw Particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                p.pulse += 0.05;
                const pulseSize = p.size + Math.sin(p.pulse) * 0.5;

                ctx.fillStyle = themeColor;
                ctx.globalAlpha = 0.5 + Math.sin(p.pulse) * 0.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        return () => {
            window.removeEventListener('resize', resize);
            observer.disconnect();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="neural-connect-wrapper">
            <canvas ref={canvasRef} className="neural-connect-canvas" />
            <div className="neural-overlay-gradient" />
        </div>
    );
};

export default NeuralConnect;
