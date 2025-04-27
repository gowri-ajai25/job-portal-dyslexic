const express         = require('express');
const router          = express.Router();
const upload          = require('../middleware/file-upload');
const checkAuth       = require('../middleware/check-auth');
const authorizeRoles  = require('../middleware/authorize-roles');
const HttpError       = require('../models/http-error');

// POST /api/upload
// — only authenticated candidates can upload
router.post(
  '/upload',
  checkAuth,
  authorizeRoles('candidate'),
  upload.single('file'),       // or 'resume' if you prefer
  (req, res, next) => {
    if (!req.file) {
      return next(new HttpError('No file uploaded!', 400));
    }
    res.status(200).json({
      message: 'File uploaded successfully!',
      file: {
        filename:    req.file.filename,
        path:        req.file.path,
        mimetype:    req.file.mimetype,
        size:        req.file.size
      }
    });
  }
);

module.exports = router;
