import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_4.png"; // Import the logo

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLinks}>
          <span onClick={() => navigate("/jobs")} style={styles.link}>Jobs</span>
          <span onClick={() => navigate("/login")} style={styles.link}>Login</span>
        </div>
      </nav>

      {/* Logo outside the navbar */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="EquiHire Logo" style={styles.logo} />
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to EquiHire!</h1>
        <p style={styles.subtitle}>Your path to a better career starts here.</p>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Find Jobs That Fit Your Skills</h2>
        </div>
        <div style={styles.buttons}>
          <button style={styles.exploreBtn} onClick={() => navigate("/jobs")}>
            Explore Jobs
          </button>
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    fontFamily: "'OpenDyslexic','Arial', sans-serif",
  },
  navbar: {
    width: "100%",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "flex-end", // Align links to the right
    alignItems: "center",
    backgroundColor: "#2c3e50",
    color: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  logoContainer: {
    marginTop: "6rem", // Space between navbar and logo
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    height: "260px", // Adjust the size as needed
    width: "auto",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "color 0.2s ease",
    fontWeight: "500",
  },
  content: {
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.4rem",
    color: "#4a4a4a",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  card: {
    backgroundColor: "#e0e0e0",
    padding: "1.8rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "1.8rem",
    border: "1px solid #ccc",
    maxWidth: "600px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "0.8rem",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  exploreBtn: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "0.8rem 1.6rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease",
    fontSize: "1rem",
    fontWeight: "bold",
    letterSpacing: "0.03rem",
    fontFamily: "'OpenDyslexic', Arial, sans-serif",
  },
  loginBtn: {
    backgroundColor: "#28a745",
    color: "#ffffff",
    padding: "0.8rem 1.6rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease",
    fontSize: "1rem",
    fontWeight: "bold",
    letterSpacing: "0.03rem",
    fontFamily: "'OpenDyslexic', Arial, sans-serif",
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.95rem",
    color: "#4a4a4a",
    letterSpacing: "0.03rem",
  },
};

export default Home;
