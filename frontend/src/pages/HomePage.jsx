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
        {/* HERO SECTION */}
        <section className="hero" style={{ padding: "4rem 1rem" }}>
          <h1 className="hero-title" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            VedaralaAI
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            Empowering Skin Health Through AI
          </p>
          <p className="hero-description" style={{ maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
            VedaralaAI is a revolutionary AI-driven diagnostic platform designed to bring
            accurate, fast, and accessible skin condition analysis to everyone, everywhere.
            From rural villages to urban clinics, our mission is to bridge the healthcare
            gap using cutting-edge technology — all in the palm of your hand.
          </p>
          <div className="hero-buttons" style={{ marginTop: "1.5rem" }}>
            <Link to="/scan" className="primary-btn">
              Start Diagnosis
            </Link>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="info-section about-simple-card" style={{ padding: "2rem 0" }}>
          <div className="about-simple-section">
            <div className="about-simple-content" style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <img
                src="/images/ai-guide.jpg"
                alt="About VedaralaAI"
                className="about-simple-image"
                style={{ flex: "1 1 300px", maxWidth: "400px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
              />
              <div className="about-simple-text" style={{ flex: "1 1 300px" }}>
                <h2 style={{ marginBottom: "0.75rem", fontSize: "1.75rem" }}>About VedaralaAI</h2>
                <p style={{ lineHeight: "1.6" }}>
                  VedaralaAI was born out of a passion to make dermatological care more accessible.
                  With millions lacking access to qualified dermatologists—especially in underserved regions—
                  we set out to create a tool that anyone with a phone can use. Built by a team of engineers,
                  medical experts, and designers—VedaralaAI stands at the intersection of technology and healthcare.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="info-section about-section-card" style={{ padding: "2rem 0" }}>
          <div className="about-card" style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap-reverse" }}>
            <div className="about-text" style={{ flex: "1 1 300px" }}>
              <h2 style={{ marginBottom: "0.75rem", fontSize: "1.75rem" }}>Our Story</h2>
              <p style={{ lineHeight: "1.6" }}>
                VedaralaAI was created to democratize access to dermatological care using machine learning and data-driven insights.
              </p>
              <Link to="/about" className="read-more-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
                Read More &gt;
              </Link>
            </div>
            <img
              src="/images/bacteria.jpg"
              alt="Our Story"
              className="about-image"
              style={{ flex: "1 1 300px", maxWidth: "400px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            />
          </div>
        </section>
      </main>

      <footer className="homepage-footer" style={{ padding: "1rem 0", textAlign: "center" }}>
        <p>© 2025 VedaralaAI | Empowering Skin Health with AI</p>
      </footer>
    </div>
  );
}
