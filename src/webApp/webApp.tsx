import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./webRoutes";
import { WebLoading } from "./components/webLoading";
import { WebErrorBoundary } from "./components/webErrorBoundary";
import { WebAuthProvider } from "../contexts/webUserContext";
import { WebToastProvider } from "../components/webToastContainer";

export default function WebApp() {
  return (
    <WebErrorBoundary>
      <WebToastProvider>
        <WebAuthProvider>
          <Suspense fallback={<WebLoading />}>
            <RouterProvider router={router} />
          </Suspense>
        </WebAuthProvider>
      </WebToastProvider>
    </WebErrorBoundary>
  );
}
