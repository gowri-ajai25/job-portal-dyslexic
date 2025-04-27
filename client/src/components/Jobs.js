import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,        // 🛠 Correct field name
          user_password: password,  // 🛠 Correct field name
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }
  
      // Handle successful login (store token, redirect, etc.)
      localStorage.setItem('authToken', data.token);   // Prefer naming it authToken
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', data.role);
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>JobPortal</div>
        <div style={styles.navLinks}>
          <span onClick={() => navigate("/")} style={styles.link}>Home</span>
          <span onClick={() => navigate("/login")} style={styles.link}>Login</span>
        </div>
      </nav>

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Login
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2025 Job Portal. All Rights Reserved.
      </footer>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  navbar: {
    width: "100%",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1f2d3d",
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#ccc",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "color 0.3s",
  },
  content: {
    marginTop: "6rem", // Adjusted to avoid navbar overlap
    padding: "2rem",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px", // Adjust width for login form
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2d3d",
    marginBottom: "1.5rem",
  },
  footer: {
    marginTop: "auto",
    fontSize: "0.9rem",
    color: "#6c757d",
    padding: "1rem",
    textAlign: "center",
  },
};

export default Login;
