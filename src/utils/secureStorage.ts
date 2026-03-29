import * as Keychain from 'react-native-keychain';
import * as EncryptedStorage from 'react-native-encrypted-storage';
import CryptoJS from 'crypto-js';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CSRF_TOKEN: 'csrf_token',
  SESSION_ID: 'session_id',
};

// Encryption key (in production, this should be derived from device-specific keys)
const ENCRYPTION_KEY = 'smart-betting-encryption-key-2024';

// Encrypted storage for sensitive data
const secureStorage = EncryptedStorage.createSecureStore();

export class SecureStorageManager {
  // Token management
  static async storeTokens(tokens: {
    accessToken: string;
    refreshToken: string;
  }): Promise<void> {
    try {
      await secureStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        this.encrypt(tokens.accessToken)
      );
      await secureStorage.setItem(
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
      const accessToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (accessToken && refreshToken) {
        return {
          accessToken: this.decrypt(accessToken),
          refreshToken: this.decrypt(refreshToken),
        };
      }

      return null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  // User data management
  static async storeUser(userData: any): Promise<void> {
    try {
      await secureStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        this.encrypt(JSON.stringify(userData))
      );
      console.log('User data stored securely');
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data securely');
    }
  }

  static async getUser(): Promise<any | null> {
    try {
      const userData = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        return JSON.parse(this.decrypt(userData));
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // CSRF token management
  static async storeCSRFToken(token: string): Promise<void> {
    try {
      await secureStorage.setItem(
        STORAGE_KEYS.CSRF_TOKEN,
        this.encrypt(token)
      );
    } catch (error) {
      console.error('Error storing CSRF token:', error);
    }
  }

  static async getCSRFToken(): Promise<string | null> {
    try {
      const token = await secureStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
      return token ? this.decrypt(token) : null;
    } catch (error) {
      console.error('Error retrieving CSRF token:', error);
      return null;
    }
  }

  // Session management
  static async createSession(): Promise<string> {
    const sessionId = this.generateSessionId();
    try {
      await secureStorage.setItem(
        STORAGE_KEYS.SESSION_ID,
        this.encrypt(sessionId)
      );
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }
  }

  static async getSessionId(): Promise<string | null> {
    try {
      const sessionId = await secureStorage.getItem(STORAGE_KEYS.SESSION_ID);
      return sessionId ? this.decrypt(sessionId) : null;
    } catch (error) {
      console.error('Error retrieving session ID:', error);
      return null;
    }
  }

  // Keychain for additional security
  static async storeInKeychain(key: string, value: string): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        'smart-betting-app',
        key,
        this.encrypt(value)
      );
    } catch (error) {
      console.error('Error storing in keychain:', error);
      throw new Error('Failed to store in keychain');
    }
  }

  static async getFromKeychain(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials('smart-betting-app');
      if (credentials && typeof credentials !== 'boolean') {
        if (credentials.username === key) {
          return this.decrypt(credentials.password);
        }
      }
      return null;
    } catch (error) {
      console.error('Error retrieving from keychain:', error);
      return null;
    }
  }

  // Clear all stored data
  static async clearAll(): Promise<void> {
    try {
      await secureStorage.clear();
      await Keychain.resetInternetCredentials('smart-betting-app');
      console.log('All secure storage cleared');
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw new Error('Failed to clear secure storage');
    }
  }

  // Security utilities
  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private static generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  // Security validation
  static async validateSession(): Promise<boolean> {
    try {
      const sessionId = await this.getSessionId();
      const tokens = await this.getTokens();
      
      if (!sessionId || !tokens) {
        return false;
      }

      // Additional validation logic here
      // For example, check if session is too old
      const sessionTimestamp = parseInt(sessionId.split('_')[1]);
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
      
      return Date.now() - sessionTimestamp < maxSessionAge;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  // Token refresh validation
  static async shouldRefreshToken(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) return false;

      // Parse JWT payload to check expiration
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // Refresh if token expires within 5 minutes
      return expirationTime - currentTime < 5 * 60 * 1000;
    } catch (error) {
      console.error('Error checking token refresh:', error);
      return false;
    }
  }
}

// Export singleton instance
export const secureStorage = SecureStorageManager;
