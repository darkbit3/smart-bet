import { useState, useEffect } from "react";
import { Flame, Trophy, TrendingUp, Star } from "lucide-react";

interface CarouselItem {
  id: string;
  type: "jackpot" | "tournament";
  title: string;
  subtitle: string;
  description: string;
  image: string;
  amount?: string;
  buttonText: string;
  gradient: string;
  borderColor: string;
  icon: React.ReactNode;
}

const carouselItems: CarouselItem[] = [
  {
    id: "jackpot",
    type: "jackpot",
    title: "Live Bingo Prize",
    subtitle: "Progressive Jackpot",
    description: "Mega jackpot growing every minute",
    image: "https://images.unsplash.com/photo-1529692236671-f1f28b1ffe13?auto=format&fit=crop&w=400&q=80",
    amount: "$345,634.81",
    buttonText: "Play Now",
    gradient: "from-purple-900/30 to-pink-900/30",
    borderColor: "border-purple-500/30",
    icon: (
      <div className="flex items-center gap-3">
        <TrendingUp className="w-7 h-7 text-green-400 animate-pulse" />
        <Star className="w-7 h-7 text-yellow-300 animate-pulse" />
      </div>
    ),
  },
  {
    id: "tournament",
    type: "tournament",
    title: "$50,000 Tournament",
    subtitle: "Hot This Week",
    description: "Play featured games and win massive prizes",
    image: "https://images.unsplash.com/photo-1602524818224-3510619c4ab8?auto=format&fit=crop&w=400&q=80",
    buttonText: "Join Now",
    gradient: "from-[#FFD700]/20 to-[#FFA500]/20",
    borderColor: "border-[#FFD700]/30",
    icon: <Flame className="w-5 h-5 text-[#FFD700]" />,
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTournament, setShowTournament] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Auto slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="px-4 md:px-8 pt-4">
      <div className={`bg-gradient-to-r ${currentItem.gradient} border ${currentItem.borderColor} rounded-xl p-4 mb-6 transition-all duration-700 shadow-lg relative overflow-hidden`}>
        {/* Background blur effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              {currentItem.icon}
              <span className="text-[#FFD700] font-semibold text-sm uppercase">
                {currentItem.subtitle}
              </span>
              {currentItem.type === "tournament" && (
                <button
                  onClick={() => setShowTournament((prev) => !prev)}
                  className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#FFC700] bg-[#1A1A1A]/90 px-3 py-1.5 text-xs text-white font-semibold hover:bg-[#FFD700]/20 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  {showTournament ? "Hide Tournament" : "Show Tournament"}
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1f1f1f] border border-purple-500/40">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Text Content */}
              <div>
                <div className="text-xl font-semibold text-white mb-0.5">
                  {currentItem.title}
                </div>
                {currentItem.amount && (
                  <div className="text-2xl font-bold text-white tracking-wider">
                    {currentItem.amount}
                  </div>
                )}
                {!currentItem.amount && (
                  <div className="text-gray-300 text-sm">
                    {currentItem.description}
                  </div>
                )}
              </div>
            </div>

            {/* Tournament details or jackpot icons */}
            {currentItem.type === "jackpot" && currentItem.icon}
          </div>

          {/* Tournament expanded content */}
          {currentItem.type === "tournament" && showTournament && (
            <div className="mt-4">
              <p className="text-gray-300 mb-3">Compete in featured games for top leaderboard prizes.</p>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>- 1st place: $20,000 bonus credit</li>
                <li>- 2nd place: $12,000 bonus credit</li>
                <li>- 3rd place: $8,000 bonus credit</li>
              </ul>
            </div>
          )}

          {/* Dots indicator */}
          <div className="mt-3 flex justify-center gap-2">
            {carouselItems.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentIndex ? "bg-[#FFD700]" : "bg-purple-500/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}