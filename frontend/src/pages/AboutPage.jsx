// AboutPage.jsx
import React from "react";
import "./style.css";         // general styles (starry background, etc.)
import "./AboutPage.jsx";       // specific styles for about us page

const teamMembers = [
  {
    name: "Kunal Chaudhari",
    image: "/images/kunal.jpg",
    linkedin: "https://www.linkedin.com/in/kunal-chaudhari-633315360/",
  },
  {
    name: "Samarth Kale",
    image: "/images/samarth.jpg",
    linkedin: "https://www.linkedin.com/in/samarth-n-kale/",
  },
  {
    name: "Preksha Pethakar",
    image: "/images/preksha.jpg",
    linkedin: "https://www.linkedin.com/in/preksha-pethakar-857170327/",
  },
  {
    name: "Abhinaya Gowda",
    image: "/images/abhinaya.jpg",
    linkedin: "https://www.linkedin.com/in/abhinaya-gowda-aa4472315/",
  },
];

const AboutPage = () => {
  return (
    <div className="page-wrapper">
      {/* Header */}
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

      {/* About Us Content */}
      <div className="aboutus-page">
        <div className="aboutus-container">
          {/* Intro */}
          <div className="aboutus-header">
            <h2>About VedaralaAI</h2>
            <p>
              VedaralaAI is a mission-driven initiative using artificial intelligence to make skin disease diagnosis accessible in rural India. Our tool empowers health workers with instant skin analysis and connects underserved areas with modern care — all through a mobile device.
            </p>
          </div>

          {/* AI + Nature Section */}
          <div className="aboutus-section">
            <img src="/images/hands2.jpg" alt="AI meets nature" />
            <div className="aboutus-text">
              <h3>🌿 Our Journey of Innovation</h3>
              <p>
                In rural clinics, many skin conditions go undiagnosed due to lack of specialists. VedaralaAI was born to change that — transforming any phone into a skin care assistant. Our platform combines advanced dermatology AI with community-driven care.
              </p>
            </div>
          </div>

          {/* Why Section */}
          <div className="aboutus-section reverse">
            <div className="aboutus-text">
              <h3>💡 Why Choose VedaralaAI?</h3>
              <p>
                We focus on what matters — early detection, rural usability, offline compatibility, and local treatment guidance. Our AI models are trained not just on medical data, but real village conditions. Each result is understandable, fast, and human-centric.
              </p>
            </div>
            <img src="/images/hands.jpg" alt="Why VedaralaAI" />
          </div>

          {/* Team Section */}
          <div className="aboutus-header">
            <h2>Meet the Team</h2>
          </div>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-card">
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <img src={member.image} alt={member.name} />
                  <h4>{member.name}</h4>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-white bg-opacity-70 text-center py-4 mt-auto">
        <p>© 2025 VedaralaAI | Empowering Health Through AI</p>
      </footer>
    </div>
  );
};

export default AboutPage;
