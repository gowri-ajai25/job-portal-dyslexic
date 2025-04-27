const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/users');

// Get all users
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }

    if (!users || users.length === 0) {
        return next(new HttpError('No users found.', 404));
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

// Get user by ID
const getUserById = async (req, res, next) => {
    const userId = req.params.userid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new HttpError('Invalid User ID', 400));
    }

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new HttpError('Something went wrong, could not fetch user.', 500));
    }

    if (!user) {
        return next(new HttpError('User not found.', 404));
    }

    res.json({ user: user.toObject({ getters: true }) });
};

// Create a new user
const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(errors.array().map(err => err.msg).join(','), 422));
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
        Isactive
    } = req.body;

    // Check if user already exists with same email
    let existingUser;
    try {
        existingUser = await User.findOne({ user_email });
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    if (existingUser) {
        return next(new HttpError('User exists already, please login instead.', 422));
    }

    const newUser = new User({
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
        Isactive: Isactive ?? true
    });

    try {
        await newUser.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Creating user failed, please try again later.', 500));
    }

    res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

// Update user
const updateUser = async (req, res, next) => {
    const userId = req.params.userid;
    const {
        user_name,
        user_password,
        contactnumber,
        skills,
        locality,
        educational_qualification,
        languages,
        Isactive
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new HttpError('Invalid User ID', 400));
    }

    let user;
    try {
        user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('User not found.', 404));
        }
    } catch (err) {
        return next(new HttpError('Something went wrong, could not update user.', 500));
    }

    if (user_name) user.user_name = user_name;
    if (user_password) user.user_password = user_password;
    if (contactnumber) user.contactnumber = contactnumber;
    if (skills) user.skills = skills;
    if (locality) user.locality = locality;
    if (educational_qualification) user.educational_qualification = educational_qualification;
    if (languages) user.languages = languages;
    if (typeof Isactive === 'boolean') user.Isactive = Isactive;

    try {
        await user.save();
    } catch (err) {
        return next(new HttpError('Could not save updated user.', 500));
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

// Delete user
const deleteUser = async (req, res, next) => {
    const userId = req.params.userid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new HttpError('Invalid User ID', 400));
    }

    let user;
    try {
        user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('User not found.', 404));
        }
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete user.', 500));
    }

    try {
        await user.deleteOne();
    } catch (err) {
        return next(new HttpError('Deleting user failed.', 500));
    }

    res.status(200).json({ message: 'Deleted user successfully.' });
};

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
