import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxImage = ({ src, alt, className = '', height = '300px' }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                height,
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '20px' // Default radius
            }}
        >
            <motion.div style={{ y, height: '140%', width: '100%', position: 'absolute', top: '-20%' }}>
                <img
                    src={src}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </motion.div>
        </div>
    );
};

export default ParallaxImage;
