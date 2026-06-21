// Centralized API utility for all backend calls
// Handles API base URL from environment variables for production deployment

const getApiBaseUrl = () => {
    // In development, use full backend URL for direct connection
    // In production, use VITE_API_BASE_URL environment variable
    const isDev = import.meta.env.DEV;
    if (isDev) {
        return 'http://localhost:5003';
    }
    // In production, use empty string to allow relative paths (e.g., /api/services)
    // This is safer for same-domain deployments behind Nginx.
    return import.meta.env.VITE_API_BASE_URL || '';
};

export const apiCall = async (endpoint, options = {}) => {
    const apiBase = getApiBaseUrl();
    // Normalize endpoint to always start with /api/
    const normalizedEndpoint = endpoint.startsWith('/api') ? endpoint : `/api/${endpoint}`;
    const url = apiBase ? `${apiBase}${normalizedEndpoint}` : normalizedEndpoint;
    console.log('Making API call to:', url, options);

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    // Stringify body if it's an object
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
        console.log('Stringified body:', config.body);
    }

    try {
        console.log('Fetching:', url, config);
        const response = await fetch(url, config);
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
            console.error('API error:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('API success:', result);
        return result;
    } catch (error) {
        console.error(`API call failed: ${endpoint}`, error);
        throw error;
    }
};

// Helper to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If image is from uploads folder, prepend API base URL
    const apiBase = getApiBaseUrl();
    if (imagePath.startsWith('/uploads/')) {
        return `${apiBase}${imagePath}`;
    }

    // Otherwise return as is (relative path)
    return imagePath;
};

// Helper to ensure URL is absolute (starts with http/https)
export const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // If it looks like a relative path but without the protocol (e.g. www.google.com)
    return `https://${url}`;
};

export default apiCall;

