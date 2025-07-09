import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./style.css";

export default function HomePage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="homepage-wrapper">
      <header className="homepage-header">
        <div className="container nav">
          <div className="logo">VedaralaAI</div>
          <nav className="nav-links">
            <Link to="/home">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/scan">Scan</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="homepage-content">
        <section className="hero">
          <h1 className="hero-title">VedaralaAI</h1>
          <p className="hero-subtitle">Empowering Skin Health Through AI</p>
          <p className="hero-description">
            VedaralaAI is a revolutionary AI-driven diagnostic platform designed to bring
            accurate, fast, and accessible skin condition analysis to everyone, everywhere.
            From rural villages to urban clinics, our mission is to bridge the healthcare
            gap using cutting-edge technology — all in the palm of your hand.
          </p>
          <div className="hero-buttons">
            <Link to="/scan" className="primary-btn">
              Start Diagnosis
            </Link>
          </div>
        </section>

        {/* About Vedarala Section - Image Left, Text Right */}
        <section className="info-section about-simple-card">
          <div className="about-simple-content split-section">
            <div className="image-wrapper">
              <img
                src="/images/ai-guide.jpg"
                alt="About VedaralaAI"
                className="about-simple-image styled-image"
              />
            </div>
            <div className="text-wrapper">
              <h2>About VedaralaAI</h2>
              <p>
                VedaralaAI was born out of a passion to make dermatological care more accessible.
                With millions lacking access to qualified dermatologists — especially in underserved regions —
                we set out to create a tool that anyone with a phone can use. Built by a team of engineers,
                medical experts, and designers, VedaralaAI stands at the intersection of technology and healthcare.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="info-section about-section-card">
          <div className="about-card split-section reverse">
            <div className="text-wrapper" style={{ fontSize: "1.2rem" }}>
              <h2 style={{ fontSize: "2rem" }}>Our Story</h2>
              <p>
                VedaralaAI was created to democratize access to dermatological care using machine learning and data-driven insights.
              </p>
              <Link to="/about" className="read-more-btn">
                Read More &gt;
              </Link>
            </div>
            <div className="image-wrapper">
              <img
                src="/images/bacteria.jpg"
                alt="Our Story"
                className="about-image styled-image"
                style={{ width: "100%", maxWidth: "600px" }}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>© 2025 VedaralaAI | Empowering Skin Health with AI</p>
      </footer>
    </div>
  );
}
