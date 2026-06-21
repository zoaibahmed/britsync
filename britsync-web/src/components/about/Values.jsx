import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Shield, Globe, Smile, Laugh, Target, Crosshair, CheckCircle, ThumbsUp, Cpu } from 'lucide-react';
import SplitText from '../ui/SplitText';
import './Values.css';

const Values = ({ data }) => {
    const section = data || {
        title: "CORE DIRECTIVES",
        items: [
            { icon: 'Zap', title: "Neural Precision", desc: "Advanced predictive algorithms and high-fidelity execution in every line of code." },
            { icon: 'Cpu', title: "Tech Supremacy", desc: "Harnessing the bleeding edge of cybernetic architecture and AI-driven solutions." },
            { icon: 'Shield', title: "Ghost Protocol", desc: "Impenetrable security layers and resilient systems built for the digital underground." },
            { icon: 'Globe', title: "Global Nexus", desc: "Constructing seamless interconnected multi-layered digital legacies." },
        ]
    };

    const getIcon = (name) => {
        switch (name) {
            case 'Heart': return <Heart size={32} />;
            case 'Zap': return <Zap size={32} />;
            case 'Cpu': return <Cpu size={32} />;
            case 'Shield': return <Shield size={32} />;
            case 'Globe': return <Globe size={32} />;
            case 'Smile': return <Smile size={32} />;
            case 'Laugh': return <Laugh size={32} />;
            case 'Target': return <Target size={32} />;
            case 'Crosshair': return <Crosshair size={32} />;
            case 'CheckCircle': return <CheckCircle size={32} />;
            case 'ThumbsUp': return <ThumbsUp size={32} />;
            default: return <Heart size={32} />;
        }
    };

    return (
        <section className="values-section">
            <div className="values-container">
                <SplitText text={section.title} className="section-title" style={{ justifyContent: 'center' }} />

                <div className="values-grid-centered">
                    {section.items.map((v, idx) => (
                        <motion.div
                            key={v.title}
                            className="value-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: idx * 0.1,
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            whileHover={{
                                y: -15,
                                rotateX: 10,
                                rotateY: -10,
                                z: 50
                            }}
                            viewport={{ once: true }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="value-card-inner" style={{ transform: 'translateZ(30px)' }}>
                                <div className="value-icon">{getIcon(v.icon)}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Values;
