import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Phone, DollarSign, Users, Briefcase } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './RobotAssistant.css';

// Page-specific messages
const pageMessages = {
    '/': [
        { title: "How can I help?", subtitle: "AI-powered assistance" },
        { title: "Explore our work", subtitle: "Check out our portfolio" },
        { title: "Need a quote?", subtitle: "Get instant pricing" },
        { title: "Book a free call", subtitle: "Let's discuss your project" },
        { title: "Questions?", subtitle: "I'm here 24/7" },
    ],
    '/services': [
        { title: "Need help choosing?", subtitle: "I can recommend services" },
        { title: "Web Development", subtitle: "High-performance sites" },
        { title: "AI Automation", subtitle: "Smart solutions for growth" },
        { title: "Get a quote", subtitle: "Custom pricing available" },
        { title: "Compare services", subtitle: "Find your perfect fit" },
    ],
    '/work': [
        { title: "Like what you see?", subtitle: "Let's build yours" },
        { title: "View case studies", subtitle: "See our process" },
        { title: "Similar project?", subtitle: "Let's discuss" },
        { title: "Start your project", subtitle: "Book a discovery call" },
        { title: "Questions?", subtitle: "Ask about any project" },
    ],
    '/about': [
        { title: "Meet the team", subtitle: "We're here to help" },
        { title: "Our mission", subtitle: "Excellence in digital" },
        { title: "Work with us?", subtitle: "Let's connect" },
        { title: "Have questions?", subtitle: "Ask me anything" },
        { title: "Ready to start?", subtitle: "Book a call today" },
    ],
    '/contact': [
        { title: "Let's connect!", subtitle: "I can help you faster" },
        { title: "Quick question?", subtitle: "Ask me directly" },
        { title: "Book a call", subtitle: "Schedule in seconds" },
        { title: "Get a quote", subtitle: "Instant estimates" },
        { title: "Prefer chat?", subtitle: "I'm ready to help" },
    ],
};

const quickPrompts = [
    { label: 'Explore Services', value: 'services', icon: <Briefcase size={14} /> },
    { label: 'Book a Call', value: 'call', icon: <Phone size={14} /> },
    { label: 'Pricing', value: 'pricing', icon: <DollarSign size={14} /> },
    { label: 'Talk to Human', value: 'human', icon: <Users size={14} /> },
];

// Bot API Configuration - Using n8n webhook
const BOT_API_URL = 'https://primary-production-3af69.up.railway.app/webhook/chat';

