import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.svg";

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // handle input changes for the controlled form
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // register
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header-container">
        <Link to="/home">
          {" "}
          <img src={logo} alt="Company Logo" className="logo-container" />{" "}
        </Link>
        <hr className="plain-line" />
        <div className="header-wrapper" style={{ width: "15%" }}>
          <Link className="header-item" to="/home">
            Go Back to Homepage
          </Link>
        </div>
      </div>

      <div className="card" style={styles.card}>
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className="drink-form">
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Choose a password"
          />
          <button type="submit">
            Register
          </button>
        </form>
        <p style={styles.footerText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/home")} className="register-link">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    marginTop: "10vh",
  }
};

export default Register;
