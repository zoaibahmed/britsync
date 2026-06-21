import React from 'react';
import { motion } from 'framer-motion';
import './Ticker.css';

const Ticker = React.memo(({ items = [], speed = 20, direction = 'left' }) => {
    // Duplicate items twice to ensure seamless infinite loop
    const safeItems = Array.isArray(items) ? items : [];
    const duplicatedItems = [...safeItems, ...safeItems, ...safeItems];

    return (
        <div className="ticker-wrapper">
            <motion.div
                className="ticker-content"
                animate={{
                    x: direction === 'left' ? [0, "-33.33%"] : ["-33.33%", 0]
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {duplicatedItems.map((item, index) => (
                    <div key={index} className="ticker-item">
                        {item}
                        <span className="ticker-dot">•</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
});

export default Ticker;
