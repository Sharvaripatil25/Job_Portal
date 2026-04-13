const User          = require('../models/User')
const Company       = require('../models/Company')
const generateToken = require('../utils/generateToken')

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password, role })

    // Auto-create a company stub for new employers
    if (role === 'employer') {
      const company = await Company.create({
        name:  `${name}'s Company`,
        owner: user._id,
      })
      user.company = company._id
      await user.save({ validateBeforeSave: false })
    }

    const token = generateToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) { 
    console.error('❌ Registration Error:', err)
    next(err) 
  }
}

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Explicitly select password since it's select:false in schema
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    if (user.suspended) {
      return res.status(403).json({ message: 'Your account has been suspended. Contact support.' })
    }

    const token = generateToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) { 
    console.error('❌ Login Error:', err)
    next(err) 
  }
}

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  res.json({ user: req.user })
}