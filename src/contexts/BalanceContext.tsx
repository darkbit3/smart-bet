import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { balanceAPI, BalanceData } from '../services/balance.service';
import { BalanceApiService } from '../services/balance-api.service';
import { useAuth } from './UserContext';

interface BalanceContextType {
  balances: BalanceData;
  isLoading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  lastUpdated: string | null;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

const defaultBalances: BalanceData = {
  balance: 0,
  withdrawable: 0,
  non_withdrawable: 0,
  bonus_balance: 0,
  last_updated: ''
};

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balances, setBalances] = useState<BalanceData>(defaultBalances);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { state: authState } = useAuth();

  // Fetch balance data
  const fetchBalance = async () => {
    if (!authState.isAuthenticated || !authState.user?.phone_number) {
      setBalances(defaultBalances);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('💰 Balance Context - Fetching real-time balance for:', authState.user.phone_number.substring(0, 6) + '***');
      
      // Use the new Balance API Service for real-time data
      const response = await BalanceApiService.getRealTimeBalance(authState.user.phone_number);
      console.log('💰 Balance Context - Real-time API Response:', response);
      
      // Check if response has data and is successful
      if (response && response.success && response.data) {
        // Convert BalanceApiService data to BalanceData format
        const balanceData: BalanceData = {
          balance: response.data.balance,
          withdrawable: response.data.withdrawable,
          non_withdrawable: response.data.non_withdrawable,
          bonus_balance: response.data.bonus_balance,
          last_updated: response.data.lastUpdated
        };
        
        setBalances(balanceData);
        setLastUpdated(new Date().toISOString());
        console.log('💰 Balance Context - Real-time balance updated successfully:', balanceData);
        setError(null); // Clear any previous errors
      } else {
        const errorMessage = response?.message || 'Failed to fetch balance - invalid response';
        console.error('💰 Balance Context - Invalid response:', response);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ Balance Context - Error fetching real-time balance:', error);
      setError(error.message || 'Failed to fetch balance');
      
      // Fallback to old API if new API fails
      try {
        console.log('💰 Balance Context - Falling back to old API...');
        const fallbackResponse = await balanceAPI.getBalance();
        console.log('💰 Balance Context - Fallback API Response:', fallbackResponse);
        
        if (fallbackResponse && fallbackResponse.data) {
          setBalances(fallbackResponse.data);
          setLastUpdated(new Date().toISOString());
          console.log('💰 Balance Context - Fallback balance updated successfully:', fallbackResponse.data);
          setError(null);
        }
      } catch (fallbackError: any) {
        console.error('❌ Balance Context - Fallback also failed:', fallbackError);
        setError(fallbackError.message || 'Failed to fetch balance');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh function
  const refreshBalance = async () => {
    await fetchBalance();
  };

  // Set up real-time updates
  useEffect(() => {
    if (authState.isAuthenticated) {
      console.log('💰 Balance Context - Setting up real-time balance updates');
      
      // Initial fetch
      fetchBalance();

      // Set up polling for real-time updates (every 10 seconds)
      const interval = setInterval(() => {
        fetchBalance();
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    } else {
      // Reset balances when not authenticated
      setBalances(defaultBalances);
      setLastUpdated(null);
      setError(null);
    }
  }, [authState.isAuthenticated]);

  const value: BalanceContextType = {
    balances,
    isLoading,
    error,
    refreshBalance,
    lastUpdated
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
}

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
