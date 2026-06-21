import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import SplitText from '../components/ui/SplitText';
import ServiceDetailModal from '../components/services/ServiceDetailModal';
import { ArrowRight, Code, Zap, Palette, Monitor, Share2, Search, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiCall } from '../utils/api';
import './ServicesPage.css';

import Process from '../components/services/Process';
import Ticker from '../components/ui/Ticker';
import FAQs from '../components/services/FAQ';
import NeuralConnect from '../components/ui/NeuralConnect';
import { useServicesPageData } from '../hooks/useServicesPageData';
import { useHomeData } from '../hooks/useHomeData';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const ExpertiseItem = React.memo(({ item, idx }) => {
    return (
        <motion.div
            className="expertise-item glass"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.8,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{
                y: -15,
                transition: { duration: 0.4, ease: "easeOut" }
            }}
        >
            <div className="card-grid-overlay" />
            <div className="card-scanline" />
            <div className="card-tech-detail" />
            <div className="card-ambient-glow" />
            <div className="item-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description || item.desc}</p>
            <div className="card-hover-glow" />
            <div className="card-border-trace" />
        </motion.div>
    );
});

const iconMap = {
    'Code': <Code size={40} />,
    'Zap': <Zap size={40} />,
    'Palette': <Palette size={40} />,
    'Search': <Search size={30} />,
    'Database': <Database size={30} />,
    'Share2': <Share2 size={30} />,
    'Monitor': <Monitor size={30} />
};

const getIcon = (name, type) => {
    if (iconMap[name]) return iconMap[name];
    return type === 'main' ? <Code size={40} /> : <Search size={30} />;
};

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        mq.addEventListener('change', (e) => setIsMobile(e.matches));
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', (e) => setIsMobile(e.matches));
    }, []);

    return isMobile;
};

