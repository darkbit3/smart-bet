import { Gift, Clock, Star, TrendingUp } from "lucide-react";

export default function Promotions() {
  const promotions = [
    {
      title: "Welcome Bonus",
      description: "100% match up to $1,000",
      details: "Deposit and get double your money to play with",
      badge: "NEW USERS",
      color: "from-[#FFD700] to-[#FFA500]",
      icon: Gift,
    },
    {
      title: "Weekly Cashback",
      description: "Get 10% back on losses",
      details: "Up to $500 cashback every Monday",
      badge: "WEEKLY",
      color: "from-purple-500 to-pink-500",
      icon: Clock,
    },
    {
      title: "VIP Rewards Program",
      description: "Exclusive perks for loyal players",
      details: "Level up and unlock bigger bonuses",
      badge: "VIP",
      color: "from-yellow-500 to-orange-500",
      icon: Star,
    },
    {
      title: "Refer a Friend",
      description: "Earn $50 for each referral",
      details: "Both you and your friend get bonuses",
      badge: "POPULAR",
      color: "from-blue-500 to-cyan-500",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Promotions & Bonuses</h1>
        <p className="text-gray-400">Maximize your winnings with our exclusive offers</p>
      </div>

      {/* Featured Promo */}
      <div className="mb-8 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-block bg-[#FFD700] text-[#121212] px-3 py-1 rounded-full text-xs font-bold mb-4">
            LIMITED TIME
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">$50,000 Tournament</h2>
          <p className="text-xl text-gray-200 mb-6">
            Compete in our biggest tournament yet. Top 100 players win prizes!
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#121212]/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400">Time Remaining</div>
              <div className="text-2xl font-bold text-white">5d 12h 34m</div>
            </div>
            <div className="bg-[#121212]/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400">Prize Pool</div>
              <div className="text-2xl font-bold text-[#FFD700]">$50,000</div>
            </div>
          </div>
          <button className="bg-[#FFD700] text-[#121212] px-8 py-3 rounded-xl font-bold hover:bg-[#FFC700] transition-colors text-lg">
            Join Tournament
          </button>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {promotions.map((promo, index) => {
          const Icon = promo.icon;
          return (
            <div
              key={index}
              className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden hover:border-[#FFD700] transition-all group"
            >
              <div className={`h-2 bg-gradient-to-r ${promo.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${promo.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`bg-gradient-to-r ${promo.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    {promo.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                <p className="text-xl text-[#FFD700] mb-3 font-semibold">{promo.description}</p>
                <p className="text-gray-400 mb-6">{promo.details}</p>
                <button className="w-full bg-[#121212] hover:bg-[#FFD700] hover:text-[#121212] text-white py-3 rounded-xl font-semibold border border-[#2A2A2A] transition-all">
                  Claim Bonus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terms */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6">
        <h3 className="text-lg font-bold text-white mb-3">Terms & Conditions</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• All bonuses are subject to wagering requirements</li>
          <li>• Minimum deposit of $10 required for most promotions</li>
          <li>• 18+ only. Please gamble responsibly</li>
          <li>• Full terms and conditions apply</li>
        </ul>
      </div>
    </div>
  );
}
