const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_name: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    certificates: [{ type: Object, required: true }],  // Store certificate details as objects
    contactnumber: { 
        type: String, 
        required: true, 
        length: 10, 
        match: /^[0-9]{10}$/  // Regex for validating a 10-digit number
    },
    user_dob: { type: Date, required: true },
    skills: { type: String, required: true },
    locality: { type: String, required: true },
    educational_qualification: { type: String, required: true },
    languages: { type: [String], required: true },  // Store languages as an array
    role: {
        type: String,
        enum: ['candidate', 'employer'], // Only allow these two roles
        required: true
    },
    Isactive: { type: Boolean, default: true }
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('user_password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.user_password = await bcrypt.hash(this.user_password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
