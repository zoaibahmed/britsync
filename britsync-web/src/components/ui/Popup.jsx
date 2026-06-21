import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import Button from './Button';
import './Popup.css';

const Popup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem('hasSeenPopup');
            if (!hasSeenPopup) { // Reset logic can be added later
                setIsVisible(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
        // localStorage.setItem('hasSeenPopup', 'true'); // Uncomment for production
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="popup-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="popup-card"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    >
                        <button className="popup-close" onClick={closePopup}><X size={20} /></button>

                        <div className="popup-icon">
                            <Sparkles size={40} className="text-blue" />
                        </div>

                        <h3>Get 20% Off Your First Project</h3>
                        <p>Join the digital revolution. Limited time offer for new startups.</p>

                        <Button onClick={closePopup} className="popup-btn">Claim Offer</Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Popup;
