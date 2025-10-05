import axios from 'axios';

// Base URL for your Django backend
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// API service functions
export const apiService = {
  // Health check endpoint
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health/');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Get all portfolio items
  getPortfolioItems: async () => {
    try {
      const response = await apiClient.get('/portfolio/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error);
      throw error;
    }
  },

  // Create new portfolio item
  createPortfolioItem: async (itemData: any) => {
    try {
      const response = await apiClient.post('/portfolio/', itemData);
      return response.data;
    } catch (error) {
      console.error('Failed to create portfolio item:', error);
      throw error;
    }
  },
};

export default apiService;