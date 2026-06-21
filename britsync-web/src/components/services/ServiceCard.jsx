import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, index, onClick }) => {
    return (
        <motion.div
            layoutId={`service-${service.id}`}
            className="service-card"
            onClick={() => onClick(service)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <div className="card-accent" />
            <div className="card-inner">
                <div className="service-icon-wrapper">
                    <span className="service-icon">{service.icon}</span>
                </div>
                <div className="card-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                </div>
                <div className="card-footer">
                    <span className="learn-more">Learn More</span>
                    <div className="card-arrow">→</div>
                </div>
            </div>
            <div className="card-glow" />
        </motion.div>
    );
};

export default ServiceCard;
