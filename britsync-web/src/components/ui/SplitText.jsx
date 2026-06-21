import React from 'react';
import { motion } from 'framer-motion';

const SplitText = React.memo(({ text, delay = 0, className = '', style = {} }) => {
    if (typeof text !== 'string') return null;
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.04 * i + delay },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -20,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.3em', ...style }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => (
                <span key={index} style={{ display: 'inline-block' }}>
                    {word.split('').map((char, index) => (
                        <motion.span
                            style={{ display: 'inline-block' }}
                            variants={child}
                            key={index}
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.div>
    );
});

export default SplitText;
