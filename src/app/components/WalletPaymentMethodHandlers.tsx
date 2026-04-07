import { useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { voucherService } from "../../services/voucher.service";

interface PaymentMethodHandlersProps {
  userBalance: {
    balance: number;
    bonus_balance: number;
    withdrawable: number;
    non_withdrawable: number;
  };
  fetchUserBalance: () => void;
  setShowVoucherModal: (show: boolean) => void;
  setShowVoucherWithdrawModal: (show: boolean) => void;
  setShowCashoutAgentModal: (show: boolean) => void;
  setSelectedDepositMethod: (method: string | null) => void;
  setSelectedWithdrawMethod: (method: string | null) => void;
}

export function useWalletPaymentMethodHandlers({
  userBalance,
  fetchUserBalance,
  setShowVoucherModal,
  setShowVoucherWithdrawModal,
  setShowCashoutAgentModal,
  setSelectedDepositMethod,
  setSelectedWithdrawMethod,
}: PaymentMethodHandlersProps) {
  const { state: authState } = useAuth();
  
  // Voucher deposit state
  const [voucherCode, setVoucherCode] = useState('');
  const [depositMessage, setDepositMessage] = useState('');
  const [showDepositMessage, setShowDepositMessage] = useState(false);
  
  // Voucher withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('20');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [showWithdrawMessage, setShowWithdrawMessage] = useState(false);
  const [voucherCodeDisplay, setVoucherCodeDisplay] = useState('');
  
  // Cashout agent state
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [cashoutMessage, setCashoutMessage] = useState('');
  const [showCashoutMessage, setShowCashoutMessage] = useState(false);

  // Processes voucher code deposits
  const handleVoucherDeposit = async () => {
    if (!voucherCode.trim()) {
      setDepositMessage('Please enter a voucher code');
      setShowDepositMessage(true);
      return;
    }

    if (!authState.user?.phone_number) {
      setDepositMessage('User phone number not found');
      setShowDepositMessage(true);
      return;
    }

    try {
      setShowDepositMessage(false);
      console.log('💰 Processing voucher deposit:', { code: voucherCode, user: authState.user?.phone_number });
      
      // Call real API
      const result = await voucherService.processVoucherDeposit({
        voucher_code: voucherCode,
        phone_number: authState.user.phone_number
      });
      
      if (result.success) {
        // Extract amount from the response message or use a default
        const amount = result.message?.match(/\$(\d+)/)?.[1] || 'amount';
        setDepositMessage(`$${amount} deposited correctly`);
        setShowDepositMessage(true);
        setVoucherCode(''); // Clear input after success
        
        // Hide message after 5 seconds
        setTimeout(() => {
          setShowDepositMessage(false);
        }, 5000);
        
        // Refresh balance after successful deposit and close modal
        setTimeout(() => {
          fetchUserBalance();
          setShowVoucherModal(false);
          setSelectedDepositMethod(null);
        }, 6000); // Close modal after message disappears
      } else {
        setDepositMessage(result.message || 'Invalid voucher code. Please try again.');
        setShowDepositMessage(true);
      }
      
    } catch (error) {
      console.error('❌ Voucher deposit error:', error);
      setDepositMessage('Invalid voucher code. Please try again.');
      setShowDepositMessage(true);
    }
  };

  // Processes voucher code withdrawals
  const handleVoucherWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 10) {
      setWithdrawMessage('Minimum withdrawal amount is $10');
      setShowWithdrawMessage(true);
      return;
    }

    if (!authState.user?.phone_number) {
      setWithdrawMessage('User phone number not found');
      setShowWithdrawMessage(true);
      return;
    }

    const requestedAmount = parseFloat(withdrawAmount);
    
    // Check if user has sufficient withdrawable balance
    if (requestedAmount > userBalance.withdrawable) {
      setWithdrawMessage(`❌ Insufficient balance. Available: $${userBalance.withdrawable}, Requested: $${requestedAmount}`);
      setShowWithdrawMessage(true);
      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setShowWithdrawMessage(false);
      }, 3000);
      return;
    }

    try {
      setShowWithdrawMessage(false);
      console.log('💰 Processing voucher withdraw:', { 
        amount: withdrawAmount,
        user: authState.user?.phone_number,
        availableBalance: userBalance.withdrawable
      });
      
      // Call real API
      const result = await voucherService.processVoucherWithdraw({
        phone_number: authState.user.phone_number,
        amount: requestedAmount
      });
      
      if (result.success) {
        // Set voucher code display (stays until modal closes)
        setVoucherCodeDisplay(result.voucher_code || 'N/A');
        
        // Show success message (disappears after 3 seconds)
        setWithdrawMessage('Voucher withdrawal successful!');
        setShowWithdrawMessage(true);
        
        // Hide message after 3 seconds
        setTimeout(() => {
          setShowWithdrawMessage(false);
        }, 3000);
        
        // Refresh balance after successful withdrawal
        setTimeout(() => {
          fetchUserBalance();
        }, 1000);
      } else {
        setWithdrawMessage(result.message || 'Withdrawal failed. Please try again.');
        setShowWithdrawMessage(true);
      }
      
    } catch (error) {
      console.error('❌ Voucher withdrawal error:', error);
      setWithdrawMessage('Withdrawal failed. Please try again.');
      setShowWithdrawMessage(true);
    }
  };

  // Processes cashout agent withdrawal requests
  const handleCashoutAgent = async () => {
    if (!cashoutAmount || parseFloat(cashoutAmount) < 50) {
      setCashoutMessage('Minimum withdrawal amount is $50');
      setShowCashoutMessage(true);
      return;
    }

    if (parseFloat(cashoutAmount) > 5000) {
      setCashoutMessage('Maximum withdrawal amount is $5,000');
      setShowCashoutMessage(true);
      return;
    }

    if (!authState.user?.phone_number) {
      setCashoutMessage('User phone number not found');
      setShowCashoutMessage(true);
      return;
    }

    const requestedAmount = parseFloat(cashoutAmount);
    
    // Check if user has sufficient withdrawable balance
    if (requestedAmount > userBalance.withdrawable) {
      setCashoutMessage(`❌ Insufficient balance. Available: $${userBalance.withdrawable}, Requested: $${requestedAmount}`);
      setShowCashoutMessage(true);
      setTimeout(() => {
        setShowCashoutMessage(false);
      }, 3000);
      return;
    }

    try {
      setShowCashoutMessage(false);
      console.log('💰 Processing cashout agent withdrawal:', { 
        amount: cashoutAmount,
        user: authState.user?.phone_number,
        availableBalance: userBalance.withdrawable
      });
      
      // Call the real cashout agent API
      const response = await fetch('https://smart-bet-backend-7wntmhyi0-kaleabs-projects-1bd541ea.vercel.app/api/cashout-agent/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          withdraw_player: authState.user?.phone_number,
          amount: parseFloat(cashoutAmount),
          cashier_name: 'agent' // This will be updated when we have cashier auth
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Show success message with cashier code
        setCashoutMessage(`Cashout request submitted successfully! Your code is: ${data.data.cashier_code}`);
        setShowCashoutMessage(true);
        
        // Hide message after 5 seconds
        setTimeout(() => {
          setShowCashoutMessage(false);
        }, 5000);
        
        // Clear form and close modal after success
        setTimeout(() => {
          setCashoutAmount('');
          setShowCashoutAgentModal(false);
          setSelectedWithdrawMethod(null);
          // Refresh balance after successful withdrawal
          fetchUserBalance();
        }, 6000);
        
      } else {
        throw new Error(data.message || 'Cashout request failed');
      }
      
    } catch (error: any) {
      console.error('❌ Cashout agent withdrawal error:', error);
      setCashoutMessage(error.message || 'Failed to submit cashout request. Please try again.');
      setShowCashoutMessage(true);
    }
  };

  return {
    // Voucher deposit
    voucherCode,
    setVoucherCode,
    depositMessage,
    showDepositMessage,
    setShowDepositMessage,
    handleVoucherDeposit,
    
    // Voucher withdraw
    withdrawAmount,
    setWithdrawAmount,
    withdrawMessage,
    showWithdrawMessage,
    setShowWithdrawMessage,
    voucherCodeDisplay,
    setVoucherCodeDisplay,
    handleVoucherWithdraw,
    
    // Cashout agent
    cashoutAmount,
    setCashoutAmount,
    cashoutMessage,
    showCashoutMessage,
    setShowCashoutMessage,
    handleCashoutAgent,
  };
}
