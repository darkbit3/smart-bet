import { useState, useEffect } from "react";
import { Trophy, Clock, Zap, Star, Activity, TrendingUp, Circle, Target, Zap as Ball, Gamepad2, Shield, Sword, Flag } from "lucide-react";

export default function Sports() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    "Live Sports Betting",
    "Real-time Odds",
    "Multiple Sports",
    "Live Streaming",
    "In-play Betting",
    "Cash Out Options"
  ];

  // Animate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section with Coming Soon */}
      <div className="mb-12 text-center">
        {/* Animated Background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-3xl animate-pulse" />
          <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-3xl p-12 backdrop-blur-sm">
            
            {/* Main Icons */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Trophy className="w-24 h-24 text-primary animate-bounce" />
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Coming Soon Text */}
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get ready for the ultimate sports betting experience! We're working hard to bring you live sports betting with real-time odds and exciting features.
            </p>

            {/* Loading Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Launching Progress</span>
                <span className="text-sm text-primary font-semibold">{loadingProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                >
                  <div className="h-full bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Rotating Features */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 text-lg">
                <Activity className="w-6 h-6 text-red-500 animate-spin" />
                <span className="text-foreground font-semibold">{features[currentFeature]}</span>
                <TrendingUp className="w-6 h-6 text-orange-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Trophy,
              title: "Live Betting",
              description: "Bet on games as they happen with real-time odds",
              delay: "animation-delay-0"
            },
            {
              icon: Clock,
              title: "Instant Updates",
              description: "Get live scores and odds updates instantly",
              delay: "animation-delay-200"
            },
            {
              icon: Star,
              title: "Best Odds",
              description: "Competitive odds on all major sports events",
              delay: "animation-delay-400"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-card border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:scale-105 ${feature.delay}`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Sports Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Sports We'll Cover</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Football", icon: Circle },
              { name: "Basketball", icon: Ball },
              { name: "Tennis", icon: Target },
              { name: "Baseball", icon: Shield },
              { name: "Hockey", icon: Star },
              { name: "American Football", icon: Flag },
              { name: "Cricket", icon: Gamepad2 },
              { name: "Boxing", icon: Trophy },
              { name: "Rugby", icon: Activity },
              { name: "Volleyball", icon: Zap },
              { name: "Table Tennis", icon: Target },
              { name: "Badminton", icon: Sword }
            ].map((sport, index) => {
              const Icon = sport.icon;
              return (
                <div
                  key={index}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white hover:border-[#FFD700] transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-sm font-semibold">{sport.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Countdown Timer Placeholder */}
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Launch Countdown</h3>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {[
              { value: "15", label: "Days" },
              { value: "08", label: "Hours" },
              { value: "42", label: "Minutes" },
              { value: "30", label: "Seconds" }
            ].map((time, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 mb-1">
                  <span className="text-2xl font-bold text-[#FFD700]">{time.value}</span>
                </div>
                <span className="text-xs text-gray-400">{time.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
