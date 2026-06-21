import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await apiCall('services');
            // Map _id to id for frontend consistency if needed, but MongoDB uses _id
            setServices(data.map(s => ({ ...s, id: s._id })));
        } catch (err) {
            console.error('Error fetching services:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const addService = async (service) => {
        try {
            const newService = await apiCall('services', {
                method: 'POST',
                body: service
            });
            setServices(prev => [...prev, { ...newService, id: newService._id }]);
            return newService;
        } catch (err) {
            console.error('Error adding service:', err);
            throw err;
        }
    };

    const updateService = async (id, updatedService) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedService)
            });
            if (!res.ok) throw new Error('Failed to update service');
            const data = await res.json();
            setServices(prev => prev.map(s => (s.id === id || s._id === id ? { ...data, id: data._id } : s)));
            return data;
        } catch (err) {
            console.error('Error updating service:', err);
            throw err;
        }
    };

    const deleteService = async (id) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete service');
            setServices(prev => prev.filter(s => s.id !== id && s._id !== id));
        } catch (err) {
            console.error('Error deleting service:', err);
            throw err;
        }
    };

    return { services, loading, error, addService, updateService, deleteService, fetchServices };
};
