import CryptoJS from 'crypto-js';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CSRF_TOKEN: 'csrf_token',
  SESSION_ID: 'session_id',
};

// Encryption key (in production, this should be more secure)
const ENCRYPTION_KEY = 'smart-betting-encryption-key-2024';

export class WebStorageManager {
  // Token management
  static async storeTokens(tokens: {
    accessToken: string;
    refreshToken: string;
  }): Promise<void> {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        this.encrypt(tokens.accessToken)
      );
      localStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        this.encrypt(tokens.refreshToken)
      );
      
      console.log('Tokens stored securely');
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store tokens securely');
    }
  }

  static async getTokens(): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        return null;
      }

      return {
        accessToken: this.decrypt(accessToken),
        refreshToken: this.decrypt(refreshToken),
      };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  // User data management
  static async storeUserData(userData: any): Promise<void> {
    try {
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        this.encrypt(JSON.stringify(userData))
      );
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  static async getUserData(): Promise<any | null> {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userData) {
        return null;
      }

      return JSON.parse(this.decrypt(userData));
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // CSRF token management
  static async storeCSRFToken(token: string): Promise<void> {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CSRF_TOKEN,
        this.encrypt(token)
      );
    } catch (error) {
      console.error('Error storing CSRF token:', error);
      throw new Error('Failed to store CSRF token');
    }
  }

  static async getCSRFToken(): Promise<string | null> {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
      if (!token) {
        return null;
      }

      return this.decrypt(token);
    } catch (error) {
      console.error('Error retrieving CSRF token:', error);
      return null;
    }
  }

  // Session management
  static async storeSessionId(sessionId: string): Promise<void> {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SESSION_ID,
        this.encrypt(sessionId)
      );
    } catch (error) {
      console.error('Error storing session ID:', error);
      throw new Error('Failed to store session ID');
    }
  }

  static async getSessionId(): Promise<string | null> {
    try {
      const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      if (!sessionId) {
        return null;
      }

      return this.decrypt(sessionId);
    } catch (error) {
      console.error('Error retrieving session ID:', error);
      return null;
    }
  }

  // Clear all stored data
  static async clearAll(): Promise<void> {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('All stored data cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  // Encryption utilities
  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

// Export singleton instance
export const secureStorage = WebStorageManager;
