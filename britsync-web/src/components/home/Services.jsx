import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';
import { useServicesPageData } from '../../hooks/useServicesPageData';
import ServiceCard from '../services/ServiceCard';
import ServicePopup from '../services/ServicePopup';
import SplitText from '../ui/SplitText';
import Button from '../ui/Button';
import './Services.css';

const Services = () => {
    const { services } = useServices();
    const { servicesPageData } = useServicesPageData();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const initialServices = (services || []).slice(0, 3);
    const extraServices = (services || []).slice(3);

    const handleServiceClick = (service) => {
        if (service.main) {
            // Redirect to work page with filters
            const filterStr = service.filter ? service.filter.join(',') : 'all';
            navigate(`/work?filter=${filterStr}`);
        } else {
            setSelectedService(service);
        }
    };

    return (
        <section id="services" className="services-section">
            <div className="services-container">
                <div className="services-header">
                    <SplitText text={servicesPageData.header?.title || "Our Services"} className="section-title" />
                    <p className="section-desc">
                        {servicesPageData.header?.description || "Comprehensive digital solutions designed to elevate your brand."}
                    </p>
                </div>

                <div className="services-grid-wrapper">
                    {/* Persistent initial cards */}
                    <div className="services-grid">
                        {initialServices.map((s, i) => (
                            <ServiceCard key={s.id} service={s} index={i} onClick={handleServiceClick} />
                        ))}
                    </div>

                    {/* Overlapping extra cards */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="extra-services-stack"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    hidden: { opacity: 0, height: 0 },
                                    visible: {
                                        opacity: 1,
                                        height: 'auto',
                                        transition: { staggerChildren: 0.1, duration: 0.5 }
                                    },
                                    exit: {
                                        opacity: 0,
                                        height: 0,
                                        transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.5 }
                                    }
                                }}
                            >
                                {extraServices.map((s, i) => (
                                    <motion.div
                                        key={s.id}
                                        className="stacked-card-wrapper"
                                        variants={{
                                            hidden: { y: 100, opacity: 0 },
                                            visible: { y: 0, opacity: 1 },
                                            exit: { y: 100, opacity: 0 }
                                        }}
                                        style={{
                                            zIndex: i + 1,
                                        }}
                                    >
                                        <ServiceCard
                                            service={s}
                                            index={i + 3}
                                            onClick={handleServiceClick}
                                            isStacked={true}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div layout className="expand-action">
                    <Button onClick={() => setIsExpanded(!isExpanded)} className="btn-expand">
                        {isExpanded ? "Show Less" : "View All Services"}
                    </Button>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedService && (
                    <ServicePopup service={selectedService} onClose={() => setSelectedService(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Services;
