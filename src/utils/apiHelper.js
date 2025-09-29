// API Helper utility for handling tenant-aware API calls
import API_BASE_URL from '../config/api.js';

// Get tenant parameter from URL
export const getTenantFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tenant') || 'default';
};

// Create API URL with tenant parameter
export const createApiUrl = (endpoint) => {
    const tenant = getTenantFromUrl();
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}?tenant=${tenant}`;
};

// Fetch with tenant parameter
export const fetchWithTenant = async (endpoint, options = {}) => {
    const url = createApiUrl(endpoint);
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        console.error('fetchWithTenant error:', error);
        throw error;
    }
};
