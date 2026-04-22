import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const playerAuthAPI = {
  login: async (credentials: { phone_number: string; password: string }) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  register: async (userData: {
    username: string;
    phone_number: string;
    password: string;
    referral_code?: string;
  }) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },

  logout: async (accessToken: string) => {
    const response = await apiClient.post('/logout', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getCurrentPlayer: async (accessToken: string) => {
    const response = await apiClient.get('/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
