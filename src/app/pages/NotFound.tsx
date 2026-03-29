import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    if (seconds <= 0) {
      clearInterval(timer);
      navigate("/home/casino", { replace: true });
    }
    return () => clearInterval(timer);
  }, [seconds, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white p-4">
      <div className="max-w-md w-full text-center border border-[#2a2a2a] bg-[#1a1a1a] p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="mb-4 text-gray-300">Page not found.</p>
        <p className="mb-6">
          Redirecting to <strong>/home/casino</strong> in <strong>{seconds}</strong> seconds...
        </p>
        <button className="px-4 py-2 rounded bg-[#FFD700] text-[#121212] font-semibold" onClick={() => navigate("/home/casino")}>Go now</button>
      </div>
    </div>
  );
}
