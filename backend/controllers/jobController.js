const Job     = require('../models/Job')
const Company = require('../models/Company')

// GET /api/jobs  — public with filters + pagination
exports.getJobs = async (req, res, next) => {
  try {
    const {
      search, location, type,
      page  = 1,
      limit = 12,
      sort  = 'newest',
    } = req.query

    const query = { isActive: true }

    if (search) {
      query.$or = [
        { title:        { $regex: search, $options: 'i' } },
        { description:  { $regex: search, $options: 'i' } },
        { requirements: { $elemMatch: { $regex: search, $options: 'i' } } },
      ]
    }
    if (location) query.location = { $regex: location, $options: 'i' }
    if (type)     query.type     = type

    const sortObj  = sort === 'salary' ? { 'salary.max': -1 } : { createdAt: -1 }
    const skip     = (Number(page) - 1) * Number(limit)

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company', 'name logo location')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ])

    res.json({
      jobs,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  } catch (err) { next(err) }
}

// GET /api/jobs/:id  — public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company',  'name logo location website description')
      .populate('postedBy', 'name email')

    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json({ job })
  } catch (err) { next(err) }
}

// POST /api/jobs  — employer only
exports.createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ owner: req.user._id })
    if (!company) {
      return res.status(400).json({ message: 'Please set up your company profile first' })
    }
    const job = await Job.create({
      ...req.body,
      company:  company._id,
      postedBy: req.user._id,
    })
    await job.populate('company', 'name logo location')
    res.status(201).json({ job })
  } catch (err) { next(err) }
}

// PUT /api/jobs/:id  — employer only, own jobs
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'name logo location')

    if (!job) return res.status(404).json({ message: 'Job not found or not authorised' })
    res.json({ job })
  } catch (err) { next(err) }
}

// DELETE /api/jobs/:id  — employer or admin
exports.deleteJob = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, postedBy: req.user._id }

    const job = await Job.findOneAndDelete(filter)
    if (!job) return res.status(404).json({ message: 'Job not found or not authorised' })
    res.json({ message: 'Job deleted successfully' })
  } catch (err) { next(err) }
}

// GET /api/jobs/employer/my-jobs  — employer only
exports.getEmployerJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ owner: req.user._id })
    if (!company) return res.json({ jobs: [] })

    const jobs = await Job.find({ company: company._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 })

    res.json({ jobs })
  } catch (err) { next(err) }
}