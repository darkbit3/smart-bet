export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-50">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center mb-6 shadow-lg shadow-[#FFD700]/30 animate-pulse">
        <span className="text-[#121212] font-bold text-4xl">G</span>
      </div>
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
