import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const defaultWorkPageData = {
    header: {
        title: "Selected Work",
        description: "We build digital products that reshape industries."
    },
    cta: {
        title: "Ready to Start Your Project?",
        subtitle: "Let's build something extraordinary together.",
        btnText: "Get a Quote",
        btnLink: "/contact"
    }
};

export const useWorkPageData = () => {
    const [workPageData, setWorkPageData] = useState(defaultWorkPageData);
    const [loading, setLoading] = useState(true);

    const fetchWorkData = async () => {
        try {
            const settings = await apiCall('settings');
            setWorkPageData({
                header: {
                    title: settings.work_header_title || defaultWorkPageData.header.title,
                    description: settings.work_header_desc || defaultWorkPageData.header.description
                },
                cta: {
                    title: settings.work_cta_title || defaultWorkPageData.cta.title,
                    subtitle: settings.work_cta_subtitle || defaultWorkPageData.cta.subtitle,
                    btnText: settings.work_cta_btn || defaultWorkPageData.cta.btnText,
                    btnLink: "/contact"
                }
            });
        } catch (error) {
            console.error('Error loading work page data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkData();
    }, []);

    // Updates are now handled via generalized Settings API in Admin
    const updateWorkPageData = async (newData) => {
        // Placeholder for potential specific implementation, currently passive
        setWorkPageData(newData);
    };

    return {
        workPageData,
        loading,
        updateWorkPageData
    };
};
