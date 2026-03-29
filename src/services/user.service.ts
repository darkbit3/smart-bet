import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UsernameCheckResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export interface ChangeUsernameResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    phone_number: string;
    balance: number;
    bonus_balance: number;
    withdrawable: number;
    created_at: string;
  };
}

class UserService {
  // Check username availability
  static async checkUsernameAvailability(username: string): Promise<UsernameCheckResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/check-username`, {
        username
      });
      return response.data;
    } catch (error: any) {
      console.error('Error checking username availability:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // Change username
  static async changeUsername(newUsername: string): Promise<ChangeUsernameResponse> {
    try {
      const tokens = localStorage.getItem('authTokens');
      console.log('🔑 Raw tokens from localStorage:', tokens);
      
      if (!tokens) {
        throw new Error('No authentication token found');
      }

      const parsedTokens = JSON.parse(tokens);
      console.log('🔑 Parsed tokens:', parsedTokens);
      console.log('🔑 Available token keys:', Object.keys(parsedTokens));
      
      // Use accessToken instead of token
      const token = parsedTokens.accessToken || parsedTokens.token;
      console.log('🔑 Using token:', token?.substring(0, 20) + '...');
      
      const response = await axios.post(
        `${API_BASE_URL}/api/user/change-username`,
        {
          newUsername
          // No password required
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Error changing username:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}

export default UserService;
