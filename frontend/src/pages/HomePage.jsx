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
        <section className="info-section about-simple-card" style={{ marginBottom: "0rem" }}>
          <div className="about-simple-content split-section">
            <div className="image-wrapper">
              <img
                src="/images/ai-guide.jpg"
                alt="About VedaralaAI"
                className="about-simple-image styled-image"
                style={{ width: "100%", maxWidth: "650px" }}
              />
            </div>
            <div className="text-wrapper">
              <h2 style={{ textAlign: "center", fontSize: "2.8rem" }}>About VedaralaAI</h2>
              <p style={{ marginTop: "0.5rem" }}>
                VedaralaAI is a mission-driven platform created to redefine access to skin care diagnostics.
                Recognizing the deep healthcare disparities in rural and underserved communities, our team
                set out with one goal: to put the power of dermatological evaluation into everyone’s hands.
                Using cutting-edge machine learning, intuitive design, and deep collaboration with medical professionals,
                VedaralaAI delivers fast, understandable, and context-aware skin analysis — all from a mobile device.
                Our initiative reflects the strength of human-centered design, and the power of technology to drive
                real-world impact in areas that need it most.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="info-section about-section-card" style={{ marginTop: "-4rem" }}>
          <div className="about-card split-section reverse">
            <div className="text-wrapper" style={{ fontSize: "1.5rem" }}>
              <h2 style={{ fontSize: "2.8rem" }}>Our Story</h2>
              <p style={{ marginTop: "0.3rem" }}>
                At its core, VedaralaAI is a story of purpose. What began as a shared vision among engineers, researchers,
                and healthcare practitioners has grown into a powerful force for change. In many rural and remote regions,
                people suffer silently from skin conditions without timely diagnosis or treatment. We wanted to change that narrative.
                Our story is built on grassroots insights, collaborative prototyping, and a commitment to blending AI with
                compassion.
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
  style={{
    width: "100%",
    maxWidth: "800px",
    height: "700px",         // 👈 explicitly set height
    objectFit: "cover",      // 👈 ensures it fills space without distortion
    borderRadius: "12px"
  }}
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
