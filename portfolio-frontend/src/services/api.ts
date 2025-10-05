import axios from 'axios';

// Base URL for your Django backend
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Do not send browser cookies with API calls; use Token auth to avoid CSRF 403s
  withCredentials: false,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth interfaces
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  template_type: string;
  html_content: string;
  css_content: string;
  js_content: string;
  preview_image: string;
  is_premium: boolean;
}

interface Portfolio {
  id: number;
  title: string;
  slug: string;
  hero_title: string;
  hero_subtitle: string;
  about_content: string;
  template_name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

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

  // Authentication
  register: async (userData: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register/', userData);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  login: async (loginData: LoginData) => {
    try {
      const response = await apiClient.post('/auth/login/', loginData);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout/');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/profile/');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  // Templates
  getTemplates: async () => {
    try {
      const response = await apiClient.get('/templates/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw error;
    }
  },

  getTemplate: async (templateId: number) => {
    try {
      const response = await apiClient.get(`/templates/${templateId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch template:', error);
      throw error;
    }
  },

  // Portfolios
  getPortfolios: async () => {
    try {
      const response = await apiClient.get('/portfolios/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      throw error;
    }
  },

  createPortfolio: async (portfolioData: any) => {
    try {
      const response = await apiClient.post('/portfolios/', portfolioData);
      return response.data;
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      throw error;
    }
  },

  getPortfolio: async (portfolioId: number) => {
    try {
      const response = await apiClient.get(`/portfolios/${portfolioId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      throw error;
    }
  },

  updatePortfolio: async (portfolioId: number, portfolioData: any) => {
    try {
      const response = await apiClient.put(`/portfolios/${portfolioId}/`, portfolioData);
      return response.data;
    } catch (error) {
      console.error('Failed to update portfolio:', error);
      throw error;
    }
  },

  deletePortfolio: async (portfolioId: number) => {
    try {
      const response = await apiClient.delete(`/portfolios/${portfolioId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
      throw error;
    }
  },

  // Export
  exportPortfolio: async (portfolioId: number) => {
    try {
      const response = await apiClient.post('/export/', 
        { portfolio_id: portfolioId },
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio-${portfolioId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { message: 'Portfolio exported successfully' };
    } catch (error) {
      console.error('Failed to export portfolio:', error);
      throw error;
    }
  },

  // Utility functions
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Legacy endpoints (for backward compatibility)
  getPortfolioItems: async () => {
    try {
      const response = await apiClient.get('/portfolio/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error);
      throw error;
    }
  },

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

// Auth API - separate export for cleaner imports
export const authAPI = {
  login: apiService.login,
  register: apiService.register,
  logout: apiService.logout,
  getCurrentUser: apiService.getCurrentUser,
  isAuthenticated: apiService.isAuthenticated,
  getStoredUser: apiService.getStoredUser,
};

export default apiService;