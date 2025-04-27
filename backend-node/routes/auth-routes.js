const express = require('express');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../controller/auth-controller');
const User = require('../models/users');

const router = express.Router();

// Use a consistent salt round for bcrypt (12 is a standard value)
const saltRounds = 12;

// POST /api/auth/signup
router.post(
  '/signup',
  [
    check('user_name')
      .notEmpty()
      .withMessage('Name is requi red.'),
    check('user_email')
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('user_password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.'),
    check('role')
      .isIn(['candidate', 'employer'])
      .withMessage('Role must be either "candidate" or "employer".'),
    check('contactnumber')
      .isLength({ min: 10, max: 10 })
      .withMessage('Contact number must be exactly 10 digits.'),
    check('user_dob')
      .notEmpty()
      .withMessage('Date of birth is required.'),
    check('skills')
      .notEmpty()
      .withMessage('Skills are required.'),
    check('locality')
      .notEmpty()
      .withMessage('Locality is required.'),
    check('educational_qualification')
      .notEmpty()
      .withMessage('Educational qualification is required.'),
    check('languages')
      .notEmpty()
      .withMessage('Languages are required.'),
    check('certificates')
      .isArray()
      .withMessage('Certificates must be an array.')
  ],
  async (req, res) => {
    try {
      let { user_name, user_email, user_password, role, contactnumber, user_dob, skills, locality, educational_qualification, languages, certificates } = req.body;

      // 1. Hash the password before saving to DB during signup
      const hashedPassword = await bcrypt.hash(user_password, saltRounds);

      // 2. Create a new user and save the hashed password in the database
      const newUser = new User({
        user_name,
        user_email,
        user_password: hashedPassword, // Store the hashed password
        role,
        contactnumber,
        user_dob,
        skills,
        locality,
        educational_qualification,
        languages,
        certificates
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id },  // Payload
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: '1h' }  // Expiry
    );

    // 4. Send token in response
    res.status(200).json({ 
      message: "Login successful!",
      token: token,  // Send this to the frontend
      userId: user._id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
