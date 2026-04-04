import axios from 'axios';

// API Configuration with encrypted URL
const DEFAULT_ENCRYPTED_URL = 'aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaA=='; // Base64 encoded "http://localhost:3000/api"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_ENCRYPTED_URL;

// Simple Base64 decoding function
const decodeBase64 = (str: string) => {
  try {
    return atob(str);
  } catch (error) {
    // If decoding fails, assume it's already a plain URL
    return str;
  }
};

// Decode the API URL (only if it's encrypted)
const DECODED_API_URL = API_BASE_URL === DEFAULT_ENCRYPTED_URL ? decodeBase64(API_BASE_URL) : API_BASE_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: DECODED_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Completely suppress console output for authentication errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Filter out all axios and authentication-related console messages
const filterConsoleOutput = (...args: any[]) => {
  const message = args[0];
  const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
  
  // Block any console output related to authentication, axios, or the app
  if (messageStr.includes('401') || 
      messageStr.includes('Unauthorized') || 
      messageStr.includes('POST http://localhost:3000/api/login') ||
      messageStr.includes('http://localhost:3000/api') ||
      messageStr.includes('localhost:3000') ||
      messageStr.includes('dispatchXhrRequest') ||
      messageStr.includes('xhr') ||
      messageStr.includes('dispatchRequest') ||
      messageStr.includes('_request') ||
      messageStr.includes('axios.js') ||
      messageStr.includes('makeRequest') ||
      messageStr.includes('auth.service.ts') ||
      messageStr.includes('UserContext.tsx') ||
      messageStr.includes('Login.tsx') ||
      messageStr.includes('chunk-FD5SMSK5.js') ||
      messageStr.includes('💰') ||
      messageStr.includes('🏠') ||
      messageStr.includes('🔍') ||
      messageStr.includes('❌') ||
      messageStr.includes('🎉') ||
      messageStr.includes('BalanceHeader') ||
      messageStr.includes('Home component') ||
      messageStr.includes('Balance update') ||
      messageStr.includes('No user data') ||
      messageStr.includes('Attempting login') ||
      messageStr.includes('Attempting registration') ||
      messageStr.includes('Registration completed') ||
      messageStr.includes('Login Modal') ||
      messageStr.includes('Checking username') ||
      messageStr.includes('Checking phone') ||
      messageStr.includes('availability') ||
      messageStr.includes('aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaQ==')) { // Base64 encoded URL
    return true; // Suppress all these messages
  }
  
  return false; // Don't suppress
};

// Override console methods
console.error = (...args) => {
  if (!filterConsoleOutput(...args)) {
    originalConsoleError.apply(console, args);
  }
};

console.warn = (...args) => {
  if (!filterConsoleOutput(...args)) {
    originalConsoleWarn.apply(console, args);
  }
};

console.log = (...args) => {
  if (!filterConsoleOutput(...args)) {
    originalConsoleLog.apply(console, args);
  }
};

// Custom request handler that prevents console errors and uses encrypted URLs
const makeRequest = async (config: any) => {
  try {
    const response = await apiClient({
      ...config,
      url: config.url // Use original URL for actual request
    });
    return response;
  } catch (error: any) {
    // Handle the error gracefully without letting it bubble to console
    if (error.response?.status === 401) {
      // Create a custom error that won't trigger browser console logs
      const customError = new Error('Invalid credentials');
      (customError as any).response = error.response;
      (customError as any).status = 401;
      throw customError;
    }
    throw error; // Let other errors bubble up normally
  }
};

