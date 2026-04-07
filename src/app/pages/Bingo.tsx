import { useState, useEffect, useRef } from "react";
import { WifiOff, RefreshCw, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/UserContext";
import axios from "axios";

interface BingoConnectionStatus {
  isConnected: boolean;
  isBingoFrontendAvailable: boolean;
  isBackendAvailable: boolean;
  isBigServerAvailable: boolean;
  message: string;
  lastChecked: Date;
}

interface BingoPlayerData {
  playerId: number;
  balance: number;
  withdrawable: number;
  non_withdrawable: number;
  bonus_balance: number;
  timestamp: string;
}

export default function Bingo() {
  const { state: authState } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<BingoConnectionStatus>({
    isConnected: false,
    isBingoFrontendAvailable: false,
    isBackendAvailable: false,
    isBigServerAvailable: false,
    message: "Checking connections...",
    lastChecked: new Date()
  });
  const [playerData, setPlayerData] = useState<BingoPlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check bingo frontend availability
  const checkBingoFrontend = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5173', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch (error) {
      // Try to ping the bigserver instead since CORS might block direct access
      try {
        const bigServerResponse = await axios.get('http://localhost:3001/public-health', { timeout: 3000 });
        return bigServerResponse.status === 200;
      } catch (bigServerError) {
        return false;
      }
    }
  };

  // Check backend availability
  const checkBackend = async (): Promise<boolean> => {
    try {
      const response = await axios.get('http://localhost:5000/health', { timeout: 3000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  // Check bigserver availability
  const checkBigServer = async (): Promise<boolean> => {
    try {
      const response = await axios.get('http://localhost:3001/public-health', { timeout: 3000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  // Send player data to backend
  const sendPlayerToBackend = async (playerData: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/bingo/player-connect', {
        playerId: playerData.id,
        username: playerData.username,
        phone_number: playerData.phone_number,
        source: 'smart_bet_bingo_page'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      console.log('✅ Player data sent to backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to send player data to backend:', error.message);
      throw error;
    }
  };

  // Check all connections and initialize player data
  const checkConnectionsAndInitialize = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check all services
      const [bingoAvailable, backendAvailable, bigServerAvailable] = await Promise.all([
        checkBingoFrontend(),
        checkBackend(),
        checkBigServer()
      ]);

      const newStatus: BingoConnectionStatus = {
        isConnected: bingoAvailable && backendAvailable && bigServerAvailable,
        isBingoFrontendAvailable: bingoAvailable,
        isBackendAvailable: backendAvailable,
        isBigServerAvailable: bigServerAvailable,
        message: "",
        lastChecked: new Date()
      };

      // Set appropriate message
      if (!bingoAvailable && !backendAvailable && !bigServerAvailable) {
        newStatus.message = "All services are unavailable. Please check your connection.";
      } else if (!bingoAvailable) {
        newStatus.message = "Bingo game is currently unavailable.";
      } else if (!backendAvailable) {
        newStatus.message = "Backend server is unavailable. Cannot sync player data.";
      } else if (!bigServerAvailable) {
        newStatus.message = "Big server is unavailable. Cannot connect to bingo game.";
      } else {
        newStatus.message = "All systems operational!";
      }

      setConnectionStatus(newStatus);

      // If user is authenticated and all services are available
      if (authState.isAuthenticated && newStatus.isConnected) {
        try {
          // Send player data to backend
          await sendPlayerToBackend(authState.user);
          
          // Set player data for display
          setPlayerData({
            playerId: authState.user.id,
            balance: authState.user.balance,
            withdrawable: authState.user.withdrawable,
            non_withdrawable: authState.user.non_withdrawable,
            bonus_balance: authState.user.bonus_balance,
            timestamp: new Date().toISOString()
          });

          console.log('🎯 Player data initialized for bingo:', authState.user.username);
        } catch (error: any) {
          setError(`Failed to initialize player data: ${error.message}`);
        }
      } else if (!authState.isAuthenticated && newStatus.isConnected) {
        setError("Please log in to play bingo games.");
      }

    } catch (error: any) {
      console.error('Connection check failed:', error);
      setError(`Connection check failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to bingo iframe
  const sendToBingoIframe = (message: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, 'http://localhost:5173');
    }
  };

  // Handle messages from bingo iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'http://localhost:5173') return;

      console.log('📨 Message from bingo iframe:', event.data);
      
      // Handle different message types
      switch (event.data.type) {
        case 'bingo_ready':
          console.log('🎮 Bingo frontend is ready');
          if (playerData) {
            sendToBingoIframe({
              type: 'player_data',
              data: playerData
            });
          }
          break;
        
        case 'balance_update_request':
          if (authState.user) {
            sendToBingoIframe({
              type: 'balance_update',
              data: {
                playerId: authState.user.id,
                balance: authState.user.balance,
                withdrawable: authState.user.withdrawable,
                non_withdrawable: authState.user.non_withdrawable,
                bonus_balance: authState.user.bonus_balance
              }
            });
          }
          break;
        
        case 'error':
          console.error('🚨 Bingo frontend error:', event.data.message);
          setError(`Bingo game error: ${event.data.message}`);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playerData, authState.user]);

  // Check connections on component mount and set up interval
  useEffect(() => {
    checkConnectionsAndInitialize();
    
    // Check connections every 30 seconds
    const interval = setInterval(checkConnectionsAndInitialize, 30000);
    
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, authState.user]);

  // Send player data to iframe when it changes
  useEffect(() => {
    if (playerData && connectionStatus.isBingoFrontendAvailable) {
      sendToBingoIframe({
        type: 'player_data',
        data: playerData
      });
    }
  }, [playerData, connectionStatus.isBingoFrontendAvailable]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Connecting to bingo game...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={checkConnectionsAndInitialize}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Connection Status Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {connectionStatus.isBingoFrontendAvailable ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm text-gray-300">Bingo Game</span>
            </div>
            
            <div className="flex items-center gap-2">
              {connectionStatus.isBackendAvailable ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm text-gray-300">Backend</span>
            </div>
            
            <div className="flex items-center gap-2">
              {connectionStatus.isBigServerAvailable ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm text-gray-300">Big Server</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{connectionStatus.message}</span>
            <button
              onClick={checkConnectionsAndInitialize}
              className="text-gray-400 hover:text-white transition-colors"
              title="Refresh connections"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Player Info Bar */}
      {authState.isAuthenticated && playerData && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-400">Player:</span>
                <span className="ml-2 text-white font-semibold">{authState.user?.username}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Balance:</span>
                <span className="ml-2 text-green-400 font-semibold">{playerData.balance}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date(playerData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Bingo Game Container */}
      {connectionStatus.isBingoFrontendAvailable ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
            <h3 className="text-white font-semibold">Bingo Game</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live</span>
            </div>
          </div>
          
          <div className="relative" style={{ height: '600px' }}>
            <iframe
              ref={iframeRef}
              src="http://localhost:5173"
              className="w-full h-full border-0"
              title="Bingo Game"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => {
                console.log('🎮 Bingo iframe loaded');
                // Send player data when iframe loads
                if (playerData) {
                  setTimeout(() => {
                    sendToBingoIframe({
                      type: 'player_data',
                      data: playerData
                    });
                  }, 1000);
                }
              }}
              onError={() => {
                console.error('❌ Failed to load bingo iframe');
                setError('Failed to load bingo game. Please refresh the page.');
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <WifiOff className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Bingo Game Unavailable</h2>
            <p className="text-gray-400 mb-6">
              The bingo game server is currently not responding. Please check your connection and try again later.
            </p>
            <div className="space-y-3">
              <div className="text-left bg-gray-800 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white">Troubleshooting:</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Check if localhost:5173 is accessible</li>
                  <li>• Ensure bingo frontend server is running</li>
                  <li>• Verify backend and bigserver are online</li>
                  <li>• Check your network connection</li>
                </ul>
              </div>
              <button
                onClick={checkConnectionsAndInitialize}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Check Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
