import { Play, Star } from "lucide-react";

interface GameTileProps {
  title: string;
  provider: string;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
  onPlay?: () => void;
}

export function GameTile({ title, provider, imageUrl, isFeatured, isNew, onPlay }: GameTileProps) {
  return (
    <div className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#FFD700] transition-all cursor-pointer">
      {/* Game Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className="bg-[#FFD700] text-[#121212] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#FFC700] transition-colors"
          >
            <Play className="w-5 h-5 fill-current" />
            Play Now
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isFeatured && (
            <div className="bg-[#FFD700] text-[#121212] px-2 py-1 rounded-md flex items-center gap-1 text-xs font-semibold">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
          {isNew && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              NEW
            </div>
          )}
        </div>
      </div>

      {/* Game Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
        <p className="text-gray-400 text-xs mt-1">{provider}</p>
      </div>
    </div>
  );
}
