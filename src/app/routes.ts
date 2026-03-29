import { createBrowserRouter, redirect } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Casino from "./pages/Casino";
import Sports from "./pages/Sports";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import Promotions from "./pages/Promotions";
import TopGames from "./pages/TopGames";
import Bingo from "./pages/Bingo";
import Jackpot from "./pages/Jackpot";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserDashboard from "./components/UserDashboard";
import PlayerRegister from "./components/PlayerRegister";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/home/casino"),
  },
  {
    path: "/home",
    Component: Home,
    children: [
      { index: true, Component: Casino },
      { path: "casino", Component: Casino },
      { path: "sports", Component: Sports },
      { path: "topgames", Component: TopGames },
      { path: "bingo", Component: Bingo },
      { path: "jackpot", Component: Jackpot },
      { path: "promotions", Component: Promotions },
      { path: "profile", Component: Profile },
      { path: "settings", Component: AccountSettings },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/auth",
    Component: Auth,
  },
  {
    path: "/dashboard",
    Component: UserDashboard,
  },
  {
    path: "/player-register",
    Component: PlayerRegister,
  },
  {
    path: "/404",
    Component: NotFound,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);