import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const defaultServicesPageData = {
    header: {
        title: "Our Services",
        description: "Comprehensive digital solutions designed to elevate your brand."
    },
    ticker: ["Quality", "Precision", "Impact", "Innovation"],
    process: {
        title: "How We Deliver",
        steps: [
            { icon: 'Search', title: "Discovery", desc: "We dive deep into your goals to understand the core problem." },
            { icon: 'PenTool', title: "Strategy & Design", desc: "Crafting a roadmap and visual identity that aligns with your vision." },
            { icon: 'Code', title: "Development", desc: "Building robust, scalable solutions using cutting-edge tech." },
            { icon: 'Rocket', title: "Launch & Scale", desc: "Deploying to production and optimizing for growth." }
        ]
    },
    faqs: {
        title: "Frequently Asked Questions",
        items: []
    }
};

export const useServicesPageData = () => {
    const [servicesPageData, setServicesPageData] = useState(defaultServicesPageData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqs, settings] = await Promise.all([
                    apiCall('faqs'),
                    apiCall('settings')
                ]);

                const safeSettings = settings && typeof settings === 'object' && !Array.isArray(settings) ? settings : {};

                setServicesPageData({
                    header: {
                        title: safeSettings.services_header_title || defaultServicesPageData.header.title,
                        description: safeSettings.services_header_desc || defaultServicesPageData.header.description
                    },
                    ticker: safeSettings.services_ticker || defaultServicesPageData.ticker,
                    process: {
                        title: safeSettings.services_process_title || defaultServicesPageData.process.title,
                        steps: defaultServicesPageData.process.steps
                    },
                    faqs: {
                        title: safeSettings.services_faq_title || defaultServicesPageData.faqs.title,
                        items: Array.isArray(faqs) ? faqs : []
                    }
                });
            } catch (err) {
                console.error('Error fetching services page data:', err);
                setServicesPageData(defaultServicesPageData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { servicesPageData, loading };
};

