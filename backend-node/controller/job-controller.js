const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Job = require('../models/jobs');
const Application = require('../models/application');

// Get all jobs with search, filter, and pagination
const getAllJobs = async (req, res, next) => {
    const {
        title,
        location,
        minSalary,
        maxSalary,
        page = 1,
        limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (title)    filter.title    = new RegExp(title, 'i');      // Case-insensitive match
    if (location) filter.location = new RegExp(location, 'i');
    if (minSalary || maxSalary) {
        filter.salary = {};
        if (minSalary) filter.salary.$gte = Number(minSalary);
        if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    // Pagination setup
    const pageNum = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);
    const skipCount = (pageNum - 1) * perPage;

    let jobs;
    try {
        jobs = await Job.find(filter)
            .skip(skipCount)
            .limit(perPage);
    } catch (err) {
        return next(new HttpError('Fetching jobs failed, please try again.', 500));
    }

    if (!jobs || jobs.length === 0) {
        return next(new HttpError('No jobs found.', 404));
    }

    res.json({
        jobs: jobs.map(job => job.toObject({ getters: true })),
        page: pageNum,
        limit: perPage
    });
};

// Get job by ID
const getJobById = async (req, res, next) => {
    const jobId = req.params.jobid;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new HttpError('Invalid Job ID', 400));
    }

    let job;
    try {
        job = await Job.findById(jobId);
    } catch (err) {
        console.error(err);
        return next(new HttpError('Fetching job failed, please try again later.', 500));
    }

    if (!job) {
        return next(new HttpError('Job not found.', 404));
    }

    res.json({ job: job.toObject({ getters: true }) });
};

// Create a job
const createJob = async (req, res, next) => {
    if (req.user.role !== 'employer') {
        return next(new HttpError('Only employers can post jobs!', 403));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(errors.array().map(err => err.msg).join(','), 422));
    }

    const { title, company, description, location, salary } = req.body;

    const newJob = new Job({
        title,
        company,
        description,
        location,
        salary
    });

    try {
        await newJob.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Creating job failed, please try again later.', 500));
    }

    res.status(201).json({ job: newJob.toObject({ getters: true }) });
};

// Update a job
const updateJob = async (req, res, next) => {
    const jobId = req.params.jobid;
    const { title, company, description, location, salary } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new HttpError('Invalid Job ID', 400));
    }

    let job;
    try {
        job = await Job.findById(jobId);
        if (!job) {
            return next(new HttpError('Job not found.', 404));
        }
    } catch (err) {
        console.error(err);
        return next(new HttpError('Something went wrong, could not update job.', 500));
    }

    // Update only provided fields
    if (title) job.title = title;
    if (company) job.company = company;
    if (description) job.description = description;
    if (location) job.location = location;
    if (salary) job.salary = salary;

    try {
        await job.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Could not save updated job.', 500));
    }

    res.status(200).json({ job: job.toObject({ getters: true }) });
};

// Delete a job
const deleteJob = async (req, res, next) => {
    const jobId = req.params.jobid;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new HttpError('Invalid Job ID', 400));
    }

    let job;
    try {
        job = await Job.findById(jobId);
        if (!job) {
            return next(new HttpError('Job not found.', 404));
        }
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete job.', 500));
    }

    try {
        await job.deleteOne();
    } catch (err) {
        return next(new HttpError('Could not delete job.', 500));
    }

    res.status(200).json({ message: 'Deleted job successfully.' });
};

// Apply to a job
const applyJob = async (req, res, next) => {
    const jobId = req.params.jobid;

    if (req.userData.role !== 'candidate') {
        return next(new HttpError('Only candidates can apply to jobs!', 403));
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new HttpError('Invalid Job ID', 400));
    }

    const { coverLetter, resume } = req.body; // Assuming resume is the uploaded file path already

    if (!resume) {
        return next(new HttpError('Resume is required to apply!', 422));
    }

    const application = new Application({
        jobId,
        userId: req.userData.userId,
        resume,
        coverLetter: coverLetter || '',
        appliedAt: new Date()
    });

    try {
        await application.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Applying to job failed, please try again later.', 500));
    }

    res.status(201).json({ message: 'Application submitted successfully!', application });
};

// View applications for a job
const viewApplications = async (req, res, next) => {
    const jobId = req.params.jobid;

    if (req.userData.role !== 'employer') {
        return next(new HttpError('Only employers can view applications!', 403));
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new HttpError('Invalid Job ID', 400));
    }

    let applications;
    try {
        applications = await Application.find({ jobId }).populate('userId', 'email');
    } catch (err) {
        console.error(err);
        return next(new HttpError('Fetching applications failed, please try again later.', 500));
    }

    res.status(200).json({ applications });
};

exports.getAllJobs = getAllJobs;
exports.getJobById = getJobById;
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
exports.applyJob = applyJob;
exports.viewApplications = viewApplications;
