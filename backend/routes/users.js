const router = require('express').Router()
const User   = require('../models/user')
const { protect } = require('../middleware/auth')

// PUT /api/users/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, profile } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, profile },
      { new: true, runValidators: true }
    ).select('-password')
    res.json({ user })
  } catch (err) { next(err) }
})

module.exports = router