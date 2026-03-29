import { Flame, TrendingUp, Star, Crown } from "lucide-react";
import { GameTile } from "../components/GameTile";

export default function TopGames() {
  const topGames = [
    { id: 1, name: "Mega Fortune", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop", jackpot: "$2.4M", category: "Jackpot" },
    { id: 2, name: "Starburst", image: "https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=400&h=300&fit=crop", jackpot: null, category: "Slots" },
    { id: 3, name: "Book of Dead", image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop", jackpot: null, category: "Adventure" },
    { id: 4, name: "Lightning Roulette", image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop", jackpot: null, category: "Live Casino" },
    { id: 5, name: "Gonzo's Quest", image: "https://images.unsplash.com/photo-1550068274-e54993d0f0f7?w=400&h=300&fit=crop", jackpot: null, category: "Adventure" },
    { id: 6, name: "Divine Fortune", image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop", jackpot: "$1.8M", category: "Jackpot" },
    { id: 7, name: "Blackjack VIP", image: "https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=400&h=300&fit=crop", jackpot: null, category: "Table Games" },
    { id: 8, name: "Fire Joker", image: "https://images.unsplash.com/photo-1566738780863-f9608f88f3a9?w=400&h=300&fit=crop", jackpot: null, category: "Classic Slots" },
    { id: 9, name: "Live Baccarat", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop", jackpot: null, category: "Live Casino" },
    { id: 10, name: "Immortal Romance", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop", jackpot: null, category: "Slots" },
    { id: 11, name: "Arabian Nights", image: "https://images.unsplash.com/photo-1570116880826-1fe961e8b3ed?w=400&h=300&fit=crop", jackpot: "$3.1M", category: "Jackpot" },
    { id: 12, name: "Crazy Time", image: "https://images.unsplash.com/photo-1551191164-a98cc4c57707?w=400&h=300&fit=crop", jackpot: null, category: "Game Shows" },
  ];

  const categories = [
    { id: "all", label: "All Games", icon: Star },
    { id: "jackpot", label: "Jackpots", icon: Crown },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "hot", label: "Hot", icon: Flame },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="mb-6 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-[#FFD700]" />
            <span className="text-[#FFD700] font-semibold text-sm uppercase">Top Games</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Most Popular Games</h2>
          <p className="text-gray-300">Play the most loved games by our community</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className="px-4 py-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#FFD700] hover:text-[#121212] text-white border border-[#2A2A2A] transition-all flex items-center gap-2 whitespace-nowrap font-semibold"
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#FFD700] mb-1">500+</div>
          <div className="text-xs text-gray-400">Total Games</div>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#FFD700] mb-1">$8.5M</div>
          <div className="text-xs text-gray-400">Total Jackpots</div>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#FFD700] mb-1">50K+</div>
          <div className="text-xs text-gray-400">Players Online</div>
        </div>
      </div>

      {/* Games Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-[#FFD700]" />
          Top Rated Games
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
          {topGames.map((game) => (
            <GameTile
              key={game.id}
              name={game.name}
              image={game.image}
              jackpot={game.jackpot || undefined}
              category={game.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
