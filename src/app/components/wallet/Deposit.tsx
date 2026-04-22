import { CreditCard } from 'lucide-react';

interface DepositProps {
  selectedDepositMethod: string | null;
  setSelectedDepositMethod: (method: string | null) => void;
  handleDepositClick: () => void;
}

export function Deposit({ selectedDepositMethod, setSelectedDepositMethod, handleDepositClick }: DepositProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Deposit Funds</h3>
      
      {/* Payment Methods */}
      <div className="space-y-4">
        <label className="block text-lg text-gray-400">Choose Payment Method</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setSelectedDepositMethod('Bank Transfer')}
            className={`card-modern p-6 transition-colors text-left cursor-pointer ${
              selectedDepositMethod === 'Bank Transfer'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700] shadow-glow'
                : 'hover-lift'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedDepositMethod === 'Bank Transfer' ? 'bg-[#121212]' : 'bg-blue-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedDepositMethod === 'Bank Transfer' ? 'text-[#121212]' : 'text-white'
                }`}>Bank Transfer</div>
                <div className={`text-sm ${
                  selectedDepositMethod === 'Bank Transfer' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Direct bank deposit</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedDepositMethod === 'Bank Transfer' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: Instant</div>
          </button>

          <button 
            onClick={() => setSelectedDepositMethod('Credit Card')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedDepositMethod === 'Credit Card'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedDepositMethod === 'Credit Card' ? 'bg-[#121212]' : 'bg-green-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedDepositMethod === 'Credit Card' ? 'text-[#121212]' : 'text-white'
                }`}>Credit Card</div>
                <div className={`text-sm ${
                  selectedDepositMethod === 'Credit Card' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Visa, Mastercard</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedDepositMethod === 'Credit Card' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: Instant</div>
          </button>

          <button 
            onClick={() => setSelectedDepositMethod('PayPal')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedDepositMethod === 'PayPal'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedDepositMethod === 'PayPal' ? 'bg-[#121212]' : 'bg-blue-600'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedDepositMethod === 'PayPal' ? 'text-[#121212]' : 'text-white'
                }`}>PayPal</div>
                <div className={`text-sm ${
                  selectedDepositMethod === 'PayPal' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Secure payment</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedDepositMethod === 'PayPal' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: Instant</div>
          </button>

          <button 
            onClick={() => setSelectedDepositMethod('Crypto')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedDepositMethod === 'Crypto'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedDepositMethod === 'Crypto' ? 'bg-[#121212]' : 'bg-orange-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedDepositMethod === 'Crypto' ? 'text-[#121212]' : 'text-white'
                }`}>Crypto</div>
                <div className={`text-sm ${
                  selectedDepositMethod === 'Crypto' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Bitcoin, Ethereum</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedDepositMethod === 'Crypto' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: 10-30 min</div>
          </button>

          <button 
            onClick={() => setSelectedDepositMethod('Voucher')}
            className={`p-6 border rounded-lg transition-colors text-left ${
              selectedDepositMethod === 'Voucher'
                ? 'bg-[#FFD700] text-[#121212] border-[#FFD700]'
                : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FFD700]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedDepositMethod === 'Voucher' ? 'bg-[#121212]' : 'bg-purple-500'
              }`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  selectedDepositMethod === 'Voucher' ? 'text-[#121212]' : 'text-white'
                }`}>Voucher</div>
                <div className={`text-sm ${
                  selectedDepositMethod === 'Voucher' ? 'text-[#666666]' : 'text-gray-400'
                }`}>Fast & secure transfer</div>
              </div>
            </div>
            <div className={`text-xs ${
              selectedDepositMethod === 'Voucher' ? 'text-[#666666]' : 'text-gray-500'
            }`}>Processing: Instant</div>
          </button>
        </div>
      </div>

      {/* Regular Deposit Button for all methods */}
      {selectedDepositMethod && (
        <button 
          onClick={handleDepositClick}
          disabled={!selectedDepositMethod}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
            selectedDepositMethod
              ? 'bg-[#FFD700] text-[#121212] hover:bg-[#FFC700]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedDepositMethod === 'Voucher' ? 'Deposit Voucher' : 'Deposit Now'}
        </button>
      )}
    </div>
  );
}
