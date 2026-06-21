import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Projects
    const fetchProjects = async (category = '') => {
        setLoading(true);
        try {
            let endpoint = 'projects';
            if (category && category !== 'all') {
                endpoint += `?category=${category}`;
            }
            const rawData = await apiCall(endpoint);
            // Normalize _id to id for frontend compatibility
            const data = rawData.map(p => ({ ...p, id: p._id }));
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchProjects();
    }, []);

    // Get specific project (from local state or fetch)
    const getProject = (id) => {
        // If ID is string vs number, handle loosely. MongoDB IDs are strings.
        return projects.find(p => p._id === id || p.id == id);
    };

    return {
        projects,
        loading,
        error,
        fetchProjects, // Expose refetch capability
        getProject,
        // Admin functions stub (future implementation)
        addProject: async (proj) => { console.log('Add not impl yet', proj) },
        updateProject: async (id, data) => { console.log('Update not impl yet', id, data) },
        deleteProject: async (id) => { console.log('Delete not impl yet', id) }
    };
};
