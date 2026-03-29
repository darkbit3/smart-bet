import { TrendingUp, Clock } from "lucide-react";

interface LiveBettingCardProps {
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  homeOdds: string;
  drawOdds?: string;
  awayOdds: string;
  isLive?: boolean;
}

export function LiveBettingCard({
  sport,
  league,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  time,
  homeOdds,
  drawOdds,
  awayOdds,
  isLive = true,
}: LiveBettingCardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-[#FFD700] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121212] border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">{sport}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">{league}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5 bg-red-500/10 text-red-500 px-2 py-1 rounded-md">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold">LIVE</span>
          </div>
        )}
      </div>

      {/* Match Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">{homeTeam}</span>
              <span className="text-2xl font-bold text-white ml-4">{homeScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{awayTeam}</span>
              <span className="text-2xl font-bold text-white ml-4">{awayScore}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>

        {/* Betting Odds */}
        <div className="grid grid-cols-3 gap-2">
          <button className="bg-[#121212] hover:bg-[#FFD700] hover:text-[#121212] text-white border border-[#2A2A2A] rounded-lg p-3 transition-all group">
            <div className="text-xs text-gray-400 group-hover:text-[#121212] mb-1">Home</div>
            <div className="text-lg font-bold">{homeOdds}</div>
          </button>
          
          {drawOdds && (
            <button className="bg-[#121212] hover:bg-[#FFD700] hover:text-[#121212] text-white border border-[#2A2A2A] rounded-lg p-3 transition-all group">
              <div className="text-xs text-gray-400 group-hover:text-[#121212] mb-1">Draw</div>
              <div className="text-lg font-bold">{drawOdds}</div>
            </button>
          )}
          
          <button className="bg-[#121212] hover:bg-[#FFD700] hover:text-[#121212] text-white border border-[#2A2A2A] rounded-lg p-3 transition-all group">
            <div className="text-xs text-gray-400 group-hover:text-[#121212] mb-1">Away</div>
            <div className="text-lg font-bold">{awayOdds}</div>
          </button>
        </div>

        {/* Additional Markets */}
        <button className="w-full mt-3 text-[#FFD700] text-sm font-semibold hover:text-[#FFC700] transition-colors flex items-center justify-center gap-1">
          <TrendingUp className="w-4 h-4" />
          +245 Markets
        </button>
      </div>
    </div>
  );
}
