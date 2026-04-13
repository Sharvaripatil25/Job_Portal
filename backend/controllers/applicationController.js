const Application = require('../models/Application')
const Job         = require('../models/Job')

// POST /api/applications/:jobId/apply  — seeker
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not available' })
    }

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' })
    }

    const application = await Application.create({
      job:         jobId,
      applicant:   req.user._id,
      coverLetter: req.body.coverLetter || '',
      resumeUrl:   req.user.profile?.resumeUrl || '',
    })

    // Add application ref to job
    await Job.findByIdAndUpdate(jobId, { $push: { applications: application._id } })

    await application.populate([
      { path: 'job',       populate: { path: 'company', select: 'name logo' } },
      { path: 'applicant', select: 'name email' },
    ])

    res.status(201).json({ application })
  } catch (err) { next(err) }
}

// GET /api/applications/my  — seeker
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name logo' } })
      .sort({ createdAt: -1 })

    res.json({ applications })
  } catch (err) { next(err) }
}

// GET /api/applications/job/:jobId  — employer
exports.getJobApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profile')
      .sort({ createdAt: -1 })

    res.json({ applications })
  } catch (err) { next(err) }
}

// PATCH /api/applications/:id/status  — employer
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('applicant', 'name email')

    if (!application) return res.status(404).json({ message: 'Application not found' })
    res.json({ application })
  } catch (err) { next(err) }
}