import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Loading } from "./components/Loading";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "../contexts/UserContext";
import { BalanceProvider } from "../contexts/BalanceContext";
import { ToastProvider } from "../components/ToastContainer";

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BalanceProvider>
            <Suspense fallback={<Loading />}>
              <RouterProvider router={router} />
            </Suspense>
          </BalanceProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
