import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/auth.service';

// Types
export interface User {
  id: number;
  username: string;
  phone_number: string;
  balance: number;
  non_withdrawable: number;
  bonus_balance: number;
  withdrawable: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: any | null;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: any } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  tokens: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (phone_number: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper function to determine error type from message
  const getErrorTypeFromMessage = (message: string): string => {
    if (message.includes('already taken') || message.includes('Username is already taken')) {
      return 'username_taken';
    } else if (message.includes('already registered') || message.includes('Phone number is already registered')) {
      return 'phone_taken';
    } else if (message.includes('must be') || message.includes('Invalid') || message.includes('format')) {
      return 'invalid_format';
    } else if (message.includes('too short') || message.includes('at least')) {
      return 'too_short';
    } else if (message.includes('referral')) {
      return 'referral_invalid';
    }
    return 'database_error';
  };

  // Check for existing tokens on mount and rehydrate auth state
  useEffect(() => {
    const tryRestoreSession = async () => {
      const tokens = authAPI.getTokens();
      if (!tokens?.accessToken && !tokens?.token) {
        return;
      }

      const accessToken = tokens.accessToken || tokens.token;
      authAPI.setAuthorizationHeader(accessToken);

      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const currentUserResponse = await authAPI.getCurrentUser();
        const userData = currentUserResponse.user || currentUserResponse.data?.user;

        if (!userData) {
          throw new Error('Failed to retrieve authenticated user data');
        }

        const user: User = {
          id: userData.id,
          username: userData.username || '',
          phone_number: userData.phone_number || '',
          balance: userData.balance ?? 0,
          non_withdrawable: userData.non_withdrawable ?? 0,
          bonus_balance: userData.bonus_balance ?? 0,
          withdrawable: userData.withdrawable ?? 0,
          status: userData.status || 'active',
          created_at: userData.created_at || new Date().toISOString(),
          updated_at: userData.updated_at || new Date().toISOString(),
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens } });
      } catch (error: any) {
        console.warn('🔐 AuthProvider - Session restore failed:', error?.message || error);
        authAPI.removeTokens();
        authAPI.setAuthorizationHeader(null);
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    tryRestoreSession();
  }, []);

  const login = async (phone_number: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const result = await authAPI.login({ phone_number, password });
      
      if ((result.success || result.status === 'success') && result.data) {
        // Handle nested data structure: result.data.data.player
        const player = result.data?.data?.player || result.data?.player;
        const tokens = result.data?.data?.tokens || result.data?.tokens;
        
        if (!player) {
          throw new Error('Login successful but no player data received');
        }
        
        // Store tokens
        if (tokens) {
          authAPI.storeTokens(tokens);
          const accessToken = tokens.accessToken || tokens.token;
          authAPI.setAuthorizationHeader(accessToken);
        }
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: player, tokens },
        });
        
        console.log('🎉 AuthProvider - Login successful:', player.username);
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      
      // Only log to console if it's not a 401 error (wrong credentials)
      if (!error.suppressConsole && error.status !== 401) {
        console.warn('🔐 AuthProvider - Login failed:', errorMessage);
      }
      
      throw error; // Re-throw the error so the calling component knows login failed
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    authAPI.removeTokens();
    authAPI.setAuthorizationHeader(null);
    dispatch({ type: 'LOGOUT' });
    console.log('🔐 AuthProvider - Logout successful');
  };

  const register = async (userData: {
    username: string;
    phone_number: string;
    password: string;
    referral_code?: string;
  }) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      console.log('🔐 AuthProvider - Registration attempt:', {
        username: userData.username,
        phone_number: userData.phone_number,
        hasReferral: !!userData.referral_code
      });

      const result = await authAPI.register(userData);
      
      if ((result.success || result.status === 'success') && result.data) {
        // Handle nested data structure: result.data.data.player
        const player = result.data?.data?.player || result.data?.player;
        
        if (!player) {
          throw new Error('Registration successful but no player data received');
        }
        
        console.log('🎉 AuthProvider - Registration successful:', player.username);
        
        // Auto-login after successful registration
        const loginResult = await authAPI.login({
          phone_number: userData.phone_number,
          password: userData.password
        });
        
        if ((loginResult.success || loginResult.status === 'success') && loginResult.data) {
          // Handle nested data structure for login too
          const loggedInPlayer = loginResult.data?.data?.player || loginResult.data?.player;
          const tokens = loginResult.data?.data?.tokens || loginResult.data?.tokens;
          
          if (!loggedInPlayer) {
            throw new Error('Login successful but no player data received');
          }
          
          // Store tokens
          if (tokens) {
            authAPI.storeTokens(tokens);
          }
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: loggedInPlayer, tokens },
          });
          
          console.log('🎉 AuthProvider - Registration and login successful:', loggedInPlayer.username);
        } else {
          // Registration successful but auto-login failed
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: player, tokens: null },
          });
          console.log('🎉 AuthProvider - Registration successful, manual login required');
        }
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      let errorType = 'database_error';
      
      // Handle Axios errors properly
      if (error.response?.data) {
        errorMessage = error.response.data.message || 'Registration failed';
        errorType = error.response.data.errorType || getErrorTypeFromMessage(errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        errorType = 'database_error';
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      console.warn('🔐 AuthProvider - Registration error:', errorMessage);
      console.warn('🔐 AuthProvider - Registration error type:', errorType);
      
      // Handle specific error types for visual feedback
      switch (errorType) {
        case 'username_taken':
          console.log('� Username already registered - will highlight username field');
          break;
        case 'phone_taken':
          console.log('📱 Phone already registered - will highlight phone field');
          break;
        case 'invalid_format':
          console.log('⚠️ Invalid format - will highlight relevant field');
          break;
        case 'too_short':
          console.log('📏 Too short - will highlight relevant field');
          break;
        case 'referral_invalid':
          console.log('🎁 Invalid referral - will highlight referral field');
          break;
        default:
          console.log('❓ Unknown error - showing generic message');
      }
      
      throw error; // Re-throw the error so the calling component knows registration failed
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    register,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
