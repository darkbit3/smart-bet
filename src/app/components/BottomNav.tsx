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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 safe-area-bottom z-50 md:hidden backdrop-blur-sm">
      <div className="flex items-center justify-start gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
