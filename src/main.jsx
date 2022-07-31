import "./index.css";

import App from "./App";
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
    <App />
  </React.StrictMode>
);
