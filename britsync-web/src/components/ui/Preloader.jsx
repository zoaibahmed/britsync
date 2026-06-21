import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const LOG_MESSAGES = [
    { threshold: 0, text: "SYSTEM SETUP: INITIALIZING BRITSCORE CORE..." },
    { threshold: 12, text: "CONNECTING TO BRITSCORE DISTRIBUTED LEDGER..." },
    { threshold: 25, text: "DECRYPTING ASSETS AND LOCAL STORAGE ENGINES..." },
    { threshold: 40, text: "SECURE SOCKET ESTABLISHED ON PORT 5003..." },
    { threshold: 55, text: "LOADING INTERACTIVE CANVASES & SHADERS..." },
    { threshold: 70, text: "SYNCHRONIZING DOCUMENT EDITOR PIPELINES..." },
    { threshold: 85, text: "VERIFYING CRYPTOGRAPHIC SHA-256 CHECKSUMS..." },
    { threshold: 95, text: "ALL STATIONS SYNCHRONIZED AND SECURE." },
    { threshold: 100, text: "INITIALIZATION COMPLETED. READY FOR INGRESS." }
];

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Detect theme
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Progress ticking
        let currentProgress = 0;
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 4) + 1; // 1 to 4% increment
            currentProgress = Math.min(currentProgress + increment, 100);
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsLoading(false);
                }, 600); // Small pause at 100% to appreciate completion
            }
        }, 35 + Math.random() * 20); // Dynamic interval for organic feel

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    // Add logs based on current progress
    useEffect(() => {
        const activeLogs = LOG_MESSAGES.filter(log => progress >= log.threshold);
        setLogs(activeLogs.map(log => log.text));
    }, [progress]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className={`preloader-overlay ${isDark ? 'dark-theme' : 'light-theme'}`}
                    exit={{ 
                        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", 
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
                    }}
                >
                    {/* Glowing Tech Grid */}
                    <div className="grid-overlay" />
                    
                    {/* Glowing Scanner Line */}
                    <div className="scanner-line" />

                    <div className="preloader-container">
                        {/* Upper Cybernetic Ring */}
                        <div className="cyber-ring-outer">
                            <div className="cyber-ring-inner"></div>
                            <div className="cyber-dot"></div>
                        </div>

                        {/* Title & Brand */}
                        <div className="brand-header">
                            <motion.h1 
                                className="brand-title"
                                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                                transition={{ duration: 1 }}
                            >
                                BRITSYNC
                            </motion.h1>
                            <span className="brand-subtitle">SECURE DOCUMENT CORE</span>
                        </div>

                        {/* Big Counter */}
                        <div className="progress-counter-container">
                            <motion.span 
                                className="progress-percentage monospace"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {progress}<span className="percent-sign">%</span>
                            </motion.span>
                        </div>

                        {/* Dynamic Tech Progress Bar */}
                        <div className="tech-progress-wrapper">
                            <div className="tech-progress-bar">
                                <div 
                                    className="tech-progress-fill" 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="progress-meta monospace">
                                <span>STATUS: {progress === 100 ? 'READY' : 'BOOTING_'}</span>
                                <span>SYS_LNK_01</span>
                            </div>
                        </div>

                        {/* Scrolling Console/Logs */}
                        <div className="tech-console">
                            <div className="console-header monospace">
                                <span className="console-dot blink"></span>
                                <span>BRITSCORE v2.10.4 // LOG CONSOLE</span>
                            </div>
                            <div className="console-body monospace">
                                <AnimatePresence initial={false}>
                                    {logs.slice(-3).map((log, idx) => (
                                        <motion.div
                                            key={log}
                                            className={`console-line ${idx === Math.min(2, logs.length - 1) ? 'line-active' : 'line-dim'}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <span className="console-prompt">&gt;</span> {log}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
