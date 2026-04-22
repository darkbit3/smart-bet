import { Suspense, useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { PageLoading } from "../components/Loading";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "../contexts/UserContext";
import { BalanceProvider } from "../contexts/BalanceContext";
import { ToastProvider } from "../components/ToastContainer";
import { io } from 'socket.io-client';
import Login from "./pages/Login";
import "../styles/globals.css";
import "../styles/main.css";
import "../styles/theme.css";

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl);

    socket.on('connect', () => {
      console.log('Smart Bet connected to backend WebSocket');
    });

    socket.on('show-login-modal', (data) => {
      console.log('Received show-login-modal event:', data);
      setShowLoginModal(true);
    });

    socket.on('disconnect', () => {
      console.log('Smart Bet disconnected from backend WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BalanceProvider>
            <Suspense fallback={<PageLoading text="Initializing app..." />}>
                <RouterProvider router={router} />
              {showLoginModal && (
                <Login
                  isOpen={showLoginModal}
                  initialMode="login"
                  onClose={() => setShowLoginModal(false)}
                  onSuccess={() => setShowLoginModal(false)}
                />
              )}
            </Suspense>
          </BalanceProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
