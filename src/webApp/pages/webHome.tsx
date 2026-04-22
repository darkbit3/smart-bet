import { Outlet, useLocation, useNavigate, useNavigation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { WebBalanceHeader } from "../components/webBalanceHeader";
import { WebBottomNav } from "../components/webBottomNav";
import WebLogin from "./webLogin";
import { WebLoading } from "../components/WebLoading";
import { Expand, Minimize2, X } from "lucide-react";
import { WebWalletModal } from "../components/webWalletModal";
import { WebAccountModal } from "../components/webAccountModal";
import { WebSettingsModal } from "../components/webSettingsModal";
import { useWebAuth } from "../../contexts/webUserContext";

interface WebGameInfo {
  title: string;
  provider: string;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

export default function WebHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useWebAuth();
  const [balance, setBalance] = useState(1247.89);
  const [bonusBalance, setBonusBalance] = useState(50.0);
  const [withdrawable, setWithdrawable] = useState(1000.0);
  const [nonWithdrawable, setNonWithdrawable] = useState(197.89);

  // Debug auth state
  console.log('🏠 WebHome component - User:', user, 'Authenticated:', isAuthenticated);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | null>(null);
  const [selectedGame, setSelectedGame] = useState<WebGameInfo | null>(null);
  const [pendingGame, setPendingGame] = useState<WebGameInfo | null>(null);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [gameCheckLoading, setGameCheckLoading] = useState(false);
  const inactivityTimerRef = useRef<number | null>(null);
  const modalWrapperRef = useRef<HTMLDivElement | null>(null);
  const gameFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isLoading = navigation.state !== "idle";
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Update balance when user changes
  useEffect(() => {
    console.log('🏠 WebHome Balance update useEffect - User changed:', user);
    if (user) {
      console.log('🏠 WebHome Setting balances from user data:', {
        balance: user.balance,
        bonusBalance: user.bonus_balance,
        withdrawable: user.withdrawable,
        nonWithdrawable: user.non_withdrawable
      });
      setBalance(user.balance);
      setBonusBalance(user.bonus_balance);
      setWithdrawable(user.withdrawable);
      setNonWithdrawable(user.non_withdrawable);
    } else {
      console.log('🏠 WebHome No user data, keeping default balances');
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/login") {
      const params = new URLSearchParams(location.search);
      setAuthModalMode(params.get("register") === "true" ? "register" : "login");
    } else {
      setAuthModalMode(null);
    }
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    console.log('🔍 WebHome: handleLogout called');
    console.log('🔍 WebHome: Current user before logout:', user);
    console.log('🔍 WebHome: isAuthenticated before logout:', isAuthenticated);
    
    try {
      await logout();
      console.log('🔍 WebHome: Logout completed');
      console.log('🔍 WebHome: User after logout:', user);
      console.log('🔍 WebHome: isAuthenticated after logout:', isAuthenticated);
      
      setAuthModalMode(null);
      console.log('🔍 WebHome: Navigating to /');
      navigate("/");
    } catch (error) {
      console.error('🔍 WebHome: Logout error:', error);
      // Still navigate even if logout fails
      setAuthModalMode(null);
      navigate("/");
    }
  };

  const openLogin = () => setAuthModalMode("login");
  const openRegister = () => setAuthModalMode("register");
  const closeAuth = () => setAuthModalMode(null);

  const checkGameAvailability = async (game: WebGameInfo): Promise<boolean> => {
    try {
      const response = await fetch(`/api/game-status?title=${encodeURIComponent(game.title)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      return data?.available !== false;
    } catch (error) {
      console.error("WebHome Game API check failed", error);
      return false;
    }
  };

  const onPlayGame = async (game: WebGameInfo) => {
    if (!isAuthenticated) {
      setPendingGame(game);
      setAuthModalMode("login");
      return;
    }

    setGameCheckLoading(true);
    setGameError(null);

    const gameAvailable = await checkGameAvailability(game);
    setGameCheckLoading(false);

    if (!gameAvailable) {
      setGameError("Game is currently unavailable. Please try a different game or try again later.");
      return;
    }

    setSelectedGame(game);
    setIsGameOpen(true);
    setPendingGame(null);
  };

  const handleIdleTimeout = () => {
    console.log('⏰ WebHome User inactive for 5 minutes, logging out...');
    
    // Close any open game first
    if (selectedGame) {
      closeGame();
    }
    
    // Logout the user due to inactivity
    logout();
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(handleIdleTimeout, 5 * 60 * 1000);
  };

  const closeGame = () => {
    setIsGameOpen(false);
    setSelectedGame(null);
    setIsFullscreenMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreenMode(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const activityHandler = () => {
      setGameError(null);
      resetInactivityTimer();
    };

    const events: Array<keyof WindowEventMap> = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, activityHandler));

    resetInactivityTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, activityHandler));
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current);
    };
  }, [isAuthenticated, selectedGame]);

  return (
    <div className="container-modern flex flex-col">
      <WebBalanceHeader
        phoneNumber={user?.phone_number}
        balance={balance}
        bonusBalance={bonusBalance}
        withdrawable={withdrawable}
        nonWithdrawable={nonWithdrawable}
        username={user?.username}
        onSignOut={handleLogout}
        onLogin={openLogin}
        onRegister={openRegister}
        onDeposit={() => setWalletModalOpen(true)}
        onAccount={() => setAccountModalOpen(true)}
        onSettings={() => setSettingsModalOpen(true)}
      />

      
      <WebLogin
        isOpen={authModalMode !== null}
        initialMode={authModalMode ?? "login"}
        onClose={() => {
          closeAuth();
          navigate("/");
        }}
        onSuccess={(user) => {
          // Username is handled by auth context
          closeAuth();
          navigate("/");
          if (pendingGame) {
            setSelectedGame(pendingGame);
            setIsGameOpen(true);
            setPendingGame(null);
          }
        }}
      />

      <WebWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        balance={balance}
        bonusBalance={bonusBalance}
        withdrawable={withdrawable}
        nonWithdrawable={nonWithdrawable}
      />

      <WebAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        username={user?.username || null}
      />

      <WebSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <div className="px-4 md:px-8 pt-4">
      </div>
      
      <main className="flex-1 pb-20 md:pb-4">
        <div key={location.pathname} className="page-transition">
          <Outlet context={{ onPlayGame }} />
        </div>
        {gameCheckLoading && (
          <div className="mt-4 mx-4 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-gray-300">
            Checking game availability...
          </div>
        )}
        {gameError && (
          <div className="mt-4 mx-4 p-3 bg-[#2a1a1a] border border-red-600 rounded-lg text-sm text-red-300">
            {gameError}
          </div>
        )}
      </main>

      {selectedGame && isGameOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4"
          onClick={closeGame}
        >
          <div
            ref={modalWrapperRef}
            className="modal-modern relative w-full h-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              <button
                onClick={() => {
                  if (isFullscreenMode) {
                    document.exitFullscreen().catch(() => undefined);
                    return;
                  }
                  const el = modalWrapperRef.current;
                  if (el && el.requestFullscreen) {
                    el.requestFullscreen();
                  } else if (el && (el as any).webkitRequestFullscreen) {
                    (el as any).webkitRequestFullscreen();
                  } else if (el && (el as any).mozRequestFullScreen) {
                    (el as any).mozRequestFullScreen();
                  } else if (el && (el as any).msRequestFullscreen) {
                    (el as any).msRequestFullscreen();
                  }
                }}
                className="bg-[#000000d0] text-white rounded-full p-2 hover:bg-[#222] transition-colors"
                title={isFullscreenMode ? "Exit Full Screen" : "Enter Full Screen"}
              >
                {isFullscreenMode ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
              </button>
              <button
                onClick={closeGame}
                className="bg-[#000000d0] text-white rounded-full p-2 hover:bg-[#222] transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent" />
            <div className="absolute top-4 left-4 text-white z-50">
              <div className="text-lg font-bold">{selectedGame.title}</div>
              <div className="text-sm text-gray-300">{selectedGame.provider}</div>
            </div>
            <iframe
              ref={gameFrameRef}
              title={selectedGame.title}
              src={`https://example.com/game/${encodeURIComponent(selectedGame.title)}`}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <WebBottomNav />
      {isLoading && <WebLoading />}
    </div>
  );
}
