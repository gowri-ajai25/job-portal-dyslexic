// controllers/auth-controller.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/users');

// controllers/auth-controller.js
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return next(new HttpError('Invalid inputs passed.', 422));
  }

  const {
    user_name,
    user_email,
    user_password,
    certificates,
    contactnumber,
    user_dob,
    skills,
    locality,
    educational_qualification,
    languages,
    role,
  } = req.body;

  console.log("User data received:", req.body);

  let existingUser;
  try {
    existingUser = await User.findOne({ user_email });
  } catch (err) {
    console.error("Error checking for existing user:", err);
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  if (existingUser) {
    console.log("User already exists:", user_email);
    return next(new HttpError('User exists already, please login instead.', 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(user_password, 12);
  } catch (err) {
    console.error("Error hashing password:", err);
    return next(new HttpError('Could not create user, please try again.', 500));
  }

  const newUser = new User({
    user_name,
    user_email,
    user_password: hashedPassword,
    certificates,
    contactnumber,
    user_dob,
    skills,
    locality,
    educational_qualification,
    languages,
    role
  });

  try {
    await newUser.save();
    console.log("New user saved successfully:", newUser);
  } catch (err) {
    console.error("Error saving new user:", err);
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.user_email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  } catch (err) {
    console.error("Error generating JWT:", err);
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  res.status(201).json({ userId: newUser.id, email: newUser.user_email, role: newUser.role, token });
};


  const login = async (req, res, next) => {
 
    const { user_email, user_password } = req.body;
    if (!user_email || !user_password) {
      return next(new HttpError('Invalid credentials', 401));
    }
    console.log('Email:', user_email);
    console.log('Password (plain):', user_password);
  
    // 2) Check for existing user
    let existingUser;
    try {
      existingUser = await User.findOne({ user_email });
    } catch (err) {
      return next(new HttpError('Logging in failed, please try again.', 500));
    }
  
    if (!existingUser) {
      return next(new HttpError('Invalid credentials', 401)); // If no user found
    }
    console.log('Password (hashed from DB):', existingUser.user_password);
  
    // 3) Check password
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(user_password, existingUser.user_password);
    } catch (err) {
      return next(new HttpError('Logging in failed, please try again.', 500));
    }
  
    if (!isValidPassword) {
      return next(new HttpError('Invalid credentials', 401)); // Invalid password
    }
    console.log('Is Valid Password?', isValidPassword);

    // 4) Generate JWT
    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, 
          email: existingUser.user_email,
          role: existingUser.role, },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
    } catch (err) {
      return next(new HttpError('Logging in failed, please try again.', 500));
    }
    
    // 5) Send response
    res.status(200).json({ userId: existingUser.id, email: existingUser.user_email, token });
  };

exports.signup = signup;
exports.login = login;
