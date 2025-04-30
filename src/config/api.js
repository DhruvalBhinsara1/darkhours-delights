export const API_BASE_URL = "http://web-production-fb3c.up.railway.app";

// Helper function to get full API URL
export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`; 