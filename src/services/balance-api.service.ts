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
  userId: number;
  username: string;
  phoneNumber: string;
  balance: number;
  withdrawable: number;
  non_withdrawable: number;
  bonus_balance: number;
  totalBalance: number;
  status: string;
  lastUpdated: string;
}

export interface BalanceApiResponse {
  success: boolean;
  data?: BalanceData;
  message?: string;
}

export const BalanceApiService = {
  // Get real-time user balance
  getRealTimeBalance: async (phoneNumber: string): Promise<BalanceApiResponse> => {
    try {
      console.log('💰 Balance API - Fetching real-time balance for:', phoneNumber.substring(0, 6) + '***');
      
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }

      const parsedTokens = JSON.parse(tokens);
      const token = parsedTokens.accessToken || parsedTokens.token;
      
      const response = await apiClient.get('/balance-api/user-balance', {
        params: { phoneNumber },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('💰 Balance API - Real-time balance response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Balance API - Error fetching real-time balance:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Update user balance (for testing/transactions)
  updateUserBalance: async (
    phoneNumber: string,
    balance: number,
    withdrawable: number,
    non_withdrawable: number,
    bonus_balance: number
  ): Promise<{success: boolean; message: string}> => {
    try {
      console.log('💰 Balance API - Updating balance for:', phoneNumber.substring(0, 6) + '***');
      
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }

      const parsedTokens = JSON.parse(tokens);
      const token = parsedTokens.accessToken || parsedTokens.token;
      
      const response = await apiClient.post('/balance-api/update-balance', {
        phoneNumber,
        balance,
        withdrawable,
        non_withdrawable,
        bonus_balance
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('💰 Balance API - Update balance response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Balance API - Error updating balance:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
};

export default BalanceApiService;
