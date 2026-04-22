import { Home, Trophy, Gift, Gamepad2, Grid3x3, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function DesktopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home/casino" },
    { icon: Gamepad2, label: "Top Games", path: "/home/topgames" },
    { icon: Grid3x3, label: "Bingo", path: "/home/bingo" },
    { icon: Trophy, label: "Sports Betting", path: "/home/sports" },
    { icon: TrendingUp, label: "Jackpot", path: "/home/jackpot" },
    { icon: Gift, label: "Promotions", path: "/home/promotions" },
  ];

  const isActive = (path: string) => {
    if (path === "/home/casino" && location.pathname === "/home") return true;
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 font-medium ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
