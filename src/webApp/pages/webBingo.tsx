import { useState, useEffect, useRef } from "react";
import { WifiOff, RefreshCw, AlertCircle, CheckCircle, Loader2, Maximize2, Minimize2, Wallet, EyeOff } from "lucide-react";
import { useWebAuth } from "../../contexts/webUserContext";
import WebLogin from "./webLogin";

interface WebBingoConnectionStatus {
  isConnected: boolean;
  isBingoFrontendAvailable: boolean;
  isBackendAvailable: boolean;
  isBigServerAvailable: boolean;
  message: string;
  lastChecked: Date;
}

interface WebBingoPlayerData {
  playerId: number;
  balance: number;
  withdrawable: number;
  non_withdrawable: number;
  bonus_balance: number;
  timestamp: string;
}

export default function WebBingo() {
  const { user, isAuthenticated } = useWebAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const balanceDetailsRef = useRef<HTMLDivElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<WebBingoConnectionStatus>({
    isConnected: false,
    isBingoFrontendAvailable: false,
    isBackendAvailable: false,
    isBigServerAvailable: false,
    message: "Checking connections...",
    lastChecked: new Date()
  });
  const [playerData, setPlayerData] = useState<WebBingoPlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showBalanceDetails, setShowBalanceDetails] = useState(false);

  const smartBetIntegrationEnabled = Boolean(import.meta.env.VITE_BIGSERVER_URL);
  const bingoFrontendUrl = import.meta.env.VITE_BINGO_FRONT_URL || 'http://localhost:5173';
  const bingoFrontendOrigin = (() => {
    try {
      return new URL(bingoFrontendUrl).origin;
    } catch {
      return 'http://localhost:5173';
    }
  })();
  const isCrossAppIntegrationReady = smartBetIntegrationEnabled && connectionStatus.isConnected;

  // Check bingo frontend availability
  const checkBingoFrontend = async (): Promise<boolean> => {
    try {
      await fetch(bingoFrontendUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      return true;
    } catch (error) {
      // Try to ping the bigserver instead since CORS might block direct access
      try {
        const bigServerUrl = import.meta.env.VITE_BIGSERVER_URL || 'http://localhost:3000';
        const bigServerResponse = await fetch(`${bigServerUrl}/public-health`, { timeout: 3000 });
        return bigServerResponse.ok;
      } catch (bigServerError) {
        return false;
      }
    }
  };

  // Check backend availability
  const checkBackend = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/health', { timeout: 3000 });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Check bigserver availability
  const checkBigServer = async (): Promise<boolean> => {
    if (!smartBetIntegrationEnabled) {
      return true;
    }

    try {
      const bigServerUrl = import.meta.env.VITE_BIGSERVER_URL;
      if (!bigServerUrl) {
        return false;
      }

      const response = await fetch(`${bigServerUrl}/public-health`, { timeout: 3000 });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Send player data to backend
  const sendPlayerToBackend = async (playerData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/bingo/player-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId: playerData.id,
          username: playerData.username,
          phone_number: playerData.phone_number,
          source: 'smart_bet_web_bingo_page'
        })
      });

      console.log('✅ Player data sent to backend:', await response.json());
      return response.ok;
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

      const connected = smartBetIntegrationEnabled
        ? bingoAvailable && backendAvailable && bigServerAvailable
        : bingoAvailable && backendAvailable;

      const newStatus: WebBingoConnectionStatus = {
        isConnected: connected,
        isBingoFrontendAvailable: bingoAvailable,
        isBackendAvailable: backendAvailable,
        isBigServerAvailable: smartBetIntegrationEnabled ? bigServerAvailable : false,
        message: "",
        lastChecked: new Date()
      };

      // Set appropriate message
      if (!smartBetIntegrationEnabled) {
        newStatus.message = "Smart Bet integration is disabled because VITE_BIGSERVER_URL is not configured in .env.";
      } else if (!bingoAvailable && !backendAvailable && !bigServerAvailable) {
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
      if (isAuthenticated && user) {
        setPlayerData({
          playerId: user.id,
          balance: user.balance,
          withdrawable: user.withdrawable,
          non_withdrawable: user.non_withdrawable,
          bonus_balance: user.bonus_balance,
          timestamp: new Date().toISOString()
        });

        if (smartBetIntegrationEnabled && newStatus.isConnected) {
          try {
            // Send player data to backend
            await sendPlayerToBackend(user);
            console.log('🎯 Player data initialized for bingo:', user.username);
          } catch (error: any) {
            setError(`Failed to initialize player data: ${error.message}`);
          }
        } else if (!smartBetIntegrationEnabled) {
          console.log('⚠️ Smart Bet integration disabled: player data will not be synced to backend.');
        }
      } else if (!isAuthenticated && newStatus.isConnected) {
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
  const sendToBingoIframe = (message: any, requireFullIntegration = true) => {
    if (requireFullIntegration && !isCrossAppIntegrationReady) {
      console.warn('Skipping iframe message because the Smart Bet/Bingo integration is not connected.');
      return;
    }

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, bingoFrontendOrigin);
    }
  };

  // Handle messages from bingo iframe
  useEffect(() => {
    // Allow basic message receiving even without full integration
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== bingoFrontendOrigin) return;

      console.log('📨 Message from bingo iframe:', event.data);
      
      // Handle different message types
      switch (event.data.type) {
        case 'bingo_ready':
          console.log('🎮 Bingo frontend is ready');
          if (playerData) {
            sendToBingoIframe({
              type: 'player_data',
              data: playerData
            }, false); // Don't require full integration for basic player data
          }
          break;
        
        case 'balance_update_request':
          if (user) {
            sendToBingoIframe({
              type: 'balance_update',
              data: {
                playerId: user.id,
                balance: user.balance,
                withdrawable: user.withdrawable,
                non_withdrawable: user.non_withdrawable,
                bonus_balance: user.bonus_balance
              }
            }, false); // Don't require full integration for balance updates
          }
          break;
        
        case 'error':
          console.error('🚨 Bingo frontend error:', event.data.message);
          setError(`Bingo game error: ${event.data.message}`);
          break;
        
        case 'auth_required':
          console.log('🔐 Bingo frontend requesting authentication:', event.data.message);
          setShowLoginModal(true);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playerData, user, bingoFrontendOrigin]);
  useEffect(() => {
    checkConnectionsAndInitialize();

    // Check connections every 30 seconds
    const interval = setInterval(checkConnectionsAndInitialize, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Send player data to iframe when it changes
  useEffect(() => {
    if (playerData) {
      sendToBingoIframe({
        type: 'player_data',
        data: playerData
      }, false); // Don't require full integration for basic player data
    }
  }, [playerData]);

  // Handle full screen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showBalanceDetails &&
        balanceDetailsRef.current &&
        !balanceDetailsRef.current.contains(event.target as Node)
      ) {
        setShowBalanceDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBalanceDetails]);

  // Toggle full screen
  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await gameContainerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Full screen toggle failed:', error);
    }
  };

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
              onClick={isAuthenticated ? checkConnectionsAndInitialize : () => setShowLoginModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              {isAuthenticated ? 'Retry Connection' : 'Login'}
            </button>
          </div>
        </div>
        <WebLogin
          isOpen={showLoginModal}
          initialMode="login"
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            checkConnectionsAndInitialize();
          }}
        />
      </div>
    );
  }

  // Main render
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Connection Status Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {connectionStatus.isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm font-medium text-white">
                {connectionStatus.isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {connectionStatus.isBingoFrontendAvailable ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-gray-300">Bingo Frontend</span>
            </div>

            <div className="flex items-center gap-2">
              {connectionStatus.isBackendAvailable ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
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

      { !smartBetIntegrationEnabled && (
        <div className="bg-yellow-500/10 border border-yellow-400 text-yellow-100 rounded-lg p-4 mb-6">
          <strong>Smart Bet integration is disabled.</strong>
          <p className="mt-2 text-sm text-yellow-100">
            Set <code className="bg-black/20 px-1 rounded">VITE_BIGSERVER_URL</code> in <code>.env</code> to enable shared bingo integration and cross-app messaging.
          </p>
        </div>
      )}

      { smartBetIntegrationEnabled && !connectionStatus.isConnected && (
        <div className="bg-red-500/10 border border-red-400 text-red-100 rounded-lg p-4 mb-6">
          <strong>Integration API shutdown:</strong>
          <p className="mt-2 text-sm text-red-100">
            Smart Bet and Bingo are not connected. Cross-app API communication is disabled until the connection is restored.
          </p>
        </div>
      )}

      {/* Player Info Bar */}
      {isAuthenticated && user && playerData && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-400">Player:</span>
                <span className="ml-2 text-white font-semibold">{user.username}</span>
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
        <div ref={gameContainerRef} className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-white font-semibold">Bingo Game</h3>
              {isFullScreen && isAuthenticated && user && (
                <div className="relative flex items-start gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowBalanceDetails(prev => !prev)}
                      className="flex items-center gap-4 bg-[#121212] rounded-lg px-4 py-2 border border-[#2A2A2A] hover:border-[#FFD700] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#FFD700]" />
                        <div className="text-left">
                          <div className="text-xs text-gray-400 mb-1">Total Balance</div>
                          <div className="text-sm font-semibold text-white">${user.balance.toFixed(2)}</div>
                        </div>
                      </div>
                      <span className="text-gray-400 hover:text-white cursor-pointer" role="button" aria-label="Hide balance">
                        <EyeOff className="w-4 h-4" />
                      </span>
                      <span className="text-gray-400 hover:text-white cursor-pointer transition-colors" role="button" aria-label="Refresh balance" title="Refresh balance">
                        <RefreshCw className="w-4 h-4" />
                      </span>
                    </button>

                    {showBalanceDetails && (
                      <div
                        ref={balanceDetailsRef}
                        className="absolute left-0 mt-2 w-72 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-xl z-20 overflow-hidden"
                      >
                        <div className="p-3 border-b border-[#2A2A2A]">
                          <div className="text-xs text-gray-400 mb-1">Balance Overview</div>
                        </div>
                        <div className="p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-400">Main Balance</div>
                              <div className="text-sm font-semibold text-white">${user.balance.toFixed(2)}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                          <div className="h-px bg-[#2A2A2A]" />
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-400">Non-Withdrawable</div>
                              <div className="text-sm font-semibold text-white">${user.non_withdrawable.toFixed(2)}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-400">Bonus Balance</div>
                              <div className="text-sm font-semibold text-[#FFD700]">${user.bonus_balance.toFixed(2)}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-400">Withdrawable</div>
                              <div className="text-sm font-semibold text-green-400">${user.withdrawable.toFixed(2)}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="hidden md:inline text-sm text-white">{user.username}</span>
                </div>
              )}
              <span className="text-sm text-gray-400">http://localhost:5173</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live</span>
              <button
                onClick={toggleFullScreen}
                className="text-gray-400 hover:text-white transition-colors ml-2"
                title={isFullScreen ? "Exit full screen" : "Full screen"}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={checkConnectionsAndInitialize}
                className="text-gray-400 hover:text-white transition-colors"
                title="Refresh connections"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative" style={{ height: '600px' }}>
            <iframe
              ref={iframeRef}
              src={bingoFrontendUrl}
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
                    }, false); // Don't require full integration for basic player data
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
              The bingo game server is currently unavailable. Please try again later or contact support if the problem persists.
            </p>
            <button
              onClick={checkConnectionsAndInitialize}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}