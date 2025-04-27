const path = require('path');
const fs = require('fs');

const HttpError = require('../models/http-error');

// For single file upload
const uploadFile = (req, res, next) => {
  if (!req.file) {
    return next(new HttpError('No file uploaded!', 422));
  }

  // Build a URL to access the file (if you're serving statics)
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(201).json({
    message: 'File uploaded successfully!',
    file: {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl
    }
  });
};

// Optional: delete a file
const deleteFile = (req, res, next) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      return next(new HttpError('Could not delete file', 500));
    }

    res.status(200).json({ message: 'File deleted successfully' });
  });
};

module.exports = {
  uploadFile,
  deleteFile
};
 