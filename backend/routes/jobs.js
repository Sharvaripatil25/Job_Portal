const router = require('express').Router()
const ctrl   = require('../controllers/jobController')
const { protect, authorise } = require('../middleware/auth')

router.get('/employer/my-jobs', protect, authorise('employer'), ctrl.getEmployerJobs)

router.get('/',       ctrl.getJobs)
router.get('/:id',    ctrl.getJobById)
router.post('/',      protect, authorise('employer'), ctrl.createJob)
router.put('/:id',    protect, authorise('employer'), ctrl.updateJob)
router.delete('/:id', protect, authorise('employer', 'admin'), ctrl.deleteJob)

module.exports = router