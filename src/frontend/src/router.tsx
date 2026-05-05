import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { DemoBanner } from "./components/DemoBanner";

// Lazy-loaded page imports
import { Suspense, lazy } from "react";
import { FullPageLoader } from "./components/LoadingSpinner";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SendMoneyPage = lazy(() => import("./pages/SendMoneyPage"));
const ScanQRPage = lazy(() => import("./pages/ScanQRPage"));
const MyQRPage = lazy(() => import("./pages/MyQRPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ReceiptPage = lazy(() => import("./pages/ReceiptPage"));

// Root layout with DEMO banner always visible
function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<FullPageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => <SignupPage />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <DashboardPage />,
});

const sendRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/send",
  component: () => <SendMoneyPage />,
});

const scanQRRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan-qr",
  component: () => <ScanQRPage />,
});

const myQRRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-qr",
  component: () => <MyQRPage />,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => <HistoryPage />,
});

const receiptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/receipt",
  component: () => <ReceiptPage />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  dashboardRoute,
  sendRoute,
  scanQRRoute,
  myQRRoute,
  historyRoute,
  receiptRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
