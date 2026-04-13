const router = require('express').Router()
const ctrl   = require('../controllers/adminController')
const { protect, authorise } = require('../middleware/auth')

router.get('/stats',               protect, authorise('admin'), ctrl.getStats)
router.get('/users',               protect, authorise('admin'), ctrl.getUsers)
router.get('/jobs',                protect, authorise('admin'), ctrl.getJobs)
router.patch('/users/:id/suspend', protect, authorise('admin'), ctrl.suspendUser)
router.patch('/jobs/:id/toggle',   protect, authorise('admin'), ctrl.toggleJob)

module.exports = router