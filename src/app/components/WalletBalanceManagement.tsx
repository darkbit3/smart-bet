import { useEffect } from "react";
import BalanceService from "../../services/balance.service";
import { BalanceApiService } from "../../services/balance-api.service";
import { useAuth } from "../../contexts/UserContext";

interface BalanceState {
  balance: number;
  bonus_balance: number;
  withdrawable: number;
  non_withdrawable: number;
}

interface WalletBalanceManagementProps {
  isOpen: boolean;
  userBalance: BalanceState;
  setUserBalance: (balance: BalanceState) => void;
  setIsLoadingBalance: (loading: boolean) => void;
  selectedDepositMethod: string | null;
  selectedWithdrawMethod: string | null;
  setSelectedDepositMethod: (method: string | null) => void;
  setSelectedWithdrawMethod: (method: string | null) => void;
  setShowComingSoonModal: (show: boolean) => void;
  setComingSoonType: (type: 'deposit' | 'withdraw') => void;
  setShowVoucherModal: (show: boolean) => void;
  setShowVoucherWithdrawModal: (show: boolean) => void;
  setShowCashoutAgentModal: (show: boolean) => void;
}

export function WalletBalanceManagement({
  isOpen,
  userBalance,
  setUserBalance,
  setIsLoadingBalance,
  selectedDepositMethod,
  selectedWithdrawMethod,
  setSelectedDepositMethod,
  setSelectedWithdrawMethod,
  setShowComingSoonModal,
  setComingSoonType,
  setShowVoucherModal,
  setShowVoucherWithdrawModal,
  setShowCashoutAgentModal,
}: WalletBalanceManagementProps) {
  const { state: authState } = useAuth();

  // Fetches and updates the user's wallet balance
  const fetchUserBalance = async () => {
    setIsLoadingBalance(true);
    try {
      console.log('💰 WalletBalanceManagement - Fetching real-time balance for:', authState.user?.phone_number?.substring(0, 6) + '***');
      
      // Use the new Balance API Service for real-time data
      const result = await BalanceApiService.getRealTimeBalance(authState.user?.phone_number || '');
      
      if (result.success && result.data) {
        setUserBalance({
          balance: result.data.balance,
          bonus_balance: result.data.bonus_balance,
          withdrawable: result.data.withdrawable,
          non_withdrawable: result.data.non_withdrawable
        });
        console.log('✅ WalletBalanceManagement - Real-time balance loaded:', result.data);
      } else {
        console.error('❌ WalletBalanceManagement - Failed to load real-time balance:', result.message);
        
        // Fallback to old API
        const balanceData = await BalanceService.getBalance();
        if (balanceData.success && balanceData.data) {
          setUserBalance({
            balance: balanceData.data.balance || 0,
            bonus_balance: balanceData.data.bonus_balance || 0,
            withdrawable: balanceData.data.withdrawable || 0,
            non_withdrawable: balanceData.data.non_withdrawable || 0
          });
          console.log('✅ WalletBalanceManagement - Fallback balance loaded:', balanceData.data);
        }
      }
    } catch (error) {
      console.error('❌ WalletBalanceManagement - Error fetching balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Orchestrates the deposit flow
  const handleDepositClick = () => {
    if (selectedDepositMethod === 'Voucher') {
      // Show voucher modal
      setShowVoucherModal(true);
    } else if (selectedDepositMethod) {
      setComingSoonType('deposit');
      setShowComingSoonModal(true);
    }
  };

  // Orchestrates the withdrawal flow
  const handleWithdrawClick = () => {
    console.log('🔍 Debug - selectedWithdrawMethod:', selectedWithdrawMethod);
    
    if (selectedWithdrawMethod === 'Voucher') {
      // Show voucher withdraw modal
      setShowVoucherWithdrawModal(true);
    } else if (selectedWithdrawMethod === 'Cashout Agent') {
      // Show cashout agent modal
      console.log('🎯 Showing cashout agent modal');
      setShowCashoutAgentModal(true);
      console.log('🔍 Cashout Agent modal state set to true');
    } else if (selectedWithdrawMethod) {
      console.log('📅 Showing coming soon modal for:', selectedWithdrawMethod);
      setComingSoonType('withdraw');
      setShowComingSoonModal(true);
    }
  };

  // Fetch balance when modal opens
  useEffect(() => {
    if (isOpen && authState.user?.phone_number) {
      fetchUserBalance();
    }
  }, [isOpen, authState.user?.phone_number]);

  return {
    fetchUserBalance,
    handleDepositClick,
    handleWithdrawClick,
    displayBalance: userBalance.balance, // Total Balance should equal Main Balance
  };
}
