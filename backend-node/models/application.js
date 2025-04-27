const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  jobId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Job'
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  resume: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
