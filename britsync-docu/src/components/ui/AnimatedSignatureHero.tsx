import React, { useEffect, useState, useRef } from 'react';
import { FileText, Shield, Check, Calendar } from 'lucide-react';

export const AnimatedSignatureHero: React.FC = () => {
    const [step, setStep] = useState<'waiting' | 'signing' | 'completed'>('waiting');
    const [penPos, setPenPos] = useState({ x: 30, y: 45 });
    const [penVisible, setPenVisible] = useState(false);
    const [inkProgress, setInkProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Path definitions for the signature stroke inside the field box
    // Field box size is approx 240px wide, 70px high
    const pathPoints = [
        { x: 30, y: 45 },
        { x: 45, y: 20 },
        { x: 55, y: 55 },
        { x: 70, y: 25 },
        { x: 80, y: 50 },
        { x: 95, y: 35 },
        { x: 110, y: 15 },
        { x: 120, y: 48 },
        { x: 135, y: 30 },
        { x: 155, y: 22 },
        { x: 175, y: 45 },
        { x: 210, y: 32 }
    ];

    // Helper to interpolate points along the path points
    const getPointAtPercent = (pct: number) => {
        const index = pct * (pathPoints.length - 1);
        const lowIndex = Math.floor(index);
        const highIndex = Math.ceil(index);
        if (lowIndex === highIndex) return pathPoints[lowIndex];
        const ratio = index - lowIndex;
        const p1 = pathPoints[lowIndex];
        const p2 = pathPoints[highIndex];
        return {
            x: p1.x + (p2.x - p1.x) * ratio,
            y: p1.y + (p2.y - p1.y) * ratio
        };
    };

    // Cycle the simulation loop
    useEffect(() => {
        let isCancelled = false;
        const runLoop = async () => {
            while (!isCancelled) {
                // 1. Waiting State
                setStep('waiting');
                setPenVisible(false);
                setInkProgress(0);
                await new Promise((r) => setTimeout(r, 1500));
                if (isCancelled) break;

                // 2. Signing State
                setStep('signing');
                setPenVisible(true);
                const startPos = pathPoints[0];
                setPenPos(startPos);
                
                // Animate signature stroke drawing over 3 seconds
                const duration = 2800;
                const startTime = Date.now();
                
                const animatePen = () => {
                    if (isCancelled) return;
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    setInkProgress(progress);
                    const currentPos = getPointAtPercent(progress);
                    setPenPos(currentPos);

                    if (progress < 1) {
                        requestAnimationFrame(animatePen);
                    }
                };
                
                requestAnimationFrame(animatePen);
                await new Promise((r) => setTimeout(r, 3000));
                if (isCancelled) break;

                // 3. Completed State
                setStep('completed');
                setPenVisible(false);
                await new Promise((r) => setTimeout(r, 3500));
            }
        };

        runLoop();
        return () => {
            isCancelled = true;
        };
    }, []);

    // Draw particle sparkles at the pen tip when signing
    useEffect(() => {
        if (step !== 'signing' || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Array<{ x: number, y: number, vx: number, vy: number, alpha: number, size: number, color: string }> = [];
        let animationFrameId: number;

        const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af'];

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Add new particle from active pen position
            if (Math.random() < 0.4) {
                particles.push({
                    x: penPos.x,
                    y: penPos.y,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5 - 0.5,
                    alpha: 1,
                    size: Math.random() * 3 + 1,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }

            // Update & Draw particles
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.03;
                if (p.alpha <= 0) {
                    particles.splice(idx, 1);
                    return;
                }
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [step, penPos]);

    // Build the completed signature path representation
    const buildPathD = () => {
        let d = `M ${pathPoints[0].x},${pathPoints[0].y}`;
        const limit = Math.floor(inkProgress * (pathPoints.length - 1));
        
        for (let i = 1; i <= limit; i++) {
            d += ` L ${pathPoints[i].x},${pathPoints[i].y}`;
        }
        
        // Add fractional trailing line segment
        const remainder = (inkProgress * (pathPoints.length - 1)) - limit;
        if (remainder > 0 && limit < pathPoints.length - 1) {
            const p1 = pathPoints[limit];
            const p2 = pathPoints[limit + 1];
            const rx = p1.x + (p2.x - p1.x) * remainder;
            const ry = p1.y + (p2.y - p1.y) * remainder;
            d += ` L ${rx},${ry}`;
        }
        return d;
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Background Glow Ring */}
            <div style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0) 70%)',
                filter: 'blur(30px)',
                zIndex: 0,
                top: '50px',
                left: '70px',
                pointerEvents: 'none'
            }} />

            {/* Document Base Plate Container */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '24px',
                width: '380px',
                height: '320px',
                boxShadow: step === 'completed'
                    ? 'var(--shadow-lg), 0 20px 40px -10px rgba(16, 185, 129, 0.15)'
                    : 'var(--shadow-lg), 0 20px 40px -10px rgba(37, 99, 235, 0.08)',
                padding: '1.75rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.5s ease',
                zIndex: 2
            }}>
                {/* Document Title Header */}
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: '#eff6ff',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileText size={16} style={{ color: '#2563eb' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Employment_Contract.pdf</span>
                                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>244 KB • PDF Document</span>
                            </div>
                        </div>

                        {/* Top corner status badge */}
                        <div style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.4s ease',
                            background: step === 'completed' ? '#d1fae5' : step === 'signing' ? '#eff6ff' : '#fee2e2',
                            color: step === 'completed' ? '#065f46' : step === 'signing' ? '#1e40af' : '#991b1b',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {step === 'completed' ? (
                                <>
                                    <Check size={11} strokeWidth={3} /> Completed
                                </>
                            ) : step === 'signing' ? (
                                <>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        background: '#2563eb',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        animation: 'pulse 1.2s infinite'
                                    }} /> Signing...
                                </>
                            ) : (
                                <>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        background: '#ef4444',
                                        borderRadius: '50%',
                                        display: 'inline-block'
                                    }} /> Waiting
                                </>
                            )}
                        </div>
                    </div>

                    {/* Dummy Text content lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
                        <div style={{ height: '7px', background: '#e2e8f0', width: '100%', borderRadius: '4px' }} />
                        <div style={{ height: '7px', background: '#e2e8f0', width: '92%', borderRadius: '4px' }} />
                        <div style={{ height: '7px', background: '#e2e8f0', width: '96%', borderRadius: '4px' }} />
                        <div style={{ height: '7px', background: '#e2e8f0', width: '65%', borderRadius: '4px' }} />
                    </div>
                </div>

                {/* Stepper signature overlay layout */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1.5rem', position: 'relative' }}>
                    {/* Date box */}
                    <div style={{
                        flex: 1,
                        border: '1px dashed #cbd5e1',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        minHeight: '62px',
                        justifyContent: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#94a3b8' }}>
                            <Calendar size={10} />
                            <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', fontWeight: 800 }}>Date Signed</span>
                        </div>
                        <span style={{ fontWeight: 800, color: '#334155', fontSize: '0.75rem', marginTop: '2px' }}>
                            {step === 'completed' ? new Date().toLocaleDateString('en-GB') : '—'}
                        </span>
                    </div>

                    {/* Signature interactive container */}
                    <div style={{
                        flex: 1.8,
                        border: step === 'completed' ? '1px solid #10b981' : '1px dashed #2563eb',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: step === 'completed' ? '#f0fdf4' : 'rgba(37, 99, 235, 0.02)',
                        position: 'relative',
                        height: '62px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.4s ease'
                    }}>
                        <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '6px',
                            color: step === 'completed' ? '#059669' : '#2563eb',
                            fontSize: '0.55rem',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            letterSpacing: '0.2px'
                        }}>
                            Sarah Connor *
                        </span>

                        {/* Signature Line */}
                        <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '10px',
                            right: '10px',
                            height: '1px',
                            background: step === 'completed' ? '#a7f3d0' : '#bfdbfe',
                            transition: 'all 0.4s ease'
                        }} />

                        {/* Canvas overlays for particle sparkles */}
                        <canvas 
                            ref={canvasRef}
                            width={240}
                            height={70}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 10
                            }}
                        />

                        {/* Drawing Path SVG */}
                        <svg 
                            viewBox="0 0 240 70"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 5
                            }}
                        >
                            {(step === 'signing' || step === 'completed') && (
                                <path
                                    d={buildPathD()}
                                    fill="none"
                                    stroke="#1e3a8a"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        filter: step === 'completed' ? 'drop-shadow(0px 1px 2px rgba(30, 58, 138, 0.35))' : 'none'
                                    }}
                                />
                            )}
                        </svg>

                        {/* Floating metallic stylus pen tip */}
                        {penVisible && (
                            <div style={{
                                position: 'absolute',
                                left: `${(penPos.x / 240) * 100}%`,
                                top: `${(penPos.y / 70) * 100}%`,
                                pointerEvents: 'none',
                                transform: 'translate(-5px, -95%) rotate(15deg)',
                                transition: 'transform 0.05s linear',
                                filter: 'drop-shadow(3px 8px 5px rgba(0, 0, 0, 0.15))',
                                zIndex: 12
                            }}>
                                {/* Stylette metallic drawing */}
                                <svg width="22" height="60" viewBox="0 0 22 60">
                                    <defs>
                                        <linearGradient id="metalShaft" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#1e293b" />
                                            <stop offset="35%" stopColor="#475569" />
                                            <stop offset="70%" stopColor="#94a3b8" />
                                            <stop offset="100%" stopColor="#0f172a" />
                                        </linearGradient>
                                        <linearGradient id="silverTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#94a3b8" />
                                            <stop offset="50%" stopColor="#f1f5f9" />
                                            <stop offset="100%" stopColor="#475569" />
                                        </linearGradient>
                                        <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#2563eb" />
                                            <stop offset="50%" stopColor="#60a5fa" />
                                            <stop offset="100%" stopColor="#1d4ed8" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Carbon main shaft */}
                                    <rect x="7" y="0" width="8" height="42" fill="url(#metalShaft)" rx="1.5" />
                                    
                                    {/* Glowing Blue accent LED ring */}
                                    <rect x="6.5" y="10" width="9" height="3" fill="url(#blueGlow)" />
                                    
                                    {/* Silver Chrome grip transition */}
                                    <rect x="7" y="42" width="8" height="3" fill="url(#silverTrim)" />
                                    
                                    {/* Silver point cone tip */}
                                    <path d="M 7,45 L 11,57 L 15,45 Z" fill="url(#silverTrim)" />
                                    
                                    {/* Dark stylus absolute active ink tip contact */}
                                    <circle cx="11" cy="57" r="1.5" fill="#0f172a" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Glowing bottom badge: Cryptographic audit tag */}
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '40px',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 700,
                boxShadow: 'var(--shadow-lg)',
                transform: step === 'completed' ? 'scale(1.05)' : 'scale(1)',
                opacity: step === 'completed' ? 1 : 0.8,
                transition: 'all 0.5s ease',
                zIndex: 3
            }}>
                <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Shield size={10} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#ecfdf5' }}>SHA-256 SECURED</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.55rem', fontFamily: 'monospace' }}>
                        {step === 'completed' ? '8f2b7a9c...1d5e' : 'CRYPTOGRAPHIC LOCK'}
                    </span>
                </div>
            </div>

            {/* Float visual card 2: Recent Signature Activity */}
            <div style={{
                position: 'absolute',
                top: '-25px',
                left: '-40px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '16px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: 'var(--shadow-md)',
                transform: step === 'completed' ? 'translateY(-3px)' : 'translateY(0)',
                opacity: step === 'waiting' ? 0.3 : 1,
                transition: 'all 0.5s ease',
                zIndex: 3
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f0fdf4',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                }}>
                    SC
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e293b' }}>Sarah Connor</span>
                    <span style={{ fontSize: '0.6rem', color: '#64748b' }}>
                        {step === 'signing' ? 'Viewing document...' : 'Completed signature'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnimatedSignatureHero;
