// API Configuration
const getApiBaseUrl = () => {
    // Check if we have an environment variable override
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'https://localhost:7074/api';
    }
    
    // For production, always use the same backend API
    // The tenant detection happens on the backend based on the request origin
    return 'https://barbershopapi-production-a935.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
