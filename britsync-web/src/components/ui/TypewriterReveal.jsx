import React from 'react';
import { motion } from 'framer-motion';

const TypewriterReveal = ({ text, className = '', delay = 0, align = 'center' }) => {
    // Handle manual line breaks and automatic wrapping
    const lines = text.split('\n');
    const isLeft = align === 'left';

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay
            },
        },
    };

    const child = {
        hidden: {
            opacity: 0,
            display: 'none'
        },
        visible: {
            opacity: 1,
            display: 'inline'
        },
    };

    return (
        <motion.div
            className={`typewriter-container ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: isLeft ? 'flex-start' : 'center',
                textAlign: isLeft ? 'left' : 'center'
            }}
        >
            {lines.map((line, lineIdx) => (
                <div
                    key={lineIdx}
                    className={`typewriter-line line-${lineIdx}`}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: isLeft ? 'flex-start' : 'center',
                        width: '100%'
                    }}
                >
                    {line.split(" ").map((word, wordIdx) => (
                        <span
                            key={wordIdx}
                            style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.3em' }}
                        >
                            {word.split("").map((char, charIdx) => (
                                <motion.span
                                    variants={child}
                                    key={charIdx}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    ))}
                    {lineIdx === lines.length - 1 && (
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            style={{ color: 'var(--color-blue)', marginLeft: '2px' }}
                        >
                            _
                        </motion.span>
                    )}
                </div>
            ))}
        </motion.div>
    );
};

export default TypewriterReveal;
