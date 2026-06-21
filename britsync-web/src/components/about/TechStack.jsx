import React from 'react';
import { useAboutData } from '../../hooks/useAboutData';
import './TechStack.css';

const TechStack = () => {
    const { aboutData } = useAboutData();
    const { techStack } = aboutData;
    const techs = techStack?.techs || ["React", "Next.js", "Node.js", "TypeScript", "Python", "AWS", "Framer Motion", "Three.js", "GraphQL", "Docker", "Figma", "Tailwind"];

    return (
        <section className="tech-section">
            <h2 className="section-title text-gradient" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
                {techStack?.title || "Powering the Future"}
            </h2>

            <div className="marquee-container hud-container">
                <div className="hud-corner top-left" />
                <div className="hud-corner top-right" />
                <div className="hud-corner bottom-left" />
                <div className="hud-corner bottom-right" />
                <div className="hud-scanline" />

                <div className="marquee-content">
                    {techs.map((tech, i) => (
                        <span key={i} className="tech-item tech-item-hud">{tech}</span>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {techs.map((tech, i) => (
                        <span key={`dup-${i}`} className="tech-item tech-item-hud">{tech}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
