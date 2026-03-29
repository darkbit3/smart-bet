import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export class PasswordService {
  // Change password
  static async changePassword(
    currentPassword: string,
    newPassword: string,
    phoneNumber: string
  ): Promise<ChangePasswordResponse> {
    try {
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }

      const parsedTokens = JSON.parse(tokens);
      const token = parsedTokens.accessToken || parsedTokens.token;
      
      const response = await axios.post(
        `${API_BASE_URL}/api/password/change-password`,
        {
          currentPassword,
          newPassword,
          phoneNumber
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}
