import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { apiCall } from '../utils/api';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import TextReveal from '../components/ui/TextReveal';
import PhoneInput from '../components/ui/PhoneInput';
import { useContactPageData } from '../hooks/useContactPageData';
import { useTheme } from '../context/ThemeContext';
import './ContactPage.css';
import Globe from '../components/ui/Globe';

const Contact = () => {
    const { contactPageData } = useContactPageData();
    const { theme } = useTheme();
    const [view, setView] = useState('landing'); // 'landing', 'project', 'proposal', 'success'
    const [formState, setFormState] = useState('idle');
    const [services, setServices] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [durationType, setDurationType] = useState('one-time');
    const form = useRef();
    const proposalForm = useRef();

    // 3D Tilt Logic for Form
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { damping: 20, stiffness: 100 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { damping: 20, stiffness: 100 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await apiCall('services');
                setServices(data || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setFormState('submitting');
        try {
            const formDataObj = { phone_number: phoneNumber };
            const formData = new FormData(form.current);
            formData.forEach((value, key) => { formDataObj[key] = value; });
            await apiCall('messages', { method: 'POST', body: formDataObj });
            setView('success');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message.');
            setFormState('idle');
        }
    };

    const handleProposalSubmit = async (e) => {
        e.preventDefault();
        setFormState('submitting');
        try {
            const formData = new FormData(proposalForm.current);
            const data = {
                userName: formData.get('userName'),
                email: formData.get('email'),
                phoneNumber: phoneNumber,
                projectDescription: formData.get('projectDescription'),
                startDate: formData.get('startDate'),
                durationType: formData.get('durationType'),
                durationValue: formData.get('durationValue'),
                deliverables: formData.get('deliverables')
            };
            await apiCall('proposals', { method: 'POST', body: data });
            setView('success');
        } catch (error) {
            console.error('Error sending proposal:', error);
            alert('Failed to submit proposal.');
            setFormState('idle');
        }
    };

    return (
        <PageTransition>
            <div className="contact-page-wrapper">
                <div className="contact-bg-elements">
                    <motion.div className="contact-blob contact-blob-1" animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.1, 0.9, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="contact-blob contact-blob-2" animate={{ x: [0, -100, 60, 0], y: [0, 80, -30, 0], scale: [1, 1.2, 0.8, 1] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
                    <div className="contact-grid-overlay" />
                </div>

                <section className="contact-page-section">
                    <div className="contact-grid">
                        <motion.div className="contact-info" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <TextReveal text={contactPageData.header.title} className="contact-title" />
                            <motion.p className="contact-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
                                {contactPageData.header.description}
                            </motion.p>

                            <motion.div className="global-map" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
                                <div className="map-bg">
                                    <div className="globe-container">
                                        <div className="globe-hud-overlay">
                                            <div className="hud-label hud-label-tl">NEURAL_LINK: ACTIVE</div>
                                            <div className="hud-label hud-label-tr">SECURE: AES_256</div>
                                            <div className="hud-label hud-label-bl">PROTO: BRITS_v3.0</div>
                                            <div className="hud-label hud-label-br">SCAN: GLOBAL</div>
                                            <div className="scanning-ring" />
                                            <div className="ping-dot" />
                                        </div>
                                        <Globe />
                                    </div>
                                    <div className="map-overlay-text">
                                        <div className="hud-heading-tag">[ NODE_STATUS: ONLINE ]</div>
                                        <div className="hud-heading-main">
                                            <span className="hud-status-dot" />
                                            <h3>{contactPageData.info.title}</h3>
                                        </div>
                                        <div className="hud-heading-sub">CONNECTIVITY_ESTABLISHED</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <div className="contact-form-wrapper">
                            <AnimatePresence mode="wait">
                                {view === 'landing' && (
                                    <motion.div key="landing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="contact-landing-glass glass">
                                        <h3>How can we help today?</h3>
                                        <p>Select an option to get started with BritSync's world-class solutions.</p>
                                        <div className="contact-choice-buttons">
                                            <button className="choice-btn project" onClick={() => setView('project')}>
                                                <div className="btn-icon">🚀</div>
                                                <div className="btn-text">
                                                    <span>Start a Project</span>
                                                    <small>Tell us about your next big idea</small>
                                                </div>
                                            </button>
                                            <button className="choice-btn proposal" onClick={() => setView('proposal')}>
                                                <div className="btn-icon">📄</div>
                                                <div className="btn-text">
                                                    <span>Send a Proposal</span>
                                                    <small>Detailed project requirements for us</small>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {view === 'project' && (
                                    <motion.div key="project" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="contact-form-container-v2" style={{ perspective: 1000, rotateX, rotateY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                                        <div className="form-header">
                                            <button className="back-btn" onClick={() => setView('landing')}>← Back</button>
                                            <h3>Start Your Project</h3>
                                        </div>
                                        <form ref={form} className="contact-form-full glass" onSubmit={handleProjectSubmit}>
                                            <div className="form-group">
                                                <label>Full Name *</label>
                                                <input name="user_name" type="text" required className="form-input-full" placeholder="Your name" />
                                            </div>
                                            <div className="form-group">
                                                <label>Email Address *</label>
                                                <input name="email" type="email" required className="form-input-full" placeholder="your@email.com" />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone Number *</label>
                                                <PhoneInput value={phoneNumber} onChange={setPhoneNumber} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Interest *</label>
                                                <select name="service_id" required className="form-input-full service-select">
                                                    <option value="">Select a service</option>
                                                    {services.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Message *</label>
                                                <textarea name="message" required rows="4" className="form-input-full" placeholder="Tell us more..."></textarea>
                                            </div>
                                            <Button className="submit-btn" style={{ width: '100%' }} disabled={formState === 'submitting'}>
                                                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </form>
                                    </motion.div>
                                )}

                                {view === 'proposal' && (
                                    <motion.div key="proposal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="contact-form-container-v2 proposal-enhanced-form">
                                        <div className="form-header">
                                            <button className="back-btn" onClick={() => setView('landing')}>← Back</button>
                                            <h3>Submit Detailed Proposal</h3>
                                        </div>
                                        <form ref={proposalForm} className="contact-form-full glass premium-form" onSubmit={handleProposalSubmit}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Full Name *</label>
                                                    <input name="userName" type="text" required className="form-input-full" placeholder="John Doe" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Email Address *</label>
                                                    <input name="email" type="email" required className="form-input-full" placeholder="john@example.com" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number *</label>
                                                <PhoneInput value={phoneNumber} onChange={setPhoneNumber} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Project Goal & Description *</label>
                                                <textarea name="projectDescription" required rows="3" className="form-input-full" placeholder="What are we building together?"></textarea>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Desired Start Date *</label>
                                                    <input name="startDate" type="date" required className="form-input-full" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Duration Type *</label>
                                                    <select 
                                                        name="durationType" 
                                                        required 
                                                        className="form-input-full service-select"
                                                        onChange={(e) => setDurationType(e.target.value)}
                                                    >
                                                        <option value="one-time">One Time Project</option>
                                                        <option value="continuous">Continuous / Retainer</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <AnimatePresence>
                                                {durationType === 'continuous' && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="form-group overflow-hidden"
                                                    >
                                                        <label>Duration Details (Months/Weeks) *</label>
                                                        <input name="durationValue" type="text" required className="form-input-full" placeholder="e.g. 6 months initial phase" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="form-group">
                                                <label>Deliverables & Specific Needs *</label>
                                                <textarea name="deliverables" required rows="3" className="form-input-full" placeholder="List key items you expect us to deliver..."></textarea>
                                            </div>
                                            <Button className="submit-btn proposal-submit" style={{ width: '100%' }} disabled={formState === 'submitting'}>
                                                {formState === 'submitting' ? 'Processing...' : 'Submit Strategic Proposal'}
                                            </Button>
                                        </form>
                                    </motion.div>
                                )}

                                {view === 'success' && (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="success-message glass">
                                        <div className="success-icon">✓</div>
                                        <h3>Submission Successful!</h3>
                                        <p>Thank you for reaching out. Our team will review your {view === 'proposal' ? 'proposal' : 'inquiry'} and get back to you shortly.</p>
                                        <button onClick={() => { setView('landing'); setFormState('idle'); }} className="reset-btn">Done</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default Contact;
