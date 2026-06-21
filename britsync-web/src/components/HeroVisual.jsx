import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './HeroVisual.css';

const LOG_MESSAGES = [
    "AI_DEPLOY: SUCCESS",
    "SYS_SYNC: 100% OK",
    "DB_TUNNEL: ENCRYPTED",
    "WORKFLOW: INGRESS_READY",
    "API_ROUTER: ONLINE"
];

const HeroVisual = () => {
    const [cpuUsage, setCpuUsage] = useState(24);
    const [recentLog, setRecentLog] = useState(LOG_MESSAGES[0]);

    // Animate stats values subtly over time
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage(prev => {
                const delta = Math.floor(Math.random() * 7) - 3; // -3% to +3%
                return Math.max(12, Math.min(prev + delta, 45));
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    // Animate logs over time
    useEffect(() => {
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % LOG_MESSAGES.length;
            setRecentLog(LOG_MESSAGES[idx]);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hero-visual-container">
            {/* SVG Connecting Net Lines with Running Dash Glows */}
            <svg className="hud-network-lines" viewBox="0 0 400 400">
                <path d="M70,80 L200,200 L320,120" fill="none" stroke="rgba(0, 191, 255, 0.15)" strokeWidth="1.5" />
                <path d="M70,300 L200,200 L320,280" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1.5" />
                
                {/* Running dash overlays */}
                <path className="dash-flow glow-cyan" d="M70,80 L200,200 L320,120" fill="none" stroke="#00bfff" strokeWidth="1.5" />
                <path className="dash-flow glow-purple" d="M320,280 L200,200 L70,300" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
            </svg>

            {/* Central Glowing Power Core */}
            <div className="hud-central-core">
                <div className="core-inner-glow" />
                <div className="core-orbiting-ring ring-1" />
                <div className="core-orbiting-ring ring-2" />
                <div className="core-symbol">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="10" fill="#00bfff" />
                    </svg>
                </div>
            </div>

            {/* Glass Card 1: AI Automation Pipeline */}
            <motion.div 
                className="hud-panel glass panel-top-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <div className="panel-hdr">
                    <span className="dot active-green" />
                    <span className="monospace">AI_PIPELINE</span>
                </div>
                <div className="panel-body">
                    <div className="metric-label monospace">NODE_AGENTS: ACTIVE</div>
                    <div className="pipeline-graph">
                        <div className="pipeline-bar active" style={{ height: '60%' }} />
                        <div className="pipeline-bar active" style={{ height: '80%' }} />
                        <div className="pipeline-bar active" style={{ height: '45%' }} />
                        <div className="pipeline-bar active" style={{ height: '90%' }} />
                        <div className="pipeline-bar active" style={{ height: '70%' }} />
                    </div>
                </div>
            </motion.div>

            {/* Glass Card 2: Cloud Infrastructure Status */}
            <motion.div 
                className="hud-panel glass panel-top-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
            >
                <div className="panel-hdr">
                    <span className="dot active-blue" />
                    <span className="monospace">INFRA_CORE</span>
                </div>
                <div className="panel-body">
                    <div className="flex-row">
                        <span className="monospace text-muted">CPU:</span>
                        <span className="monospace text-cyan bold">{cpuUsage}%</span>
                    </div>
                    <div className="flex-row">
                        <span className="monospace text-muted">MEM:</span>
                        <span className="monospace text-white bold">1.4 / 4.0 GB</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${(cpuUsage / 100) * 100}%` }} />
                    </div>
                </div>
            </motion.div>

            {/* Glass Card 3: Automation Log terminal */}
            <motion.div 
                className="hud-panel glass panel-bottom-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
            >
                <div className="panel-hdr">
                    <span className="dot active-purple" />
                    <span className="monospace">AUTO_ENG_SYS</span>
                </div>
                <div className="panel-body monospace">
                    <div className="text-purple bold font-xs">&gt; CONNECTED</div>
                    <div className="text-white font-xs terminal-log">
                        {recentLog}
                    </div>
                </div>
            </motion.div>

            {/* Glass Card 4: Micro Metrics summary */}
            <motion.div 
                className="hud-panel glass panel-bottom-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
            >
                <div className="panel-hdr">
                    <span className="dot active-cyan" />
                    <span className="monospace">DEPLOY_LNK</span>
                </div>
                <div className="panel-body flex-column-center">
                    <span className="monospace font-xs">STATUS:</span>
                    <span className="monospace text-green bold pulsing-text">SYNC COMPLETE</span>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroVisual;
