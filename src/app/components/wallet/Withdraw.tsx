import { CreditCard } from 'lucide-react';

interface WithdrawProps {
  selectedWithdrawMethod: string | null;
  setSelectedWithdrawMethod: (method: string | null) => void;
  handleWithdrawClick: () => void;
}

export function Withdraw({ selectedWithdrawMethod, setSelectedWithdrawMethod, handleWithdrawClick }: WithdrawProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Withdraw Funds</h3>
      
      {/* Withdrawal Methods */}
      <div className="space-y-4">
        <label className="block text-lg text-gray-400">Choose Withdrawal Method</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setSelectedWithdrawMethod('Bank Transfer')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedWithdrawMethod === 'Bank Transfer'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedWithdrawMethod === 'Bank Transfer' ? 'bg-[#121212]' : 'bg-blue-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedWithdrawMethod === 'Bank Transfer' ? 'text-[#121212]' : 'text-white'
                }`}>Bank Transfer</div>
                <div className={`text-sm ${
                  selectedWithdrawMethod === 'Bank Transfer' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Direct to your bank</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedWithdrawMethod === 'Bank Transfer' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: 1-3 days</div>
          </button>

          <button 
            onClick={() => setSelectedWithdrawMethod('PayPal')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedWithdrawMethod === 'PayPal'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedWithdrawMethod === 'PayPal' ? 'bg-[#121212]' : 'bg-blue-600'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedWithdrawMethod === 'PayPal' ? 'text-[#121212]' : 'text-white'
                }`}>PayPal</div>
                <div className={`text-sm ${
                  selectedWithdrawMethod === 'PayPal' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Fast payout</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedWithdrawMethod === 'PayPal' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: 1-2 hours</div>
          </button>

          <button 
            onClick={() => setSelectedWithdrawMethod('Crypto')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedWithdrawMethod === 'Crypto'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedWithdrawMethod === 'Crypto' ? 'bg-[#121212]' : 'bg-orange-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedWithdrawMethod === 'Crypto' ? 'text-[#121212]' : 'text-white'
                }`}>Crypto</div>
                <div className={`text-sm ${
                  selectedWithdrawMethod === 'Crypto' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Bitcoin, Ethereum</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedWithdrawMethod === 'Crypto' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: 10-30 min</div>
          </button>

          <button 
            onClick={() => setSelectedWithdrawMethod('Voucher')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedWithdrawMethod === 'Voucher'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedWithdrawMethod === 'Voucher' ? 'bg-[#121212]' : 'bg-purple-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedWithdrawMethod === 'Voucher' ? 'text-[#121212]' : 'text-white'
                }`}>Voucher</div>
                <div className={`text-sm ${
                  selectedWithdrawMethod === 'Voucher' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Fast & secure transfer</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedWithdrawMethod === 'Voucher' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: Instant</div>
          </button>

          <button 
            onClick={() => {
              console.log('🔴 Cashout Agent button clicked');
              setSelectedWithdrawMethod('Cashout Agent');
            }}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedWithdrawMethod === 'Cashout Agent'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedWithdrawMethod === 'Cashout Agent' ? 'bg-[#121212]' : 'bg-red-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedWithdrawMethod === 'Cashout Agent' ? 'text-[#121212]' : 'text-white'
                }`}>Cashout Agent</div>
                <div className={`text-sm ${
                  selectedWithdrawMethod === 'Cashout Agent' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Agent-assisted withdrawal</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedWithdrawMethod === 'Cashout Agent' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: 30 min - 2 hours</div>
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        Minimum withdrawal: $10 | Maximum: $10,000 per day | Processing time varies by method
      </div>
      
      <button 
        onClick={handleWithdrawClick}
        disabled={!selectedWithdrawMethod}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
          selectedWithdrawMethod
            ? 'bg-[#FFD700] text-[#121212] hover:bg-[#FFC700]'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {selectedWithdrawMethod === 'Voucher' ? 'Withdraw Voucher' : 'Withdraw Now'}
      </button>
    </div>
  );
}
