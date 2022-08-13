import App from "./App";
import { CssReset } from "./css-reset.styles";
import { GlobalStyle } from "./App.styles";
import React from "react";
import ReactDOM from "react-dom/client";

// Set global values
window.__wooclap = {
  API_BASE_URL: "http://localhost:9000/",
  authToken: `z${Math.floor(Math.random() * Math.random() * Date.now())}`,
  clientConfig: null,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssReset />
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
