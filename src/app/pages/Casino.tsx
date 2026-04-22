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
    { title: "Bingo", provider: "Smart Bet Gaming", imageUrl: "https://images.unsplash.com/photo-1517248135467-39c9704e5cf5?auto=format&fit=crop&w=400&q=80", isFeatured: true, isNew: true, category: "all" },
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
    <div className="container-modern py-6 animate-fade-in">
      {/* Hero Carousel - Progressive Jackpot & Hot This Week */}
      <HeroCarousel />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            className="input-modern w-full pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus-modern"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap card-modern hover-lift ${
                  activeTab === category.id
                    ? "bg-gradient-gold text-black shadow-glow"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border/20"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredGames.slice(0, visibleCount).map((game, index) => {
            // Special handling for Bingo game
            if (game.title === "Bingo") {
              return (
                <div key={index} className="group relative card-modern overflow-hidden hover-lift cursor-pointer">
                  {/* Bingo Game Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
                        className="bg-[#FFD700] text-[#121212] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#FFC700] transition-colors"
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm mb-1">{game.title}</h3>
                        <p className="text-gray-400 text-xs">{game.provider}</p>
                      </div>
                      <div className="flex gap-1">
                        {game.isFeatured && (
                          <span className="bg-[#FFD700]/20 text-[#FFD700] text-xs px-2 py-1 rounded-full font-semibold">
                            Featured
                          </span>
                        )}
                        {game.isNew && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            
            // Regular game tile for other games
            return (
              <GameTile
                key={index}
                title={game.title}
                provider={game.provider}
                imageUrl={game.imageUrl}
                isFeatured={game.isFeatured}
                isNew={game.isNew}
                onPlay={() => onPlayGame?.(game)}
              />
            );
          })}
        </div>
      </div>

      {/* Load More / Show Less */}
      <div className="text-center mt-8 space-y-4">
        {visibleCount < filteredGames.length && (
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredGames.length))}
            className="card-modern hover-lift text-foreground px-8 py-3 font-semibold transition-all"
          >
            Load More Games
          </button>
        )}
        {visibleCount > 20 && (
          <button
            onClick={() => setVisibleCount(20)}
            className="btn-modern text-black px-8 py-3 font-semibold"
          >
            Show Less Games
          </button>
        )}
      </div>
    </div>
  );
}
