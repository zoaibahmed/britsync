import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Target, Clock, Users, Zap } from 'lucide-react';
import SplitText from '../ui/SplitText';
import './WhyChooseUs.css';

const iconMap = {
    Target: <Target size={32} />,
    Clock: <Clock size={32} />,
    Users: <Users size={32} />,
    Zap: <Zap size={32} />,
};

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(max-width: 768px)').matches;
        }
        return false;
    });

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');

        // Simple debounce function
        let timeoutId;
        const onChange = (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsMobile(e.matches);
            }, 100);
        };

        setIsMobile(mq.matches);

        // Modern browsers support addEventListener for MediaQueryList
        if (mq.addEventListener) {
            mq.addEventListener('change', onChange);
        } else {
            mq.addListener(onChange);
        }

        return () => {
            clearTimeout(timeoutId);
            if (mq.removeEventListener) {
                mq.removeEventListener('change', onChange);
            } else {
                mq.removeListener(onChange);
            }
        };
    }, []);

    return isMobile;
};

const NeuralConnection = ({ start, end, index, animationState }) => {
    if (!start || !end) return null;

    // Standardized outward path calculation for perfect symmetry
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    // Consistent horizontal bulge for high-tension tech lines
    const bulge = Math.abs(dx) * 0.42;
    const cp1x = start.x + (end.x > start.x ? bulge : -bulge);
    const cp1y = start.y;
    const cp2x = end.x - (end.x > start.x ? bulge : -bulge);
    const cp2y = end.y;

    const path = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

    // Determine local state for this specific pipe
    let pipeState = 'idle';
    if (animationState.phase === 'continuous') {
        pipeState = 'continuous';
    } else if (animationState.phase === 'sequence') {
        if (index < animationState.activeIndex) pipeState = 'filled';
        else if (index === animationState.activeIndex) pipeState = 'filling';
        else pipeState = 'idle';
    }

    return (
        <g className={`neural-path-group state-${pipeState}`}>
            <defs>
                <linearGradient id={`flow-grad-${index}`} gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
                    <stop offset="0%" stopColor="rgba(0, 191, 255, 0)" />
                    <stop offset="50%" stopColor="rgba(0, 191, 255, 0.8)" />
                    <stop offset="100%" stopColor="rgba(0, 191, 255, 0)" />
                </linearGradient>
            </defs>

            {/* 1. Underlying/Base Path (Always visible but dim) - User said "No glow, no flowing animation" initially, but maybe "Empty" means invisible? 
                User said "All 4 pipes must be completely empty." -> implied hidden or very faint track. 
                "Stroke should be hidden using stroke-dasharray and stroke-dashoffset." usually implies the *content* is hidden. 
                I will keep a very faint track for structure if it looks good, or hide it. 
                Let's keep a barely visible track (0.05 opacity) so it feels like physical pipes exist.
            */}
            <path
                d={path}
                stroke="var(--color-blue)"
                strokeWidth="1.6"
                fill="none"
                style={{ opacity: 0.05 }}
            />

            {/* 2. Sequential Filling Pipe */}
            {/* Using pathLength for the "Filling" effect */}
            <motion.path
                d={path}
                stroke="var(--color-blue)"
                strokeWidth="2.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: (pipeState === 'filling' || pipeState === 'filled' || pipeState === 'continuous') ? 1 : 0,
                    opacity: (pipeState !== 'idle') ? 0.8 : 0,
                }}
                transition={{
                    pathLength: { duration: 2.5, ease: "linear" },
                    opacity: { duration: 0.3 }
                }}
                style={{
                    filter: "drop-shadow(0 0 3px var(--color-blue))" // Slight professional glow
                }}
            />

            {/* 3. Continuous Flow Layer (Only visible in 'continuous' phase) */}
            {/* Dashed line moving on top of the filled line */}
            <motion.path
                d={path}
                stroke={`url(#flow-grad-${index})`}
                strokeWidth="3"
                fill="none"
                strokeDasharray="20 40"
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={pipeState === 'continuous' ? {
                    strokeDashoffset: -200, // Move backwards to simulate flow forward? Or usually positive moves it backwards. 
                    // If standard SVG, negative offset moves dash forward along path? 
                    // Let's test standard direction.
                    opacity: 1
                } : { opacity: 0 }}
                transition={pipeState === 'continuous' ? {
                    strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 0.5 }
                } : {}}
                style={{
                    mixBlendMode: 'plus-lighter'
                }}
            />

            {/* Connection Terminals */}
            <circle cx={start.x} cy={start.y} r="3" fill="var(--color-blue)" opacity="0.3" />
            <motion.circle
                cx={end.x}
                cy={end.y}
                r="4"
                fill="var(--color-blue)"
                animate={{
                    scale: (pipeState === 'filling' || pipeState === 'continuous') ? [1, 1.2, 1] : 1,
                    opacity: (pipeState !== 'idle') ? 1 : 0.3
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </g>
    );
};

