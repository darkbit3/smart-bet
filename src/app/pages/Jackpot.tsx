import { useState, useEffect } from "react";
import { TrendingUp, Star, Trophy, Crown, Medal, Award } from "lucide-react";

interface JackpotItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  image: string;
  participants: number;
  timeLeft: string;
  isActive: boolean;
}

const jackpotData: JackpotItem[] = [
  {
    id: "mega-sports",
    title: "Mega Sports Pot",
    description: "Sports betting jackpot",
    amount: 1247853.42,
    currency: "$",
    image: "https://images.unsplash.com/photo-1534375976996-cc6c4e7fe4bd?auto=format&fit=crop&w=400&q=80",
    participants: 15420,
    timeLeft: "2h 34m",
    isActive: true,
  },
  {
    id: "casino-round",
    title: "Casino Round",
    description: "Slot machine jackpot",
    amount: 780432.11,
    currency: "$",
    image: "https://images.unsplash.com/photo-1602524818224-3510619c4ab8?auto=format&fit=crop&w=400&q=80",
    participants: 8920,
    timeLeft: "5h 12m",
    isActive: true,
  },
  {
    id: "live-bingo",
    title: "Live Bingo Prize",
    description: "Bingo game jackpot",
    amount: 345112.87,
    currency: "$",
    image: "https://images.unsplash.com/photo-1529692236671-f1f28b1ffe13?auto=format&fit=crop&w=400&q=80",
    participants: 5670,
    timeLeft: "1h 45m",
    isActive: true,
  },
  {
    id: "top-games",
    title: "Top Games Award",
    description: "Multi-game jackpot",
    amount: 559900.66,
    currency: "$",
    image: "https://images.unsplash.com/photo-1549947605-92c9c088a5f5?auto=format&fit=crop&w=400&q=80",
    participants: 12340,
    timeLeft: "3h 22m",
    isActive: true,
  },
];

export default function Jackpot() {
  const [jackpots, setJackpots] = useState<JackpotItem[]>(jackpotData);
  const [selectedJackpot, setSelectedJackpot] = useState<JackpotItem | null>(null);

  useEffect(() => {
    // Simulate jackpot amounts increasing
    const interval = setInterval(() => {
      setJackpots(prev =>
        prev.map(jackpot => ({
          ...jackpot,
          amount: jackpot.amount + Math.random() * 10,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-purple-500/20">
        <div className="px-4 md:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">Progressive Jackpots</h1>
          </div>
          <p className="text-gray-300">Compete for massive prizes in our growing jackpot pools</p>
        </div>
      </div>

      {/* Jackpot Stats */}
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Total Pool</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${formatAmount(jackpots.reduce((sum, j) => sum + j.amount, 0))}
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Active Players</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {jackpots.reduce((sum, j) => sum + j.participants, 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Growing Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              +$2,340/min
            </div>
          </div>
        </div>

        {/* Jackpot List */}
        <div className="space-y-4">
          {jackpots.map((jackpot, index) => (
            <div
              key={jackpot.id}
              className="bg-gradient-to-r from-[#1A1A1A] to-[#121212] rounded-xl p-6 border border-[#2A2A2A] hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedJackpot(jackpot)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank Icon */}
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>

                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1f1f1f] border border-purple-500/40 flex-shrink-0">
                    <img
                      src={jackpot.image}
                      alt={jackpot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{jackpot.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{jackpot.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>{jackpot.participants.toLocaleString()} players</span>
                      <span className="text-red-400">{jackpot.timeLeft} left</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-white mb-1">
                    {jackpot.currency}{formatAmount(jackpot.amount)}
                  </div>
                  <div className="text-green-400 text-sm font-semibold animate-pulse">
                    +${(Math.random() * 5 + 1).toFixed(2)}/sec
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <h3 className="text-2xl font-bold text-white mb-4">How Progressive Jackpots Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-400">1</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Play Games</h4>
              <p className="text-gray-400 text-sm">Participate in eligible games to contribute to the jackpot pool</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Jackpot Grows</h4>
              <p className="text-gray-400 text-sm">A portion of each bet increases the progressive jackpot amount</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-400">3</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Win Big</h4>
              <p className="text-gray-400 text-sm">Hit the jackpot trigger and win the entire accumulated amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jackpot Modal */}
      {selectedJackpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="modal-modern w-full max-w-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedJackpot.title}</h2>
                <button
                  onClick={() => setSelectedJackpot(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  {selectedJackpot.currency}{formatAmount(selectedJackpot.amount)}
                </div>
                <div className="text-green-400 text-lg animate-pulse">
                  Growing at +${(Math.random() * 10 + 5).toFixed(2)}/sec
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{selectedJackpot.participants.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Active Players</div>
                </div>
                <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{selectedJackpot.timeLeft}</div>
                  <div className="text-gray-400 text-sm">Time Remaining</div>
                </div>
              </div>

              <button className="w-full bg-[#FFD700] text-[#121212] py-4 rounded-lg font-bold hover:bg-[#FFC700] transition-colors text-lg">
                Join {selectedJackpot.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}