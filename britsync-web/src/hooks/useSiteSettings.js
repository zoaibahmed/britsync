import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const defaultSettings = {
    siteTitle: 'BRITSYNC',
    siteDescription: 'Digital agency creating exceptional web experiences',
    adminEmail: 'admin@britsync.com',
    socials: {
        twitter: '#',
        linkedin: '#',
        github: '#'
    }
};

export const useSiteSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const data = await apiCall('settings');
            // Merge with defaults to ensure all keys exist
            setSettings({ ...defaultSettings, ...data });
        } catch (error) {
            console.error('Error loading site settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSettings = async (newSettings) => {
        // Optimistic update
        const updatedStart = { ...settings, ...newSettings };
        setSettings(updatedStart);

        try {
            // Update each key individually as per backend API
            const updates = Object.entries(newSettings).map(([key, value]) => {
                return apiCall('settings', {
                    method: 'POST',
                    body: { key, value }
                });
            });
            await Promise.all(updates);
        } catch (error) {
            console.error('Error updating site settings:', error);
            // Revert on error? For now just log.
        }
    };

    return { settings, updateSettings, loading };
};
