import React, { useEffect, useRef, useState } from 'react';
import './VerificationGridBackground.css';

const VerificationGridBackground = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        let animationFrameId;
        let particles = [];
        let dataLines = [];
        let gridOffset = 0;
        let scanY = 0;
        let scanDirection = 1;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        window.addEventListener('resize', resize);
        resize();

        // 1. Initialize floating particles
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                size: Math.random() * 1.5 + 0.5,
                speedY: -(Math.random() * 0.2 + 0.1),
                opacity: Math.random() * 0.4 + 0.2
            });
        }

        // 2. Initialize data-flow paths
        for (let i = 0; i < 4; i++) {
            dataLines.push({
                y: Math.random() * canvas.offsetHeight * 0.7 + 50,
                x: Math.random() * canvas.offsetWidth,
                length: Math.random() * 150 + 100,
                speed: Math.random() * 0.4 + 0.2,
                opacity: Math.random() * 0.15 + 0.05
            });
        }

        const drawGrid = (w, h, color) => {
            const horizon = h * 0.45;
            const gridHeight = h - horizon;
            ctx.strokeStyle = `rgba(${color}, 0.08)`;
            ctx.lineWidth = 1;

            // Draw perspective lines originating from vanishing point
            const numRadials = 18;
            const vpX = w / 2;
            const vpY = horizon;
            for (let i = 0; i <= numRadials; i++) {
                const angleX = (i / numRadials) * w;
                ctx.beginPath();
                ctx.moveTo(vpX, vpY);
                ctx.lineTo(angleX, h);
                ctx.stroke();
            }

            // Draw animated horizontal lines (accelerating forward)
            gridOffset += 0.15;
            if (gridOffset >= 20) gridOffset = 0;

            const numHorizontals = 12;
            for (let i = 0; i < numHorizontals; i++) {
                const normIndex = (i + gridOffset / 20) / numHorizontals;
                // Exponential spacing for 3D perspective depth
                const lineY = horizon + Math.pow(normIndex, 2) * gridHeight;
                ctx.beginPath();
                ctx.moveTo(0, lineY);
                ctx.lineTo(w, lineY);
                ctx.stroke();
            }
        };

        const draw = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            const themeColor = '0, 191, 255'; // Always use cyan for the dark verification grid floor

            // 1. Draw Grid Floor
            drawGrid(w, h, themeColor);

            // 2. Draw Data Lines
            dataLines.forEach(line => {
                line.x += line.speed;
                if (line.x > w) line.x = -line.length;

                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x + line.length, line.y);
                ctx.strokeStyle = `rgba(${themeColor}, ${line.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // 3. Draw Floating Particles
            particles.forEach(p => {
                p.y += p.speedY;
                if (p.y < 0) {
                    p.y = h;
                    p.x = Math.random() * w;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${themeColor}, ${p.opacity})`;
                ctx.fill();
            });

            // 4. Draw Verifying Scanner Line
            scanY += scanDirection * 0.6; // Slow speed
            if (scanY > h || scanY < 0) {
                scanDirection *= -1;
            }

            const scanGrad = ctx.createLinearGradient(0, scanY - 4, 0, scanY + 4);
            scanGrad.addColorStop(0, 'rgba(0, 191, 255, 0)');
            scanGrad.addColorStop(0.5, `rgba(${themeColor}, 0.22)`);
            scanGrad.addColorStop(1, 'rgba(0, 191, 255, 0)');

            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, scanY - 4, w, 8);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isVisible]);

    return (
        <div ref={containerRef} className="verification-bg-wrapper">
            <canvas ref={canvasRef} className="verification-bg-canvas" />
            <div className="radial-glow-cyan" />
            <div className="radial-glow-purple" />
        </div>
    );
};

export default VerificationGridBackground;
