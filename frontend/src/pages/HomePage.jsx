import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      <header className="homepage-header">
        <div className="container nav">
          <div className="logo">VedaralaAI</div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/scan">Scan</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="homepage-content">
        <section className="hero">
          <h1 className="hero-title">VedaralaAI</h1>
          <p className="hero-subtitle">Empowering Skin Health Through AI</p>
          <p className="hero-description">
            VedaralaAI is a revolutionary AI-driven diagnostic platform designed to bring accurate, fast, and accessible skin condition analysis to everyone, everywhere.
            From rural villages to urban clinics, our mission is to bridge the healthcare gap using cutting-edge technology — all in the palm of your hand.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn">Get Started</button>
          </div>
        </section>

        <section id="about" className="info-section about-simple-card">
  <section className="about-simple-section">
  <div className="about-simple-content">
    <img
      src="/images/ai-guide.jpg"
      alt="About VedaralaAI"
      className="about-simple-image"
    />
    <div className="about-simple-text">
      <h2>About VedaralaAI</h2>
      <p>
        VedaralaAI was born out of a passion to make dermatological care more accessible.
        With millions lacking access to qualified dermatologists—especially in underserved regions—
        we set out to create a tool that anyone with a phone can use. Built by a team of engineers,
        medical experts, and designers—VedaralaAI stands at the intersection of technology and healthcare.
      </p>
    </div>
  </div>
</section>
</section>


        <section id="story" className="info-section about-section-card">
  <div className="about-card">
    <img
      src="/images/bacteria.jpg"
      alt="Our Story"
      className="about-image"
    />
    <div className="about-text">
      <h2>Our Story</h2>
      <p>VedaralaAI was born out of a passion to make dermatological care more accessible. With millions lacking access to qualified dermatologists—especially in underserved regions—we set out to create a tool that anyone with a phone can use. Built by a team of engineers, medical experts, and designers—VedaralaAI stands at the intersection of technology and healthcare.</p>
      <Link to="/about" className="read-more-btn">Read More &gt;</Link>
    </div>
  </div>
</section>


        <section id="diagnose" className="diagnosis-section">
          
          <form className="diagnosis-form">
          
            <button type="submit">Diagnose Now</button>
          </form>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>© 2025 VedaralaAI | Empowering Skin Health with AI</p>
      </footer>
    </div>
  );
}