const RobotAssistant = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('hidden');
    const [showTeaser, setShowTeaser] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hey there! 👋 I\'m your Assistant from BritSync. How can I help you today? 🚀' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const sessionId = useRef(Math.random().toString(36).substring(7));
    const messagesEndRef = useRef(null);

    // Get messages for current page
    const currentPageMessages = pageMessages[location.pathname] || pageMessages['/'];
    const currentMessage = currentPageMessages[currentMessageIndex];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset message index when page changes
    useEffect(() => {
        setCurrentMessageIndex(0);
    }, [location.pathname]);

    // Entry animation sequence
    useEffect(() => {
        const enterTimer = setTimeout(() => {
            setIsVisible(true);
            setAnimationPhase('entering');
        }, 600);

        const settleTimer = setTimeout(() => {
            setAnimationPhase('settled');
        }, 1500);

        const waveTimer = setTimeout(() => {
            setAnimationPhase('waving');
        }, 1800);

        const idleTimer = setTimeout(() => {
            setAnimationPhase('idle');
        }, 3300);

        // Show first message
        const teaserShowTimer = setTimeout(() => {
            if (!hasInteracted && !isChatOpen) {
                setShowTeaser(true);
            }
        }, 2500);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(settleTimer);
            clearTimeout(waveTimer);
            clearTimeout(idleTimer);
            clearTimeout(teaserShowTimer);
        };
    }, [hasInteracted, isChatOpen]);

    // Rotating messages every 4 seconds
    useEffect(() => {
        if (hasInteracted || isChatOpen || !showTeaser) return;

        const messageInterval = setInterval(() => {
            setCurrentMessageIndex(prev => {
                const next = prev + 1;
                return next >= currentPageMessages.length ? 0 : next;
            });
        }, 4000);

        return () => clearInterval(messageInterval);
    }, [hasInteracted, isChatOpen, showTeaser, currentPageMessages.length]);

    // Pulse glow every 12 seconds
    useEffect(() => {
        if (hasInteracted || isChatOpen) return;

        const pulseInterval = setInterval(() => {
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 2000);
        }, 12000);

        return () => clearInterval(pulseInterval);
    }, [hasInteracted, isChatOpen]);

    const handleRobotClick = () => {
        setHasInteracted(true);
        setShowTeaser(false);
        setIsChatOpen(true);
    };

    const handleTeaserAction = (action) => {
        setHasInteracted(true);
        setShowTeaser(false);
        setIsChatOpen(true);

        setTimeout(() => {
            handleQuickPrompt({ label: action, value: action.toLowerCase().replace(/\s/g, '') });
        }, 300);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    // Fallback simulated responses when webhook fails
    const getSimulatedResponse = (userMessage) => {
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('pricing')) {
            return "Our pricing is tailored to each project's scope. For a custom quote, please share your requirements or book a free discovery call! 💰";
        } else if (lowerMsg.includes('service') || lowerMsg.includes('what do you') || lowerMsg.includes('explore')) {
            return "We offer Web Development, AI Automation, Mobile Apps, and Digital Marketing. Each solution is crafted for maximum impact! 🚀";
        } else if (lowerMsg.includes('contact') || lowerMsg.includes('call') || lowerMsg.includes('meet') || lowerMsg.includes('book')) {
            return "Great! You can book a discovery call through our Contact page, or I can help schedule one for you right here! 📞";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            return "Hello! 👋 Great to meet you! I'm your AI assistant. How can I help you today?";
        } else if (lowerMsg.includes('human') || lowerMsg.includes('talk to')) {
            return "Of course! 🙋‍♂️ Please share your name and email, and our team will reach out within 2-4 hours!";
        }
        return "Thanks for your message! Our team will get back to you shortly. Is there anything specific you'd like to know about our services? 🚀";
    };

    // Send message to N8N webhook and get AI response
    const sendToWebhook = async (userMessage) => {
        setIsTyping(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const response = await fetch(BOT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    action: "sendMessage",
                    sessionId: sessionId.current,
                    chatInput: userMessage
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Webhook HTTP Error:', response.status, errorText);
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Webhook Response:', data);

            // N8N Chat Trigger typically returns an array or an object with 'output' or 'response'
            let botResponse = '';
            if (Array.isArray(data)) {
                botResponse = data[0]?.output || data[0]?.response || data[0]?.text || JSON.stringify(data[0]);
            } else {
                botResponse = data.output || data.response || data.text || data.message || (typeof data === 'string' ? data : '');
            }

            if (!botResponse) {
                botResponse = 'I received your message, but I\'m having trouble generating a response right now. 🤖';
            }

            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: botResponse }]);
        } catch (error) {
            console.error('Webhook Error:', error);

            // Use fallback response instead of showing error - better UX
            const fallbackResponse = getSimulatedResponse(userMessage);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: fallbackResponse
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = useCallback(() => {
        if (!inputValue.trim() || isTyping) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userMsg }]);
        setInputValue('');
        sendToWebhook(userMsg);
    }, [inputValue, isTyping]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Render text with **bold** markdown support
    const renderMessageText = (text) => {
        return text.split('\n').map((line, i, arr) => {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
                <React.Fragment key={i}>
                    {parts.map((part, j) =>
                        part.startsWith('**') && part.endsWith('**')
                            ? <strong key={j}>{part.slice(2, -2)}</strong>
                            : part
                    )}
                    {i < arr.length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    const handleQuickPrompt = (prompt) => {
        if (isTyping) return;
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: prompt.label }]);
        sendToWebhook(prompt.label);
    };

    const handleMouseEnter = () => {
        if (!isChatOpen) {
            setShowTeaser(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isChatOpen && hasInteracted) {
            setShowTeaser(false);
        }
    };

    return (
        <div className="robot-assistant-container">
            {/* Robot Icon */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className={`robot-icon ${animationPhase} ${showPulse ? 'pulse-ring' : ''}`}
                        initial={{ x: 120, opacity: 0, scale: 0.5 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            scale: 1,
                            rotate: animationPhase === 'waving' ? [0, -10, 10, -10, 10, 0] : 0
                        }}
                        transition={{
                            x: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                            rotate: { duration: 1.5, ease: 'easeInOut' }
                        }}
                        onClick={handleRobotClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="robot-ring robot-ring-1" />
                        <div className="robot-ring robot-ring-2" />
                        <div className="robot-glow" />
                        <div className="robot-body">
                            <div className="robot-face">
                                <div className="robot-eye left" />
                                <div className="robot-eye right" />
                                <div className="robot-mouth" />
                            </div>
                        </div>
                        <div className="robot-antenna">
                            <div className="antenna-ball" />
                        </div>
                        <div className="ai-badge">AI</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rotating Message Teaser Panel */}
            <AnimatePresence mode="wait">
                {showTeaser && !isChatOpen && (
                    <motion.div
                        key={currentMessageIndex}
                        className="teaser-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div className="teaser-header">
                            <span className="teaser-title">{currentMessage.title}</span>
                            <span className="teaser-subtitle">{currentMessage.subtitle}</span>
                        </div>
                        <div className="teaser-actions">
                            <button onClick={() => handleTeaserAction('Explore Services')}>
                                <Briefcase size={14} /> Services
                            </button>
                            <button onClick={() => handleTeaserAction('Pricing')}>
                                <DollarSign size={14} /> Pricing
                            </button>
                            <button onClick={() => handleTeaserAction('Book a Call')}>
                                <Phone size={14} /> Call
                            </button>
                        </div>
                        <div className="teaser-arrow" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Widget */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        className="chat-widget"
                        initial={{ opacity: 0, scale: 0.7, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <motion.div
                                    className="chat-avatar"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Bot size={22} />
                                </motion.div>
                                <div className="chat-header-text">
                                    <h4>Assistant</h4>
                                    <span className="status-online">
                                        <span className="status-dot" />
                                        <Sparkles size={12} /> AI Powered • Online
                                    </span>
                                </div>
                            </div>
                            <motion.button
                                className="chat-close-btn"
                                onClick={handleCloseChat}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={18} />
                            </motion.button>
                        </div>

                        <div className="quick-prompts">
                            {quickPrompts.map((prompt, index) => (
                                <motion.button
                                    key={prompt.value}
                                    className="quick-prompt-btn"
                                    onClick={() => handleQuickPrompt(prompt)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {prompt.icon}
                                    {prompt.label}
                                </motion.button>
                            ))}
                        </div>

                        <div className="chat-messages" onWheel={(e) => e.stopPropagation()}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`chat-message ${msg.type}`}
                                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                                >
                                    {msg.type === 'bot' && (
                                        <div className="message-avatar"><Bot size={14} /></div>
                                    )}
                                    <div className="message-content">
                                        {renderMessageText(msg.text)}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div className="typing-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="message-avatar"><Bot size={14} /></div>
                                    <div className="typing-dots"><span /><span /><span /></div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <motion.button className="send-btn" onClick={handleSendMessage} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Send size={18} />
                            </motion.button>
                        </div>

                        <div className="chat-footer">Powered by <span>BritSync AI</span></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RobotAssistant;
