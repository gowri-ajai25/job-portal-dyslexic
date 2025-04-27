import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Token fetch logic inside useEffect
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      const fetchProtectedData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/protected', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Ensure the token is sent correctly
            },
          });

          const data = await response.json();
          // Handle the response
          console.log(data);
        } catch (err) {
          console.error('Error fetching protected data:', err);
        }
      };
      fetchProtectedData();
    } else {
      console.error('No token found');
    }
  }, []); // This will run once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');

    // Send login request to the backend
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          user_password: password,
        }),
      });

      const data = await response.json();

      // Handle response from the backend
      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      // Save the token and user info after a successful login
      localStorage.setItem('token', data.token); // Make sure token is stored here
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', data.role);

      // Redirect to the desired route after successful login
      navigate('/'); // Replace with the correct route after login
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <p>Please log in to continue.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p className="signup-link">
        Don’t have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;
