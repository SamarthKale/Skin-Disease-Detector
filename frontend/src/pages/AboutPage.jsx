// AboutPage.jsx
import React from "react";
import "./style.css";

const AboutPage = () => {
  return (
    <div className="page-wrapper">
      <header className="header">
        <div className="container nav">
          <div className="logo">VedaralaAI</div>
          <nav className="nav-links">
            <a href="/home">Home</a>
            <a href="/about">About Us</a>
            <a href="/scan">Scan</a>
            <a href="/resources">Resources</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="info-section">
          <h1>About VedaralaAI</h1>
          <p>
            VedaralaAI is committed to revolutionizing healthcare through intelligent,
            accessible AI-driven diagnostic tools. We bridge the gap in dermatological care
            by empowering both professionals and patients with powerful technology.
          </p>
          <p>
            Our team consists of passionate engineers, medical experts, and designers
            who believe that high-quality healthcare should be a right, not a privilege.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 VedaralaAI | Empowering Health Through AI</p>
      </footer>
    </div>
  );
};

export default AboutPage;
