import React, { useState } from "react";

function JobForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // 🛑 Get token first!

    if (!token) {
      console.error("No token found. Please log in first.");
      return;
    }

    // POST the new job to the backend
    fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`, // Ensure `token` is retrieved from localStorage
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Job added:", data);
        // Clear form after submission
        setTitle("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error posting job:", error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Post a New Job</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Job Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Job Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>
        <button type="submit" style={styles.submitBtn}>Post Job</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "4rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    minHeight: "150px",
  },
  submitBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "0.8rem 2rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
    display: "block",
    width: "100%",
    fontSize: "1rem",
  },
};

export default JobForm;
