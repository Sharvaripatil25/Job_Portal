const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true },
  applicant:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending',
  },
  coverLetter: { type: String, default: '' },
  resumeUrl:   { type: String, default: '' },
}, { timestamps: true })

// One application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

module.exports = mongoose.model('Application', applicationSchema)