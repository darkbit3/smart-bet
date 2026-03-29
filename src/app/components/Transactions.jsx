import { useState, useEffect } from 'react';
import { History, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { TransactionService } from '../../services/transaction.service';

export function Transactions({ phoneNumber }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!phoneNumber) {
      setIsLoading(false);
      return;
    }

    const loadTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await TransactionService.getUserTransactions(phoneNumber);
        
        if (result.success) {
          setTransactions(result.transactions || []);
          console.log('✅ Loaded transactions:', result.transactions.length);
        } else {
          setError(result.message || 'Failed to load transactions');
        }
      } catch (err) {
        console.error('❌ Error loading transactions:', err);
        setError('Failed to load transactions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [phoneNumber]);

  const getMethodColor = (method) => {
    switch (method) {
      case 'Deposit': return 'text-green-400 bg-green-900';
      case 'Withdraw': return 'text-blue-400 bg-blue-900';
      case 'Bet': return 'text-purple-400 bg-purple-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-200 bg-green-900';
      case 'Won': return 'text-green-200 bg-green-900';
      case 'Lost': return 'text-red-200 bg-red-900';
      case 'Pending': return 'text-yellow-200 bg-yellow-900';
      default: return 'text-gray-200 bg-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-[#FFD700]" />
              Transaction History
            </h3>
          </div>
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent animate-spin rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-[#FFD700]" />
              Transaction History
            </h3>
          </div>
          <div className="text-center py-8 text-red-400">
            <History className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#FFD700]" />
            Transaction History
          </h3>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="w-8 h-8 mx-auto mb-3 text-gray-500" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#2A2A2A] z-10">
                  <tr className="border-b border-[#3A3A3A] text-left">
                    <th className="px-4 py-3 text-gray-400">Time</th>
                    <th className="px-4 py-3 text-gray-400">Phone Number</th>
                    <th className="px-4 py-3 text-gray-400">Method</th>
                    <th className="px-4 py-3 text-gray-400">Status</th>
                    <th className="px-4 py-3 text-gray-400">Old Balance</th>
                    <th className="px-4 py-3 text-gray-400">New</th>
                    <th className="px-4 py-3 text-gray-400">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id} 
                      className={`border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors ${
                        index < 7 ? '' : 'scroll-row'
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(transaction.time).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {transaction.phonenumber}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getMethodColor(transaction.method)}`}>
                          {transaction.method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        ${transaction.old_balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {transaction.new_balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        ${transaction.new_balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Scroll indicator for more than 7 transactions */}
            {transactions.length > 7 && (
              <div className="mt-2 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                  <span>Scroll for more transactions ({transactions.length - 7} more)</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}