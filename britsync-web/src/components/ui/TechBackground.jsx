import React, { useEffect, useRef, useState } from 'react';
import './TechBackground.css';

const TechBackground = () => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            setIsVisible(entries[0].isIntersecting);
        }, { threshold: 0.1 });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`tech-background ${!isVisible ? 'is-paused' : ''}`}
        >
            {/* Atmospheric Auroras */}
            <div className="aurora-layers">
                <div className="aurora aurora-1" />
                <div className="aurora aurora-2" />
            </div>

            {/* Technical Grid */}
            <div className="tech-grid" />

            {/* Neural Mesh Overlay */}
            <div className="neural-mesh" />

            {/* Bottom Fade */}
            <div className="bg-fade-bottom" />
        </div>
    );
};

export default TechBackground;
