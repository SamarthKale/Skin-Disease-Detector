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
        <section className="resource-section">
          <h1 className="resource-heading">Resources</h1>
          <div className="card-container">
            <div className="resource-card">
              <img
                src="/images/hold.jpg"
                alt="Skin Scan"
                className="resource-img"
              />
              <h2>Resource 01</h2>
              <h3>AI-Powered Skin Analysis</h3>
              <p>
                Discover how our AI scans your skin and detects dermatological
                issues instantly from your phone's camera.
              </p>
            </div>

            <div className="resource-card">
              <img
                src="/images/disease-catalog.jpg"
                alt="Skincare Routine"
                className="resource-img"
              />
              <h2>Resource 02</h2>
              <h3>Personalized Care Guides</h3>
              <p>
                Get curated skincare routines and product recommendations based
                on AI diagnostics tailored to your skin type.
              </p>
            </div>

            <div className="resource-card">
              <img
                src="/images/tutorials.jpg"
                alt="AI Innovation"
                className="resource-img"
              />
              <h2>Resource 03</h2>
              <h3>AI & Dermatology Research</h3>
              <p>
                Explore our publications, documentation, and innovations behind
                the VedaralaAI platform.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 VedaralaAI | Empowering Health Through AI</p>
      </footer>
    </div>
  );
};

export default ResourcesPage;
