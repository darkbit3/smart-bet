import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-bet-backend-7wntmhyi0-kaleabs-projects-1bd541ea.vercel.app';

// Create axios instance for balance API
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      error.isNetworkError = true;
      error.userMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.isTimeoutError = true;
      error.userMessage = 'Request timed out. Please try again.';
    }
    return Promise.reject(error);
  }
);

export interface BalanceData {
  balance: number;
  withdrawable: number;
  non_withdrawable: number;
  bonus_balance: number;
  last_updated: string;
}

export interface BalanceResponse {
  success: boolean;
  data?: BalanceData;
  message?: string;
}

export const balanceAPI = {
  // Get current balance for authenticated user
  getBalance: async (): Promise<BalanceResponse> => {
    try {
      console.log('💰 Balance API - Fetching current balance');
      const response = await apiClient.get('/player/balance');
      console.log('💰 Balance API - Balance response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Balance API - Error fetching balance:', error);
      throw error;
    }
  },

  // Get balance history
  getBalanceHistory: async (limit: number = 50): Promise<any> => {
    try {
      console.log('💰 Balance API - Fetching balance history');
      const response = await apiClient.get(`/player/balance/history?limit=${limit}`);
      console.log('💰 Balance API - Balance history response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Balance API - Error fetching balance history:', error);
      throw error;
    }
  },

  // Get transaction history
  getTransactionHistory: async (limit: number = 50): Promise<any> => {
    try {
      console.log('💰 Balance API - Fetching transaction history');
      const response = await apiClient.get(`/player/transactions?limit=${limit}`);
      console.log('💰 Balance API - Transaction history response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Balance API - Error fetching transaction history:', error);
      throw error;
    }
  }
};

export default balanceAPI;