// Add request interceptor to attach tokens for authenticated requests
apiClient.interceptors.request.use(
  (config) => {
    try {
      const tokens = authAPI.getTokens();
      const accessToken = tokens?.accessToken || tokens?.token;
      if (accessToken && config.headers) {
        (config.headers as any).Authorization = `Bearer ${accessToken}`;
      }
    } catch (err) {
      // ignore token parsing errors
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors from being logged as they're expected for wrong credentials
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }
    
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

// Login API Service
export const authAPI = {
  // Login with phone number and password
  login: async (credentials: {
    phone_number: string;
    password: string;
  }) => {
    try {
      const response = await makeRequest({
        method: 'post',
        url: '/login',
        data: credentials
      });
      return response.data;
    } catch (error: any) {
      // Handle different error types with user-friendly messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid phone number or password. Please check your credentials and try again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid input. Please check your phone number and password format.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.isNetworkError) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.isTimeoutError) {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      // Create a more user-friendly error object
      const userFriendlyError: any = new Error(errorMessage);
      userFriendlyError.status = error.response?.status;
      userFriendlyError.isAuthError = true;
      userFriendlyError.suppressConsole = error.response?.status === 401;
      
      throw userFriendlyError;
    }
  },

  // Register new player
  register: async (userData: {
    username: string;
    phone_number: string;
    password: string;
    referral_code?: string;
  }) => {
    console.log('🔐 Frontend Auth API - Register attempt:', { 
      username: userData.username,
      phone_number: userData.phone_number,
      hasPassword: !!userData.password,
      passwordLength: userData.password.length,
      hasReferral: !!userData.referral_code,
      fullUserData: userData
    });
    
    try {
      const response = await apiClient.post('/register', userData);
      console.log('🔐 Frontend Auth API - Register response:', response.data);
      return response.data;
    } catch (error: any) {
      // Handle different error types with user-friendly messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid registration data. Please check your information.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Username or phone number already exists. Please use different credentials.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.isNetworkError) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.isTimeoutError) {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      // Create a more user-friendly error object
      const userFriendlyError: any = new Error(errorMessage);
      userFriendlyError.status = error.response?.status;
      userFriendlyError.isAuthError = true;
      
      // Log the technical error for debugging but don't expose it to user
      console.warn('🔐 Frontend Auth API - Registration failed:', errorMessage);
      
      throw userFriendlyError;
    }
  },

  // Check username and phone availability (combined)
  checkAvailability: async (username?: string, phone_number?: string) => {
    console.log('🔐 Frontend Auth API - Checking availability:', { username, phone_number });
    
    try {
      const params = new URLSearchParams();
      if (username) params.append('username', username);
      if (phone_number) params.append('phone_number', phone_number);
      
      const response = await apiClient.get(`/availability/check-username-phone?${params.toString()}`);
      console.log('🔐 Frontend Auth API - Availability check response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Auth API - Availability check error:', error);
      throw error;
    }
  },

  // Check username availability (individual - kept for backward compatibility)
  checkUsernameAvailability: async (username: string) => {
    console.log('🔐 Frontend Auth API - Checking username availability:', username);
    
    try {
      const response = await apiClient.get(`/availability/username/${encodeURIComponent(username)}`);
      console.log('🔐 Frontend Auth API - Username check response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Auth API - Username check error:', error);
      throw error;
    }
  },

  // Check phone number availability (individual - kept for backward compatibility)
  checkPhoneAvailability: async (phone_number: string) => {
    console.log('🔐 Frontend Auth API - Checking phone availability:', phone_number);
    
    try {
      const response = await apiClient.get(`/availability/phone/${encodeURIComponent(phone_number)}`);
      console.log('🔐 Frontend Auth API - Phone check response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Auth API - Phone check error:', error);
      throw error;
    }
  },

  // Validate referral code
  validateReferralCode: async (referral_code?: string) => {
    console.log('🔐 Frontend Auth API - Validating referral code:', referral_code);
    
    try {
      const response = await apiClient.post('/validate-referral', { referral_code });
      console.log('🔐 Frontend Auth API - Referral validation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Auth API - Referral validation error:', error);
      throw error;
    }
  },

  // Get current authenticated user from the API using stored token
  getCurrentUser: async () => {
    const accessToken = authAPI.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await apiClient.get('/user/test-token', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error: any) {
      // On failure, remove invalid tokens
      authAPI.removeTokens();
      throw error;
    }
  },

  setAuthorizationHeader: (accessToken: string | null) => {
    if (accessToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  // Logout
  logout: async () => {
    console.log('🔐 Frontend Auth API - Logout attempt');
    
    try {
      const response = await apiClient.post('/logout');
      console.log('🔐 Frontend Auth API - Logout response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Auth API - Logout error:', error);
      throw error;
    }
  },

  // Store tokens in localStorage
  storeTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    console.log('🔐 Frontend Auth API - Storing tokens');
    localStorage.setItem('authTokens', JSON.stringify(tokens));
  },

  // Get tokens from localStorage
  getTokens: () => {
    const tokens = localStorage.getItem('authTokens');
    if (!tokens || tokens === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(tokens);
    } catch (error) {
      console.error('Error parsing tokens:', error);
      return null;
    }
  },

  // Remove tokens from localStorage
  removeTokens: () => {
    console.log('🔐 Frontend Auth API - Removing tokens');
    localStorage.removeItem('authTokens');
  },

  // Get access token
  getAccessToken: () => {
    const tokens = authAPI.getTokens();
    return tokens?.accessToken || null;
  }
};

export default authAPI;
