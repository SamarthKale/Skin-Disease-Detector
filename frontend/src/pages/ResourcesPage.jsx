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
            {/* Resource 1: TensorFlow */}
            <a
              href="https://www.tensorflow.org/overview"
              className="resource-card"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/ai-guide.jpg"
                alt="TensorFlow Overview"
                className="resource-img"
              />
              <h2>Resource 01</h2>
              <h3>Introduction to TensorFlow</h3>
              <p>
                TensorFlow is an open-source machine learning framework used to build and train AI models.
                It powers real-time skin disease detection in VedaralaAI.
              </p>
            </a>

            {/* Resource 2: NVIDIA CUDA */}
            <a
              href="https://developer.nvidia.com/cuda-zone"
              className="resource-card"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/disease-catalog.jpg"
                alt="NVIDIA CUDA"
                className="resource-img"
              />
              <h2>Resource 02</h2>
              <h3>GPU Acceleration with NVIDIA CUDA</h3>
              <p>
                Learn how NVIDIA’s CUDA platform accelerates deep learning workflows, enabling
                efficient training and inference for medical AI applications like ours.
              </p>
            </a>

            {/* Resource 3: Kaggle HAM10000 Dataset */}
            <a
              href="https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000"
              className="resource-card"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/tutorials.jpg"
                alt="HAM10000 Dataset"
                className="resource-img"
              />
              <h2>Resource 03</h2>
              <h3>HAM10000 Skin Dataset</h3>
              <p>
                Explore this widely used dermatology dataset containing 10,000+ dermatoscopic images.
                It plays a crucial role in training and benchmarking skin disease classification models.
              </p>
            </a>
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
