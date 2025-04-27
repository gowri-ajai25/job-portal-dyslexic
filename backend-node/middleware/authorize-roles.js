// middleware/authorize-roles.js
const HttpError = require('../models/http-error');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Make sure checkAuth has already run and set req.userData
    if (!req.userData || !allowedRoles.includes(req.userData.role)) {
      return next(new HttpError('Not allowed', 403));
    }
    next();
  };
};

module.exports = authorizeRoles;
