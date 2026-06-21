import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import './Pricing.css';

const Pricing = ({ data }) => {
    const section = data || {
        title: "Flexible Plans",
        subtitle: "Transparent pricing tailored to your needs.",
        plans: [
            { name: 'Starter', price: '$2,500', description: 'Perfect for small businesses and startups.', features: ['Responsive Website', '5 Pages', 'Basic SEO', 'Contact Form', '1 Month Support'], highlight: false },
            { name: 'Professional', price: '$5,000', description: 'Comprehensive solution for growing brands.', features: ['Custom Design', '10 Pages', 'Advanced SEO', 'CMS Integration', '3 Months Support', 'Analytics Dashboard'], highlight: true },
            { name: 'Enterprise', price: 'Custom', description: 'Scalable architecture for large organizations.', features: ['Full Stack App', 'Unlimited Pages', 'AI Integration', 'Custom API', 'Priority Support', 'Security Audit'], highlight: false }
        ]
    };

    return (
        <section className="pricing-section">
            <div className="pricing-container">
                <h2 className="section-title text-gradient" style={{ justifyContent: 'center', marginBottom: '1rem', display: 'flex' }}>{section.title}</h2>
                <p className="section-desc" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    {section.subtitle}
                </p>

                <div className="pricing-grid">
                    {section.plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -15 }}
                        >
                            {plan.highlight && <div className="popular-badge">Most Popular</div>}
                            <h3>{plan.name}</h3>
                            <div className="price">{plan.price}</div>
                            {plan.description && <p className="plan-desc">{plan.description}</p>}

                            <ul className="plan-features">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>
                                        <Check size={16} className="feature-icon" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/contact" style={{ width: '100%' }}>
                                <Button className={plan.highlight ? 'btn-highlight' : 'btn-outline'}>
                                    Choose Plan
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
