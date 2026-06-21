import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const STORAGE_KEY = 'britsync_contact_page_data';

const defaultContactPageData = {
    header: {
        title: "Let's Talk",
        description: "We'd love to hear about your project. Fill out the form or reach us globally."
    },
    info: {
        title: "Global Presence",
        locations: "London • New York • Dubai • Bangladesh • Pakistan • Morocco • Somalia"
    }
};

export const useContactPageData = () => {
    const [contactPageData, setContactPageData] = useState(defaultContactPageData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const settings = await apiCall('settings');
                if (settings) {
                    setContactPageData({
                        header: {
                            title: settings.contact_title || defaultContactPageData.header.title,
                            description: settings.contact_desc || defaultContactPageData.header.description
                        },
                        info: {
                            title: "Global Presence",
                            locations: settings.contact_locations || defaultContactPageData.info.locations
                        }
                    });
                }
            } catch (err) {
                console.error('Error fetching contact data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
    }, []);

    const updateContactPageData = async (newData) => {
        // This is now handled via AdminDashboard saving to /api/settings
        setContactPageData(newData);
    };

    return {
        contactPageData,
        loading,
        updateContactPageData
    };
};
