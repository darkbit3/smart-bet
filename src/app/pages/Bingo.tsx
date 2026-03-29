import { useState, useEffect } from "react";
import { Clock, Users, Zap, WifiOff, RefreshCw } from "lucide-react";

export default function Bingo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check API connection and fetch data
  const checkConnectionAndFetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement bingo API when available
      console.log('📨 Would check API health and fetch bingo data');
      
      // Simulate loading for demo
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      
    } catch (err: any) {
      console.error('Bingo API error:', err);
      setError(err.message || 'Failed to load bingo data');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle room join
  const handleJoinRoom = async (roomId: string) => {
    // TODO: Implement room join API when available
    console.log('📨 Would join room:', roomId);
  };

  // Check connection on component mount
  useEffect(() => {
    checkConnectionAndFetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading bingo rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show waiting state when API is not connected
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <WifiOff className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Bingo Games Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            The bingo game server is currently under development. Please check back later...
          </p>
          <button
            onClick={checkConnectionAndFetchData}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
