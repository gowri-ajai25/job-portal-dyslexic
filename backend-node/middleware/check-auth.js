require('dotenv').config();
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  // 1) Get token from header
  const authHeader = req.headers.authorization;

  // If there's no Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or invalid format');
    return next(new HttpError('Authentication failed! Authorization header missing or malformed.', 401));
  }

  const token = authHeader.split(' ')[1]; // Expected format: "Bearer TOKEN"

  // 2) Verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return next(new HttpError('Authentication failed! Invalid or expired token.', 401));
  }

  // 3) Attach user data from token
  req.userData = { 
    userId: decodedToken.id,  // Use 'id' because you stored { id: user._id } in the token
    // If you stored more fields in token (like email, role), you can extract them too
  };

  console.log('User authenticated:', req.userData);

  // router.get('/protected-route', checkAuth, (req, res) => {
  //   res.json({ message: 'Access granted!' });
  // });

  next(); // Continue to the next middleware/route
};