const RotatingRing = ({ radius, duration, reverse = false, dashArray = "40 120", opacity = 0.2 }) => (
    <motion.circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="1"
        strokeDasharray={dashArray}
        strokeOpacity={opacity}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: 'center' }}
    />
);

const SatisfactionHub = ({ showNeuralLines = true, className = '', hubRef }) => {
    const [hasEntered, setHasEntered] = useState(false);

    return (
        <motion.div
            className={`satisfaction-hub-container ${className} ${hasEntered ? 'animate' : ''}`.trim()}
            viewport={{ once: true, amount: 0.65 }}
            onViewportEnter={() => setHasEntered(true)}
        >
            <div ref={hubRef} className="satisfaction-hub">
                <div className="hub-glow" />
                <div className="hub-tech-rings">
                    <svg viewBox="0 0 120 120" className="tech-rings-svg">
                        <RotatingRing radius={58} duration={15} opacity={0.1} dashArray="20 100" />
                        <RotatingRing radius={52} duration={10} reverse opacity={0.15} dashArray="60 60" />
                        <RotatingRing radius={48} duration={20} opacity={0.08} dashArray="5 20" />
                    </svg>
                </div>
                <div className="hub-content">
                    <div className="hub-title-scanner" />
                    <span className="hub-percent">100%</span>
                    <span className="hub-label">SATISFACTION</span>
                </div>
                <svg className="hub-ring" viewBox="0 0 120 120">
                    <circle className="ring-bg" cx="60" cy="60" r="54" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" strokeOpacity="0.1" />
                    <circle className="ring-progress" cx="60" cy="60" r="54" fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                {/* Center Core Pulse */}
                <div className="hub-core-pulse" />
            </div>
        </motion.div>
    );
};

