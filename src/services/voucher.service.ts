import axios from 'axios';

// API Configuration - using same base as auth service
const DEFAULT_ENCRYPTED_URL = 'aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaA==';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_ENCRYPTED_URL;

const decodeBase64 = (str: string) => {
  try {
    return atob(str);
  } catch (error) {
    return str;
  }
};

const DECODED_API_URL = API_BASE_URL === DEFAULT_ENCRYPTED_URL ? decodeBase64(API_BASE_URL) : API_BASE_URL;

const apiClient = axios.create({
  baseURL: DECODED_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests - using same storage as UserContext
apiClient.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('authTokens');
  if (tokens && tokens !== 'undefined') {
    try {
      const parsedTokens = JSON.parse(tokens);
      if (parsedTokens && parsedTokens.accessToken) {
        config.headers.Authorization = `Bearer ${parsedTokens.accessToken}`;
      }
    } catch (error) {
      console.error('Failed to parse auth tokens:', error);
    }
  }
  return config;
});

export interface VoucherWithdrawRequest {
  phone_number: string;
  amount: number;
}

export interface VoucherWithdrawResponse {
  success: boolean;
  message: string;
  voucher_code?: string;
  data?: {
    voucher_code: string;
    amount: number;
    new_balance: number;
  };
}

export interface VoucherDepositRequest {
  voucher_code: string;
  phone_number: string;
}

export interface VoucherDepositResponse {
  success: boolean;
  message: string;
  data?: any;
}

class VoucherService {
  // Process voucher withdrawal
  async processVoucherWithdraw(request: VoucherWithdrawRequest): Promise<VoucherWithdrawResponse> {
    try {
      console.log('💰 Processing voucher withdrawal:', request);
      
      const response = await apiClient.post('/voucher/withdraw', request);
      
      console.log('✅ Voucher withdrawal successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Voucher withdrawal failed:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Withdrawal failed',
          data: error.response.data.data
        };
      }
      
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Process voucher deposit
  async processVoucherDeposit(request: VoucherDepositRequest): Promise<VoucherDepositResponse> {
    try {
      console.log('💰 Processing voucher deposit:', request);
      
      const response = await apiClient.post('/voucher/deposit', request);
      
      console.log('✅ Voucher deposit successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Voucher deposit failed:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Deposit failed',
          data: error.response.data.data
        };
      }
      
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Get vouchers by phone number
  async getVouchersByPhoneNumber(phoneNumber: string) {
    try {
      const response = await apiClient.get(`/voucher/phone/${phoneNumber}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get vouchers:', error);
      return {
        success: false,
        message: 'Failed to fetch vouchers'
      };
    }
  }
}

export const voucherService = new VoucherService();
