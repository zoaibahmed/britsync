import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiCall } from '../../utils/api'; // added apiCall import
import SplitText from '../ui/SplitText';
import Button from '../ui/Button';
import './Contact.css';

import contactImage from '../../assets/images/contact-3d.png';

const Contact = () => {
    const [formState, setFormState] = useState('idle'); // idle, submitting, success
    const form = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState('submitting');
        try {
            const formDataObj = {};
            const formData = new FormData(form.current);
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            await apiCall('messages', { method: 'POST', body: formDataObj });
            setFormState('success');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again later.');
            setFormState('idle');
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-bg-glow" />
            <div className="contact-container">
                <div className="contact-grid">
                    <div className="contact-content">
                        <SplitText text="Let's Talk" className="section-title" />
                        <p className="section-desc">
                            Ready to start your project? Contact us today.
                        </p>

                        {formState === 'success' ? (
                            <motion.div
                                className="success-message"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="success-icon">✓</div>
                                <h3>Message Sent!</h3>
                                <p>We'll get back to you shortly.</p>
                                <button onClick={() => setFormState('idle')} className="reset-btn">Send another</button>
                            </motion.div>
                        ) : (
                            <motion.form
                                ref={form}
                                className="contact-form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="form-group">
                                    <input name="name" type="text" placeholder="Name" required className="form-input" />
                                    <div className="input-line" />
                                </div>
                                <div className="form-group">
                                    <input name="email" type="email" placeholder="Email" required className="form-input" />
                                    <div className="input-line" />
                                </div>
                                <div className="form-group">
                                    <textarea name="message" placeholder="Message" required rows="4" className="form-input"></textarea>
                                    <div className="input-line" />
                                </div>

                                <Button className="submit-btn">
                                    {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                                </Button>
                            </motion.form>
                        )}
                    </div>

                    <motion.div
                        className="contact-visual"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <div className="image-wrapper">
                            <img src={contactImage} alt="Contact Illustration" className="contact-image" />
                            <div className="image-glow" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
