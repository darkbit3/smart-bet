import { createBrowserRouter, redirect } from "react-router";
import WebLogin from "./pages/webLogin";
import WebHome from "./pages/webHome";
import WebCasino from "./pages/webCasino";
import WebSports from "./pages/webSports";
import WebProfile from "./pages/webProfile";
import WebPromotions from "./pages/webPromotions";
import WebTopGames from "./pages/webTopGames";
import WebBingo from "./pages/webBingo";
import WebJackpot from "./pages/webJackpot";
import WebNotFound from "./pages/webNotFound";
import WebAuth from "./pages/webAuth";
import WebUserDashboard from "./components/webUserDashboard";
import WebTestAuth from "./pages/webTestAuth";
import WebPlayerRegister from "./components/webPlayerRegister";

export const webRouter = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/home/casino"),
  },
  {
    path: "/home",
    Component: WebHome,
    children: [
      { index: true, Component: WebCasino },
      { path: "casino", Component: WebCasino },
      { path: "sports", Component: WebSports },
      { path: "topgames", Component: WebTopGames },
      { path: "bingo", Component: WebBingo },
      { path: "jackpot", Component: WebJackpot },
      { path: "promotions", Component: WebPromotions },
      { path: "profile", Component: WebProfile },
    ],
  },
  {
    path: "/login",
    Component: WebLogin,
  },
  {
    path: "/auth",
    Component: WebAuth,
  },
  {
    path: "/dashboard",
    Component: WebUserDashboard,
  },
  {
    path: "/test-auth",
    Component: WebTestAuth,
  },
  {
    path: "/player-register",
    Component: WebPlayerRegister,
  },
  {
    path: "/404",
    Component: WebNotFound,
  },
  {
    path: "*",
    Component: WebNotFound,
  },
]);
