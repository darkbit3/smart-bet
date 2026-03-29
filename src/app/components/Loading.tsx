export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg">
        <div className="h-10 w-10 rounded-full border-4 border-t-[#FFD700] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <p className="text-sm text-white">Loading, please wait...</p>
      </div>
    </div>
  );
}
