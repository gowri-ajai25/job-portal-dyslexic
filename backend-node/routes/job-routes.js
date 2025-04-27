const express = require('express');
const { check } = require('express-validator');
const jobController    = require('../controller/job-controller');
const checkAuth        = require('../middleware/check-auth');
const authorizeRoles   = require('../middleware/authorize-roles');

const router = express.Router();

// Public routes (no auth required)
router.get('/', jobController.getAllJobs);
router.get('/:jobid', jobController.getJobById);

// ------------------------
// Employer-only routes
// ------------------------

// Create a new job
router.post(
  '/',
  checkAuth,
  authorizeRoles('employer'),
  [
    check('title').notEmpty().withMessage('Title is required.'),
    check('company').notEmpty().withMessage('Company is required.'),
    check('description')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters.'),
    check('location').notEmpty().withMessage('Location is required.'),
    check('salary')
      .isNumeric()
      .withMessage('Salary must be a number.')
  ],
  jobController.createJob
);

// Update an existing job
router.patch(
  '/:jobid',
  checkAuth,
  authorizeRoles('employer'),
  jobController.updateJob
);
router.put(
  '/:jobid',
  checkAuth,
  authorizeRoles('employer'),
  jobController.updateJob
);

// Delete a job
router.delete(
  '/:jobid',
  checkAuth,
  authorizeRoles('employer'),
  jobController.deleteJob
);

// ------------------------
// Candidate-only route
// ------------------------

// Apply to a job
router.post(
  '/:jobid/apply',
  checkAuth,
  authorizeRoles('candidate'),
  jobController.applyJob
);

// ------------------------
// Employer-only route
// ------------------------

// View applications for a job
router.get(
  '/:jobid/applications',
  checkAuth,
  authorizeRoles('employer'),
  jobController.viewApplications
);

module.exports = router;
