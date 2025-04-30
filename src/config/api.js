// API Configuration
export const API_BASE_URL = 'http://localhost:5005';

// API Endpoints
export const ENDPOINTS = {
    items: `${API_BASE_URL}/api/items`,
    shopStatus: `${API_BASE_URL}/api/shop-status`,
    shopStatusStream: `${API_BASE_URL}/api/shop-status-stream/stream`,
    orders: `${API_BASE_URL}/api/orders`
};

export default ENDPOINTS;

// Helper function to get full API URL
export const getApiUrl = (path) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
}; 