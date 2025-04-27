// routes/user-routes.js
const express           = require('express');
const { check }        = require('express-validator');
const userController   = require('../controller/user-controller');
const checkAuth        = require('../middleware/check-auth');
const authorizeRoles   = require('../middleware/authorize-roles');

const router = express.Router();

// — GET all users (employer only)
router.get(
  '/',
  checkAuth,
  authorizeRoles('employer'),
  userController.getAllUsers
);

// — GET a single user (candidate can fetch their own, employer can fetch anyone)
router.get(
  '/:userid',
  checkAuth,
  authorizeRoles('candidate','employer'),
  userController.getUserById
);

// — CREATE a user (if you want employers to onboard new users — otherwise signup covers this)
//    only employers in this example
router.post(
  '/',
  checkAuth,
  authorizeRoles('employer'),
  [
    check('user_name').notEmpty().withMessage('Name is required.'),
    check('user_email').isEmail().withMessage('Valid email is required.'),
    check('user_password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 chars.'),
    check('certificates').isArray().withMessage('Certificates must be an array.'),
    check('contactnumber')
      .isLength({ min: 10, max: 10 })
      .withMessage('Contact number must be 10 digits.'),
    check('user_dob').notEmpty().withMessage('Date of birth is required.'),
    check('skills').notEmpty().withMessage('Skills are required.'),
    check('locality').notEmpty().withMessage('Locality is required.'),
    check('educational_qualification')
      .notEmpty()
      .withMessage('Educational qualification is required.'),
    check('languages').notEmpty().withMessage('Languages are required.')
  ],
  userController.createUser
);

// — UPDATE a user (only the candidate themselves)
router.patch(
  '/:userid',
  checkAuth,
  authorizeRoles('candidate'),
  userController.updateUser
);

// — DELETE a user (only the candidate themselves)
router.delete(
  '/:userid',
  checkAuth,
  authorizeRoles('candidate'),
  userController.deleteUser
);

module.exports = router;
