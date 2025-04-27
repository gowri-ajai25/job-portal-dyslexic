import React, { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactno, setContactNo] = useState('');
  const [dob, setDOB] = useState('');
  const [skills, setSkills] = useState('');
  const [locality, setLocality] = useState('');
  const [education_qualification, setEducation_Qualification] = useState('');
  const [languages, setLanguages] = useState('');
  const [certificates, setCertificates] = useState('');
  const [role, setRole] = useState('candidate');  // Default role is 'candidate'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (contactno.length !== 10) {
      setError('Contact number must be exactly 10 digits.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please provide a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Convert certificates to an array if they're comma-separated
    const certificatesArray = certificates.split(',').map(cert => cert.trim());

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: name,
          user_email: email,
          user_password: password,
          contactnumber: contactno,
          user_dob: dob,
          skills,
          locality,
          educational_qualification: education_qualification,
          languages,
          certificates: certificatesArray,  // Send certificates as an array
          role,  // Send the selected role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed.');
        return;
      }

      // Handle successful signup (redirect, show success message, etc.)
      alert(`Welcome, ${name}! Signup successful.`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.signupContainer}>
      <h2 style={styles.signupTitle}>Create Your Account</h2>
      <form style={styles.signupForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.signupInput}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.signupInput}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.signupInput}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contactno}
          onChange={(e) => setContactNo(e.target.value)}
          style={styles.signupInput}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDOB(e.target.value)}
          style={styles.signupInput}
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          style={styles.signupInput}
        />
        <input
          type="text"
          placeholder="Locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          style={styles.signupInput}
        />
        <input
          type="text"
          placeholder="Education Qualification"
          value={education_qualification}
          onChange={(e) => setEducation_Qualification(e.target.value)}
          style={styles.signupInput}
        />
        <input
          type="text"
          placeholder="Languages Known"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          style={styles.signupInput}
        />
        <input
          type="text"
          placeholder="Certificates (comma separated)"
          value={certificates}
          onChange={(e) => setCertificates(e.target.value)}
          style={styles.signupInput}
        />
        
        {/* Role Selection Dropdown */}
        <select 
          value={role}
          onChange={(e) => setRole(e.target.value)} 
          style={styles.signupInput}
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit" style={styles.signupButton}>Sign Up</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

const styles = {
  signupContainer: {
    maxWidth: '400px',
    margin: '5rem auto',
    padding: '2rem',
    background: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  signupTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333333',
  },
  signupForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  signupInput: {
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #cccccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  signupButton: {
    padding: '0.75rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Signup;
