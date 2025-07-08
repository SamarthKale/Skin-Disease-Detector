import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const toggleForm = () => {
    setError("");
    setIsSignUp(!isSignUp);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            username: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Signup successful!");
          navigate("/home");
        } else {
          setError(data.message || "Signup failed");
        }
      } catch (err) {
        setError("Server error");
      }
    } else {
      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Login successful!");
          navigate("/home");
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        setError("Server error");
      }
    }
  };

  return (
    <>
      <header>
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

      <main>
        <div className="container content">
          <section className="login-section">
            <div className="login-card">
              <h2>{isSignUp ? "Create an Account" : "Access Your Account"}</h2>
              <p className="description">
                {isSignUp
                  ? "Sign up to unlock VedaralaAI's intelligent healthcare solutions."
                  : "Sign in to unlock the full potential of VedaralaAI's intelligent healthcare solutions."}
              </p>

              {error && <p className="error">{error}</p>}

              <form onSubmit={handleSubmit}>
                {isSignUp && (
                  <>
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      type="text"
                      id="full_name"
                      placeholder="Your full name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {isSignUp && (
                  <>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}

                {!isSignUp && (
                  <div className="form-footer">
                    <label className="remember">
                      <input type="checkbox" /> Remember Me
                    </label>
                    <a href="#" className="forgot">Forgot Password?</a>
                  </div>
                )}

                <button type="submit">
                  {isSignUp ? "Sign Up" : "Login to Dashboard"}
                </button>
              </form>

              <p className="account-link">
                {isSignUp ? (
                  <>Already have an account? <a href="#" onClick={toggleForm}>Sign In</a></>
                ) : (
                  <>Don't have an account? <a href="#" onClick={toggleForm}>Create an Account</a></>
                )}
              </p>

              <p className="terms">
                By continuing, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>
            </div>
          </section>

          <section className="promo-section">
            <h1>"Empowering Health Through AI Innovation"</h1>
            <p className="promo-desc">
              VedaralaAI: Revolutionizing healthcare with intelligent, data-driven solutions designed for precision and compassion.
            </p>
            <div className="why">
              <h3>Why Choose VedaralaAI?</h3>
              <ul>
                <li><span>✔</span> <strong>Cutting-Edge AI Diagnostics:</strong> Faster, more accurate medical insights.</li>
                <li><span>✔</span> <strong>Personalized Treatment Plans:</strong> Based on individual patient data.</li>
                <li><span>✔</span> <strong>Robust Data Security:</strong> Protected with encryption and compliance.</li>
                <li><span>✔</span> <strong>Seamless Integration:</strong> Works with existing healthcare systems.</li>
                <li><span>✔</span> <strong>24/7 Intelligent Support:</strong> AI-powered help, anytime.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="container footer">
          <p>
            Need Assistance? Contact Support:{" "}
            <a href="mailto:support@vedaralaai.com">support@vedaralaai.com</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default LoginPage;
