import React, { useState, useEffect } from "react";
import "./style.css";

const ScanPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [explanation, setExplanation] = useState("");
  const [typedExplanation, setTypedExplanation] = useState("");
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapKey, setMapKey] = useState("");

  // Fetch Google Maps embed key
  useEffect(() => {
    fetch("http://localhost:5000/api/get-map-key")
      .then((res) => res.json())
      .then((data) => setMapKey(data.key))
      .catch((err) => console.error("Map key fetch error:", err));
  }, []);

  // Typing animation for explanation
  useEffect(() => {
    if (!explanation) return;
    let i = 0;
    setTypedExplanation("");
    const interval = setInterval(() => {
      setTypedExplanation((prev) => prev + explanation.charAt(i));
      i++;
      if (i >= explanation.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [explanation]);

  // Image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Trigger camera input
  const handleCameraClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = handleImageChange;
    input.click();
  };

  // Run prediction + explanation + doctor search
  const handleAnalyze = async () => {
    if (!imageFile) return alert("Please upload an image first.");
    setLoading(true);
    setPrediction("");
    setConfidence("");
    setExplanation("");
    setTypedExplanation("");
    setDoctors([]);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence);

      const explainRes = await fetch("http://localhost:5000/api/explain-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition: data.prediction }),
      });
      const explainData = await explainRes.json();
      setExplanation(explainData.explanation);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude });

          const doctorRes = await fetch("http://localhost:5000/api/search-doctors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: latitude, lon: longitude }),
          });
          const docData = await doctorRes.json();
          setDoctors(docData.doctors || []);
          setLoading(false);
        },
        () => {
          alert("Location permission denied.");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper fade-in">
      {/* Header */}
      <header className="homepage-header">
        <div className="container nav">
          <div className="logo">VedaralaAI</div>
          <nav className="nav-links">
            <a href="/home">Home</a>
            <a href="/about">About Us</a>
            <a href="/scan" className="active-link">Scan</a>
            <a href="/resources">Resources</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <section className="diagnosis-section">
          <h2>📷 Upload or Scan Skin Image</h2>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <div style={{ marginTop: "10px" }}>
            <button className="secondary-btn" onClick={handleCameraClick}>📷 Use Camera</button>
            <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? <span className="loader"></span> : "🔍 Analyze"}
            </button>
          </div>

          {imagePreview && (
            <>
              <h3 style={{ marginTop: "30px" }}>Preview:</h3>
              <img src={imagePreview} alt="preview" style={{ width: "250px", borderRadius: "12px" }} />
            </>
          )}

          {/* Prediction */}
          {prediction && (
            <div className="terminal-box fade-in">
              <p>🧠 <strong>Prediction:</strong> <span style={{ color: "#00f5d4" }}>{prediction}</span></p>
              <p>📊 <strong>Confidence:</strong> <span style={{ color: "#00f5d4" }}>{confidence}</span></p>
            </div>
          )}

          {/* Explanation */}
          {typedExplanation && (
            <div className="terminal-box fade-in">
              <p>💡 <strong>Condition Info</strong></p>
              <p style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>{typedExplanation}</p>
            </div>
          )}

          {/* Doctor List */}
          {doctors.length > 0 && (
            <div className="terminal-box fade-in">
              <p>🏥 <strong>Nearby Skin Specialists</strong></p>
              <ul style={{ marginTop: "10px", listStyle: "none", padding: 0 }}>
                {doctors.map((doc, index) => (
                  <li key={index}>
                    <strong>{doc.name}</strong> — {doc.address || "No address"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Map Embed */}
          {location && mapKey && (
            <div className="map-container fade-in">
              <p>🗺️ <strong>Location Map</strong></p>
              <iframe
                title="Nearby Dermatologists"
                width="100%"
                height="300"
                style={{ border: "2px solid #00f5d4", borderRadius: "10px" }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/search?key=${mapKey}&q=dermatologist&center=${location.lat},${location.lon}&zoom=13`}>
              </iframe>
            </div>
          )}

          {/* Report Options */}
          <div style={{ marginTop: "30px" }}>
            <button className="secondary-btn">💾 Save Report</button>
            <button className="primary-btn" style={{ marginLeft: "1rem" }}>📂 View Past Reports</button>
          </div>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>© 2025 VedaralaAI | Empowering Skin Health with AI</p>
      </footer>
    </div>
  );
};

export default ScanPage;
