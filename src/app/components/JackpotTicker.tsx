import { DollarSign, TrendingUp, Star } from "lucide-react";
import { useState, useEffect } from "react";

const jackpots = [
  { title: "Progressive Jackpot", base: 1247853.42, currency: "$", description: "Mega Sports Pot", image: "https://images.unsplash.com/photo-1534375976996-cc6c4e7fe4bd?auto=format&fit=crop&w=400&q=80" },
  { title: "Progressive Jackpot", base: 780432.11, currency: "$", description: "Casino Round", image: "https://images.unsplash.com/photo-1602524818224-3510619c4ab8?auto=format&fit=crop&w=400&q=80" },
  { title: "Progressive Jackpot", base: 345112.87, currency: "$", description: "Live Bingo Prize", image: "https://images.unsplash.com/photo-1529692236671-f1f28b1ffe13?auto=format&fit=crop&w=400&q=80" },
  { title: "Progressive Jackpot", base: 559900.66, currency: "$", description: "Top Games Award", image: "https://images.unsplash.com/photo-1549947605-92c9c088a5f5?auto=format&fit=crop&w=400&q=80" },
];

export function JackpotTicker() {
  const [sliceIndex, setSliceIndex] = useState(0);
  const [values, setValues] = useState(jackpots.map((item) => item.base));

  useEffect(() => {
    const grow = setInterval(() => {
      setValues((prev) => prev.map((val) => val + Math.random() * 3));
    }, 1500);

    return () => clearInterval(grow);
  }, []);

  useEffect(() => {
    const slider = setInterval(() => {
      setSliceIndex((prev) => (prev + 1) % jackpots.length);
    }, 4000);

    return () => clearInterval(slider);
  }, []);

  const card = jackpots[sliceIndex];
  const liveValue = values[sliceIndex];

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-8 mb-8 transition-all duration-700 shadow-lg relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-green-400 animate-pulse" />
              <Star className="w-7 h-7 text-yellow-300 animate-pulse" />
            </div>
            <span className="text-[#FFD700] font-semibold text-sm uppercase">Progressive Jackpot</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1f1f1f] border border-purple-500/40">
              <img src={card.image} alt={card.description} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
            <div>
              <div className="text-xl font-semibold text-white mb-0.5">{card.description}</div>
              <div className="text-2xl font-bold text-white tracking-wider">
                {card.currency}{liveValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-green-400 animate-pulse" />
            <Star className="w-7 h-7 text-yellow-300 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {jackpots.map((_, idx) => (
            <span key={idx} className={`h-2 w-8 rounded-full ${idx === sliceIndex ? "bg-[#FFD700]" : "bg-purple-500/40"}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
}
