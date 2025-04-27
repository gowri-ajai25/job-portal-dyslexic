const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary:{ type: Number, required: true},
    postedDate: { type: Date, default: Date.now }
 });

module.exports = mongoose.model('Job', jobSchema);
