import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await apiCall('categories');
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async (cat) => {
        try {
            await apiCall('categories', {
                method: 'POST',
                body: cat
            });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCategory = async (id) => {
        try {
            await apiCall(`categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return { categories, loading, addCategory, deleteCategory };
};
