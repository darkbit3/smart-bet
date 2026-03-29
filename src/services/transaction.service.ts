import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface Transaction {
  id: number;
  phonenumber: string;
  method: string;
  status: string;
  time: string;
  old_balance: number;
  new_balance: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  message: string;
  transactions: Transaction[];
}

export class TransactionService {
  // Get transaction history for specific user
  static async getUserTransactions(phoneNumber: string): Promise<TransactionHistoryResponse> {
    try {
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }

      const parsedTokens = JSON.parse(tokens);
      const token = parsedTokens.accessToken || parsedTokens.token;
      
      const response = await axios.get(
        `${API_BASE_URL}/api/transaction/user-transactions`,
        {
          params: { phoneNumber },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching transaction history:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // Create transaction (for testing)
  static async createTransaction(
    phoneNumber: string,
    method: string,
    status: string,
    oldBalance: number,
    newBalance: number
  ): Promise<{success: boolean; message: string; transactionId?: number}> {
    try {
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }

      const parsedTokens = JSON.parse(tokens);
      const token = parsedTokens.accessToken || parsedTokens.token;
      
      const response = await axios.post(
        `${API_BASE_URL}/api/transaction/create-transaction`,
        {
          phoneNumber,
          method,
          status,
          old_balance: oldBalance,
          new_balance: newBalance
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}
