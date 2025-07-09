import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./pages/style.css";
import { AuthProvider } from './context/AuthContext';  // ✅ Make sure this path is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>             {/* ✅ FIX: Wrap your app with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