const ServicesContent = () => {
    const navigate = useNavigate();
    const { servicesPageData } = useServicesPageData();
    const { homeData } = useHomeData();
    const { expertise } = homeData || {};
    
    const expertiseItems = useMemo(() => expertise?.items || [
        { title: 'Development', icon: '⚡', desc: 'Crafting high-speed, scalable digital products that define your brand voice.' },
        { title: 'Design', icon: '🎨', desc: 'Immersive interfaces that tell your story through movement and color.' },
        { title: 'Marketing', icon: '📈', desc: 'Data-driven growth strategies that ensure you lead the market.' }
    ], [expertise]);

    const [selectedService, setSelectedService] = useState(null);

    const [mainServices, setMainServices] = useState([]);
    const [otherServices, setOtherServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [secondaryIndex, setSecondaryIndex] = useState(0);
    const isMobile = useIsMobile();
    const shouldReduceMotion = useReducedMotion();

    // Body scroll lock for modal
    useEffect(() => {
        if (selectedService) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'; // Prevent layout shift
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [selectedService]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await apiCall('services');

                if (!Array.isArray(data)) {
                    console.error("API did not return an array", data);
                    setMainServices([]);
                    setOtherServices([]);
                    return;
                }

                // transform data to match component expectations
                const rawData = Array.isArray(data) ? data : [];

                const main = rawData.filter(s => s && s.type === 'main')
                    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
                    .map(s => ({
                        ...s,
                        id: s?._id || Math.random().toString(),
                        desc: s?.description || '',
                        filter: s?.filter_slug || '',
                        icon: getIcon(s?.icon, 'main'),
                        title: s?.title || 'Service'
                    }));

                const others = rawData.filter(s => s && s.type === 'secondary')
                    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
                    .map(s => ({
                        ...s,
                        id: s?._id || Math.random().toString(),
                        icon: getIcon(s?.icon, 'secondary'),
                        title: s?.title || 'Service'
                    }));

                setMainServices(main);
                setOtherServices(others);
            } catch (err) {
                console.error("Fetch services error:", err);
                // Fallback to empty to prevent crash, maybe set error state
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Strict ordering for main services
    const orderedMainServices = useMemo(() => {
        try {
            const priority = ['Web Excellence', 'Mobile Automation', 'Automation Alpha'];
            const first = [];
            const rest = Array.isArray(mainServices) ? [...mainServices] : [];

            priority.forEach(title => {
                const idx = rest.findIndex(s =>
                    s && s.title && typeof s.title === 'string' &&
                    s.title.toLowerCase() === (title || '').toLowerCase()
                );
                if (idx !== -1) {
                    first.push(rest.splice(idx, 1)[0]);
                }
            });

            return [...first, ...rest].filter(s => s && s.id);
        } catch (e) {
            console.error("Memo error:", e);
            return Array.isArray(mainServices) ? mainServices : [];
        }
    }, [mainServices]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="loader"></div>
        </div>
    );

    // Defensive fallback for local storage data
    const safePageData = servicesPageData || {};
    const safeProcess = safePageData.process || { title: "How We Deliver", steps: [] };
    const safeTicker = safePageData.ticker || ["Quality", "Precision", "Impact", "Innovation"];
    const safeFAQs = safePageData.faqs || { title: "FAQs", items: [] };

    // Safe calculations
    const cardsPerPage = isMobile ? 1 : 3;
    const totalPages = Math.max(1, Math.ceil((orderedMainServices?.length || 0) / cardsPerPage));

    const nextSlide = () => {
        if (totalPages > 1) {
            setCurrentIndex((prev) => (prev + 1) % totalPages);
        }
    };

    const prevSlide = () => {
        if (totalPages > 1) {
            setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
        }
    };

    // Top Services Carousel Logic (Desktop: Slide by sets of 3)
    const secondaryTotalPages = Math.max(1, Math.ceil((otherServices?.length || 0) / 3));

    const nextSecondary = () => {
        if (secondaryIndex + 3 < otherServices.length) {
            setSecondaryIndex(prev => prev + 3);
        }
    };

    const prevSecondary = () => {
        if (secondaryIndex > 0) {
            setSecondaryIndex(prev => Math.max(0, prev - 3));
        }
    };


    return (
        <PageTransition>
            <div className="services-page-container" style={{ paddingTop: '100px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
                <NeuralConnect />
                <div className="container" style={{ paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>

                    {/* Transferred Digital Mastery Section - MOVED TO ABSOLUTE TOP */}
                    <section className="home-services-overhaul" style={{ paddingTop: '2rem' }}>
                        <div className="glow-bg" />
                        <div className="container">
                            <motion.div
                                className="services-header-v4"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "0px 0px -150px 0px" }}
                            >
                                <h2 className="title-tag" style={{ color: "var(--color-blue)", fontWeight: 800, letterSpacing: '0.2em' }}>{expertise?.title || "OUR EXPERTISE"}</h2>
                                <SplitText text={expertise?.mainTitle || "Digital Mastery"} className="text-gradient large-title" style={{ justifyContent: 'center', fontSize: '4rem', fontWeight: 900 }} />
                                <p className="subtitle-v4">{expertise?.subtitle || "Innovative solutions tailored for the next generation of digital leaders."}</p>
                            </motion.div>

                            <div className="expertise-mini-grid" style={{ marginBottom: '5rem' }}>
                                {expertiseItems.map((item, idx) => (
                                    <ExpertiseItem key={item.id || idx} item={item} idx={idx} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Hero Heading Section - NOW BELOW MASTERY */}
                    <motion.div
                        className="services-hero"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h1
                            className="section-title text-gradient"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: isMobile ? '3.2rem' : '3.5rem',
                                marginBottom: '1rem'
                            }}
                        >
                            {safePageData?.header?.title || "Our Capabilities"}
                        </h1>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                            {safePageData?.header?.description || "We tackle complex challenges with a blend of creative vision and technical precision."}
                        </p>
                    </motion.div>

                    {/* Primary Services Section - Carousel */}
                    <div className="primary-carousel-wrapper" style={{ marginBottom: '8rem' }}>
                        {!isMobile && totalPages > 1 && currentIndex > 0 && (
                            <button className="carousel-arrow left" onClick={prevSlide} aria-label="Previous">
                                <ChevronLeft size={30} />
                            </button>
                        )}

                        <div className="primary-carousel-viewport">
                            <motion.div
                                className={`primary-carousel-track ${isMobile ? 'mobile-vertical-stack' : ''}`}
                                animate={isMobile ? { x: 0 } : { x: `-${currentIndex * 100}%` }}
                                transition={{
                                    duration: shouldReduceMotion ? 0 : 0.6,
                                    ease: "easeInOut"
                                }}
                            >
                                {orderedMainServices.map((service, idx) => {
                                    if (!service) return null;
                                    return (
                                        <div key={service.id || idx} className="carousel-item">
                                            <motion.div
                                                className="main-service-card premium-card"
                                                initial={{ opacity: 0, y: 50 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: { delay: (idx % cardsPerPage) * 0.1, type: "spring", stiffness: 100, damping: 20 }
                                                }}
                                                animate={{
                                                    y: [0, -6, 0] // Subtle enterprise float
                                                }}
                                                transition={{
                                                    animate: {
                                                        duration: 8,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: idx * 0.5
                                                    }
                                                }}
                                                viewport={{ once: true }}
                                                whileHover={{
                                                    y: -12, // Professional lift
                                                    scale: 1.01,
                                                    transition: { duration: 0.4, ease: "easeOut" }
                                                }}
                                                style={{ transformStyle: 'preserve-3d' }}
                                            >
                                                {/* Technical Overlays */}
                                                <div className="card-border-trace" />
                                                <div className="card-scanline" />
                                                <div className="card-tech-detail" />

                                                <div className="card-inner" style={{ transition: 'transform 0.4s ease-out' }}>
                                                    <div className="icon-wrapper-v2" style={{ transform: 'translateZ(60px)' }}>
                                                        {service.icon}
                                                    </div>
                                                    <h3 style={{ transform: 'translateZ(45px)' }}>{service.title || 'Service'}</h3>
                                                    <p style={{ transform: 'translateZ(30px)' }}>{service.desc || service.description || ''}</p>
                                                    <div className="card-footer-v2" style={{ transform: 'translateZ(50px)' }}>
                                                        <span className="view-label" onClick={() => navigate('/contact')}>Get Started</span>
                                                        <div className="arrow-circle-v2" onClick={() => navigate('/contact')}>
                                                            <ArrowRight size={22} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {!isMobile && totalPages > 1 && currentIndex < totalPages - 1 && (
                            <button className="carousel-arrow right" onClick={nextSlide} aria-label="Next">
                                <ChevronRight size={30} />
                            </button>
                        )}
                    </div>

                    <div className="glow-divider" style={{ margin: '4rem 0' }} />

                    {/* Top Services (Secondary) - Horizontal Slider on Desktop, Vertical Stack on Mobile */}
                    {Array.isArray(otherServices) && otherServices.length > 0 && (
                        <div className="top-services-section">
                            <h2 className="section-title text-gradient" style={{ textAlign: 'center', margin: '4rem 0 2rem', fontSize: isMobile ? '3.2rem' : '3rem' }}>
                                Top Services
                            </h2>

                            <div className={`secondary-carousel-wrapper ${isMobile ? 'mobile-stack' : 'desktop-slider'}`}>

                                {/* Left Shadow Indicator for Desktop */}
                                {!isMobile && secondaryIndex > 0 && <div className="slider-shadow-left" style={{ pointerEvents: 'none' }} />}

                                {!isMobile && secondaryIndex > 0 && (
                                    <button
                                        className="carousel-arrow left secondary-arrow"
                                        onClick={prevSecondary}
                                        aria-label="Previous"
                                        style={{ zIndex: 10 }}
                                    >
                                        <ChevronLeft size={32} />
                                    </button>
                                )}

                                <div className="secondary-carousel-viewport">
                                    <motion.div
                                        className="secondary-carousel-track"
                                        animate={isMobile ? {} : { x: `-${(secondaryIndex * (100 / 3)).toFixed(2)}%` }}
                                        transition={{
                                            duration: shouldReduceMotion ? 0 : 0.5,
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                        style={!isMobile ? { width: '100%', display: 'flex' } : { transform: 'none' }}
                                    >
                                        {otherServices.map((service, idx) => {
                                            if (!service) return null;
                                            return (
                                                <div
                                                    key={service.id || idx}
                                                    className="carousel-item-secondary"
                                                >
                                                    <motion.div
                                                        className="other-service-card-v2"
                                                        initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                                                        whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        animate={{
                                                            y: [0, -4, 0] // Even subtler for secondary
                                                        }}
                                                        transition={{
                                                            delay: idx * 0.05,
                                                            animate: {
                                                                duration: 6,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: idx * 0.3
                                                            }
                                                        }}
                                                        onClick={() => setSelectedService(service)}
                                                        whileHover={isMobile ? {} : {
                                                            y: -8,
                                                            scale: 1.01,
                                                            transition: { duration: 0.4 }
                                                        }}
                                                        style={{
                                                            padding: '2.5rem 2rem', // Refreshing padding
                                                            zIndex: idx + 1,
                                                            transformStyle: 'preserve-3d',
                                                            transform: isMobile ? 'none' : undefined
                                                        }}
                                                    >
                                                        <div className="card-inner" style={{ transform: 'translateZ(25px)' }}>
                                                            <div className="icon-wrapper-v2 secondary-icon">
                                                                {service.icon}
                                                            </div>
                                                            <h4>{service.title || 'Service'}</h4>
                                                            <p>{service.description || "Comprehensive solutions tailored to your business goals."}</p>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                </div>

                                {!isMobile && (
                                    <button
                                        className="carousel-arrow right secondary-arrow"
                                        onClick={nextSecondary}
                                        aria-label="Next"
                                        style={{
                                            visibility: secondaryIndex + 3 < otherServices.length ? 'visible' : 'hidden',
                                            zIndex: 10
                                        }}
                                    >
                                        <ChevronRight size={32} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Sections */}
                <div style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
                    <div className="glow-divider" />
                    <Process data={safeProcess} />
                    <div className="glow-divider" />
                    <Ticker items={safeTicker} speed={40} direction="right" />
                    <div className="glow-divider" />
                    <FAQs data={safeFAQs} />
                    <div className="glow-divider" />
                </div>
            </div>

            <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />
        </PageTransition>
    );
};

const Services = () => {
    return (
        <ErrorBoundary>
            <ServicesContent />
        </ErrorBoundary>
    );
};

export default Services;
