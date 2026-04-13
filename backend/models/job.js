const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title:        { type: String, required: [true, 'Job title is required'], trim: true },
  description:  { type: String, required: [true, 'Description is required'] },
  requirements: [{ type: String }],
  salary: {
    min:      { type: Number, default: 0 },
    max:      { type: Number, default: 0 },
    currency: { type: String, default: '₹' },
  },
  location:    { type: String, required: [true, 'Location is required'] },
  type:        { type: String, enum: ['full-time', 'part-time', 'remote', 'internship'], default: 'full-time' },
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  applications:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  deadline:    { type: Date },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

// Text search index
jobSchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('Job', jobSchema)