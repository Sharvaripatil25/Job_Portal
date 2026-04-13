const router = require('express').Router()
const ctrl   = require('../controllers/applicationController')
const { protect, authorise } = require('../middleware/auth')

router.post('/:jobId/apply',  protect, authorise('seeker'),   ctrl.applyToJob)
router.get('/my',             protect, authorise('seeker'),   ctrl.getMyApplications)
router.get('/job/:jobId',     protect, authorise('employer'), ctrl.getJobApplications)
router.patch('/:id/status',   protect, authorise('employer'), ctrl.updateStatus)

module.exports = router