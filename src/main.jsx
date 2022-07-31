import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import "virtual:fonts.css";

// Set global values
window.__wooclap = {
  API_BASE_URL: "http://localhost:9000/",
  authToken: `z${Math.floor(Math.random() * Math.random() * Date.now())}`,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
