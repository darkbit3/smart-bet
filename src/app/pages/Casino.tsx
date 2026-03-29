import { GameTile } from "../components/GameTile";
import { JackpotTicker } from "../components/JackpotTicker";
import { HeroCarousel } from "../components/HeroCarousel";
import { Search, TrendingUp, Flame, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";

interface CasinoOutletContext {
  onPlayGame?: (game: { title: string; provider: string; imageUrl: string; isFeatured?: boolean; isNew?: boolean }) => void;
}

type GameEntry = {
  title: string;
  provider: string;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
  category: "slots" | "table" | "live" | "popular" | "all";
};

export default function Casino() {
  const { onPlayGame } = useOutletContext<CasinoOutletContext>();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const categories = [
    { id: "all", label: "All Games", icon: Sparkles },
    { id: "popular", label: "Popular", icon: TrendingUp },
    { id: "slots", label: "Slots", icon: Flame },
    { id: "table", label: "Table Games", icon: null },
    { id: "live", label: "Live Casino", icon: Zap },
  ];

  const games: GameEntry[] = [
    { title: "Mega Fortune Wheel", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1706129867447-b4f156c46641?auto=format&fit=crop&w=400&q=80", isFeatured: true, isNew: false, category: "slots" },
    { title: "Royal Poker Championship", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1670085734257-84c0aa3e357a?auto=format&fit=crop&w=400&q=80", isFeatured: true, isNew: true, category: "table" },
    { title: "European Roulette Pro", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1592602944193-0848995f4b5a?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "table" },
    { title: "Blackjack Royal Pairs", provider: "Playtech", imageUrl: "https://images.unsplash.com/photo-1618304925090-b68a8c744cbe?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "table" },
    { title: "Lucky Dice Extreme", provider: "Red Tiger Gaming", imageUrl: "https://images.unsplash.com/photo-1739133710741-1468de0acf26?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: true, category: "slots" },
    { title: "Neon Jackpot Slots", provider: "Microgaming", imageUrl: "https://images.unsplash.com/photo-1734935641113-ac7a7bab1312?auto=format&fit=crop&w=400&q=80", isFeatured: true, isNew: false, category: "slots" },
    { title: "Starburst Deluxe", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1550068274-e54993d0f0f7?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Book of Dead", provider: "Play'n GO", imageUrl: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Lightning Roulette", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "live" },
    { title: "Gonzo's Quest", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Divine Fortune", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Blackjack VIP", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1571988840298-3b5301d5109b?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "table" },
    { title: "Fire Joker", provider: "Play'n GO", imageUrl: "https://images.unsplash.com/photo-1566738780863-f9608f88f3a9?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Live Baccarat", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "live" },
    { title: "Immortal Romance", provider: "Microgaming", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Twin Spin", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1534375976996-cc6c4e7fe4bd?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Aloha! Cluster Pays", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f28b1ffe13?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Jumanji", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1549947605-92c9c088a5f5?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Reactoonz", provider: "Play'n GO", imageUrl: "https://images.unsplash.com/photo-1550068274-e54993d0f0f7?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Dead or Alive 2", provider: "NetEnt", imageUrl: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Bonanza", provider: "Big Time Gaming", imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Sweet Bonanza", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Wolf Gold", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1571988840298-3b5301d5109b?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Great Rhino", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1566738780863-f9608f88f3a9?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Buffalo King", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Peaky Blinders", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "John Hunter and the Tomb of the Scarab Queen", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1534375976996-cc6c4e7fe4bd?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Release the Kraken", provider: "Push Gaming", imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f28b1ffe13?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Wild Swarm", provider: "Push Gaming", imageUrl: "https://images.unsplash.com/photo-1549947605-92c9c088a5f5?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Fat Rabbit", provider: "Push Gaming", imageUrl: "https://images.unsplash.com/photo-1550068274-e54993d0f0f7?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Wild Gladiators", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "The Hand of Midas", provider: "Pragmatic Play", imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "slots" },
    { title: "Master Joker", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "table" },
    { title: "Crazy Time", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "live" },
    { title: "Monopoly Live", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1571988840298-3b5301d5109b?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "live" },
    { title: "Dream Catcher", provider: "Evolution Gaming", imageUrl: "https://images.unsplash.com/photo-1566738780863-f9608f88f3a9?auto=format&fit=crop&w=400&q=80", isFeatured: false, isNew: false, category: "live" },
  ];

  const filteredGames = games.filter((game) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "popular" && game.isFeatured) ||
      game.category === activeTab;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      game.title.toLowerCase().includes(query) ||
      game.provider.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  useEffect(() => {
    setVisibleCount(20);
  }, [activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Carousel - Progressive Jackpot & Hot This Week */}
      <HeroCarousel />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === category.id
                    ? "bg-[#FFD700] text-[#121212]"
                    : "bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2A2A2A]"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Games Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">All Games</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGames.slice(0, visibleCount).map((game, index) => (
            <GameTile
              key={index}
              title={game.title}
              provider={game.provider}
              imageUrl={game.imageUrl}
              isFeatured={game.isFeatured}
              isNew={game.isNew}
              onPlay={() => onPlayGame?.(game)}
            />
          ))}
        </div>
      </div>

      {/* Load More / Show Less */}
      <div className="text-center mt-8 space-y-4">
        {visibleCount < filteredGames.length && (
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredGames.length))}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-8 py-3 rounded-xl font-semibold border border-[#2A2A2A] transition-colors"
          >
            Load More Games
          </button>
        )}
        {visibleCount > 20 && (
          <button
            onClick={() => setVisibleCount(20)}
            className="bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Show Less Games
          </button>
        )}
      </div>
    </div>
  );
}
