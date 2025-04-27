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
router.post('/api/auth/login', async (req, res) => {
  try {
    let { user_email, user_password } = req.body;

    // 1. Check the request body to ensure you're sending the correct data
    console.log("Login request body:", req.body); // Logs the request data

    // 2. Trim any extra spaces from email and password (important for comparison)
    user_email = user_email.trim();
    user_password = user_password.trim();

    // 3. Validate the incoming data
    if (!user_email || !user_password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 4. Find the user in the database
    const user = await User.findOne({ user_email });
    console.log("User from DB:", user); // Logs the user found from the DB (if any)

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 5. Compare the provided password with the stored hashed password during login
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    console.log("Password match:", isMatch); // Logs whether the password matches or not
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 6. Create a JWT token if everything is fine
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 7. Send the token back in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
