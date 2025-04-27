const express = require('express');
const checkAuth = require('../middleware/check-auth'); // Import the check-auth middleware
const router = express.Router();

// Example of a protected route (accessed only with a valid JWT token)
router.get('/protected-route', checkAuth, (req, res) => {
  // If the user passes the check-auth middleware, they can access this route
  res.json({ message: 'Access granted!' });
});

// Add more protected routes as needed
router.get('/user-profile', checkAuth, (req, res) => {
  // You can access user data here via req.userData (attached by the check-auth middleware)
  res.json({
    message: 'User profile data',
    userId: req.userData.userId,
  });
});

module.exports = router;
