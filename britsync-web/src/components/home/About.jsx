import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import SplitText from '../ui/SplitText';
import './About.css';

const About = ({ data, phases }) => {
    const timelineRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end end"]
    });
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Fallback if data is not provided
    const mission = data || {
        title: "About Us",
        description: "We are a team of visionary creators, developers, and strategists. We don't just build websites; we build digital legacies.",
        stats: [
            { label: 'Years Experience', value: '10+' },
            { label: 'Projects Delivered', value: '200+' },
            { label: 'Awards Won', value: '15' },
            { label: 'Client Satisfaction', value: '99%' },
        ]
    };

    const timelinePhases = (phases?.items || []).length > 0 ? phases.items : [
        { phaseNumber: 1, title: 'Discovery', description: 'Understanding your goals.' },
        { phaseNumber: 2, title: 'Strategy', description: 'Roadmap and visual identity.' },
        { phaseNumber: 3, title: 'Execution', description: 'Building the solution.' }
    ];

    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <div className="about-content">
                    <SplitText text={mission.title} className="section-title" />
                    <motion.p
                        className="section-desc"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.005
                                }
                            }
                        }}
                    >
                        {(mission.description || (mission.paragraphs ? mission.paragraphs.join(' ') : '')).split("").map((char, i) => (
                            <motion.span
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 5 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.p>

                    <div className="stats-grid">
                        {(mission.stats || []).map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    y: -4,
                                    borderColor: 'rgba(0, 191, 255, 0.4)'
                                }}
                            >
                                <h3 className="stat-value text-gradient">{stat.value}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="timeline" ref={timelineRef}>
                        <motion.div
                            className="timeline-line-animated"
                            style={{ scaleY, originY: 0 }}
                        />
                        <div className="timeline-line" style={{ opacity: 0.1 }} />
                        {timelinePhases.map((phase, i) => (
                            <motion.div
                                key={phase._id || i}
                                className="timeline-item"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="timeline-dot" />
                                <div className="timeline-content">
                                    <h4>Phase {phase.phaseNumber}: {phase.title}</h4>
                                    <p>{phase.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

