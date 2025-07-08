import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";       // ✅ If App.js is inside pages
import "./pages/style.css";         // ✅ Make sure this path matches your style file

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
