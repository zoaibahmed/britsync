import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const defaultHomeData = {
    hero: {
        title: "Crafting Digital\nRealities.",
        subtitle: "We merge aesthetic perfection with technical brilliance.",
        primaryBtnText: "Get Started",
        primaryBtnLink: "/contact",
        secondaryBtnText: "Explore Work",
        secondaryBtnLink: "/work"
    },
    ticker: ["AI Integration", "Digital Strategy", "Next-Gen Web", "Brand Identity", "UX Brilliance", "Cyber Security"],
    expertise: {
        title: "OUR EXPERTISE",
        mainTitle: "Digital Mastery",
        subtitle: "Innovative solutions tailored for the next generation of digital leaders.",
        items: [] // Will be fetched
    },
    whyChooseUs: {
        title: "Why Britsync?",
        description: "We don't just build websites; we build digital legacies. Our approach combines data-driven strategy with world-class aesthetics.",
        stats: [
            { id: 1, value: "50+", label: "Projects Delivered" },
            { id: 2, value: "98%", label: "Client Retention" }
        ],
        reasons: [
            { id: 1, icon: "Target", title: "Precision", desc: "Pixel-perfect execution aligned with your business goals." },
            { id: 2, icon: "Zap", title: "Speed", desc: "Rapid prototyping and deployment without compromising quality." }
        ]
    }
};

export const useHomeData = () => {
    const [homeData, setHomeData] = useState(defaultHomeData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [expertise, why, stats, settings] = await Promise.all([
                    apiCall('expertise'),
                    apiCall('why-reasons'),
                    apiCall('stats'),
                    apiCall('settings')
                ]);

                setHomeData({
                    hero: {
                        title: settings.hero_title || defaultHomeData.hero.title,
                        subtitle: settings.hero_subtitle || defaultHomeData.hero.subtitle,
                        primaryBtnText: settings.hero_primary_btn || defaultHomeData.hero.primaryBtnText,
                        primaryBtnLink: "/contact",
                        secondaryBtnText: settings.hero_secondary_btn || defaultHomeData.hero.secondaryBtnText,
                        secondaryBtnLink: "/work"
                    },
                    ticker: settings.ticker_items || defaultHomeData.ticker,
                    expertise: { ...defaultHomeData.expertise, items: expertise },
                    whyChooseUs: {
                        title: defaultHomeData.whyChooseUs.title,
                        description: defaultHomeData.whyChooseUs.description,
                        stats: stats,
                        reasons: why
                    }
                });
            } catch (err) {
                console.error('Error fetching home data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return { homeData, loading };
};

