import { Home, Trophy, Gift, Gamepad2, Grid3x3, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home/casino" },
    { icon: Gamepad2, label: "Top Games", path: "/home/topgames" },
    { icon: TrendingUp, label: "Jackpot", path: "/home/jackpot" },
    { icon: Grid3x3, label: "Bingo", path: "/home/bingo" },
    { icon: Trophy, label: "Sports", path: "/home/sports" },
    { icon: Gift, label: "Promos", path: "/home/promotions" },
  ];

  const isActive = (path: string) => {
    if (path === "/home/casino" && location.pathname === "/home") return true;
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#2A2A2A] px-2 py-2 safe-area-bottom z-50 md:hidden">
      <div className="horizontal-scroll flex items-center justify-start gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                active
                  ? "text-[#FFD700]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}