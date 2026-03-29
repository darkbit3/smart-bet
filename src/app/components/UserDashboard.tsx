import { useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { Wallet, User, LogOut, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

export default function UserDashboard() {
  const { user, isAuthenticated, getBalance, updateBalance, logout, isLoading } = useAuth();
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [testAmount, setTestAmount] = useState("10");

  const handleRefreshBalance = async () => {
    setBalanceLoading(true);
    try {
      await getBalance();
    } catch (error) {
      console.error('Failed to refresh balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleTestCredit = async () => {
    try {
      await updateBalance(parseFloat(testAmount), 'credit');
    } catch (error) {
      console.error('Failed to credit balance');
    }
  };

  const handleTestDebit = async () => {
    try {
      await updateBalance(parseFloat(testAmount), 'debit');
    } catch (error) {
      console.error('Failed to debit balance');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Not Logged In</h3>
          <p className="text-gray-400 mb-4">Please login to view your dashboard</p>
          <a
            href="/auth"
            className="inline-block bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Login / Register
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Header */}
      <div className="bg-gradient-to-r from-[#FFD700]/20 to-orange-500/20 border border-[#FFD700]/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.username}
              </h2>
              <p className="text-gray-300">Phone: {user.phone_number}</p>
            </div>
          </div>
          <button
            onClick={logout}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? '...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#FFD700]" />
            Account Balance
          </h3>
          <button
            onClick={handleRefreshBalance}
            disabled={balanceLoading}
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:bg-gray-700 text-white p-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${balanceLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#FFD700] mb-2">
            ${(user.non_withdrawable + user.withdrawable + user.bonus_balance).toFixed(2)}
          </div>
          <p className="text-gray-400">Available Balance</p>
        </div>

        {/* Test Balance Controls */}
        <div className="border-t border-[#2A2A2A] pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Test Balance Controls</h4>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white w-24"
              min="1"
              step="0.01"
            />
            <button
              onClick={handleTestCredit}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Credit
            </button>
            <button
              onClick={handleTestDebit}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Debit
            </button>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Account Status</h4>
          <p className="text-lg font-semibold text-green-400">
            {user.status === 'active' ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Member Since</h4>
          <p className="text-lg font-semibold text-white">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">User ID</h4>
          <p className="text-lg font-semibold text-white">#{user.id}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/home/bingo"
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg p-4 text-center transition-colors group"
          >
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-white font-semibold group-hover:text-[#FFD700] transition-colors">
              Play Bingo
            </h4>
            <p className="text-gray-400 text-sm">Join exciting bingo games</p>
          </a>
          <a
            href="/home/sports"
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg p-4 text-center transition-colors group"
          >
            <div className="text-2xl mb-2">⚽</div>
            <h4 className="text-white font-semibold group-hover:text-[#FFD700] transition-colors">
              Sports Betting
            </h4>
            <p className="text-gray-400 text-sm">Bet on your favorite sports</p>
          </a>
        </div>
      </div>
    </div>
  );
}
