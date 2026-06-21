import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Button = React.memo(({ children, onClick, className = '', isMagnetic = true }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        if (!isMagnetic) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 }); // Attraction strength
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            ref={ref}
            className={`magnetic-button ${className}`}
            animate={isMagnetic ? { x, y } : {}}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={onClick}
            style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '1rem 2rem',
                borderRadius: '50px',
                border: 'none',
                background: 'var(--color-blue)',
                color: '#111',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}
        >
            <span style={{ position: 'relative', zIndex: 10 }}>{children}</span>
            {isMagnetic && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                    animate={{
                        x: x * 2, // Move glow more than button
                        y: y * 2,
                    }}
                />
            )}
        </motion.button>
    );
});

export default Button;
