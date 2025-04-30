export const API_BASE_URL = "https://web-production-7d43f.up.railway.app";

// Helper function to get full API URL
export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`; 