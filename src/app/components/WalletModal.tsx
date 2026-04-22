import { useState, useEffect } from "react";
import { X, CreditCard, ArrowDown, ArrowUp, History } from "lucide-react";
import { Deposit } from "./wallet/Deposit";
import { Withdraw } from "./wallet/Withdraw";
import { Transaction } from "./wallet/Transaction";
import { WalletBalanceManagement } from "./WalletBalanceManagement";
import { useWalletPaymentMethodHandlers } from "./WalletPaymentMethodHandlers";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  bonusBalance: number;
  withdrawable: number;
  nonWithdrawable: number;
  phoneNumber?: string | null;
}

export function WalletModal({ isOpen, onClose, phoneNumber }: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transaction">("deposit");
  
  // Real balance state
  const [userBalance, setUserBalance] = useState({
    balance: 0,
    bonus_balance: 0,
    withdrawable: 0,
    non_withdrawable: 0
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Payment method selection state
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<string | null>(null);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<string | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonType, setComingSoonType] = useState<'deposit' | 'withdraw'>('deposit');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showVoucherWithdrawModal, setShowVoucherWithdrawModal] = useState(false);
  const [showCashoutAgentModal, setShowCashoutAgentModal] = useState(false);

  // Use balance management hook
  const balanceManagement = WalletBalanceManagement({
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
  });

  // Use payment method handlers hook
  const paymentHandlers = useWalletPaymentMethodHandlers({
    userBalance,
    fetchUserBalance: balanceManagement.fetchUserBalance,
    setShowVoucherModal,
    setShowVoucherWithdrawModal,
    setShowCashoutAgentModal,
    setSelectedDepositMethod,
    setSelectedWithdrawMethod,
  });

  // Close modals when switching tabs or closing main modal
  useEffect(() => {
    if (!isOpen || activeTab !== "withdraw") {
      setShowVoucherWithdrawModal(false);
      setShowVoucherModal(false);
      setShowCashoutAgentModal(false);
      paymentHandlers.setVoucherCodeDisplay('');
      paymentHandlers.setCashoutAmount('');
    }
  }, [isOpen, activeTab]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const tabs = [
    { id: "deposit" as const, label: "Deposit", icon: ArrowDown },
    { id: "withdraw" as const, label: "Withdraw", icon: ArrowUp },
    { id: "transaction" as const, label: "Transaction", icon: History },
  ];

  return isOpen ? (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/80"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="modal-modern w-full max-w-5xl overflow-hidden max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
            <h2 className="text-xl font-bold text-white">Wallet</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Summary */}
          <div className="p-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
            {isLoadingBalance ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent animate-spin rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">Total Balance</div>
                  <div className="text-lg font-semibold text-white">${balanceManagement.displayBalance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Bonus Balance</div>
                  <div className="text-lg font-semibold text-[#FFD700]">${userBalance.bonus_balance.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Bingo Game Section */}
          <div className="p-4 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-39c9704e5cf5?auto=format&fit=crop&w=400&q=80"
                  alt="Bingo Game"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">BINGO</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Play Bingo Now!</h3>
                <p className="text-sm text-gray-400 mb-3">Experience the excitement of Bingo with Smart Bet Gaming</p>
                <button
                  onClick={() => {
                    // Show confirmation panel before navigating
                    const confirmed = window.confirm(
                      'Do you want to play Bingo with your Smart Bet account?\n\n' +
                      'Click OK to play with your balance and player ID displayed.\n' +
                      'Click Cancel to play without Smart Bet integration.'
                    );
                    
                    if (confirmed) {
                      // Store navigation flag for cashier integration
                      sessionStorage.setItem('fromCashier', 'true');
                      sessionStorage.setItem('showPlayerData', 'true');
                      // Open Bingo Front in the same window
                      window.location.href = 'http://localhost:5173';
                    } else {
                      // Store navigation flag for normal play
                      sessionStorage.setItem('fromCashier', 'false');
                      sessionStorage.setItem('showPlayerData', 'false');
                      // Open Bingo Front in the same window
                      window.location.href = 'http://localhost:5173';
                    }
                  }}
                  className="bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  Play Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#2A2A2A]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#FFD700] text-[#121212]"
                      : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "deposit" && (
              <Deposit 
                selectedDepositMethod={selectedDepositMethod}
                setSelectedDepositMethod={setSelectedDepositMethod}
                handleDepositClick={balanceManagement.handleDepositClick}
              />
            )}

            {activeTab === "withdraw" && (
              <Withdraw 
                selectedWithdrawMethod={selectedWithdrawMethod}
                setSelectedWithdrawMethod={setSelectedWithdrawMethod}
                handleWithdrawClick={balanceManagement.handleWithdrawClick}
              />
            )}

            {activeTab === "transaction" && (
              <Transaction phoneNumber={phoneNumber || null} />
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="modal-modern w-full max-w-md p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8 text-[#121212]" />
              </div>
              
              <h3 className="text-2xl font-bold text-white">Coming Soon!</h3>
              
              <p className="text-gray-300">
                {comingSoonType === 'deposit' 
                  ? `Deposit via ${selectedDepositMethod} will be available soon. We&apos;re working hard to bring you the best payment experience.`
                  : `Withdrawal via ${selectedWithdrawMethod} will be available soon. We&apos;re working hard to bring you the best payment experience.`
                }
              </p>
              
              <div className="space-y-2 text-sm text-gray-400">
                <p>🚀 New payment methods coming soon</p>
                <p>💰 Enhanced security features</p>
                <p>⚡ Faster processing times</p>
              </div>
              
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full bg-[#FFD700] text-[#121212] py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <VoucherModal
          isOpen={showVoucherModal}
          onClose={() => setShowVoucherModal(false)}
          voucherCode={paymentHandlers.voucherCode}
          setVoucherCode={paymentHandlers.setVoucherCode}
          onDeposit={paymentHandlers.handleVoucherDeposit}
          message={paymentHandlers.depositMessage}
          showMessage={paymentHandlers.showDepositMessage}
          setShowMessage={paymentHandlers.setShowDepositMessage}
        />
      )}

      {/* Voucher Withdraw Modal */}
      {showVoucherWithdrawModal && (
        <VoucherWithdrawModal
          isOpen={showVoucherWithdrawModal}
          onClose={() => setShowVoucherWithdrawModal(false)}
          withdrawAmount={paymentHandlers.withdrawAmount}
          setWithdrawAmount={paymentHandlers.setWithdrawAmount}
          onWithdraw={paymentHandlers.handleVoucherWithdraw}
          message={paymentHandlers.withdrawMessage}
          showMessage={paymentHandlers.showWithdrawMessage}
          setShowMessage={paymentHandlers.setShowWithdrawMessage}
          voucherCodeDisplay={paymentHandlers.voucherCodeDisplay}
        />
      )}

      {/* Cashout Agent Modal */}
      {showCashoutAgentModal && (
        <CashoutAgentModal
          isOpen={showCashoutAgentModal}
          onClose={() => setShowCashoutAgentModal(false)}
          cashoutAmount={paymentHandlers.cashoutAmount}
          setCashoutAmount={paymentHandlers.setCashoutAmount}
          onCashout={paymentHandlers.handleCashoutAgent}
          message={paymentHandlers.cashoutMessage}
          showMessage={paymentHandlers.showCashoutMessage}
          setShowMessage={paymentHandlers.setShowCashoutMessage}
        />
      )}
    </>
  ) : null;
}

// Separate modal components for better organization
function VoucherModal({ isOpen, onClose, voucherCode, setVoucherCode, onDeposit, message, showMessage, setShowMessage }: any) {
  return isOpen ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-modern w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Voucher Deposit</h3>
              <p className="text-sm text-gray-400">Processing: Instant</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Voucher Code</label>
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter voucher code"
              className="input-modern w-full px-4 py-3 focus-modern"
            />
          </div>

          {showMessage && (
            <div className={`p-4 rounded-lg text-sm ${
              message.includes('successful') 
                ? 'bg-green-900/30 border border-green-500/30 text-green-400'
                : 'bg-red-900/30 border border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-3">
            <button onClick={onDeposit} className="w-full bg-[#FFD700] text-[#121212] py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-colors">
              Deposit
            </button>
            <button 
              onClick={() => {
                onClose();
                setVoucherCode('');
                setShowMessage(false);
              }} 
              className="w-full bg-transparent border border-[#2A2A2A] text-gray-400 py-3 rounded-lg font-semibold hover:border-[#FFD700] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function VoucherWithdrawModal({ isOpen, onClose, withdrawAmount, setWithdrawAmount, onWithdraw, message, showMessage, setShowMessage, voucherCodeDisplay }: any) {
  return isOpen ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-modern w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Voucher Withdraw</h3>
              <p className="text-sm text-gray-400">Processing: Instant</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Withdrawal Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {['20', '50', '100', '200', '500', '1000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWithdrawAmount(amount)}
                  className={`py-2 px-3 rounded-lg font-semibold transition-colors ${
                    withdrawAmount === amount
                      ? 'bg-[#FFD700] text-[#121212]'
                      : 'bg-[#1A1A1A] text-white border border-[#2A2A2A] hover:border-[#FFD700]'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="input-modern w-full px-4 py-3 focus-modern"
            />
          </div>

          {voucherCodeDisplay && (
            <div className="p-4 bg-[#FFD700] rounded-lg text-center">
              <div className="text-xs text-[#121212] font-semibold mb-2">YOUR VOUCHER CODE</div>
              <div className="text-2xl font-bold text-[#121212] tracking-wider font-mono">
                {voucherCodeDisplay}
              </div>
            </div>
          )}

          {showMessage && (
            <div className={`p-4 rounded-lg text-sm ${
              message.includes('successful') 
                ? 'bg-green-900/30 border border-green-500/30 text-green-400'
                : 'bg-red-900/30 border border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-3">
            <button onClick={onWithdraw} className="w-full bg-[#FFD700] text-[#121212] py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-colors">
              Withdraw
            </button>
            <button 
              onClick={() => {
                onClose();
                setWithdrawAmount('20');
                setShowMessage(false);
              }} 
              className="w-full bg-transparent border border-[#2A2A2A] text-gray-400 py-3 rounded-lg font-semibold hover:border-[#FFD700] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function CashoutAgentModal({ isOpen, onClose, cashoutAmount, setCashoutAmount, onCashout, message, showMessage, setShowMessage }: any) {
  return isOpen ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-modern w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Cashout Agent</h3>
              <p className="text-sm text-gray-400">Processing: 30 min - 2 hours</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Withdrawal Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {['50', '100', '200', '500', '1000', '5000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCashoutAmount(amount)}
                  className={`py-2 px-3 rounded-lg font-semibold transition-colors ${
                    cashoutAmount === amount
                      ? 'bg-[#FFD700] text-[#121212]'
                      : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={cashoutAmount}
              onChange={(e) => setCashoutAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="input-modern w-full px-4 py-3 focus-modern"
              min="50"
              max="5000"
            />
          </div>

          {showMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('successfully') 
                ? 'bg-green-900/20 border border-green-500/30 text-green-300'
                : 'bg-red-900/20 border border-red-500/30 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={onCashout}
              disabled={!cashoutAmount || parseFloat(cashoutAmount) < 50 || parseFloat(cashoutAmount) > 5000}
              className={`w-full py-3 rounded-lg font-bold transition-colors ${
                cashoutAmount && parseFloat(cashoutAmount) >= 50 && parseFloat(cashoutAmount) <= 5000
                  ? 'bg-[#FFD700] text-[#121212] hover:bg-[#FFC700]'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Withdraw Now
            </button>
            <button 
              onClick={() => {
                onClose();
                setCashoutAmount('');
                setShowMessage(false);
              }} 
              className="w-full bg-transparent border border-[#2A2A2A] text-gray-400 py-3 rounded-lg font-semibold hover:border-[#FFD700] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
