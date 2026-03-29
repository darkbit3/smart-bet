import { createRoot } from "react-dom/client";
import App from "./webApp/webApp.tsx";
import "./webApp/webStyles.css";

// Set default theme to dark
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
