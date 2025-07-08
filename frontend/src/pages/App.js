import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Correct: import sibling components directly
import LoginPage from "./LoginPage";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import ContactPage from "./ContactPage";
import ResourcesPage from "./ResourcesPage";
import ScanPage from "./ScanPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/scan" element={<ScanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
