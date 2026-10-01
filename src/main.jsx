import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/cormorant-garamond/index.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/tangerine/400.css";
import "@fontsource/tangerine/700.css";
import "@fontsource-variable/inter/index.css";
import "./styles/globals.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
