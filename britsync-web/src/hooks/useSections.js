import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

export const useSections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSections = async () => {
        setLoading(true);
        try {
            const data = await apiCall('sections');
            // Normalize _id to id
            setSections(data.map(s => ({ ...s, id: s._id })));
        } catch (err) {
            console.error('Error fetching sections:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const addSection = async (section) => {
        try {
            const newSection = await apiCall('sections', {
                method: 'POST',
                body: section
            });
            const normalized = { ...newSection, id: newSection._id };
            setSections(prev => [...prev, normalized]);
            return normalized;
        } catch (err) {
            console.error(err);
        }
    };

    const updateSection = async (id, updatedData) => {
        try {
            const data = await apiCall(`sections/${id}`, {
                method: 'PUT',
                body: updatedData
            });
            const normalized = { ...data, id: data._id };
            setSections(prev => prev.map(s => (s.id === id || s._id === id ? normalized : s)));
            return normalized;
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSection = async (id) => {
        try {
            await apiCall(`sections/${id}`, { method: 'DELETE' });
            setSections(prev => prev.filter(s => s.id !== id && s._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getSection = (id) => sections.find(s => s.id === id || s._id === id);

    // Content Item Helpers - modify local state then push update
    const addContentItem = async (sectionId, item) => {
        const section = getSection(sectionId);
        if (!section) return;
        const newContent = [...(section.content || []), item];
        await updateSection(sectionId, { content: newContent });
    };

    const updateContentItem = async (sectionId, itemId, updatedItem) => {
        const section = getSection(sectionId);
        if (!section) return;
        // Item IDs might be _id from attributes or generated
        const newContent = (section.content || []).map(i =>
            (i._id === itemId || i.id === itemId) ? { ...i, ...updatedItem } : i
        );
        await updateSection(sectionId, { content: newContent });
    };

    const deleteContentItem = async (sectionId, itemId) => {
        const section = getSection(sectionId);
        if (!section) return;
        const newContent = (section.content || []).filter(i => i._id !== itemId && i.id !== itemId);
        await updateSection(sectionId, { content: newContent });
    };

    return {
        sections,
        loading,
        addSection,
        updateSection,
        deleteSection,
        getSection,
        addContentItem,
        updateContentItem,
        deleteContentItem
    };
};
