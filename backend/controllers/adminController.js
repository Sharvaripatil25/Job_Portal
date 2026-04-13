const User        = require('../models/User')
const Job         = require('../models/Job')
const Application = require('../models/Application')

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, activeJobs, totalApplications, totalEmployers] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      User.countDocuments({ role: 'employer' }),
    ])
    res.json({ totalUsers, activeJobs, totalApplications, totalEmployers })
  } catch (err) { next(err) }
}

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) { next(err) }
}

// GET /api/admin/jobs
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name')
      .sort({ createdAt: -1 })
    res.json({ jobs })
  } catch (err) { next(err) }
}

// PATCH /api/admin/users/:id/suspend
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { suspended: req.body.suspend },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) { next(err) }
}

// PATCH /api/admin/jobs/:id/toggle
exports.toggleJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    job.isActive = !job.isActive
    await job.save()
    res.json({ job })
  } catch (err) { next(err) }
}