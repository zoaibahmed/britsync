import React, { useEffect, useRef, useState } from 'react';

const InteractiveParticles = () => {
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        let animationFrameId;
        let isBursting = false;
        let particles = [];

        // Adaptive particle count based on device
        const getParticleCount = () => {
            const isMobile = window.innerWidth < 768;
            const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
            if (isMobile) return 70; // Highly optimized for mobile
            if (isLowEnd) return 100; // Highly optimized for mid-range
            return 160; // Clean, high-performance desktop limit
        };
        const particleCount = getParticleCount();
        const mouse = { x: null, y: null, radius: 350, speed: 0 }; 
        let lastMouseX = null;
        let lastMouseY = null;
        let lastMouseTime = Date.now();

        class Particle {
            constructor() {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                this.x = centerX;
                this.y = centerY;

                this.baseX = Math.random() * canvas.width;
                this.baseY = Math.random() * canvas.height;

                this.size = Math.random() * 1.5 + 0.5;
                this.density = (Math.random() * 25) + 5; // Increased density range for a more dynamic swarm feel
                this.color = '';
            }

            draw(isDark) {
                this.color = isDark ? '#00bfff' : '#4f46e5';

                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                if (mouse.x === null || mouse.y === null) {
                    // Smoother return to base position when not attracted
                    if (Math.abs(this.x - this.baseX) > 0.1) {
                        this.x += (this.baseX - this.x) * 0.05;
                    }
                    if (Math.abs(this.y - this.baseY) > 0.1) {
                        this.y += (this.baseY - this.y) * 0.05;
                    }
                    return;
                }

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distSq = dx * dx + dy * dy;
                let radiusSq = mouse.radius * mouse.radius;

                if (distSq < radiusSq) {
                    let distance = Math.sqrt(distSq);
                    if (distance > 0) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let maxDistance = mouse.radius;
                        let force = (maxDistance - distance) / maxDistance;
                        
                        // Stronger magnetism as particles get closer
                        let magnetPull = distance < 100 ? 5.0 : 3.5;
                        let directionX = forceDirectionX * force * this.density * magnetPull; 
                        let directionY = forceDirectionY * force * this.density * magnetPull;

                        this.x += directionX;
                        this.y += directionY;
                    }
                } else {
                    // Smoother return to base position when not attracted
                    if (Math.abs(this.x - this.baseX) > 0.1) {
                        this.x += (this.baseX - this.x) * 0.05;
                    }
                    if (Math.abs(this.y - this.baseY) > 0.1) {
                        this.y += (this.baseY - this.y) * 0.05;
                    }
                }
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const drawMouseGlow = (isDark) => {
            if (mouse.x === null) return;
            const glowColor = isDark ? 'rgba(0, 191, 255, 0.04)' : 'rgba(79, 70, 229, 0.03)';

            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.5);
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const connect = (isDark) => {
            if (!isBursting) return;

            const lineColor = isDark ? '0, 191, 255' : '79, 70, 229';
            const connectDistance = 140; // Restored from 90
            const connectDistanceSq = connectDistance * connectDistance;

            let lineCount = 0;
            const maxLines = 800; // Increased from 50 to restore full web connectivity

            for (let a = 0; a < particles.length; a++) {
                const pA = particles[a];
                for (let b = a + 1; b < particles.length; b++) {
                    if (lineCount > maxLines) break;

                    const pB = particles[b];
                    const dx = pA.x - pB.x;
                    if (dx > connectDistance || dx < -connectDistance) continue;

                    const dy = pA.y - pB.y;
                    if (dy > connectDistance || dy < -connectDistance) continue;

                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectDistanceSq) {
                        const distance = Math.sqrt(distSq);
                        const opacityValue = 1 - (distance / connectDistance);
                        ctx.strokeStyle = `rgba(${lineColor}, ${opacityValue * 0.2})`; // Restored opacity for visible web
                        ctx.beginPath();
                        ctx.moveTo(pA.x, pA.y);
                        ctx.lineTo(pB.x, pB.y);
                        ctx.stroke();
                        lineCount++;
                    }
                }
                if (lineCount > maxLines) break;
            }
        };

        let frameCounter = 0;
        const animate = () => {
            frameCounter++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.classList.contains('dark');
            drawMouseGlow(isDark);

            for (let i = 0; i < particles.length; i++) {
                particles[i].draw(isDark);
                particles[i].update();
            }

            connect(isDark); // Process connections every frame for maximum stability

            animationFrameId = requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationFrameId) animate();
                } else {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(canvas);
        const handleMouseMove = (e) => {
            const now = Date.now();
            const dt = now - lastMouseTime;
            if (dt < 16) return;

            const dx = e.clientX - (lastMouseX || e.clientX);
            const dy = e.clientY - (lastMouseY || e.clientY);
            const distance = Math.sqrt(dx * dx + dy * dy);

            mouse.speed = distance / (now - lastMouseTime);
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            lastMouseTime = now;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        resize();
        init();

        const burstTimer = setTimeout(() => {
            isBursting = true;
        }, 500); // Faster burst for immediate premium look

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
            clearTimeout(burstTimer);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="interactive-particles"
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                contain: 'strict' /* Critical performance: isolated element from layout */
            }}
        />
    );
};

export default React.memo(InteractiveParticles);