const CountUp = ({ to, label, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = React.useMemo(() => {
        // We aren't using framer-motion's useInView hook directly because we want accurate 40% threshold
        // But for simplicity in a small component, we can use a custom managed state or props
        return false;
    }, []);

    // Actually, we can use framer-motion's animate function inside a useEffect triggered by IntersectionObserver
    const [displayValue, setDisplayValue] = useState("0");
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    // Parse target
                    let target = 0;
                    let suffix = "";
                    let isK = false;

                    if (typeof to === 'string') {
                        if (to.includes('k')) {
                            target = parseFloat(to.replace('k', '')) * 1000;
                            isK = true;
                        } else if (to.includes('+')) {
                            target = parseInt(to.replace('+', ''), 10);
                            suffix = "+";
                        } else if (to.includes('%')) {
                            target = parseInt(to.replace('%', ''), 10);
                            suffix = "%";
                        } else {
                            target = parseInt(to, 10);
                        }
                    } else {
                        target = to;
                    }

                    // Animate
                    const node = elementRef.current;
                    const controls = {
                        value: 0,
                        stop: () => { }
                    };

                    // Custom animation loop for full control
                    const startTime = performance.now();
                    const duration = 2000; // 2s
                    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

                    const update = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = easeOutCubic(progress);
                        const current = eased * target;

                        if (isK) {
                            // 0 -> 1.2k logic
                            if (current >= 1000) {
                                setDisplayValue((current / 1000).toFixed(1) + 'k');
                            } else {
                                setDisplayValue(Math.floor(current).toString());
                            }
                        } else {
                            setDisplayValue(Math.floor(current).toString() + suffix);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            // Ensure final value is exact
                            setDisplayValue(to);
                        }
                    };

                    setTimeout(() => {
                        requestAnimationFrame(update);
                    }, delay * 1000);
                }
            },
            { threshold: 0.4, triggerOnce: true }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [to, delay]);

    return (
        <div className="stat" ref={elementRef}>
            <span className="stat-num">{displayValue}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

const WhyChooseUs = ({ data }) => {
    const {
        title = "Why Britsync?",
        description = "We don't just build websites; we build digital legacies. Our approach combines data-driven strategy with world-class aesthetics.",
        stats = [
            { id: 1, value: "50+", label: "Projects Delivered" },
            { id: 2, value: "98%", label: "Client Retention" },
            { id: 3, value: "15+", label: "Expert Engineers" },
            { id: 4, value: "1.2k", label: "Cups of Coffee" }
        ],
        reasons = [
            { id: 1, icon: "Target", title: "Precision", desc: "Pixel-perfect execution aligned with your business goals." },
            { id: 2, icon: "Zap", title: "Speed", desc: "Rapid prototyping and deployment without compromising quality." },
            { id: 3, icon: "Users", title: "Collaboration", desc: "We work as an extension of your team, not just a vendor." },
            { id: 4, icon: "Clock", title: "Reliability", desc: "24/7 support and 99.9% uptime guarantee for all projects." }
        ]
    } = data || {};

    const isMobile = useIsMobile();
    const shouldReduceMotion = useReducedMotion();
    const enterEase = useMemo(() => [0.22, 1, 0.36, 1], []);

    const hubRef = useRef(null);
    const cardRefs = useRef([]);
    const svgRef = useRef(null);
    const sectionRef = useRef(null);
    const [coords, setCoords] = useState([]);
    const [activePillar, setActivePillar] = useState(null);

    // Animation State Machine
    const [animationState, setAnimationState] = useState({
        phase: 'idle', // 'idle' | 'sequence' | 'continuous'
        activeIndex: -1 // 0..3 during sequence
    });

    const updateCoords = useCallback(() => {
        if (!hubRef.current || !svgRef.current || isMobile) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const hubRect = hubRef.current.getBoundingClientRect();

        if (hubRect.width === 0 || hubRect.left < -1500) return;

        const hubCenterX = (hubRect.left + hubRect.width / 2) - svgRect.left;
        const hubCenterY = (hubRect.top + hubRect.height / 2) - svgRect.top;
        const hubRadius = (hubRect.width / 2) - 0.2;

        const newCoords = reasons.map((r, i) => {
            let card = document.querySelector(`.reason-card-${i}`);
            if (!card) card = cardRefs.current[i];
            if (!card) return null;

            const cardRect = card.getBoundingClientRect();
            if (cardRect.width === 0) return null;

            const isLeftColumn = (i === 0 || i === 2);
            const cardX = isLeftColumn ? (cardRect.right - svgRect.left) + 2 : (cardRect.left - svgRect.left) - 2;
            const cardY = (cardRect.top + cardRect.height / 2) - svgRect.top;

            const dx = cardX - hubCenterX;
            const dy = cardY - hubCenterY;
            const angle = Math.atan2(dy, dx);

            return {
                start: {
                    x: hubCenterX + Math.cos(angle) * hubRadius,
                    y: hubCenterY + Math.sin(angle) * hubRadius
                },
                end: { x: cardX, y: cardY }
            };
        });

        if (newCoords.some(c => c !== null)) {
            setCoords(newCoords.filter(c => c !== null));
        }
    }, [isMobile, reasons]);

    // Handle Scroll Trigger and Animation Sequence
    useEffect(() => {
        if (isMobile) return;

        const handleSequence = async () => {
            // Sequence: Pipe 0 -> 1 -> 2 -> 3 -> Continuous
            for (let i = 0; i < 4; i++) {
                setAnimationState(prev => ({ phase: 'sequence', activeIndex: i }));
                await new Promise(r => setTimeout(r, 2500)); // 2.5s per pipe
            }
            setAnimationState({ phase: 'continuous', activeIndex: -1 });
        };

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                // Trigger once
                if (animationState.phase === 'idle') {
                    handleSequence();
                }
                updateCoords();
                window.addEventListener('resize', updateCoords);
                window.addEventListener('scroll', updateCoords, { passive: true });
            }
        }, { threshold: 0.4 }); // Trigger when 40% visible

        if (sectionRef.current) observer.observe(sectionRef.current);

        // Initial coordination check
        setTimeout(updateCoords, 500);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords);
        };
    }, [isMobile, animationState.phase, updateCoords]);

    const introMotionProps = (isMobile && !shouldReduceMotion)
        ? {
            initial: { opacity: 0, y: 14 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: enterEase },
            viewport: { once: true, amount: 0.6 }
        }
        : null;

    return (
        <section className="why-section" ref={sectionRef}>
            <div className="why-container">
                <div className="why-left-content">
                    {isMobile && introMotionProps ? (
                        <motion.div {...introMotionProps}>
                            <h2 className="section-title">{title}</h2>
                            <p className="why-desc">{description}</p>
                        </motion.div>
                    ) : (
                        <div className="why-header-top">
                            <h2 className="section-title">{title}</h2>
                            <p className="why-desc">{description}</p>
                        </div>
                    )}

                    <motion.div
                        className="stat-row"
                        {...(isMobile && !shouldReduceMotion
                            ? {
                                initial: { opacity: 0, y: 10 },
                                whileInView: { opacity: 1, y: 0 },
                                transition: { duration: 0.38, ease: enterEase, delay: 0.06 },
                                viewport: { once: true, amount: 0.6 }
                            }
                            : {})}
                    >
                        {stats.map((s, i) => (
                            <CountUp key={s.id || i} to={s.value} label={s.label} delay={i * 0.1} />
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    className="why-satisfaction-standalone"
                    {...(isMobile && !shouldReduceMotion
                        ? {
                            initial: { opacity: 0, y: 10, scale: 0.95 },
                            whileInView: { opacity: 1, y: 0, scale: 1 },
                            transition: { duration: 0.45, ease: enterEase },
                            viewport: { once: true, amount: 0.55 }
                        }
                        : { viewport: { once: true } })}
                >
                    <SatisfactionHub showNeuralLines={false} className="satisfaction-hub-container--standalone" />
                </motion.div>

                <motion.div className="why-cards-wrapper">
                    {!isMobile && (
                        <svg ref={svgRef} className="neural-connections-svg" style={{ overflow: 'visible' }}>
                            {coords.length > 0 && coords.map((c, i) => (
                                c && (
                                    <NeuralConnection
                                        key={reasons[i]?.id || i}
                                        index={i}
                                        start={c.start}
                                        end={c.end}
                                        animationState={animationState}
                                    />
                                )
                            ))}
                        </svg>
                    )}

                    <div className="why-grid why-grid-with-circle">
                        {reasons.map((r, i) => (
                            <motion.div
                                key={r.id || i}
                                ref={el => cardRefs.current[i] = el}
                                className={`reason-card reason-card-${i}`}
                                onMouseEnter={() => setActivePillar(i)}
                                onMouseLeave={() => setActivePillar(null)}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                                }}
                                initial={isMobile ? {} : { opacity: 0, x: 20 }}
                                whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
                                transition={isMobile ? {} : { delay: i * 0.1 }}
                                style={isMobile ? { opacity: 1, transform: 'none' } : {}}
                            >
                                <div className="card-tech-overlay" />
                                <div className="card-corner-tl" />
                                <div className="card-corner-tr" />
                                <div className="card-corner-bl" />
                                <div className="card-corner-br" />
                                <div className="reason-icon">{iconMap[r.icon] || <Zap size={32} />}</div>
                                <div className="reason-content">
                                    <h4>{r.title}</h4>
                                    <p>{r.desc}</p>
                                </div>
                                <div className="card-active-glow" />
                            </motion.div>
                        ))}

                        {!isMobile && (
                            <motion.div
                                className="satisfaction-hub-motion"
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                <SatisfactionHub hubRef={hubRef} showNeuralLines className="satisfaction-hub-container--in-grid" />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default React.memo(WhyChooseUs);
