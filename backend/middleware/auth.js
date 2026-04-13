const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// Verify JWT and attach user to req
exports.protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorised — no token' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user)    return res.status(401).json({ message: 'User no longer exists' })
    if (req.user.suspended) return res.status(403).json({ message: 'Account suspended' })
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}

// Check user role
exports.authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Role '${req.user.role}' is not allowed to perform this action`,
    })
  }
  next()
}