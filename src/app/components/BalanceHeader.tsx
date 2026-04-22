import { Wallet, Plus, User, ChevronDown, ScrollText, Gift, Settings, LogOut, MessageSquare, History, Eye, EyeOff, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { DesktopNav } from "./DesktopNav";
import { useNavigate } from "react-router";
import { Badge } from "./ui/badge";
import { useBalance } from "../../contexts/BalanceContext";
import { useAuth } from "../../contexts/UserContext";
import { BalanceApiService } from "../../services/balance-api.service";

interface BalanceHeaderProps {
  onSignOut?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
  onDeposit?: () => void;
  onAccount?: () => void;
  onSettings?: () => void;
}

export function BalanceHeader({ onSignOut, onLogin, onRegister, onDeposit, onAccount, onSettings }: BalanceHeaderProps) {
  const { state } = useAuth();
  const { balances, isLoading: balanceLoading, refreshBalance, lastUpdated } = useBalance();
  const navigate = useNavigate();
  
  // Debug props
  console.log('💰 BalanceHeader - Real-time balances:', { balances, balanceLoading, lastUpdated });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [showAccountHistoryModal, setShowAccountHistoryModal] = useState(false);
  const [accountHistory] = useState<any[]>([]);
  const [historyLoading] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Calculate authentication status
  const isAuthenticated = Boolean(state.user && state.user.username && state.user.username.trim().length > 0);
  const username = state.user?.username;
  const phoneNumber = state.user?.phone_number;
  
  console.log('💰 BalanceHeader - Username:', username, 'IsAuthenticated:', isAuthenticated);

  // Subscribe to real-time balance updates when authenticated
  useEffect(() => {
    if (isAuthenticated && username) {
      console.log('🔔 Real-time balance updates active for user:', username);
    }
  }, [isAuthenticated, username]);

  const toggleBalanceDropdown = async () => {
    const newState = !showBalanceDropdown;
    setShowBalanceDropdown(newState);
    
    // When opened, fetch latest balances
    if (newState && isAuthenticated) {
      await refreshBalance();
    }
  };

  // Calculate Total Balance as sum of all balance types
  const totalBalance = balances.withdrawable + balances.non_withdrawable + balances.bonus_balance;
  const displayBalance = totalBalance;

  // Debug: Log the balance values to see what we're getting
  console.log('💰 BalanceHeader - Balance Values Debug:', {
    mainBalance: balances.balance,
    withdrawable: balances.withdrawable,
    nonWithdrawable: balances.non_withdrawable,
    bonusBalance: balances.bonus_balance,
    calculatedTotal: displayBalance,
    username: username,
    phoneNumber: phoneNumber
  });

  const BalanceDetails = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">Main Balance</div>
          <div className="text-sm font-semibold text-white">${balances.balance.toFixed(2)}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500" />
      </div>
      <div className="h-px bg-[#2A2A2A]" />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">Non-Withdrawable</div>
          <div className="text-sm font-semibold text-white">${balances.non_withdrawable.toFixed(2)}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">Bonus Balance</div>
          <div className="text-sm font-semibold text-[#FFD700]">${balances.bonus_balance.toFixed(2)}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">Withdrawable</div>
          <div className="text-sm font-semibold text-green-400">${balances.withdrawable.toFixed(2)}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
    </>
  );

  const handleSignOut = () => {
    setShowDropdown(false);
    onSignOut?.();
    navigate("/login");
  };

  const handleRefreshBalance = async () => {
    if (isRefreshingBalance || !isAuthenticated || !phoneNumber) return;
    
    setIsRefreshingBalance(true);
    try {
      console.log('🔄 Manually refreshing balance with new API...');
      
      // Use the new Balance API Service directly
      const result = await BalanceApiService.getRealTimeBalance(phoneNumber);
      
      if (result.success && result.data) {
        console.log('✅ Real-time balance loaded:', result.data);
        
        // Update the balance context by calling refreshBalance which now uses the new API
        await refreshBalance();
        
        console.log('✅ Balance refreshed with real-time data');
      } else {
        console.error('❌ Failed to load real-time balance:', result.message);
      }
    } catch (error) {
      console.error('❌ Error refreshing balance:', error);
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  return (
    <>
    <div className="glass-dark border-b border-border/20 px-4 py-3 backdrop-blur-xl">
        <div className="responsive-container flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              navigate("/home/casino");
              window.location.reload();
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
              <span className="text-[#121212] font-bold text-xl">S</span>
            </div>
            <span className="text-[#FFD700] font-bold text-xl hidden sm:block">Smart Bet</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block relative">
                <button
                  onClick={toggleBalanceDropdown}
                  className="card-modern flex items-center gap-4 px-4 py-2 cursor-pointer hover-lift"
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#FFD700]" />
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Total Balance</div>
                      <div className="text-sm font-semibold text-white">
                        {balanceLoading ? (
                          <span className="inline-block h-4 w-20 bg-gray-600 rounded animate-pulse" />
                        ) : isBalanceHidden ? (
                          "••••••"
                        ) : (
                          `$${displayBalance.toFixed(2)}`
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBalanceHidden((prev) => !prev);
                    }}
                    className="text-gray-400 hover:text-white cursor-pointer"
                    role="button"
                    aria-label={isBalanceHidden ? "Show balance" : "Hide balance"}
                  >
                    {isBalanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefreshBalance();
                    }}
                    className={`text-gray-400 hover:text-white cursor-pointer transition-colors ${
                      isRefreshingBalance ? 'animate-spin' : ''
                    }`}
                    role="button"
                    aria-label="Refresh balance"
                    title="Refresh balance"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </span>
                </button>

                {showBalanceDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowBalanceDropdown(false)} />
                    <div className="absolute left-0 mt-2 w-64 modal-content-modern shadow-glow animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-[#2A2A2A]">
                        <div className="text-xs text-gray-400 mb-1">Balance Overview</div>
                      </div>
                      <div className="p-3 space-y-3">
                        <BalanceDetails />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="sm:hidden relative">
                <button
                  onClick={toggleBalanceDropdown}
                  className="card-modern flex items-center gap-2 px-3 py-2 cursor-pointer hover-lift"
                >
                  <Wallet className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm font-semibold text-white">
                    {balanceLoading ? (
                      <span className="inline-block h-4 w-16 bg-gray-600 rounded animate-pulse" />
                    ) : isBalanceHidden ? (
                      "••••••"
                    ) : (
                      `$${displayBalance.toFixed(2)}`
                    )}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBalanceHidden((prev) => !prev);
                    }}
                    className="text-gray-400 hover:text-white cursor-pointer"
                    role="button"
                    aria-label={isBalanceHidden ? "Show balance" : "Hide balance"}
                  >
                    {isBalanceHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefreshBalance();
                    }}
                    className={`text-gray-400 hover:text-white cursor-pointer transition-colors ${
                      isRefreshingBalance ? 'animate-spin' : ''
                    }`}
                    role="button"
                    aria-label="Refresh balance"
                    title="Refresh balance"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {showBalanceDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowBalanceDropdown(false)} />
                    <div className="absolute left-0 mt-2 w-56 modal-content-modern shadow-glow animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-[#2A2A2A]">
                        <div className="text-xs text-gray-400 mb-1">Balance Overview</div>
                      </div>
                      <div className="p-3 space-y-3">
                        <BalanceDetails />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => onDeposit?.()}
                className="bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Deposit</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="card-modern text-white px-3 py-2 flex items-center gap-2 cursor-pointer hover-lift"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">{username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 modal-content-modern shadow-glow animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-[#2A2A2A]">
                        <div className="text-sm text-white font-semibold">{username}</div>
                        <div className="text-xs text-gray-400">VIP Level: Gold</div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onAccount?.();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2">
                          <ScrollText className="w-4 h-4" />
                          Bet History
                        </button>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onDeposit?.();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Deposit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          Bonuses
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Messages
                        </button>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            setShowAccountHistoryModal(true);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                        >
                          <History className="w-4 h-4" />
                          Account History
                        </button>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onSettings?.();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <div className="border-t border-[#2A2A2A] mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLogin?.()}
                className="border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-lg hover:bg-[#FFD700] hover:text-[#121212] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onRegister?.()}
                className="bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg hover:bg-[#FFC700] transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="glass-dark border-b border-[#2A2A2A] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <DesktopNav />
        </div>
      </div>

      {/* Account History Modal */}
      {showAccountHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-modern p-4 animate-fade-in" onClick={() => setShowAccountHistoryModal(false)}>
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="modal-content-modern w-full max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-modern hover-lift"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Account History
              </h2>
              <button 
                onClick={() => setShowAccountHistoryModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-4 relative">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{username}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium text-gray-900">{phoneNumber}</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-white/90 px-4 py-2 rounded-lg shadow-lg border border-purple-200">
                  <div className="text-sm text-gray-600">Current Balance:</div>
                  <div className="text-xl font-bold text-purple-700">${displayBalance.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* History Table */}
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400">Loading account history...</p>
              </div>
            ) : accountHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No account history found
                </h3>
                <p className="text-gray-400">
                  You haven't had any account activities yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">Date & Time</th>
                      <th className="text-left p-3 font-medium text-gray-700">Type</th>
                      <th className="text-left p-3 font-medium text-gray-700">Game</th>
                      <th className="text-left p-3 font-medium text-gray-700">Description</th>
                      <th className="text-left p-3 font-medium text-gray-700">Odds</th>
                      <th className="text-left p-3 font-medium text-gray-700">Result</th>
                      <th className="text-left p-3 font-medium text-gray-700">Amount</th>
                      <th className="text-left p-3 font-medium text-gray-700">Balance Before</th>
                      <th className="text-left p-3 font-medium text-gray-700">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountHistory.map((activity) => (
                      <tr key={activity.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={
                              activity.type === 'deposit' ? 'default' :
                              activity.type === 'withdraw' ? 'destructive' :
                              activity.type === 'bet' ? 'secondary' :
                              activity.type === 'win' ? 'default' :
                              activity.type === 'bonus' ? 'default' :
                              'secondary'
                            }
                            className="capitalize"
                          >
                            {activity.type}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{activity.game}</td>
                        <td className="p-3 text-sm">{activity.description}</td>
                        <td className="p-3 text-sm">{activity.odds || '-'}</td>
                        <td className="p-3 text-sm">{activity.result || '-'}</td>
                        <td className="p-3">
                          <span className={`font-medium ${
                            activity.type === 'deposit' || activity.type === 'win' || activity.type === 'bonus' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {activity.type === 'deposit' || activity.type === 'win' || activity.type === 'bonus' ? '+' : '-'}${activity.amount}
                          </span>
                        </td>
                        <td className="p-3 text-sm">${activity.balance_before}</td>
                        <td className="p-3 text-sm font-medium">${activity.balance_after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}