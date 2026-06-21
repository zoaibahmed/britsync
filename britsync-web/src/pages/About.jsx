import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AboutComponent from '../components/home/About';
import Values from '../components/about/Values';
import TechStack from '../components/about/TechStack';
import PageTransition from '../components/layout/PageTransition';
import SplitText from '../components/ui/SplitText';
import TeamMemberCard from '../components/home/TeamMemberCard';
import TeamMemberPanel from '../components/home/TeamMemberPanel';
import NeuralConnect from '../components/ui/NeuralConnect';
import { useAboutData } from '../hooks/useAboutData';
import { Box, Code, Cpu, Database, Layers, Monitor, Share2, Shield, Terminal } from 'lucide-react';
import './AboutPage.css'; // Refresh trigger

// About Page Main Component
const getPanelDirection = (index, total) => {
    const cardsPerRow = 4;
    const rowIndex = Math.floor(index / cardsPerRow);
    const colIndex = index % cardsPerRow;
    const startOfRow = rowIndex * cardsPerRow;
    const endOfRow = Math.min(startOfRow + cardsPerRow, total);
    const cardsInRow = endOfRow - startOfRow;
    // For any row, left 2 cards pop from right, right 2 from left
    if (cardsInRow === 1) return 'center';
    if (cardsInRow === 2) return 'center';
    if (cardsInRow === 3) return colIndex < 2 ? 'right' : 'left';
    // Full row (4): left 2 from right, right 2 from left
    if (colIndex < 2) return 'right';
    return 'left';
};

const About = () => {
    const { aboutData } = useAboutData();
    const [selectedMember, setSelectedMember] = useState(null);
    const [panelPosition, setPanelPosition] = useState('left');

    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    const handleCardClick = (member, index) => {
        const direction = getPanelDirection(index, aboutData.team.members.length);
        setPanelPosition(direction);
        setSelectedMember({ ...member, _index: index });
    };

    const handleClosePanel = () => {
        setSelectedMember(null);
    };

    // New grid logic: 5 per row, center last row if incomplete, no placeholders
    const cardsPerRow = 5;
    const members = aboutData.team.members;
    const isLastRowIncomplete = members.length % cardsPerRow !== 0;

    return (
        <PageTransition>
            <div style={{ paddingTop: '80px', position: 'relative', overflow: 'hidden', background: 'var(--bg-site)' }}>
                <NeuralConnect />

                {/* Floating Parallax Icons */}
                <div className="parallax-overlay">
                    <motion.div style={{ y: y1, rotate }} className="parallax-icon p-1"><Cpu size={80} /></motion.div>
                    <motion.div style={{ y: y2 }} className="parallax-icon p-2"><Terminal size={64} /></motion.div>
                    <motion.div style={{ y: y1 }} className="parallax-icon p-3"><Database size={96} /></motion.div>
                    <motion.div style={{ y: y2, rotate: -rotate }} className="parallax-icon p-4"><Layers size={72} /></motion.div>
                    <motion.div style={{ y: y1 }} className="parallax-icon p-5"><Monitor size={88} /></motion.div>
                </div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative-content">
                    <AboutComponent data={aboutData.mission} phases={aboutData.phases} />
                </motion.div>
                <div className="glow-divider" />
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative-content">
                    <Values data={aboutData.values} />
                </motion.div>
                <div className="glow-divider" />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative-content">
                    <TechStack />
                </motion.div>

                <div className="glow-divider" />

                <section className="team-section">
                    <div className="team-container">
                        <SplitText text={aboutData.team.title} className="section-title" />
                        <div className="team-grid-premium">
                            {members.map((member, i) => (
                                <TeamMemberCard
                                    key={member.id}
                                    member={member}
                                    index={i}
                                    onClick={() => handleCardClick(member, i)}
                                    isBlurred={selectedMember !== null && selectedMember._index !== i}
                                    isActive={selectedMember && selectedMember._index === i}
                                    position={getPanelDirection(i, members.length)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                <div className="glow-divider" />

                <AnimatePresence>
                    {selectedMember && (
                        <div className="popup-overlay" onClick={handleClosePanel}>
                            <TeamMemberPanel
                                member={selectedMember}
                                onClose={handleClosePanel}
                                position={panelPosition}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default About;
