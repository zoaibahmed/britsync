import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import HomeHero from '../components/HomeHero';
import Ticker from '../components/ui/Ticker';
import PageTransition from '../components/layout/PageTransition';
import TextReveal from '../components/ui/TextReveal';
import Button from '../components/ui/Button';
import ParallaxImage from '../components/ui/ParallaxImage';
import TrustSection from '../components/TrustSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import SplitText from '../components/ui/SplitText';
import { useProjects } from '../hooks/useProjects';
import { useHomeData } from '../hooks/useHomeData';
import DynamicSections from '../components/home/DynamicSections';
import InitiativesSection from '../components/home/InitiativesSection';
import './Home.css';



const Home = () => {
    const navigate = useNavigate();
    const { projects } = useProjects();
    const { homeData } = useHomeData();
    const { hero, whyChooseUs, trust } = homeData;

    return (
        <PageTransition>
            <HomeHero />



            {/* Initiatives & Project Section */}
            <InitiativesSection projects={projects} />

            <div className="glow-divider" />
            <WhyChooseUs data={whyChooseUs} />
            <div className="glow-divider" />
            <TrustSection data={trust} />
            <DynamicSections />
            <div className="glow-divider" />

            {/* Final Contact CTA */}
            <section className="final-cta-section">
                <div className="cta-background-glow" />
                <div className="container">
                    <motion.div
                        className="cta-card glass"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    >
                        <div className="cta-content">
                            <h2 className="cta-headline">Ready to build your <br /><span className="text-gradient">digital legacy?</span></h2>
                            <p className="cta-subtext">Let's collaborate to create something exceptional that defines the future of your brand.</p>
                            <Link to="/contact">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button className="btn-premium">Start Your Project</Button>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    );
};

export default Home;
