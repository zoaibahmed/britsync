import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './RotaryDial.css';

const RotaryDial = ({ projects = [] }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const navigate = useNavigate();

    // Physics & State
    const state = useRef({
        rotation: 0,
        velocity: 0,
        isDragging: false,
        lastX: 0,
        lastTime: 0,
        lastTickAngle: 0,
        friction: 0.95,
        snapStiffness: 0.1,
        autoRotateSpeed: 0.15, // Slow default speed
        baseVelocity: 0.15
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Audio Context for mechanical "tick"
    const audioCtx = useRef(null);

    const playTick = useCallback(() => {
        try {
            if (!audioCtx.current) {
                audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtx.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.03);

            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2500, ctx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.03);
        } catch (e) {
            // Audio blocked
        }
    }, []);

    // Cached dimensions to prevent layout thrashing
    const dims = useRef({ width: 0, height: 0, rect: null });

    useEffect(() => {
        const updateDims = () => {
            if (containerRef.current) {
                dims.current.width = containerRef.current.offsetWidth;
                dims.current.height = containerRef.current.offsetHeight;
                dims.current.rect = containerRef.current.getBoundingClientRect();
            }
        };
        updateDims();
        window.addEventListener('resize', updateDims);
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    const updateItems = useCallback(() => {
        if (!trackRef.current) return;
        const items = trackRef.current.children;
        const count = items.length;
        if (count === 0) return;

        const angleStep = 360 / count;
        const radius = isMobile ? 180 : 320;

        for (let i = 0; i < count; i++) {
            const item = items[i];
            const baseAngle = i * angleStep;
            const currentAngle = (baseAngle + state.current.rotation);
            const rad = (currentAngle - 90) * (Math.PI / 180);

            const x = Math.cos(rad) * radius;
            const z = Math.sin(rad) * radius * 0.7;

            let normalizedAngle = ((currentAngle % 360) + 360) % 360;
            let diff = Math.abs(normalizedAngle - 180); // 180 is the front-center (x=0, z=max)
            if (diff > 180) diff = 360 - diff;

            const normalizedDist = 1 - Math.min(diff / 180, 1);
            const focus = Math.pow(normalizedDist, 4); // Smoother falloff (4 instead of 6)

            const scale = 0.6 + (focus * 1.2); // Larger front card for impact
            const opacity = 0.3 + (normalizedDist * 0.7);

            const blur = diff < 5 ? 0 : Math.min((diff - 5) / 40 * 8, 8); // Reduced max blur
            const brightness = 0.4 + (focus * 0.6);

            item.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.filter = `blur(${blur}px) brightness(${brightness})`;
            item.style.zIndex = Math.round(z + radius);

            if (diff < 15) { // Active class also tighter
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }

            // SCROLL PARALLAX - Using cached dims with protective clamping
            const img = item.querySelector('.parallax-img');
            if (img && dims.current.rect) {
                const centerY = window.innerHeight / 2;
                const sectionCenter = dims.current.rect.top + dims.current.height / 2;
                const distanceFromCenter = sectionCenter - centerY;

                // Tighten multiplier and clamp to prevent image from showing container edges
                const parallaxOffset = Math.max(Math.min(distanceFromCenter * 0.03, 20), -20);
                img.style.transform = `scale(1.3) translateY(${parallaxOffset}px)`; // Increased scale for safety
            }
        }

        // Tick feedback based on speed
        const currentTickCheck = Math.floor((state.current.rotation + (angleStep / 2)) / angleStep);
        if (currentTickCheck !== state.current.lastTickAngle) {
            playTick();
            state.current.lastTickAngle = currentTickCheck;
        }
    }, [playTick, isMobile]);

    useEffect(() => {
        let rafId;

        const loop = () => {
            const p = state.current;

            if (!p.isDragging) {
                // If velocity is near zero, merge back into auto-rotate
                if (Math.abs(p.velocity) < p.autoRotateSpeed) {
                    p.velocity = p.autoRotateSpeed;
                } else {
                    p.velocity *= p.friction;
                }

                p.rotation += p.velocity;
            }

            updateItems();
            rafId = requestAnimationFrame(loop);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!rafId) rafId = requestAnimationFrame(loop);
                } else {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        }, { threshold: 0.1 });

        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (observer) observer.disconnect();
            cancelAnimationFrame(rafId);
        };
    }, [projects.length, updateItems]);

    const onStart = (e) => {
        state.current.isDragging = true;
        state.current.lastX = e.touches ? e.touches[0].clientX : e.clientX;
        state.current.lastTime = Date.now();
        document.body.style.cursor = 'grabbing';
    };

    const onMove = (e) => {
        if (!state.current.isDragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const now = Date.now();
        const dt = now - state.current.lastTime;
        const dx = x - state.current.lastX;

        const sensitivity = isMobile ? 0.35 : 0.2;
        state.current.rotation += dx * sensitivity;

        if (dt > 0) {
            const newVel = (dx / dt) * 1.5;
            state.current.velocity = Math.max(Math.min(newVel, 20), -20);
        }

        state.current.lastX = x;
        state.current.lastTime = now;
    };

    const onEnd = () => {
        state.current.isDragging = false;
        document.body.style.cursor = '';
    };

    return (
        <div
            className="rotary-dial-container compact"
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
            onMouseLeave={onEnd}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
            ref={containerRef}
        >
            <div className="dial-background compact-bg">
                <div className="dial-ring-hologram small" />
                <div className="dial-center-hub mini" />
            </div>

            <div className="rotary-track-3d" ref={trackRef}>
                {projects.map((project, idx) => (
                    <div
                        key={project.id || idx}
                        className="rotary-card-3d compact-card glass"
                        onClick={() => navigate(`/work/${project.id || ''}`)}
                    >
                        <div className="card-media">
                            <img
                                src={project.image}
                                alt={project.title}
                                draggable="false"
                                className="parallax-img"
                                style={{
                                    transform: `scale(1.2)`,
                                    transition: 'transform 0.1s linear' // Faster for parallax responsiveness
                                }}
                            />
                            <div className="card-scanline" />
                        </div>
                        <div className="card-info compact-info">
                            <span className="cat">{project.category}</span>
                            <h3>{project.title}</h3>
                        </div>
                        {/* Removed active glow per user request for serious feel */}
                    </div>
                ))}
            </div>

            <div className="dial-ui-overlay">
                <div className="dial-top-pointer mini" />
            </div>
        </div>
    );
};

export default RotaryDial;
