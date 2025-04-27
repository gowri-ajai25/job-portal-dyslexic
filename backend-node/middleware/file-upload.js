const multer = require('multer');
const path = require('path');

// Set up storage engine (destination and filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder to save uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique name for each file
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// Create the upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,  // Limit the file size to 10MB (optional)
  },
  fileFilter: (req, file, cb) => {
    // Accept only certain file types (optional)
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only image files or PDFs are allowed!');
    }
  }
});

module.exports = upload;
