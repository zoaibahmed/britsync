import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const defaultAboutData = {
    mission: {
        title: "Our Mission",
        subtitle: "Defining the Future",
        paragraphs: [
            "At Britsync, we believe that digital experiences should be as visceral and impactful as physical ones. Our mission is to bridge the gap between human imagination and technological possibility.",
            "We build systems that don't just solve problems—they create new opportunities for growth, connection, and inspiration."
        ],
        stats: [
            { label: "Innovation", value: "100%" },
            { label: "Precision", value: "0.1ms" },
            { label: "Creativity", value: "∞" }
        ]
    },
    values: {
        title: "The Core Values",
        subtitle: "What drives us",
        items: [] // Will fetch
    },
    phases: {
        title: "The Britsync Blueprint",
        subtitle: "Our process for perfection",
        items: [] // Will fetch
    },
    team: {
        title: "MEET THE MINDS",
        members: [] // Will fetch
    }
};

export const useAboutData = () => {
    const [aboutData, setAboutData] = useState(defaultAboutData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const [phases, values, team, tech, settings] = await Promise.all([
                    apiCall('phases'),
                    apiCall('values'),
                    apiCall('team'),
                    apiCall('tech'),
                    apiCall('settings')
                ]);

                setAboutData({
                    mission: {
                        title: settings.mission_title || defaultAboutData.mission.title,
                        subtitle: settings.mission_subtitle || defaultAboutData.mission.subtitle,
                        paragraphs: [
                            settings.mission_p1 || defaultAboutData.mission.paragraphs[0],
                            settings.mission_p2 || defaultAboutData.mission.paragraphs[1]
                        ],
                        stats: defaultAboutData.mission.stats
                    },
                    values: {
                        ...defaultAboutData.values,
                        items: values.map(v => ({
                            ...v,
                            desc: v.description || v.desc || ''
                        }))
                    },
                    phases: { ...defaultAboutData.phases, items: phases },
                    team: { ...defaultAboutData.team, members: team },
                    techStack: {
                        title: "Powering the Future",
                        techs: tech.map(t => t.name)
                    }
                });
            } catch (err) {
                console.error('Error fetching about data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    return { aboutData, loading };
};

