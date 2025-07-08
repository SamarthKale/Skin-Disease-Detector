import React from "react";
import "./style.css";

export default function ContactPage() {
  return (
    <div className="contact-wrapper with-bg-image">
      <header className="homepage-header">
        <div className="container nav">
          <div className="logo">VedaralaAI</div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/scan">Scan</a>
            <a href="/resources">Resources</a>
            <a href="/contact" className="active-link">Contact</a>
          </nav>
        </div>
      </header>

      <main className="contact-main">
        <section className="contact-section">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-description">
            Whether you have questions, feedback, or need assistance — we're here to help. Reach out to the VedaralaAI team anytime.
          </p>

          <form className="contact-form">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your Full Name" />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your Email Address" />

            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="Write your message here..." rows="5" />

            <button type="submit">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>© 2025 VedaralaAI | Empowering Skin Health with AI</p>
      </footer>
    </div>
  );
}
