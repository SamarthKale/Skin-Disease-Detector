// ResourcesPage.jsx
import React from "react";
import "./style.css";

const ResourcesPage = () => {
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
          <h1>Resources</h1>
          <ul>
            <li><a href="#">📄 AI & Dermatology: White Paper</a></li>
            <li><a href="#">📊 Case Studies on AI Diagnostics</a></li>
            <li><a href="#">📚 Research Publications</a></li>
            <li><a href="#">🎥 Video Tutorials and Demos</a></li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 VedaralaAI | Empowering Health Through AI</p>
      </footer>
    </div>
  );
};

export default ResourcesPage;
